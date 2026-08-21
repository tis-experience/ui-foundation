#!/usr/bin/env node

import crypto from "node:crypto"
import fs from "node:fs"
import os from "node:os"
import path from "node:path"
import { fileURLToPath } from "node:url"

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..")
const publicRoot = path.join(root, "public")
const writeRelease = process.argv.includes("--write")
const requestedVersionIndex = process.argv.indexOf("--version")
const requestedVersion = requestedVersionIndex >= 0 ? process.argv[requestedVersionIndex + 1] : null
const siteBaseUrl = "https://tis-experience.github.io/ui-foundation"

function readJson(relativePath) {
  return JSON.parse(fs.readFileSync(path.join(root, relativePath), "utf8"))
}

function assert(condition, message) {
  if (!condition) throw new Error(message)
}

function walkFiles(directory, prefix = "") {
  return fs.readdirSync(directory, { withFileTypes: true }).flatMap((entry) => {
    const relativePath = path.posix.join(prefix, entry.name)
    const absolutePath = path.join(directory, entry.name)
    return entry.isDirectory() ? walkFiles(absolutePath, relativePath) : [relativePath]
  })
}

function sha256(buffer) {
  return crypto.createHash("sha256").update(buffer).digest("hex")
}

const packageJson = readJson("package.json")
const catalog = readJson("registry/catalog.json")
const contracts = readJson("contracts/component-contracts.json")
const customizer = readJson("tokens/customizer.json")
const aiManifest = readJson("public/ai/manifest.json")
const version = packageJson.version
const releaseBaseUrl = `${siteBaseUrl}/releases/${version}`

if (writeRelease) {
  assert(
    requestedVersion === version,
    `Release staging requires an explicit matching version: npm run release:stage -- --version ${version}`
  )
}

assert(packageJson.private === true, "package.json must remain private: source registry is the distribution model")
assert(packageJson.license === "MIT", "package.json must declare the repository MIT license")
assert(/^\d+\.\d+\.\d+(?:-[0-9A-Za-z.-]+)?$/.test(version), `Invalid release version: ${version}`)
assert(catalog.version === version, "Catalog version does not match package.json")
assert(contracts.version === version, "Component contract version does not match package.json")
assert(customizer.version === version, "Customizer version does not match package.json")
assert(aiManifest.version === version, "AI manifest version does not match package.json")
assert(fs.existsSync(path.join(root, "LICENSE")), "LICENSE is required for a release")

const requiredPublicPaths = [
  "LICENSE",
  "ai/manifest.json",
  "ai/customizer.json",
  "contracts/components.json",
  "docs/ai-usage.md",
  "docs/developer-api.md",
  "docs/installation.md",
  "docs/releases.md",
  "llms.txt",
  "registry/catalog.json",
]

for (const relativePath of requiredPublicPaths) {
  assert(fs.existsSync(path.join(publicRoot, relativePath)), `Missing public release artifact: ${relativePath}`)
}

const releaseFiles = [
  ...walkFiles(path.join(publicRoot, "r"), "r"),
  ...walkFiles(path.join(publicRoot, "ai"), "ai"),
  ...walkFiles(path.join(publicRoot, "contracts"), "contracts"),
  ...walkFiles(path.join(publicRoot, "docs"), "docs"),
  ...walkFiles(path.join(publicRoot, "registry"), "registry"),
  ...walkFiles(path.join(publicRoot, "schemas"), "schemas"),
  ...walkFiles(path.join(publicRoot, "tokens"), "tokens"),
  "LICENSE",
  "llms.txt",
].sort((a, b) => a.localeCompare(b))

const temporaryRoot = writeRelease
  ? null
  : fs.mkdtempSync(path.join(os.tmpdir(), "ui-foundation-release-"))
const destination = writeRelease
  ? path.join(publicRoot, "releases", version)
  : path.join(temporaryRoot, version)

if (writeRelease) {
  assert(!fs.existsSync(destination), `Release ${version} already exists and is immutable`)
}

fs.mkdirSync(destination, { recursive: true })

const replacements = [
  [`${siteBaseUrl}/`, `${releaseBaseUrl}/`],
]

for (const relativePath of releaseFiles) {
  const source = path.join(publicRoot, relativePath)
  const target = path.join(destination, relativePath)
  let content = fs.readFileSync(source, "utf8")

  for (const [current, versioned] of replacements) {
    content = content.replaceAll(current, versioned)
  }

  fs.mkdirSync(path.dirname(target), { recursive: true })
  fs.writeFileSync(target, content)
}

const releaseRegistry = JSON.parse(fs.readFileSync(path.join(destination, "r/registry.json"), "utf8"))
const releaseItemNames = new Set(releaseRegistry.items.map((item) => item.name))

for (const item of releaseRegistry.items) {
  const itemPath = path.join(destination, "r", `${item.name}.json`)
  assert(fs.existsSync(itemPath), `Release is missing registry item ${item.name}`)

  for (const dependency of item.registryDependencies ?? []) {
    assert(
      dependency.startsWith(`${releaseBaseUrl}/r/`),
      `${item.name}: release dependency is not versioned: ${dependency}`
    )
    const dependencyName = path.basename(new URL(dependency).pathname, ".json")
    assert(releaseItemNames.has(dependencyName), `${item.name}: unknown release dependency ${dependencyName}`)
  }
}

const files = walkFiles(destination)
  .sort((a, b) => a.localeCompare(b))
  .map((relativePath) => {
    const content = fs.readFileSync(path.join(destination, relativePath))
    return {
      path: relativePath,
      bytes: content.byteLength,
      sha256: sha256(content),
    }
  })

const manifestDigest = sha256(
  Buffer.from(files.map((file) => `${file.path}:${file.sha256}`).join("\n"))
)
const manifest = {
  $schema: `${releaseBaseUrl}/schemas/release-manifest.schema.json`,
  name: packageJson.name,
  version,
  status: version.includes("-") ? "prerelease" : "stable",
  immutable: true,
  distribution: {
    model: "shadcn-source",
    root: releaseBaseUrl,
    registry: `${releaseBaseUrl}/r/registry.json`,
    npmPackage: false,
  },
  compatibility: {
    node: packageJson.engines.node,
    react: packageJson.dependencies.react,
    tailwind: packageJson.devDependencies.tailwindcss,
    shadcn: aiManifest.distribution.cli,
    behaviorEngine: catalog.behaviorEngine,
  },
  inventory: {
    components: catalog.components.length,
    blocks: (catalog.blocks ?? []).length,
    chartBundles: (catalog.charts ?? []).length,
    registryItems: releaseRegistry.items.length,
  },
  integrity: {
    algorithm: "sha256",
    digest: manifestDigest,
    files,
  },
}

fs.writeFileSync(path.join(destination, "manifest.json"), `${JSON.stringify(manifest, null, 2)}\n`)

const totalBytes = files.reduce((sum, file) => sum + file.bytes, 0)
console.log(
  `Registry release ${writeRelease ? "staged" : "rehearsal passed"}: ${version}, ${releaseRegistry.items.length} items, ${files.length} files, ${totalBytes} bytes, sha256:${manifestDigest}.`
)

if (writeRelease) {
  const pointer = {
    version,
    manifest: `${releaseBaseUrl}/manifest.json`,
  }
  const pointerPath = path.join(publicRoot, "releases", "current.json")
  fs.mkdirSync(path.dirname(pointerPath), { recursive: true })
  fs.writeFileSync(pointerPath, `${JSON.stringify(pointer, null, 2)}\n`)
} else {
  fs.rmSync(temporaryRoot, { recursive: true, force: true })
}
