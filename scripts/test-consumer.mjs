#!/usr/bin/env node

import assert from "node:assert/strict"
import { execFileSync, spawn } from "node:child_process"
import fs from "node:fs"
import net from "node:net"
import os from "node:os"
import path from "node:path"
import { setTimeout as delay } from "node:timers/promises"
import { fileURLToPath } from "node:url"
import AxeBuilder from "@axe-core/playwright"
import { chromium } from "@playwright/test"

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..")
const template = path.join(root, "fixtures", "consumer-template")
const packageJson = JSON.parse(fs.readFileSync(path.join(root, "package.json"), "utf8"))
const catalog = JSON.parse(
  fs.readFileSync(path.join(root, "registry", "catalog.json"), "utf8")
)
const consumer = fs.mkdtempSync(path.join(os.tmpdir(), "UI Foundation Consumer "))
const npmCache = path.join(os.tmpdir(), "ui-foundation-npm-cache")
const publicRegistryBaseUrl = "https://tis-experience.github.io/ui-foundation/r/"

function releaseVersionFor(flag) {
  const index = process.argv.indexOf(flag)
  if (index < 0) return null
  const candidate = process.argv[index + 1]
  return candidate && !candidate.startsWith("--") ? candidate : packageJson.version
}

const localReleaseVersion = releaseVersionFor("--release")
const publicReleaseVersion = releaseVersionFor("--public-release")
const publicMode = process.argv.includes("--public") || publicReleaseVersion !== null
const releaseVersion = localReleaseVersion ?? publicReleaseVersion
const registryBaseUrl = publicReleaseVersion
  ? `https://tis-experience.github.io/ui-foundation/releases/${publicReleaseVersion}/r/`
  : publicRegistryBaseUrl
const localRegistryDirectory = localReleaseVersion
  ? path.join(root, "public", "releases", localReleaseVersion, "r")
  : path.join(root, "public", "r")
const sourceRegistryBaseUrl = localReleaseVersion
  ? `https://tis-experience.github.io/ui-foundation/releases/${localReleaseVersion}/r/`
  : publicRegistryBaseUrl
let passed = false

if (localReleaseVersion && publicReleaseVersion) {
  throw new Error("Choose either --release or --public-release, not both")
}

function run(command, args, cwd = consumer) {
  execFileSync(command, args, {
    cwd,
    env: { ...process.env, npm_config_cache: npmCache },
    stdio: "inherit",
  })
}

async function getAvailablePort() {
  const server = net.createServer()
  await new Promise((resolve, reject) => {
    server.once("error", reject)
    server.listen(0, "127.0.0.1", resolve)
  })
  const address = server.address()
  assert(address && typeof address === "object", "Could not allocate a consumer preview port")
  const port = address.port
  await new Promise((resolve, reject) => server.close((error) => error ? reject(error) : resolve()))
  return port
}

async function waitForPreview(url, child, logs) {
  const deadline = Date.now() + 20_000
  while (Date.now() < deadline) {
    if (child.exitCode !== null) {
      throw new Error(`Consumer preview stopped before it was ready.\n${logs.join("")}`)
    }
    try {
      const response = await fetch(url)
      if (response.ok) return
    } catch {
      // The preview may still be binding the local port.
    }
    await delay(100)
  }
  throw new Error(`Consumer preview did not become ready at ${url}.\n${logs.join("")}`)
}

async function assertAccessible(page, surface) {
  const results = await new AxeBuilder({ page }).analyze()
  assert.deepEqual(
    results.violations.map(({ id, impact, nodes }) => ({
      id,
      impact,
      targets: nodes.map((node) => node.target.join(" ")),
    })),
    [],
    `${surface} has automated accessibility violations`
  )
}

