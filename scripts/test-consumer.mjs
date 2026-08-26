#!/usr/bin/env node

import { execFileSync } from "node:child_process"
import fs from "node:fs"
import os from "node:os"
import path from "node:path"
import { fileURLToPath } from "node:url"

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..")
const template = path.join(root, "fixtures", "consumer-template")
const packageJson = JSON.parse(fs.readFileSync(path.join(root, "package.json"), "utf8"))
const catalog = JSON.parse(
  fs.readFileSync(path.join(root, "registry", "catalog.json"), "utf8")
)
const consumer = fs.mkdtempSync(path.join(os.tmpdir(), "ui-foundation-consumer-"))
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
  const channel = publicMode
    ? releaseVersion ? `published ${releaseVersion}` : "published preview"
    : releaseVersion ? `staged ${releaseVersion}` : "generated preview"
  console.log(`Consumer smoke passed against the ${channel} registry: ${catalog.components.length} components, ${(catalog.blocks ?? []).length} blocks, ${(catalog.charts ?? []).length} chart bundles, dependencies, density profiles, accessible focus, portable Typeset rhythm, TIS preset and production build.`)
  passed = true
} finally {
  if (passed) {
    fs.rmSync(consumer, { recursive: true, force: true })
  } else {
    console.error(`Consumer fixture preserved for inspection: ${consumer}`)
  }
}
