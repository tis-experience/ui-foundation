#!/usr/bin/env node

import fs from "node:fs"
import path from "node:path"
import { fileURLToPath } from "node:url"

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..")
const outputFile = path.join(root, "registry.json")
const checkOnly = process.argv.includes("--check")
const homepage = "https://tis-experience.github.io/ui-foundation/"
const registryBaseUrl = `${homepage}r`
const registryDependency = (name) => `${registryBaseUrl}/${name}.json`

function readJson(relativePath) {
  return JSON.parse(fs.readFileSync(path.join(root, relativePath), "utf8"))
}

const catalog = readJson("registry/catalog.json")
const foundations = readJson("tokens/foundations.json")
const densities = readJson("tokens/densities.json")
const neutral = readJson("tokens/themes/neutral.json")
const tis = readJson("tokens/themes/tis.json")

const foundationTokens = foundations.groups.flatMap((group) => group.tokens)
const foundationCssVars = Object.fromEntries(
  foundationTokens.map(({ name, value }) => [name, value])
)
const densityProperties = ["height", "paddingInline", "gap", "fontSize", "iconSize"]
const densitySizes = ["sm", "md", "lg"]
const densityCssName = (property) => property.replace(/[A-Z]/g, (character) => `-${character.toLowerCase()}`)

function densityCssVariables(profile) {
  return Object.fromEntries(
    densityProperties.flatMap((property) =>
      densitySizes.map((size) => [
        `--ui-control-${densityCssName(property)}-${size}`,
        profile.control[property][size],
      ])
    )
  )
}

const defaultDensity = densities.profiles.find(({ name }) => name === densities.default)
if (!defaultDensity) throw new Error("tokens/densities.json: default profile is missing")
const focusSelector = ':where([data-slot]):focus-visible:not([data-slot="input-group-control"], [data-slot="combobox-input"], [data-slot="message-scroller-viewport"], [data-slot="resizable-handle"])'
const focusNestedSelector = ':where([data-slot] button, [data-slot] a, [data-slot] input, [data-slot] textarea, [data-slot] select, [data-slot] [tabindex]:not([tabindex="-1"])):focus-visible:not([data-slot="input-group-control"], [data-slot="combobox-input"], [data-slot="message-scroller-viewport"], [data-slot="resizable-handle"])'
const focusPreparationSelector = ':where([data-slot]), :where([data-slot] button, [data-slot] a, [data-slot] input, [data-slot] textarea, [data-slot] select, [data-slot] [tabindex]:not([tabindex="-1"]))'
const focusContainerSelector = ':where([data-slot="input-group"]):has([data-slot="input-group-control"]:focus-visible), :where([data-slot="combobox-chips"]):focus-within, :where([data-slot="questionnaire-choice"]):has(input:focus-visible), :where([data-slot="message-scroller"]):has([data-slot="message-scroller-viewport"]:focus-visible), :where([data-slot="resizable-panel-group"]):has([data-slot="resizable-handle"]:focus-visible)'
const focusProperties = {
  "--tw-ring-offset-shadow": "0 0 #0000 !important",
  "--tw-ring-shadow": "0 0 #0000 !important",
  "outline-color": "var(--focus-ring-color, var(--ring)) !important",
  "outline-offset": "var(--focus-ring-offset) !important",
  "outline-style": "solid !important",
  "outline-width": "var(--focus-ring-width) !important",
}
const focusReadOnlySelector = ':where([readonly], [aria-readonly="true"], [data-readonly])'
const focusInvalidSelector = ':where([aria-invalid="true"], [data-invalid])'
const focusContainerReadOnlySelector = ':where([data-slot="input-group"]):has([readonly], [aria-readonly="true"], [data-readonly]), :where([data-slot="combobox-chips"]):has([readonly], [aria-readonly="true"], [data-readonly]), :where([data-slot="questionnaire-choice"]):has([readonly], [aria-readonly="true"], [data-readonly])'
const focusContainerInvalidSelector = ':where([data-slot="input-group"]):has([aria-invalid="true"], [data-invalid]), :where([data-slot="combobox-chips"]):has([aria-invalid="true"], [data-invalid]), :where([data-slot="questionnaire-choice"]):has([aria-invalid="true"], [data-invalid])'
const focusHaloSuppressionSelector = ':where([data-slot="field-label"]):has(:focus-visible), :where([data-slot="attachment"]):focus-within'
const delegatedFocusSuppressionSelector = ':where([data-slot="message-scroller-viewport"], [data-slot="resizable-handle"]):focus-visible'

const names = catalog.components.map((component) => component.name)
const guides = catalog.guides ?? []
const blocks = catalog.blocks ?? []
const charts = catalog.charts ?? []
if (new Set(names).size !== names.length) {
  throw new Error("Component names must be unique")
}

const orderedNames = [...names].sort((a, b) => a.localeCompare(b))
if (orderedNames.join("\n") !== names.join("\n")) {
  throw new Error("Components in registry/catalog.json must be alphabetical")
}

