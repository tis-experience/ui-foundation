import neutralTheme from "../../tokens/themes/neutral.json"
import tisTheme from "../../tokens/themes/tis.json"
import foundationContract from "../../tokens/foundations.json"
import densityContract from "../../tokens/densities.json"

type FoundationTokenType =
  | "fontFamily"
  | "fontSize"
  | "lineHeight"
  | "fontWeight"
  | "letterSpacing"
  | "dimension"
  | "radius"
  | "borderWidth"
  | "shadow"
  | "duration"
  | "cubicBezier"

interface FoundationToken {
  name: string
  type: FoundationTokenType
  value: string
}

interface FoundationTokenGroup {
  name: string
  label: string
  tokens: FoundationToken[]
}

type DensityName = "compact" | "comfortable" | "spacious"

interface DensityScale {
  sm: string
  md: string
  lg: string
}

interface DensityProfile {
  name: DensityName
  label: string
  description: string
  control: {
    height: DensityScale
    paddingInline: DensityScale
    gap: DensityScale
    fontSize: DensityScale
    iconSize: DensityScale
  }
}

const themeSources = {
  neutral: neutralTheme,
  tis: tisTheme,
}

const themeTokenGroups = [
  {
    label: "Surfaces and content",
    tokens: [
      "background",
      "foreground",
      "card",
      "card-foreground",
      "popover",
      "popover-foreground",
      "overlay",
      "muted",
      "muted-foreground",
    ],
  },
  {
    label: "Actions and boundaries",
    tokens: [
      "primary",
      "primary-foreground",
      "secondary",
      "secondary-foreground",
      "accent",
      "accent-foreground",
      "destructive",
      "border",
      "input",
      "ring",
    ],
  },
  {
    label: "Charts",
    tokens: ["chart-1", "chart-2", "chart-3", "chart-4", "chart-5"],
  },
  {
    label: "Sidebar",
    tokens: [
      "sidebar",
      "sidebar-foreground",
      "sidebar-primary",
      "sidebar-primary-foreground",
      "sidebar-accent",
      "sidebar-accent-foreground",
      "sidebar-border",
      "sidebar-ring",
    ],
  },
  {
    label: "Geometry",
    tokens: ["radius"],
  },
] as const

const foundationTokenGroups = foundationContract.groups as FoundationTokenGroup[]
const defaultDensity = densityContract.default as DensityName
const densityProfiles = densityContract.profiles as DensityProfile[]
const densityTokenCount = Object.keys(densityProfiles[0].control).length * 3
const themeTokenCount = themeTokenGroups.reduce(
  (count, group) => count + group.tokens.length,
  0
)
const foundationTokenCount = foundationTokenGroups.reduce(
  (count, group) => count + group.tokens.length,
  0
)
const tokenCount = themeTokenCount + foundationTokenCount + densityTokenCount

const foundationTokens = foundationTokenGroups.flatMap((group) => group.tokens)
const foundationTokenMap = new Map(
  foundationTokens.map((token) => [token.name, token] as const)
)

function foundationValue(name: string) {
  const token = foundationTokenMap.get(name)
  if (!token) throw new Error(`Unknown foundation token: ${name}`)
  return token.value
}

export {
  defaultDensity,
  densityProfiles,
  densityTokenCount,
  foundationTokenCount,
  foundationTokenGroups,
  foundationValue,
  themeSources,
  themeTokenCount,
  themeTokenGroups,
  tokenCount,
}
export type {
  DensityName,
  DensityProfile,
  FoundationToken,
  FoundationTokenGroup,
  FoundationTokenType,
}