async function verifyRuntime() {
  const port = await getAvailablePort()
  const url = `http://127.0.0.1:${port}`
  const serverLogs = []
  const preview = spawn(
    "npm",
    ["run", "preview", "--", "--host", "127.0.0.1", "--port", String(port), "--strictPort"],
    {
      cwd: consumer,
      env: { ...process.env, npm_config_cache: npmCache },
      stdio: ["ignore", "pipe", "pipe"],
    }
  )
  preview.stdout.on("data", (chunk) => serverLogs.push(chunk.toString()))
  preview.stderr.on("data", (chunk) => serverLogs.push(chunk.toString()))

  let browser
  try {
    await waitForPreview(url, preview, serverLogs)
    browser = await chromium.launch({ channel: "chrome", headless: true })
    const context = await browser.newContext({ viewport: { width: 1280, height: 900 } })
    const page = await context.newPage()
    const browserErrors = []
    page.on("console", (message) => {
      if (["error", "warning"].includes(message.type())) browserErrors.push(`${message.type()}: ${message.text()}`)
    })
    page.on("pageerror", (error) => browserErrors.push(`pageerror: ${error.message}`))

    await page.goto(url)
    assert.equal(await page.title(), "UI Foundation consumer smoke")
    await page.getByRole("heading", { name: "Operations Workspace" }).waitFor()
    await assertAccessible(page, "Overview")

    await page.getByLabel("Interface density").selectOption("compact")
    assert.equal(await page.locator("html").getAttribute("data-ui-density"), "compact")
    await page.getByRole("button", { name: "Neutral" }).click()
    assert.equal(await page.locator("html").getAttribute("data-ui-theme"), "tis")
    await page.getByRole("button", { name: "Use dark mode" }).click()
    assert.equal(await page.locator("html").evaluate((element) => element.classList.contains("dark")), true)

    const newItemTrigger = page.getByRole("button", { name: "New work item" })
    await newItemTrigger.click()
    await page.getByRole("dialog").waitFor()
    assert.equal(await page.evaluate(() => document.activeElement?.id), "work-item-title")
    await page.waitForTimeout(150)
    await assertAccessible(page, "Dialog")
    await page.getByRole("textbox", { name: "Title" }).fill("Validate registry adoption")
    await page.getByLabel("Priority").selectOption("high")
    await page.getByRole("button", { name: "Create item" }).click()
    await page.getByRole("dialog").waitFor({ state: "detached" })
    assert.equal(await page.getByRole("dialog").count(), 0)
    assert.equal(await newItemTrigger.evaluate((element) => element === document.activeElement), true)
    await page.getByRole("status").filter({ hasText: "Work item Validate registry adoption created" }).waitFor()

    const overviewTab = page.getByRole("tab", { name: "Overview" })
    await overviewTab.focus()
    await page.keyboard.press("ArrowRight")
    await page.keyboard.press("ArrowRight")
    await page.keyboard.press("Enter")
    const componentTab = page.getByRole("tab", { name: "Component states" })
    assert.equal(await componentTab.getAttribute("aria-selected"), "true")
    await page.getByRole("region", { name: "Component states" }).waitFor()
    await page.keyboard.press("Tab")
    await page.keyboard.press("Tab")
    assert.equal((await page.evaluate(() => document.activeElement?.textContent))?.trim(), "Primary action")
    const focus = await page.evaluate(() => {
      const style = getComputedStyle(document.activeElement)
      return {
        outlineOffset: style.outlineOffset,
        outlineStyle: style.outlineStyle,
        outlineWidth: style.outlineWidth,
      }
    })
    assert.deepEqual(focus, { outlineOffset: "2px", outlineStyle: "solid", outlineWidth: "2px" })
    await assertAccessible(page, "Component states")

    await page.getByRole("tab", { name: "Settings" }).click()
    await page.getByRole("textbox", { name: "Workspace name" }).fill("TIS Experience Lab")
    await page.getByLabel("Default locale").selectOption("pt-BR")
    await page.getByRole("button", { name: "Save settings" }).click()
    await page.getByRole("status").filter({ hasText: "Workspace settings saved" }).waitFor()
    await assertAccessible(page, "Settings")

    await page.setViewportSize({ width: 320, height: 800 })
    const responsive = await page.evaluate(() => ({
      innerWidth,
      scrollWidth: document.documentElement.scrollWidth,
    }))
    assert.equal(responsive.scrollWidth, responsive.innerWidth, "Consumer app overflows at the 320px minimum width")
    assert.deepEqual(browserErrors, [], "Consumer runtime emitted console or page errors")
    await context.close()
  } finally {
    if (browser) await browser.close()
    preview.kill("SIGTERM")
  }
}