const guideNames = guides.map((guide) => guide.name)
if (new Set(guideNames).size !== guideNames.length) {
  throw new Error("Guide names must be unique")
}

if ([...guideNames].sort((a, b) => a.localeCompare(b)).join("\n") !== guideNames.join("\n")) {
  throw new Error("Guides in registry/catalog.json must be alphabetical")
}

const blockNames = blocks.map((block) => block.name)
if (new Set(blockNames).size !== blockNames.length) {
  throw new Error("Block names must be unique")
}

if ([...blockNames].sort((a, b) => a.localeCompare(b)).join("\n") !== blockNames.join("\n")) {
  throw new Error("Blocks in registry/catalog.json must be alphabetical")
}

if (blockNames.some((name) => names.includes(name))) {
  throw new Error("Blocks and components must not share registry item names")
}

const chartNames = charts.map((chart) => chart.name)
if (new Set(chartNames).size !== chartNames.length) {
  throw new Error("Chart recipe names must be unique")
}

if ([...chartNames].sort((a, b) => a.localeCompare(b)).join("\n") !== chartNames.join("\n")) {
  throw new Error("Charts in registry/catalog.json must be alphabetical")
}

if (chartNames.some((name) => names.includes(name) || blockNames.includes(name))) {
  throw new Error("Charts, blocks and components must not share registry item names")
}

for (const component of catalog.components) {
  for (const file of component.files) {
    if (!fs.existsSync(path.join(root, file))) {
      throw new Error(`${component.name}: missing source file ${file}`)
    }
  }

  for (const dependency of component.registryDependencies ?? []) {
    if (!names.includes(dependency)) {
      throw new Error(`${component.name}: unknown registry dependency ${dependency}`)
    }
  }

  for (const dependency of component.dependencies ?? []) {
    if (/(^|@)latest$/.test(dependency)) {
      throw new Error(`${component.name}: dependencies must be version-pinned, received ${dependency}`)
    }
  }
}

for (const block of blocks) {
  for (const file of block.files) {
    if (!fs.existsSync(path.join(root, file))) {
      throw new Error(`${block.name}: missing source file ${file}`)
    }
  }

  for (const dependency of block.registryDependencies ?? []) {
    if (!names.includes(dependency)) {
      throw new Error(`${block.name}: unknown registry dependency ${dependency}`)
    }
  }

  for (const dependency of block.dependencies ?? []) {
    if (/(^|@)latest$/.test(dependency)) {
      throw new Error(`${block.name}: dependencies must be version-pinned, received ${dependency}`)
    }
  }
}

for (const chart of charts) {
  for (const file of chart.files) {
    if (!fs.existsSync(path.join(root, file))) {
      throw new Error(`${chart.name}: missing source file ${file}`)
    }
  }

  for (const dependency of chart.registryDependencies ?? []) {
    if (!names.includes(dependency)) {
      throw new Error(`${chart.name}: unknown registry dependency ${dependency}`)
    }
  }

  for (const dependency of chart.dependencies ?? []) {
    if (/(^|@)latest$/.test(dependency)) {
      throw new Error(`${chart.name}: dependencies must be version-pinned, received ${dependency}`)
    }
  }
}

for (const guide of guides) {
  for (const componentName of guide.components) {
    if (!names.includes(componentName)) {
      throw new Error(`${guide.name}: unknown component ${componentName}`)
    }
  }
}

function componentItem(component) {
  return {
    name: component.name,
    type: "registry:ui",
    title: component.title,
    description: component.description,
    dependencies: component.dependencies ?? [],
    registryDependencies: [
      registryDependency("ui-base"),
      ...(component.registryDependencies ?? []).map(registryDependency),
    ],
    files: component.files.map((file) => ({
      path: file,
      type: file.startsWith("src/hooks/")
        ? "registry:hook"
        : file.endsWith(".css")
          ? "registry:style"
          : "registry:ui",
    })),
    categories: [component.category],
    meta: {
      behaviorEngine: catalog.behaviorEngine,
      distribution: catalog.distribution,
      accessibility: component.accessibility,
      status: "alpha",
      ...(component.introducedIn ? { introducedIn: component.introducedIn } : {}),
    },
  }
}

function blockItem(block) {
  return {
    name: block.name,
    type: "registry:block",
    title: block.title,
    description: block.description,
    dependencies: block.dependencies ?? [],
    registryDependencies: [
      registryDependency("ui-base"),
      ...(block.registryDependencies ?? []).map(registryDependency),
    ],
    files: block.files.map((file) => ({
      path: file,
      target: file,
      type: "registry:component",
    })),
    categories: [block.category],
    meta: {
      behaviorEngine: catalog.behaviorEngine,
      distribution: catalog.distribution,
      accessibility: block.accessibility,
      status: "alpha",
    },
  }
}

function cssVariableMap(tokens) {
  return Object.fromEntries(
    Object.entries(tokens).map(([name, value]) => [`--${name}`, value])
  )
}

