#!/usr/bin/env node

import fs from "node:fs"
import path from "node:path"
import { fileURLToPath } from "node:url"

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..")
const checkOnly = process.argv.includes("--check")
const siteBaseUrl = "https://tis-experience.github.io/ui-foundation"
const publicUrl = (relativePath) => `${siteBaseUrl}/${relativePath.replace(/^\/+/, "")}`

function readJson(relativePath) {
  return JSON.parse(fs.readFileSync(path.join(root, relativePath), "utf8"))
}

function extractExports(relativePaths) {
  const exports = new Set()

  for (const relativePath of relativePaths) {
    const source = fs.readFileSync(path.join(root, relativePath), "utf8")
    const blocks = source.matchAll(/export\s*\{([\s\S]*?)\}/g)

    for (const block of blocks) {
      for (const candidate of block[1].split(",")) {
        const normalized = candidate
          .replace(/\btype\s+/g, "")
          .replace(/\s+as\s+.*/g, "")
          .trim()

        if (/^[A-Za-z_$][\w$]*$/.test(normalized)) {
          exports.add(normalized)
        }
      }
    }
  }

  return [...exports].sort((a, b) => a.localeCompare(b))
}

const catalog = readJson("registry/catalog.json")
const packageJson = readJson("package.json")
const foundations = readJson("tokens/foundations.json")
const densities = readJson("tokens/densities.json")
const neutral = readJson("tokens/themes/neutral.json")
const tis = readJson("tokens/themes/tis.json")
const customizer = readJson("tokens/customizer.json")
const foundationTokenCount = foundations.groups.reduce(
  (count, group) => count + group.tokens.length,
  0
)

if (catalog.version !== packageJson.version) {
  throw new Error(`Version mismatch: package=${packageJson.version}, catalog=${catalog.version}`)
}
if (customizer.version !== packageJson.version) {
  throw new Error(`Version mismatch: package=${packageJson.version}, customizer=${customizer.version}`)
}

const manifest = {
  $schema: publicUrl("schemas/ai-manifest.schema.json"),
  name: "ui-foundation",
  version: packageJson.version,
  status: "alpha",
  independence: {
    standalone: true,
    dependsOnDsTis: false,
    figmaAvailable: false,
  },
  distribution: {
    model: "shadcn-source",
    cli: "shadcn@4.18.0",
    behaviorEngine: catalog.behaviorEngine,
    registryBaseUrl: publicUrl("r"),
  },
  theming: {
    default: neutral.name,
    optional: [tis.name],
    selector: "data-ui-theme",
    colorModes: ["light", "dark"],
    darkModeSelector: ".dark",
    density: {
      source: publicUrl("tokens/densities.json"),
      selector: "data-ui-density",
      default: densities.default,
      profiles: densities.profiles,
    },
    customizer: {
      source: publicUrl("tokens/customizer.json"),
      route: `${siteBaseUrl}/#customize`,
      default: customizer.default,
      options: customizer.options,
      outputs: customizer.outputs,
    },
  },
  foundations: {
    source: publicUrl("tokens/foundations.json"),
    tokenCount: foundationTokenCount,
    groups: foundations.groups,
  },
  rules: [
    "Read this manifest before selecting or generating components.",
    "Install registry source instead of recreating component markup from memory.",
    "Use Neutral unless the TIS identity is explicitly requested.",
    "Use Comfortable density unless the product explicitly requires Compact or Spacious controls.",
    "Use Base UI render composition; do not translate examples to Radix asChild.",
    "Use the theme and foundation token contracts; never hardcode brand colors in components.",
    "Prefer an installable block when it matches the requested application pattern, then adapt its owned source.",
    "Use the chart recipe bundle for Area, Bar, Line, Pie, Radar or Radial visualizations and keep its text summary or an equivalent data table.",
    "Preserve visible labels, focus behavior, keyboard paths and responsive states.",
    "Do not claim a Figma library or handoff exists for this alpha."
  ],
  sources: [
    publicUrl("ai/manifest.json"),
    publicUrl("llms.txt"),
    publicUrl("r/registry.json"),
    publicUrl("registry/catalog.json"),
    publicUrl("ai/customizer.json"),
    publicUrl("tokens/foundations.json"),
    publicUrl("tokens/densities.json"),
    publicUrl("tokens/customizer.json"),
    publicUrl("tokens/themes/neutral.json"),
    publicUrl("tokens/themes/tis.json"),
    publicUrl("docs/ai-usage.md"),
    publicUrl("docs/blocks.md"),
    publicUrl("docs/charts.md"),
    publicUrl("docs/customization.md"),
    publicUrl("docs/compositions.md")
  ],
  guides: (catalog.guides ?? []).map((guide) => ({
    ...guide,
    install: null,
  })),
  components: catalog.components.map((component) => ({
    name: component.name,
    title: component.title,
    status: "alpha",
    category: component.category,
    ...(component.introducedIn ? { introducedIn: component.introducedIn } : {}),
    description: component.description,
    install: `npx shadcn@4.18.0 add ${publicUrl(`r/${component.name}.json`)}`,
    exports: extractExports(component.files),
    files: component.files,
    dependencies: component.dependencies ?? [],
    registryDependencies: component.registryDependencies ?? [],
    accessibility: component.accessibility
  })),
  blocks: (catalog.blocks ?? []).map((block) => ({
    name: block.name,
    title: block.title,
    status: "alpha",
    category: block.category,
    description: block.description,
    install: `npx shadcn@4.18.0 add ${publicUrl(`r/${block.name}.json`)}`,
    exports: extractExports(block.files),
    files: block.files,
    dependencies: block.dependencies ?? [],
    registryDependencies: block.registryDependencies ?? [],
    accessibility: block.accessibility,
  })),
  charts: (catalog.charts ?? []).map((chart) => ({
    name: chart.name,
    title: chart.title,
    status: "alpha",
    category: chart.category,
    description: chart.description,
    install: `npx shadcn@4.18.0 add ${publicUrl(`r/${chart.name}.json`)}`,
    exports: extractExports(chart.files),
    files: chart.files,
    dependencies: chart.dependencies ?? [],
    registryDependencies: chart.registryDependencies ?? [],
    accessibility: chart.accessibility,
  }))
}

