import { themeSources } from "@/catalog/foundation-data"
import customizerContract from "../../tokens/customizer.json"

type IdentityName = "neutral" | "tis" | "custom"
type BaseColorName = "neutral" | "slate" | "stone" | "zinc"
type ChartPaletteName = "brand" | "categorical" | "neutral"
type FontName = "geist" | "humanist" | "serif" | "system"
type RadiusName = "none" | "small" | "default" | "large" | "full"
type TypesetPresetName = "compact" | "default" | "reading" | "custom"

interface CustomizerConfig {
  identity: IdentityName
  baseColor: BaseColorName
  brand: string
  chartPalette: ChartPaletteName
  bodyFont: FontName
  headingFont: FontName
  typesetPreset: TypesetPresetName
  typesetSize: number
  typesetLeading: number
  typesetFlow: number
  typesetMeasure: number
  radius: RadiusName
  density: "compact" | "comfortable" | "spacious"
  mode: "light" | "dark"
}

type ThemeMode = Record<string, string>

interface CustomTheme {
  modes: {
    light: ThemeMode
    dark: ThemeMode
  }
  typography: {
    "font-sans": string
    "font-heading": string
    "typeset-config-size": string
    "typeset-config-leading": string
    "typeset-config-flow": string
    "typeset-config-measure": string
  }
}

const baseColorOptions = customizerContract.options.baseColor as Array<{
  label: string
  swatch: string
  value: BaseColorName
}>
const chartPaletteOptions = customizerContract.options.chartPalette as Array<{
  label: string
  value: ChartPaletteName
}>
const fontOptions = customizerContract.options.font as Array<{
  label: string
  source: "bundled" | "system-stack"
  stack: string
  value: FontName
}>
const typesetOptions = customizerContract.options.typeset as Array<{
  flow: number
  label: string
  leading: number
  measure: number
  size: number
  value: Exclude<TypesetPresetName, "custom">
}>
const radiusOptions = customizerContract.options.radius as Array<{
  cssValue: string
  label: string
  surfaceValue: string
  value: RadiusName
}>
const defaultCustomizerConfig = customizerContract.default as CustomizerConfig
const identityPresets = customizerContract.presets as Record<
  Exclude<IdentityName, "custom">,
  CustomizerConfig
>
const fontStacks = Object.fromEntries(
  fontOptions.map((option) => [option.value, option.stack])
) as Record<FontName, string>
const radiusValues = Object.fromEntries(
  radiusOptions.map((option) => [option.value, option.cssValue])
) as Record<RadiusName, string>
const surfaceRadiusValues = Object.fromEntries(
  radiusOptions.map((option) => [option.value, option.surfaceValue])
) as Record<RadiusName, string>

const baseColors = {
  neutral: {
    light: {
      background: "#ffffff",
      foreground: "#171717",
      muted: "#f5f5f5",
      mutedForeground: "#666666",
      border: "#e5e5e5",
    },
    dark: {
      background: "#171717",
      foreground: "#fafafa",
      card: "#262626",
      muted: "#2f2f2f",
      mutedForeground: "#a3a3a3",
      border: "#404040",
    },
  },
  slate: {
    light: {
      background: "#ffffff",
      foreground: "#0f172a",
      muted: "#f1f5f9",
      mutedForeground: "#475569",
      border: "#cbd5e1",
    },
    dark: {
      background: "#0f172a",
      foreground: "#f8fafc",
      card: "#1e293b",
      muted: "#273449",
      mutedForeground: "#94a3b8",
      border: "#334155",
    },
  },
  stone: {
    light: {
      background: "#fafaf9",
      foreground: "#1c1917",
      muted: "#f5f5f4",
      mutedForeground: "#57534e",
      border: "#d6d3d1",
    },
    dark: {
      background: "#1c1917",
      foreground: "#fafaf9",
      card: "#292524",
      muted: "#302c2a",
      mutedForeground: "#a8a29e",
      border: "#44403c",
    },
  },
  zinc: {
    light: {
      background: "#ffffff",
      foreground: "#18181b",
      muted: "#f4f4f5",
      mutedForeground: "#52525b",
      border: "#d4d4d8",
    },
    dark: {
      background: "#18181b",
      foreground: "#fafafa",
      card: "#27272a",
      muted: "#2f2f33",
      mutedForeground: "#a1a1aa",
      border: "#3f3f46",
    },
  },
} as const

