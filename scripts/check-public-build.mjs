#!/usr/bin/env node

import crypto from "node:crypto"
import fs from "node:fs"
import path from "node:path"
import { fileURLToPath } from "node:url"

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..")
const dist = path.join(root, "dist")
const siteBaseUrl = "https://tis-experience.github.io/ui-foundation/"
const packageJson = JSON.parse(fs.readFileSync(path.join(root, "package.json"), "utf8"))

function assert(condition, message) {
  if (!condition) throw new Error(message)
}

function read(relativePath) {
  return fs.readFileSync(path.join(dist, relativePath), "utf8")
}

function sha256(buffer) {
  return crypto.createHash("sha256").update(buffer).digest("hex")
}

assert(fs.existsSync(dist), "dist is missing. Run npm run build first.")

const requiredFiles = [
  "index.html",
  "LICENSE",
  "ai/manifest.json",
  "ai/customizer.json",
  "llms.txt",
  "r/registry.json",
  "r/button.json",
  "r/theme-tis.json",
  "registry/catalog.json",
  "contracts/components.json",
  "tokens/foundations.json",
  "tokens/densities.json",
  "tokens/customizer.json",
  "tokens/themes/neutral.json",
  "tokens/themes/tis.json",
  "schemas/ai-manifest.schema.json",
  "schemas/component-catalog.schema.json",
  "schemas/component-contracts.schema.json",
  "schemas/resolved-component-contracts.schema.json",
  "schemas/release-manifest.schema.json",
  "docs/ai-usage.md",
  "docs/developer-api.md",
  "docs/installation.md",
  "docs/blocks.md",
  "docs/charts.md",
  "docs/customization.md",
  "docs/compositions.md",
  "docs/maintenance.md",
  "docs/releases.md",
  "releases/current.json",
  `releases/${packageJson.version}/manifest.json`,
]

for (const relativePath of requiredFiles) {
  assert(fs.existsSync(path.join(dist, relativePath)), `Missing public artifact: ${relativePath}`)
}