const llms = `# UI Foundation

Standalone React component library. Neutral is the default theme; TIS is optional. There is no ds-tis dependency and no Figma library in this alpha.

## Runtime and distribution

- React 19
- shadcn source registry: 4.18.0
- Base UI behavior engine: 1.7.0
- Tailwind CSS 4

## Agent rules

${manifest.rules.map((rule) => `- ${rule}`).join("\n")}

## Themes

- Neutral: default, light and dark
- TIS: optional via data-ui-theme="tis", light and dark

## Density

- Comfortable: default; control heights 32 / 40 / 48px for sm / md / lg
- Compact: opt-in for dense interfaces; 28 / 32 / 36px
- Spacious: opt-in for generous and touch-oriented interfaces; 40 / 48 / 56px
- Apply with data-ui-density="compact|comfortable|spacious" on the document root

## Customizer

- Human interface: ${siteBaseUrl}/#customize
- Machine-readable contract: ${publicUrl("tokens/customizer.json")}
- Identity presets: ${customizer.options.identity.map((option) => option.value).join(", ")}
- Base colors: ${customizer.options.baseColor.map((option) => option.value).join(", ")}
- Fonts: ${customizer.options.font.map((option) => option.value).join(", ")}
- Typeset presets: ${customizer.options.typeset.map((option) => `${option.value} (${option.size}px / ${option.leading} leading / ${option.measure}ch)`).join(", ")}
- Radius: ${customizer.options.radius.map((option) => option.value).join(", ")}
- Outputs: ${customizer.outputs.join(", ")}

## Foundations (${foundationTokenCount} tokens)

${foundations.groups.map((group) => `- ${group.label}: ${group.tokens.map((token) => `--${token.name}`).join(", ")}`).join("\n")}

## Components (${manifest.components.length})

${manifest.components.map((component) => `- ${component.title} (${component.name}): ${component.description} Exports: ${component.exports.join(", ")}.`).join("\n")}

## Blocks (${manifest.blocks.length})

${manifest.blocks.map((block) => `- ${block.title} (${block.name}): ${block.description} Installable registry:block. Exports: ${block.exports.join(", ")}.`).join("\n")}

## Chart recipe bundles (${manifest.charts.length})

${manifest.charts.map((chart) => `- ${chart.title} (${chart.name}): ${chart.description} Installable registry:block. Exports: ${chart.exports.join(", ")}.`).join("\n")}

## Canonical machine-readable source

Read ${publicUrl("ai/manifest.json")} before generating an interface.
`

