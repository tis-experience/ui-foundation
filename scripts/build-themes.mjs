#!/usr/bin/env node

import fs from "node:fs"
import path from "node:path"
import { fileURLToPath } from "node:url"

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..")
const sourceDir = path.join(root, "tokens", "themes")
const foundationSourceFile = path.join(root, "tokens", "foundations.json")
const densitySourceFile = path.join(root, "tokens", "densities.json")
const outputFile = path.join(root, "src", "styles", "generated", "themes.css")
const foundationOutputFile = path.join(root, "src", "styles", "generated", "foundations.css")
const densityOutputFile = path.join(root, "src", "styles", "generated", "densities.css")
const checkOnly = process.argv.includes("--check")

const sourceFiles = fs.readdirSync(sourceDir)
  .filter((file) => file.endsWith(".json"))
  .sort((a, b) => a.localeCompare(b))

if (sourceFiles.length === 0) {
  throw new Error("No theme sources found in tokens/themes")
}

const themes = sourceFiles.map((file) => {
  const theme = JSON.parse(fs.readFileSync(path.join(sourceDir, file), "utf8"))
  if (!theme.name || !theme.label || !theme.modes?.light || !theme.modes?.dark) {
    throw new Error(`${file}: expected name, label and light/dark modes`)
  }
  return theme
})

const foundation = JSON.parse(fs.readFileSync(foundationSourceFile, "utf8"))
if (!Array.isArray(foundation.groups) || foundation.groups.length === 0) {
  throw new Error("tokens/foundations.json: expected a non-empty groups array")
}

const density = JSON.parse(fs.readFileSync(densitySourceFile, "utf8"))
const densityNames = ["compact", "comfortable", "spacious"]
const densityProperties = ["height", "paddingInline", "gap", "fontSize", "iconSize"]
const densitySizes = ["sm", "md", "lg"]
if (!densityNames.includes(density.default) || !Array.isArray(density.profiles)) {
  throw new Error("tokens/densities.json: expected a valid default and profiles array")
}
if (density.profiles.map(({ name }) => name).join("\n") !== densityNames.join("\n")) {
  throw new Error(`tokens/densities.json: profiles must be ordered ${densityNames.join(", ")}`)
}
for (const profile of density.profiles) {
  for (const property of densityProperties) {
    for (const size of densitySizes) {
      if (typeof profile.control?.[property]?.[size] !== "string") {
        throw new Error(`tokens/densities.json: missing ${profile.name}.control.${property}.${size}`)
      }
    }
  }
}

const foundationTokens = []
const foundationNames = new Set()
for (const group of foundation.groups) {
  if (!group.name || !group.label || !Array.isArray(group.tokens) || group.tokens.length === 0) {
    throw new Error(`tokens/foundations.json: invalid group ${group.name || "unknown"}`)
  }
  for (const token of group.tokens) {
    if (!token.name || !token.type || typeof token.value !== "string" || token.value.length === 0) {
      throw new Error(`tokens/foundations.json: invalid token in ${group.name}`)
    }
    if (foundationNames.has(token.name)) {
      throw new Error(`tokens/foundations.json: duplicate token ${token.name}`)
    }
    foundationNames.add(token.name)
    foundationTokens.push(token)
  }
}

const canonicalKeys = Object.keys(themes[0].modes.light).sort()
for (const theme of themes) {
  for (const mode of ["light", "dark"]) {
    const keys = Object.keys(theme.modes[mode]).sort()
    if (keys.join("\n") !== canonicalKeys.join("\n")) {
      const missing = canonicalKeys.filter((key) => !keys.includes(key))
      const extra = keys.filter((key) => !canonicalKeys.includes(key))
      throw new Error(`${theme.name}/${mode}: token mismatch; missing=${missing.join(",") || "none"}; extra=${extra.join(",") || "none"}`)
    }
  }
}

function toLinearSrgb(value) {
  return value <= 0.04045
    ? value / 12.92
    : ((value + 0.055) / 1.055) ** 2.4
}

function parseColor(value) {
  if (/^#[0-9a-f]{6}$/i.test(value)) {
    return [0, 2, 4].map((index) =>
      toLinearSrgb(Number.parseInt(value.slice(index + 1, index + 3), 16) / 255)
    )
  }

  const oklch = value.match(/^oklch\(([\d.]+)\s+([\d.]+)\s+([\d.]+)\)$/i)
  if (!oklch) throw new Error(`Unsupported contrast color: ${value}`)
  const lightness = Number(oklch[1])
  const chroma = Number(oklch[2])
  const hue = Number(oklch[3]) * Math.PI / 180
  const a = chroma * Math.cos(hue)
  const b = chroma * Math.sin(hue)
  const l = (lightness + 0.3963377774 * a + 0.2158037573 * b) ** 3
  const m = (lightness - 0.1055613458 * a - 0.0638541728 * b) ** 3
  const s = (lightness - 0.0894841775 * a - 1.291485548 * b) ** 3
  return [
    4.0767416621 * l - 3.3077115913 * m + 0.2309699292 * s,
    -1.2684380046 * l + 2.6097574011 * m - 0.3413193965 * s,
    -0.0041960863 * l - 0.7034186147 * m + 1.707614701 * s,
  ].map((channel) => Math.max(0, Math.min(1, channel)))
}