try {
  fs.cpSync(template, consumer, { recursive: true })
  if (!publicMode) {
    if (!fs.existsSync(localRegistryDirectory)) {
      throw new Error(`Staged release registry is missing: ${localRegistryDirectory}`)
    }
    for (const file of fs.readdirSync(localRegistryDirectory)) {
      if (file.endsWith(".json")) {
        const source = fs.readFileSync(path.join(localRegistryDirectory, file), "utf8")
        fs.writeFileSync(
          path.join(consumer, file),
          source.replaceAll(sourceRegistryBaseUrl, `${consumer}${path.sep}`)
        )
      }
    }
  }
  run("npm", ["install", "--no-audit", "--no-fund"])

  const items = [
    ...catalog.components.map(({ name }) => name),
    ...(catalog.blocks ?? []).map(({ name }) => name),
    ...(catalog.charts ?? []).map(({ name }) => name),
    "theme-tis",
  ].map((name) => publicMode
    ? `${registryBaseUrl}${name}.json`
    : path.join(consumer, `${name}.json`)
  )
  run(path.join(root, "node_modules", ".bin", "shadcn"), [
    "add",
    "--yes",
    ...items,
  ])

  const requiredFiles = [
    ...catalog.components.flatMap(({ files }) => files),
    ...(catalog.blocks ?? []).flatMap(({ files }) => files),
    ...(catalog.charts ?? []).flatMap(({ files }) => files),
    "src/lib/utils.ts",
  ]
  for (const file of requiredFiles) {
    if (!fs.existsSync(path.join(consumer, file))) {
      throw new Error(`Consumer install is missing ${file}`)
    }
  }

  const css = fs.readFileSync(path.join(consumer, "src", "index.css"), "utf8")
  if (
    !css.includes("[data-ui-theme=\"tis\"]") ||
    !css.includes("--color-overlay") ||
    !css.includes("--font-sans") ||
    !css.includes("--duration-normal") ||
    !css.includes("--shadow-md") ||
    !css.includes("[data-ui-density=\"comfortable\"]") ||
    !css.includes("--ui-control-height-md: 2.5rem") ||
    !css.includes("--focus-ring-width: 2px") ||
    !css.includes(":focus-visible")
  ) {
    throw new Error("Consumer CSS is missing the theme, density, focus or core foundation contract")
  }

  const typesetCss = fs.readFileSync(
    path.join(consumer, "src", "components", "ui", "typography.css"),
    "utf8"
  )
  for (const variable of [
    "--typeset-config-size",
    "--typeset-config-leading",
    "--typeset-config-flow",
    "--typeset-config-measure",
  ]) {
    if (!typesetCss.includes(variable)) {
      throw new Error(`Installed Typeset CSS is missing ${variable}`)
    }
  }

  run("npm", ["run", "build"])
  await verifyRuntime()
  const channel = publicMode
    ? releaseVersion ? `published ${releaseVersion}` : "published preview"
    : releaseVersion ? `staged ${releaseVersion}` : "generated preview"
  console.log(`Consumer smoke passed against the ${channel} registry: ${catalog.components.length} components, ${(catalog.blocks ?? []).length} blocks, ${(catalog.charts ?? []).length} chart bundles, dependencies, build, real Blocks, theme and density controls, keyboard paths, focus restoration, 320px layout and axe.`)
  passed = true
} finally {
  if (passed) {
    fs.rmSync(consumer, { recursive: true, force: true })
  } else {
    console.error(`Consumer fixture preserved for inspection: ${consumer}`)
  }
}