const guideLlms = manifest.guides.length
  ? `\n## Guides and compositions (${manifest.guides.length})\n\n${manifest.guides.map((guide) => `- ${guide.title} (${guide.name}, ${guide.type}): ${guide.description} This is not an installable registry item.`).join("\n")}\n`
  : ""

const outputs = new Map([
  ["public/ai/manifest.json", `${JSON.stringify(manifest, null, 2)}\n`],
  ["public/ai/customizer.json", `${JSON.stringify(customizer, null, 2)}\n`],
  ["public/llms.txt", `${llms}${guideLlms}`],
  ["public/registry/catalog.json", fs.readFileSync(path.join(root, "registry/catalog.json"), "utf8")],
  ["public/tokens/foundations.json", fs.readFileSync(path.join(root, "tokens/foundations.json"), "utf8")],
  ["public/tokens/densities.json", fs.readFileSync(path.join(root, "tokens/densities.json"), "utf8")],
  ["public/tokens/customizer.json", fs.readFileSync(path.join(root, "tokens/customizer.json"), "utf8")],
  ["public/tokens/themes/neutral.json", fs.readFileSync(path.join(root, "tokens/themes/neutral.json"), "utf8")],
  ["public/tokens/themes/tis.json", fs.readFileSync(path.join(root, "tokens/themes/tis.json"), "utf8")],
  ["public/schemas/ai-manifest.schema.json", fs.readFileSync(path.join(root, "schemas/ai-manifest.schema.json"), "utf8")],
  ["public/schemas/component-catalog.schema.json", fs.readFileSync(path.join(root, "schemas/component-catalog.schema.json"), "utf8")],
  ["public/tokens/foundation.schema.json", fs.readFileSync(path.join(root, "tokens/foundation.schema.json"), "utf8")],
  ["public/tokens/density.schema.json", fs.readFileSync(path.join(root, "tokens/density.schema.json"), "utf8")],
  ["public/tokens/customizer.schema.json", fs.readFileSync(path.join(root, "tokens/customizer.schema.json"), "utf8")],
  ["public/tokens/theme.schema.json", fs.readFileSync(path.join(root, "tokens/theme.schema.json"), "utf8")],
  ...fs.readdirSync(path.join(root, "docs"), { withFileTypes: true })
    .filter((entry) => entry.isFile() && entry.name.endsWith(".md"))
    .map((entry) => [
      `public/docs/${entry.name}`,
      fs.readFileSync(path.join(root, "docs", entry.name), "utf8"),
    ]),
  ...fs.readdirSync(path.join(root, "docs/decisions"), { withFileTypes: true })
    .filter((entry) => entry.isFile() && entry.name.endsWith(".md"))
    .map((entry) => [
      `public/docs/decisions/${entry.name}`,
      fs.readFileSync(path.join(root, "docs/decisions", entry.name), "utf8"),
    ])
])

for (const [relativePath, content] of outputs) {
  const absolutePath = path.join(root, relativePath)

  if (checkOnly) {
    const current = fs.existsSync(absolutePath) ? fs.readFileSync(absolutePath, "utf8") : ""
    if (current !== content) {
      console.error(`${relativePath} is stale. Run npm run build:ai.`)
      process.exitCode = 1
    }
  } else {
    fs.mkdirSync(path.dirname(absolutePath), { recursive: true })
    fs.writeFileSync(absolutePath, content)
  }
}

if (process.exitCode !== 1) {
  console.log(`AI surfaces valid: ${manifest.components.length} components, ${manifest.blocks.length} blocks, ${manifest.charts.length} chart bundles, ${manifest.rules.length} agent rules.`)
}