const index = read("index.html")
assert(/(?:src|href)="\.\/assets\//.test(index), "Vite assets are not relative to the Pages project path")

const manifest = JSON.parse(read("ai/manifest.json"))
const manifestSchema = JSON.parse(read("schemas/ai-manifest.schema.json"))
const contracts = JSON.parse(read("contracts/components.json"))
const registry = JSON.parse(read("r/registry.json"))
const releasePointer = JSON.parse(read("releases/current.json"))
const releaseRoot = `releases/${packageJson.version}`
const releaseManifest = JSON.parse(read(`${releaseRoot}/manifest.json`))
assert(manifest.distribution.registryBaseUrl === `${siteBaseUrl}r`, "Registry base URL is not public")
assert(manifest.distribution.releases.preview === `${siteBaseUrl}r`, "Preview registry URL is not public")
assert(
  manifest.distribution.releases.pattern === `${siteBaseUrl}releases/<version>/r`,
  "Versioned registry pattern is not public"
)
assert(manifest.distribution.releases.npmPackage === false, "Manifest must preserve the source-registry boundary")
assert(manifest.theming.customizer.route === `${siteBaseUrl}#customize`, "Customizer URL is not public")
assert(releasePointer.version === packageJson.version, "Current release pointer does not match package.json")
assert(
  releasePointer.manifest === `${siteBaseUrl}releases/${packageJson.version}/manifest.json`,
  "Current release manifest URL is not public and versioned"
)
assert(releaseManifest.version === packageJson.version, "Release manifest version does not match package.json")
assert(releaseManifest.immutable === true, "Release manifest must be immutable")
assert(
  releaseManifest.status === (packageJson.version.includes("-") ? "prerelease" : "stable"),
  "Release status does not match the semantic version channel"
)
assert(releaseManifest.distribution.npmPackage === false, "Release must preserve the source-registry boundary")
assert(
  releaseManifest.distribution.root === `${siteBaseUrl}releases/${packageJson.version}`,
  "Release root is not public and versioned"
)
assert(releaseManifest.inventory.components === manifest.components.length, "Release component inventory is stale")
assert(releaseManifest.inventory.blocks === manifest.blocks.length, "Release block inventory is stale")
assert(releaseManifest.inventory.chartBundles === manifest.charts.length, "Release chart inventory is stale")
assert(
  manifestSchema.properties.components.items.required.includes("contract") &&
    !manifestSchema.properties.blocks.items.required.includes("contract") &&
    !manifestSchema.properties.charts.items.required.includes("contract"),
  "AI manifest schema assigns component contracts to the wrong collection"
)
assert(contracts.components.length === manifest.components.length, "Resolved component contracts are incomplete")
assert(manifest.componentContracts.components === manifest.components.length, "Manifest component contract count is stale")
const interactionTestedContracts = contracts.components.filter(
  (component) => component.verification?.level === "interaction-tested"
)
assert(
  interactionTestedContracts.length === manifest.componentContracts.interactionTested,
  "Manifest interaction-tested contract count is stale"
)
assert(
  manifest.components.every((component) =>
    component.contract?.profile &&
    component.contract.source === manifest.componentContracts.source &&
    ["profile", "interaction-tested"].includes(component.contract.level)
  ),
  "Manifest components do not reference their resolved contracts"
)
assert(
  manifest.components.filter((component) => component.contract.level === "interaction-tested").length ===
    interactionTestedContracts.length,
  "Manifest component verification levels do not match resolved contracts"
)

for (const source of manifest.sources) {
  const url = new URL(source)
  assert(url.href.startsWith(siteBaseUrl), `Machine-readable source is outside the site: ${source}`)
  const relativePath = url.pathname.replace(/^\/ui-foundation\//, "")
  assert(fs.existsSync(path.join(dist, relativePath)), `Manifest source is missing from dist: ${relativePath}`)
}

for (const item of [...manifest.components, ...manifest.blocks, ...manifest.charts]) {
  assert(item.install.includes(`${siteBaseUrl}r/`), `${item.name}: install command is not public`)
}

for (const item of registry.items) {
  for (const dependency of item.registryDependencies ?? []) {
    assert(
      dependency.startsWith(`${siteBaseUrl}r/`),
      `${item.name}: registry dependency is not a public absolute URL: ${dependency}`
    )
    const relativePath = new URL(dependency).pathname.replace(/^\/ui-foundation\//, "")
    assert(fs.existsSync(path.join(dist, relativePath)), `${item.name}: missing registry dependency ${relativePath}`)
  }
}

const releaseRegistry = JSON.parse(read(`${releaseRoot}/r/registry.json`))
assert(
  releaseRegistry.items.length === releaseManifest.inventory.registryItems,
  "Release registry inventory is stale"
)

for (const item of releaseRegistry.items) {
  for (const dependency of item.registryDependencies ?? []) {
    assert(
      dependency.startsWith(`${siteBaseUrl}releases/${packageJson.version}/r/`),
      `${item.name}: release registry dependency is not versioned: ${dependency}`
    )
    const relativePath = new URL(dependency).pathname.replace(/^\/ui-foundation\//, "")
    assert(fs.existsSync(path.join(dist, relativePath)), `${item.name}: missing release dependency ${relativePath}`)
  }
}

const integrityLines = []
for (const file of releaseManifest.integrity.files) {
  const absolutePath = path.join(dist, releaseRoot, file.path)
  assert(fs.existsSync(absolutePath), `Release integrity file is missing: ${file.path}`)
  const content = fs.readFileSync(absolutePath)
  assert(content.byteLength === file.bytes, `Release byte count changed: ${file.path}`)
  const digest = sha256(content)
  assert(digest === file.sha256, `Release SHA-256 changed: ${file.path}`)
  integrityLines.push(`${file.path}:${digest}`)
}
assert(
  sha256(Buffer.from(integrityLines.join("\n"))) === releaseManifest.integrity.digest,
  "Release aggregate SHA-256 digest changed"
)

for (const relativePath of ["ai/manifest.json", "contracts/components.json", "llms.txt", "registry/catalog.json"]) {
  const content = read(relativePath)
  assert(!content.includes("ui-foundation.local"), `${relativePath} contains the retired local hostname`)
  assert(!content.includes("127.0.0.1"), `${relativePath} contains a localhost URL`)
}

console.log(`Public build valid: ${requiredFiles.length} required artifacts, ${manifest.sources.length} manifest sources and immutable release ${packageJson.version} with ${releaseManifest.integrity.files.length} integrity-checked files.`)
