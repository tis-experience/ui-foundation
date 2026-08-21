#!/usr/bin/env node

import fs from "node:fs"
import path from "node:path"
import { fileURLToPath } from "node:url"

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..")
const readJson = (relativePath) =>
  JSON.parse(fs.readFileSync(path.join(root, relativePath), "utf8"))

const packageJson = readJson("package.json")
const catalog = readJson("registry/catalog.json")
const contracts = readJson("contracts/component-contracts.json")
const catalogNames = catalog.components.map(({ name }) => name)
const contractNames = Object.keys(contracts.components)
const profileNames = Object.keys(contracts.profiles)

function assert(condition, message) {
  if (!condition) throw new Error(message)
}

assert(contracts.version === packageJson.version, "Component contract version must match package.json")
assert(profileNames.length > 0, "At least one component contract profile is required")
assert(new Set(contractNames).size === contractNames.length, "Component contracts must be unique")
assert(
  contractNames.join("\n") === [...contractNames].sort((a, b) => a.localeCompare(b)).join("\n"),
  "Component contracts must be alphabetical"
)
assert(
  catalogNames.join("\n") === contractNames.join("\n"),
  "Every catalog component must have exactly one component contract"
)

for (const [componentName, profileName] of Object.entries(contracts.components)) {
  assert(contracts.profiles[profileName], `${componentName}: unknown contract profile ${profileName}`)
}

for (const [profileName, profile] of Object.entries(contracts.profiles)) {
  for (const field of [
    "classification",
    "behaviorOwner",
    "keyboard",
    "responsive",
    "requiredStates",
    "consumerResponsibilities",
  ]) {
    assert(profile[field] != null, `${profileName}: missing ${field}`)
  }

  assert(profile.requiredStates.length > 0, `${profileName}: requiredStates cannot be empty`)
  assert(
    profile.consumerResponsibilities.length > 0,
    `${profileName}: consumerResponsibilities cannot be empty`
  )
}

console.log(
  `Component contracts valid: ${contractNames.length} components across ${profileNames.length} behavior profiles.`
)
