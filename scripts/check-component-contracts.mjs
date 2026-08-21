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
const interactionNames = Object.keys(contracts.interactionContracts)
const interactionTestSource = fs.readFileSync(
  path.join(root, "tests/component-contracts.spec.ts"),
  "utf8"
)

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
assert(
  interactionNames.join("\n") === [...interactionNames].sort((a, b) => a.localeCompare(b)).join("\n"),
  "Interaction contracts must be alphabetical"
)

for (const [componentName, profileName] of Object.entries(contracts.components)) {
  assert(contracts.profiles[profileName], `${componentName}: unknown contract profile ${profileName}`)
}

for (const [componentName, contract] of Object.entries(contracts.interactionContracts)) {
  assert(contracts.components[componentName], `${componentName}: interaction contract has no component profile`)
  for (const field of [
    "semantics",
    "keyboardInteractions",
    "focusManagement",
    "requiredComposition",
  ]) {
    assert(contract[field]?.length > 0, `${componentName}: ${field} cannot be empty`)
  }
  assert(contract.upstream?.shadcn, `${componentName}: missing shadcn upstream source`)
  assert(contract.upstream?.behavior, `${componentName}: missing behavior upstream source`)
  assert(
    contract.evidence === `tests/component-contracts.spec.ts#${componentName}`,
    `${componentName}: evidence must use its canonical test anchor`
  )
  assert(
    interactionTestSource.includes(`test.describe("contract: ${componentName}"`),
    `${componentName}: interaction contract has no matching automated test group`
  )
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
  `Component contracts valid: ${contractNames.length} components across ${profileNames.length} behavior profiles; ${interactionNames.length} interaction-tested.`
)
