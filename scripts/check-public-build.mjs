#!/usr/bin/env node

import fs from "node:fs"
import path from "node:path"
import { fileURLToPath } from "node:url"

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..")
const dist = path.join(root, "dist")
const siteBaseUrl = "https://tis-experience.github.io/ui-foundation/"

function assert(condition, message) {
  if (!condition) throw new Error(message)
}

function read(relativePath) {
  return fs.readFileSync(path.join(dist, relativePath), "utf8")
}

assert(fs.existsSync(dist), "dist is missing. Run npm run build first.")

const requiredFiles = [
  "index.html",
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
  "docs/ai-usage.md",
  "docs/blocks.md",
  "docs/charts.md",
  "docs/customization.md",
  "docs/compositions.md",
  "docs/maintenance.md",
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
assert(manifest.distribution.registryBaseUrl === `${siteBaseUrl}r`, "Registry base URL is not public")
assert(manifest.theming.customizer.route === `${siteBaseUrl}#customize`, "Customizer URL is not public")
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

for (const relativePath of ["ai/manifest.json", "contracts/components.json", "llms.txt", "registry/catalog.json"]) {
  const content = read(relativePath)
  assert(!content.includes("ui-foundation.local"), `${relativePath} contains the retired local hostname`)
  assert(!content.includes("127.0.0.1"), `${relativePath} contains a localhost URL`)
}

console.log(`Public build valid: ${requiredFiles.length} required artifacts and ${manifest.sources.length} manifest sources.`)