const categoricalCharts = ["#0056e0", "#0086c9", "#7a5af8", "#12b76a", "#f79009"]
const neutralCharts = ["#d4d4d4", "#a3a3a3", "#737373", "#525252", "#262626"]

function normalizeHex(value: string) {
  const normalized = value.trim().toLowerCase()
  if (/^#[0-9a-f]{6}$/.test(normalized)) return normalized
  if (/^#[0-9a-f]{3}$/.test(normalized)) {
    return `#${normalized
      .slice(1)
      .split("")
      .map((character) => `${character}${character}`)
      .join("")}`
  }
  return defaultCustomizerConfig.brand
}

function hexToRgb(value: string) {
  const hex = normalizeHex(value).slice(1)
  return {
    r: Number.parseInt(hex.slice(0, 2), 16),
    g: Number.parseInt(hex.slice(2, 4), 16),
    b: Number.parseInt(hex.slice(4, 6), 16),
  }
}

function rgbToHex(red: number, green: number, blue: number) {
  return `#${[red, green, blue]
    .map((channel) => Math.round(channel).toString(16).padStart(2, "0"))
    .join("")}`
}

function mixHex(base: string, overlay: string, amount: number) {
  const from = hexToRgb(base)
  const to = hexToRgb(overlay)
  return rgbToHex(
    from.r + (to.r - from.r) * amount,
    from.g + (to.g - from.g) * amount,
    from.b + (to.b - from.b) * amount
  )
}

function relativeLuminance(value: string) {
  const { r, g, b } = hexToRgb(value)
  const linear = [r, g, b].map((channel) => {
    const normalized = channel / 255
    return normalized <= 0.04045
      ? normalized / 12.92
      : ((normalized + 0.055) / 1.055) ** 2.4
  })
  return linear[0] * 0.2126 + linear[1] * 0.7152 + linear[2] * 0.0722
}

function contrastRatio(first: string, second: string) {
  const lighter = Math.max(relativeLuminance(first), relativeLuminance(second))
  const darker = Math.min(relativeLuminance(first), relativeLuminance(second))
  return (lighter + 0.05) / (darker + 0.05)
}

function ensureContrast(color: string, background: string, direction: "darken" | "lighten") {
  if (contrastRatio(color, background) >= 3) return normalizeHex(color)
  const target = direction === "darken" ? "#000000" : "#ffffff"
  for (let step = 1; step <= 10; step += 1) {
    const candidate = mixHex(color, target, step / 10)
    if (contrastRatio(candidate, background) >= 3) return candidate
  }
  return target
}

function readableForeground(background: string) {
  return contrastRatio(background, "#ffffff") >= contrastRatio(background, "#101828")
    ? "#ffffff"
    : "#101828"
}

function chartColors(config: CustomizerConfig, dark: boolean) {
  if (config.chartPalette === "categorical") {
    return dark
      ? categoricalCharts.map((color) => mixHex(color, "#ffffff", 0.28))
      : categoricalCharts
  }
  if (config.chartPalette === "neutral") {
    return dark ? [...neutralCharts].reverse() : neutralCharts
  }
  const brand = normalizeHex(config.brand)
  const target = dark ? "#ffffff" : "#000000"
  return [0.06, 0.22, 0.4, 0.58, 0.74].map((amount) => mixHex(brand, target, amount))
}

function cloneMode(mode: ThemeMode) {
  return { ...mode }
}

function derivedCustomModes(config: CustomizerConfig) {
  const base = baseColors[config.baseColor]
  const brand = normalizeHex(config.brand)
  const lightPrimary = ensureContrast(brand, base.light.background, "darken")
  const darkPrimary = ensureContrast(brand, base.dark.background, "lighten")
  const lightCharts = chartColors(config, false)
  const darkCharts = chartColors(config, true)

  const light: ThemeMode = {
    background: base.light.background,
    foreground: base.light.foreground,
    card: base.light.background,
    "card-foreground": base.light.foreground,
    popover: base.light.background,
    "popover-foreground": base.light.foreground,
    primary: lightPrimary,
    "primary-foreground": readableForeground(lightPrimary),
    secondary: mixHex(base.light.background, lightPrimary, 0.1),
    "secondary-foreground": ensureContrast(lightPrimary, mixHex(base.light.background, lightPrimary, 0.1), "darken"),
    muted: base.light.muted,
    "muted-foreground": base.light.mutedForeground,
    overlay: "#10182833",
    accent: mixHex(base.light.background, lightPrimary, 0.14),
    "accent-foreground": ensureContrast(lightPrimary, mixHex(base.light.background, lightPrimary, 0.14), "darken"),
    destructive: "#b42318",
    border: base.light.border,
    input: base.light.border,
    ring: lightPrimary,
    radius: surfaceRadiusValues[config.radius],
    "control-radius": radiusValues[config.radius],
    sidebar: base.light.muted,
    "sidebar-foreground": base.light.foreground,
    "sidebar-primary": lightPrimary,
    "sidebar-primary-foreground": readableForeground(lightPrimary),
    "sidebar-accent": mixHex(base.light.background, lightPrimary, 0.12),
    "sidebar-accent-foreground": ensureContrast(lightPrimary, mixHex(base.light.background, lightPrimary, 0.12), "darken"),
    "sidebar-border": base.light.border,
    "sidebar-ring": lightPrimary,
  }

  const dark: ThemeMode = {
    background: base.dark.background,
    foreground: base.dark.foreground,
    card: base.dark.card,
    "card-foreground": base.dark.foreground,
    popover: base.dark.card,
    "popover-foreground": base.dark.foreground,
    primary: darkPrimary,
    "primary-foreground": readableForeground(darkPrimary),
    secondary: base.dark.muted,
    "secondary-foreground": base.dark.foreground,
    muted: base.dark.muted,
    "muted-foreground": base.dark.mutedForeground,
    overlay: "#000000b3",
    accent: mixHex(base.dark.background, darkPrimary, 0.18),
    "accent-foreground": base.dark.foreground,
    destructive: "#f97066",
    border: base.dark.border,
    input: base.dark.border,
    ring: darkPrimary,
    radius: surfaceRadiusValues[config.radius],
    "control-radius": radiusValues[config.radius],
    sidebar: base.dark.card,
    "sidebar-foreground": base.dark.foreground,
    "sidebar-primary": darkPrimary,
    "sidebar-primary-foreground": readableForeground(darkPrimary),
    "sidebar-accent": mixHex(base.dark.background, darkPrimary, 0.16),
    "sidebar-accent-foreground": base.dark.foreground,
    "sidebar-border": base.dark.border,
    "sidebar-ring": darkPrimary,
  }

  lightCharts.forEach((color, index) => {
    light[`chart-${index + 1}`] = color
  })
  darkCharts.forEach((color, index) => {
    dark[`chart-${index + 1}`] = color
  })

  return { light, dark }
}

function buildCustomTheme(config: CustomizerConfig): CustomTheme {
  const sourceModes =
    config.identity === "custom"
      ? derivedCustomModes(config)
      : {
          light: cloneMode(themeSources[config.identity].modes.light),
          dark: cloneMode(themeSources[config.identity].modes.dark),
        }
  const lightCharts = chartColors(config, false)
  const darkCharts = chartColors(config, true)

  for (let index = 0; index < 5; index += 1) {
    sourceModes.light[`chart-${index + 1}`] = lightCharts[index]
    sourceModes.dark[`chart-${index + 1}`] = darkCharts[index]
  }
  sourceModes.light.radius = surfaceRadiusValues[config.radius]
  sourceModes.dark.radius = surfaceRadiusValues[config.radius]
  sourceModes.light["control-radius"] = radiusValues[config.radius]
  sourceModes.dark["control-radius"] = radiusValues[config.radius]

  return {
    modes: sourceModes,
    typography: {
      "font-sans": fontStacks[config.bodyFont],
      "font-heading": fontStacks[config.headingFont],
      "typeset-config-size": `${config.typesetSize}px`,
      "typeset-config-leading": `${config.typesetLeading}`,
      "typeset-config-flow": `${config.typesetFlow}em`,
      "typeset-config-measure": `${config.typesetMeasure}ch`,
    },
  }
}

function serializeThemeCss(theme: CustomTheme) {
  const declarationBlock = (values: ThemeMode) =>
    Object.entries(values)
      .map(([name, value]) => `  --${name}: ${value};`)
      .join("\n")
  const typography = Object.entries(theme.typography)
    .map(([name, value]) => `  --${name}: ${value};`)
    .join("\n")

  return `[data-ui-theme="custom"] {\n${declarationBlock(theme.modes.light)}\n${typography}\n}\n\n.dark[data-ui-theme="custom"] {\n${declarationBlock(theme.modes.dark)}\n}`
}

function serializeRegistryTheme(config: CustomizerConfig, theme: CustomTheme) {
  const cssVariables = (values: ThemeMode) =>
    Object.fromEntries(Object.entries(values).map(([name, value]) => [`--${name}`, value]))
  const light = { ...cssVariables(theme.modes.light) }
  Object.entries(theme.typography).forEach(([name, value]) => {
    light[`--${name}`] = value
  })

  return JSON.stringify(
    {
      $schema: "https://ui.shadcn.com/schema/registry-item.json",
      name: "ui-foundation-custom-theme",
      title: "UI Foundation custom theme",
      description: "Portable theme generated by the UI Foundation customizer.",
      type: "registry:theme",
      registryDependencies: ["./ui-base.json"],
      css: {
        '[data-ui-theme="custom"]': light,
        '.dark[data-ui-theme="custom"]': cssVariables(theme.modes.dark),
      },
      meta: {
        selectedDensity: config.density,
        previewMode: config.mode,
        density: `Set data-ui-density="${config.density}" on the document root.`,
        generatedFrom: config,
      },
    },
    null,
    2
  )
}

function encodeCustomizerConfig(config: CustomizerConfig) {
  return window.btoa(JSON.stringify(config)).replaceAll("+", "-").replaceAll("/", "_").replace(/=+$/, "")
}

function decodeCustomizerConfig(value: string | null): CustomizerConfig | null {
  if (!value) return null
  try {
    const base64 = value.replaceAll("-", "+").replaceAll("_", "/")
    const parsed = JSON.parse(window.atob(base64)) as Partial<CustomizerConfig>
    if (
      !parsed.identity ||
      !parsed.baseColor ||
      !parsed.brand ||
      !parsed.chartPalette ||
      !parsed.bodyFont ||
      !parsed.headingFont ||
      !parsed.radius ||
      !parsed.density ||
      !parsed.mode
    ) return null
    return { ...defaultCustomizerConfig, ...parsed }
  } catch {
    return null
  }
}

export {
  baseColorOptions,
  buildCustomTheme,
  chartPaletteOptions,
  decodeCustomizerConfig,
  defaultCustomizerConfig,
  encodeCustomizerConfig,
  fontOptions,
  identityPresets,
  radiusOptions,
  typesetOptions,
  serializeRegistryTheme,
  serializeThemeCss,
}
export type {
  BaseColorName,
  ChartPaletteName,
  CustomTheme,
  CustomizerConfig,
  FontName,
  IdentityName,
  RadiusName,
  TypesetPresetName,
}
