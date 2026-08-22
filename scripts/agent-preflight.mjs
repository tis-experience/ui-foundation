#!/usr/bin/env node

import { spawnSync } from "node:child_process"
import fs from "node:fs"

const packageJson = JSON.parse(fs.readFileSync("package.json", "utf8"))
const catalog = JSON.parse(fs.readFileSync("registry/catalog.json", "utf8"))
const contracts = JSON.parse(fs.readFileSync("contracts/component-contracts.json", "utf8"))
const stagedRelease = fs.existsSync(`public/releases/${packageJson.version}/manifest.json`)

const run = (command, args) =>
  spawnSync(command, args, { encoding: "utf8" }).stdout.trim()

const branch = run("git", ["branch", "--show-current"])
const status = run("git", ["status", "--short"])
const commit = run("git", ["log", "-1", "--oneline"])
const generatedChecks = [
  ["themes", ["scripts/build-themes.mjs", "--check"]],
  ["registry", ["scripts/build-registry.mjs", "--check"]],
  ["contracts", ["scripts/check-component-contracts.mjs"]],
  ["ai", ["scripts/build-ai.mjs", "--check"]],
].map(([name, args]) => {
  const result = spawnSync(process.execPath, args, { encoding: "utf8" })
  return `${name}=${result.status === 0 ? "fresh" : "stale"}`
})

console.log("UI Foundation agent preflight")
console.log(`branch: ${branch}`)
console.log(`worktree: ${status ? `${status.split("\n").length} changed path(s)` : "clean"}`)
console.log(`version: ${packageJson.version}`)
console.log(`catalog: ${catalog.components.length} components, ${catalog.blocks.length} blocks, ${catalog.charts.length} chart bundle(s)`)
console.log(`contracts: ${Object.keys(contracts.components).length} components, ${Object.keys(contracts.profiles).length} profiles`)
console.log(`release: ${stagedRelease ? "staged" : "not staged"}; npm publication blocked`)
console.log(`generated: ${generatedChecks.join(", ")}`)
console.log(`head: ${commit}`)
console.log("required gates: npm test; npm run test:consumer; npm run test:e2e; post-deploy npm run test:consumer:public")