const registry = {
  $schema: "https://ui.shadcn.com/schema/registry.json",
  name: "ui-foundation",
  homepage,
  items: [
    {
      name: "ui-base",
      type: "registry:base",
      title: "UI Foundation Base",
      description: "Base dependencies, utilities and neutral semantic theme for UI Foundation components.",
      dependencies: [
        "@base-ui/react@1.7.0",
        "class-variance-authority@0.7.1",
        "clsx@2.1.1",
        "lucide-react@1.33.0",
        "shadcn@4.18.0",
        "tailwind-merge@3.6.0",
        "tw-animate-css@1.4.0",
      ],
      files: [
        {
          path: "src/lib/utils.ts",
          type: "registry:lib",
        },
      ],
      cssVars: {
        theme: {
          ...foundationCssVars,
          "color-overlay": "var(--overlay)",
        },
        light: neutral.modes.light,
        dark: neutral.modes.dark,
      },
      css: {
        ':root, [data-ui-density="comfortable"]': densityCssVariables(defaultDensity),
        ...Object.fromEntries(
          densities.profiles
            .filter(({ name }) => name !== densities.default)
            .map((profile) => [`[data-ui-density="${profile.name}"]`, densityCssVariables(profile)])
        ),
        "*": { "outline-color": "var(--focus-ring-color, var(--ring))" },
        [focusPreparationSelector]: {
          "outline-color": "var(--focus-ring-color, var(--ring))",
          "outline-offset": "var(--focus-ring-offset)",
          "outline-width": "var(--focus-ring-width)",
        },
        [focusSelector]: focusProperties,
        [focusNestedSelector]: focusProperties,
        [focusContainerSelector]: focusProperties,
        [focusReadOnlySelector]: { "--focus-ring-color": "var(--muted-foreground)" },
        [focusContainerReadOnlySelector]: { "--focus-ring-color": "var(--muted-foreground)" },
        [focusInvalidSelector]: { "--focus-ring-color": "var(--destructive)" },
        [focusContainerInvalidSelector]: { "--focus-ring-color": "var(--destructive)" },
        [focusHaloSuppressionSelector]: {
          "--tw-ring-offset-shadow": "0 0 #0000 !important",
          "--tw-ring-shadow": "0 0 #0000 !important",
        },
        [delegatedFocusSuppressionSelector]: {
          "--tw-ring-offset-shadow": "0 0 #0000 !important",
          "--tw-ring-shadow": "0 0 #0000 !important",
          "outline-style": "none !important",
        },
        "@media (forced-colors: active)": {
          ':where([data-slot]):focus-visible, :where([data-slot] button, [data-slot] a, [data-slot] input, [data-slot] textarea, [data-slot] select, [data-slot] [tabindex]:not([tabindex="-1"])):focus-visible, :where([data-slot="input-group"]):has([data-slot="input-group-control"]:focus-visible), :where([data-slot="combobox-chips"]):focus-within, :where([data-slot="questionnaire-choice"]):has(input:focus-visible), :where([data-slot="message-scroller"]):has([data-slot="message-scroller-viewport"]:focus-visible), :where([data-slot="resizable-panel-group"]):has([data-slot="resizable-handle"]:focus-visible)': {
            "outline-color": "Highlight !important",
          },
        },
      },
      docs: "Neutral and Comfortable are the defaults. Set data-ui-density to compact, comfortable or spacious. Add theme-tis separately and set data-ui-theme=\"tis\" on the document root to opt into the TIS identity.",
      meta: {
        distribution: catalog.distribution,
        behaviorEngine: catalog.behaviorEngine,
        defaultTheme: catalog.defaultTheme,
        foundationTokenCount: foundationTokens.length,
        defaultDensity: densities.default,
        densityProfiles: densities.profiles.map(({ name }) => name),
      },
    },
    {
      name: "theme-tis",
      type: "registry:theme",
      title: "TIS Theme",
      description: "Optional standalone TIS identity preset for UI Foundation.",
      registryDependencies: [registryDependency("ui-base")],
      css: {
        "[data-ui-theme=\"tis\"]": cssVariableMap(tis.modes.light),
        ".dark[data-ui-theme=\"tis\"]": cssVariableMap(tis.modes.dark),
      },
      docs: "Apply data-ui-theme=\"tis\" to the html element. Add class=\"dark\" on the same element for dark mode. This preset has no dependency on ds-tis.",
      meta: {
        optional: true,
        source: "tokens/themes/tis.json",
      },
    },
    ...catalog.components.map(componentItem),
    ...blocks.map(blockItem),
    ...charts.map(blockItem),
  ],
}

const output = `${JSON.stringify(registry, null, 2)}\n`

if (checkOnly) {
  const current = fs.existsSync(outputFile) ? fs.readFileSync(outputFile, "utf8") : ""
  if (current !== output) {
    console.error("registry.json is stale. Run npm run build:registry:source.")
    process.exit(1)
  }
  console.log(`Registry source valid: ${catalog.components.length} components, ${blocks.length} blocks, ${charts.length} chart bundles, 2 foundation items.`)
} else {
  fs.writeFileSync(outputFile, output)
  console.log(`Generated registry.json with ${catalog.components.length + blocks.length + charts.length + 2} items.`)
}