function relativeLuminance([red, green, blue]) {
  return 0.2126 * red + 0.7152 * green + 0.0722 * blue
}

function contrastRatio(first, second) {
  const firstLuminance = relativeLuminance(parseColor(first))
  const secondLuminance = relativeLuminance(parseColor(second))
  return (Math.max(firstLuminance, secondLuminance) + 0.05) /
    (Math.min(firstLuminance, secondLuminance) + 0.05)
}

const focusContrast = []
const focusStateTokens = [
  ["default", "ring"],
  ["error", "destructive"],
  ["read-only", "muted-foreground"],
]
for (const theme of themes) {
  for (const mode of ["light", "dark"]) {
    for (const [state, token] of focusStateTokens) {
      const ratio = contrastRatio(theme.modes[mode][token], theme.modes[mode].background)
      if (ratio < 3) {
        throw new Error(`${theme.name}/${mode}: ${state} focus token ${token} must contrast at least 3:1 with background; received ${ratio.toFixed(2)}:1`)
      }
      focusContrast.push(`${theme.name}/${mode}/${state} ${ratio.toFixed(2)}:1`)
    }
  }
}

function declarations(tokens) {
  return canonicalKeys.map((key) => `  --${key}: ${tokens[key]};`).join("\n")
}

const neutral = themes.find((theme) => theme.name === "neutral")
if (!neutral) throw new Error("A neutral default theme is required")

const ordered = [neutral, ...themes.filter((theme) => theme !== neutral)]
const blocks = []
for (const theme of ordered) {
  const lightSelector = theme.name === "neutral"
    ? `:root, [data-ui-theme="neutral"]`
    : `[data-ui-theme="${theme.name}"]`
  const darkSelector = theme.name === "neutral"
    ? `.dark, .dark[data-ui-theme="neutral"]`
    : `.dark[data-ui-theme="${theme.name}"]`
  blocks.push(`${lightSelector} {\n${declarations(theme.modes.light)}\n}`)
  blocks.push(`${darkSelector} {\n${declarations(theme.modes.dark)}\n}`)
}

const output = `/* Generated by scripts/build-themes.mjs. Do not edit directly. */\n\n${blocks.join("\n\n")}\n`
const foundationDeclarations = foundationTokens
  .map((token) => `  --${token.name}: ${token.value};`)
  .join("\n")
const foundationOutput = `/* Generated by scripts/build-themes.mjs. Do not edit directly. */\n\n:root {\n${foundationDeclarations}\n}\n`
const densityName = (property) => property.replace(/[A-Z]/g, (character) => `-${character.toLowerCase()}`)
const orderedDensityProfiles = [
  density.profiles.find(({ name }) => name === density.default),
  ...density.profiles.filter(({ name }) => name !== density.default),
]
const densityBlocks = orderedDensityProfiles.map((profile) => {
  const selector = profile.name === density.default
    ? `:root, [data-ui-density="${profile.name}"]`
    : `[data-ui-density="${profile.name}"]`
  const values = densityProperties.flatMap((property) =>
    densitySizes.map((size) => `  --ui-control-${densityName(property)}-${size}: ${profile.control[property][size]};`)
  )
  return `${selector} {\n${values.join("\n")}\n}`
})
const densityOutput = `/* Generated by scripts/build-themes.mjs. Do not edit directly. */\n\n${densityBlocks.join("\n\n")}\n`

if (checkOnly) {
  const current = fs.existsSync(outputFile) ? fs.readFileSync(outputFile, "utf8") : ""
  const currentFoundations = fs.existsSync(foundationOutputFile)
    ? fs.readFileSync(foundationOutputFile, "utf8")
    : ""
  const currentDensities = fs.existsSync(densityOutputFile)
    ? fs.readFileSync(densityOutputFile, "utf8")
    : ""
  if (current !== output || currentFoundations !== foundationOutput || currentDensities !== densityOutput) {
    console.error("Generated theme, foundation or density CSS is stale. Run npm run build:themes.")
    process.exit(1)
  }
  console.log(`Contracts valid: ${themes.length} themes × ${canonicalKeys.length} tokens; ${foundationTokens.length} foundation tokens; ${density.profiles.length} density profiles; focus ${focusContrast.join(", ")}.`)
} else {
  fs.mkdirSync(path.dirname(outputFile), { recursive: true })
  fs.writeFileSync(outputFile, output)
  fs.writeFileSync(foundationOutputFile, foundationOutput)
  fs.writeFileSync(densityOutputFile, densityOutput)
  console.log(`Generated theme, foundation and density CSS from ${themes.length} themes, ${foundationTokens.length} core tokens and ${density.profiles.length} density profiles; focus ${focusContrast.join(", ")}.`)
}
