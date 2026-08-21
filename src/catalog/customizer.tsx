import { useMemo, useState } from "react"
import {
  CheckIcon,
  ChevronDownIcon,
  CopyIcon,
  DownloadIcon,
  LinkIcon,
  RefreshCwIcon,
  SparklesIcon,
} from "lucide-react"
import { Area, AreaChart, CartesianGrid, XAxis } from "recharts"

import type { DensityName } from "@/catalog/foundation-data"
import {
  baseColorOptions,
  buildCustomTheme,
  chartPaletteOptions,
  defaultCustomizerConfig,
  encodeCustomizerConfig,
  fontOptions,
  identityPresets,
  radiusOptions,
  serializeRegistryTheme,
  serializeThemeCss,
  typesetOptions,
  type BaseColorName,
  type ChartPaletteName,
  type CustomizerConfig,
  type FontName,
  type IdentityName,
  type RadiusName,
  type TypesetPresetName,
} from "@/catalog/customizer-contract"
import type { ModeName } from "@/catalog/theme-controls"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import { Checkbox } from "@/components/ui/checkbox"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
  FieldLegend,
  FieldSet,
} from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
  InputGroupText,
} from "@/components/ui/input-group"
import { NativeSelect, NativeSelectOption } from "@/components/ui/native-select"
import { Switch } from "@/components/ui/switch"
import { Typeset } from "@/components/ui/typography"

interface CustomizerProps {
  config: CustomizerConfig
  density: DensityName
  mode: ModeName
  onConfigChange: (config: CustomizerConfig) => void
  onDensityChange: (density: DensityName) => void
  onModeChange: (mode: ModeName) => void
}

const previewChartData = [
  { month: "Jan", value: 42 },
  { month: "Feb", value: 58 },
  { month: "Mar", value: 51 },
  { month: "Apr", value: 74 },
  { month: "May", value: 68 },
  { month: "Jun", value: 86 },
]

const previewChartConfig = {
  value: { label: "Adoption", color: "var(--chart-1)" },
}

function downloadText(filename: string, content: string, type: string) {
  const blob = new Blob([content], { type })
  const url = URL.createObjectURL(blob)
  const anchor = document.createElement("a")
  anchor.href = url
  anchor.download = filename
  document.body.append(anchor)
  anchor.click()
  anchor.remove()
  URL.revokeObjectURL(url)
}

function Customizer({
  config,
  density,
  mode,
  onConfigChange,
  onDensityChange,
  onModeChange,
}: CustomizerProps) {
  const [copied, setCopied] = useState<"css" | "json" | "link" | null>(null)
  const theme = useMemo(() => buildCustomTheme(config), [config])
  const css = useMemo(() => serializeThemeCss(theme), [theme])
  const registryTheme = useMemo(
    () => serializeRegistryTheme(config, theme),
    [config, theme]
  )
  const baseColorLabel = baseColorOptions.find((option) => option.value === config.baseColor)?.label ?? config.baseColor
  const fontPresetValue = config.bodyFont === config.headingFont ? config.bodyFont : undefined
  const fontPresetLabel = fontPresetValue
    ? fontOptions.find((option) => option.value === fontPresetValue)?.label ?? fontPresetValue
    : "Custom pairing"
  const radiusLabel = radiusOptions.find((option) => option.value === config.radius)?.label ?? config.radius
  const selectedRadius = radiusOptions.find((option) => option.value === config.radius)
  const typesetPresetLabel = config.typesetPreset === "custom"
    ? "Custom"
    : typesetOptions.find((option) => option.value === config.typesetPreset)?.label ?? config.typesetPreset

  function update(patch: Partial<CustomizerConfig>, customIdentity = false) {
    onConfigChange({
      ...config,
      ...patch,
      identity: customIdentity ? "custom" : (patch.identity ?? config.identity),
    })
  }

  function chooseIdentity(identity: IdentityName) {
    if (identity === "custom") {
      update({ identity: "custom" })
      return
    }
    onConfigChange({ ...identityPresets[identity] })
  }

  function chooseTypesetPreset(typesetPreset: Exclude<TypesetPresetName, "custom">) {
    const preset = typesetOptions.find((option) => option.value === typesetPreset)
    if (!preset) return
    update({
      typesetPreset,
      typesetSize: preset.size,
      typesetLeading: preset.leading,
      typesetFlow: preset.flow,
      typesetMeasure: preset.measure,
    })
  }

  function updateTypesetValue(
    property: "typesetSize" | "typesetLeading" | "typesetFlow" | "typesetMeasure",
    value: string,
    minimum: number,
    maximum: number
  ) {
    const nextValue = Number(value)
    if (!Number.isFinite(nextValue)) return
    update({
      typesetPreset: "custom",
      [property]: Math.min(maximum, Math.max(minimum, nextValue)),
    })
  }

  async function copy(content: string, target: "css" | "json" | "link") {
    await navigator.clipboard.writeText(content)
    setCopied(target)
    window.setTimeout(() => setCopied((current) => (current === target ? null : current)), 1800)
  }

  async function copyShareLink() {
    const url = new URL(window.location.href)
    url.searchParams.set("preset", encodeCustomizerConfig(config))
    url.hash = "customize"
    window.history.replaceState(null, "", url)
    await copy(url.toString(), "link")
  }

  function shuffle() {
    const brandColors = ["#0056e0", "#7c3aed", "#0f766e", "#b42318", "#c2410c"]
    const nextBrand = brandColors[Math.floor(Math.random() * brandColors.length)]
    const nextBase = baseColorOptions[Math.floor(Math.random() * baseColorOptions.length)]
    const nextRadius = radiusOptions[Math.floor(Math.random() * radiusOptions.length)]
    update(
      {
        baseColor: nextBase.value,
        brand: nextBrand,
        radius: nextRadius.value,
      },
      true
    )
  }

  return (
    <section className="customizer-section" id="customize">
      <div className="container customizer-shell">
        <aside className="customizer-panel" aria-label="Theme customizer">
          <div className="customizer-panel-header">
            <div>
              <h2>Customize</h2>
              <p>One preset for theme, type and control density.</p>
            </div>
            <Button type="button" variant="ghost" size="icon-sm" aria-label="Shuffle preset" onClick={shuffle}>
              <SparklesIcon />
            </Button>
          </div>

          <div className="customizer-fields">
            <fieldset className="customizer-fieldset">
              <legend>Identity</legend>
              <div className="customizer-choice-grid customizer-choice-grid--three" role="group" aria-label="Identity">
                {(["neutral", "tis", "custom"] as const).map((identity) => (
                  <Button
                    key={identity}
                    type="button"
                    size="sm"
                    variant={config.identity === identity ? "outline" : "ghost"}
                    aria-pressed={config.identity === identity}
                    onClick={() => chooseIdentity(identity)}
                  >
                    {identity === "tis" ? "TIS" : identity.charAt(0).toUpperCase() + identity.slice(1)}
                  </Button>
                ))}
              </div>
            </fieldset>

            <div className="customizer-preset-list" aria-label="Style presets">
              <DropdownMenu>
                <DropdownMenuTrigger
                  render={
                    <Button
                      type="button"
                      variant="ghost"
                      className="customizer-preset-trigger"
                      aria-label={`Base color preset: ${baseColorLabel}`}
                    />
                  }
                >
                  <span className="customizer-preset-copy">
                    <span className="customizer-preset-label">Base color</span>
                    <span className="customizer-preset-value">{baseColorLabel}</span>
                  </span>
                  <span
                    aria-hidden="true"
                    className="customizer-preset-swatch"
                    style={{ background: baseColorOptions.find((option) => option.value === config.baseColor)?.swatch }}
                  />
                  <ChevronDownIcon data-icon="inline-end" />
                </DropdownMenuTrigger>
                <DropdownMenuContent align="start" className="customizer-preset-menu">
                  <DropdownMenuRadioGroup
                    value={config.baseColor}
                    onValueChange={(value) => update({ baseColor: value as BaseColorName }, true)}
                  >
                    <DropdownMenuLabel>Base color</DropdownMenuLabel>
                    {baseColorOptions.map((option) => (
                      <DropdownMenuRadioItem key={option.value} value={option.value} closeOnClick>
                        <span aria-hidden="true" className="customizer-preset-swatch" style={{ background: option.swatch }} />
                        {option.label}
                      </DropdownMenuRadioItem>
                    ))}
                  </DropdownMenuRadioGroup>
                </DropdownMenuContent>
              </DropdownMenu>

              <DropdownMenu>
                <DropdownMenuTrigger
                  render={
                    <Button
                      type="button"
                      variant="ghost"
                      className="customizer-preset-trigger"
                      aria-label={`Typeset preset: ${typesetPresetLabel}`}
                    />
                  }
                >
                  <span className="customizer-preset-copy">
                    <span className="customizer-preset-label">Typeset</span>
                    <span className="customizer-preset-value">{typesetPresetLabel}</span>
                  </span>
                  <span
                    aria-hidden="true"
                    className="customizer-typeset-sample"
                    data-typeset={config.typesetPreset}
                  >
                    <span />
                    <span />
                    <span />
                  </span>
                  <ChevronDownIcon data-icon="inline-end" />
                </DropdownMenuTrigger>
                <DropdownMenuContent align="start" className="customizer-preset-menu">
                  <DropdownMenuRadioGroup
                    value={config.typesetPreset === "custom" ? "" : config.typesetPreset}
                    onValueChange={(value) => chooseTypesetPreset(value as Exclude<TypesetPresetName, "custom">)}
                  >
                    <DropdownMenuLabel>Typeset rhythm</DropdownMenuLabel>
                    {typesetOptions.map((option) => (
                      <DropdownMenuRadioItem key={option.value} value={option.value} closeOnClick>
                        <span aria-hidden="true" className="customizer-typeset-sample" data-typeset={option.value}>
                          <span />
                          <span />
                          <span />
                        </span>
                        {option.label}
                      </DropdownMenuRadioItem>
                    ))}
                  </DropdownMenuRadioGroup>
                </DropdownMenuContent>
              </DropdownMenu>

              <DropdownMenu>
                <DropdownMenuTrigger
                  render={
                    <Button
                      type="button"
                      variant="ghost"
                      className="customizer-preset-trigger"
                      aria-label={`Font preset: ${fontPresetLabel}`}
                    />
                  }
                >
                  <span className="customizer-preset-copy">
                    <span className="customizer-preset-label">Font</span>
                    <span className="customizer-preset-value">{fontPresetLabel}</span>
                  </span>
                  <span aria-hidden="true" className="customizer-preset-font">Aa</span>
                  <ChevronDownIcon data-icon="inline-end" />
                </DropdownMenuTrigger>
                <DropdownMenuContent align="start" className="customizer-preset-menu">
                  <DropdownMenuRadioGroup
                    value={fontPresetValue ?? ""}
                    onValueChange={(value) => update({ bodyFont: value as FontName, headingFont: value as FontName })}
                  >
                    <DropdownMenuLabel>Font preset</DropdownMenuLabel>
                    {fontOptions.map((option) => (
                      <DropdownMenuRadioItem key={option.value} value={option.value} closeOnClick>
                        <span aria-hidden="true" className="customizer-preset-font" style={{ fontFamily: option.stack }}>Aa</span>
                        {option.label}
                      </DropdownMenuRadioItem>
                    ))}
                  </DropdownMenuRadioGroup>
                </DropdownMenuContent>
              </DropdownMenu>

              <DropdownMenu>
                <DropdownMenuTrigger
                  render={
                    <Button
                      type="button"
                      variant="ghost"
                      className="customizer-preset-trigger"
                      aria-label={`Corner radius preset: ${radiusLabel}`}
                    />
                  }
                >
                  <span className="customizer-preset-copy">
                    <span className="customizer-preset-label">Corner radius</span>
                    <span className="customizer-preset-value">{radiusLabel}</span>
                  </span>
                  <span aria-hidden="true" className="customizer-radius-preview">
                    <span
                      className="customizer-radius-preview__surface"
                      style={{ borderRadius: selectedRadius?.surfaceValue }}
                    />
                    <span
                      className="customizer-radius-preview__control"
                      style={{ borderRadius: selectedRadius?.cssValue }}
                    />
                  </span>
                  <ChevronDownIcon data-icon="inline-end" />
                </DropdownMenuTrigger>
                <DropdownMenuContent align="start" className="customizer-preset-menu">
                  <DropdownMenuRadioGroup
                    value={config.radius}
                    onValueChange={(value) => update({ radius: value as RadiusName })}
                  >
                    <DropdownMenuLabel>Corner radius</DropdownMenuLabel>
                    {radiusOptions.map((option) => (
                      <DropdownMenuRadioItem key={option.value} value={option.value} closeOnClick>
                        <span aria-hidden="true" className="customizer-radius-preview">
                          <span
                            className="customizer-radius-preview__surface"
                            style={{ borderRadius: option.surfaceValue }}
                          />
                          <span
                            className="customizer-radius-preview__control"
                            style={{ borderRadius: option.cssValue }}
                          />
                        </span>
                        {option.label}
                      </DropdownMenuRadioItem>
                    ))}
                  </DropdownMenuRadioGroup>
                </DropdownMenuContent>
              </DropdownMenu>

              <DropdownMenu>
                <DropdownMenuTrigger
                  render={
                    <Button
                      type="button"
                      variant="ghost"
                      className="customizer-preset-trigger"
                      aria-label={`Density preset: ${density.charAt(0).toUpperCase() + density.slice(1)}`}
                    />
                  }
                >
                  <span className="customizer-preset-copy">
                    <span className="customizer-preset-label">Density</span>
                    <span className="customizer-preset-value">{density.charAt(0).toUpperCase() + density.slice(1)}</span>
                  </span>
                  <span aria-hidden="true" className="customizer-density-sample" data-density={density}>
                    <span />
                    <span />
                    <span />
                  </span>
                  <ChevronDownIcon data-icon="inline-end" />
                </DropdownMenuTrigger>
                <DropdownMenuContent align="start" className="customizer-preset-menu">
                  <DropdownMenuRadioGroup value={density} onValueChange={(value) => onDensityChange(value as DensityName)}>
                    <DropdownMenuLabel>Density</DropdownMenuLabel>
                    {(["compact", "comfortable", "spacious"] as const).map((option) => (
                      <DropdownMenuRadioItem key={option} value={option} closeOnClick>
                        <span aria-hidden="true" className="customizer-density-sample" data-density={option}>
                          <span />
                          <span />
                          <span />
                        </span>
                        {option.charAt(0).toUpperCase() + option.slice(1)}
                      </DropdownMenuRadioItem>
                    ))}
                  </DropdownMenuRadioGroup>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>

            <FieldGroup>
              <Field>
                <FieldLabel htmlFor="customizer-brand">Brand color</FieldLabel>
                <div className="customizer-color-control">
                  <input
                    aria-label="Choose brand color"
                    type="color"
                    value={config.brand}
                    onChange={(event) => update({ brand: event.target.value }, true)}
                  />
                  <Input
                    id="customizer-brand"
                    value={config.brand}
                    spellCheck={false}
                    onChange={(event) => update({ brand: event.target.value }, true)}
                  />
                </div>
                <FieldDescription>Focus and action colors are recalculated for contrast.</FieldDescription>
              </Field>

              <Field>
                <FieldLabel htmlFor="customizer-chart-palette">Chart palette</FieldLabel>
                <NativeSelect
                  className="customizer-select"
                  id="customizer-chart-palette"
                  value={config.chartPalette}
                  onChange={(event) => update({ chartPalette: event.target.value as ChartPaletteName })}
                >
                  {chartPaletteOptions.map((option) => (
                    <NativeSelectOption key={option.value} value={option.value}>{option.label}</NativeSelectOption>
                  ))}
                </NativeSelect>
              </Field>

              <Field>
                <FieldLabel htmlFor="customizer-body-font">Body font</FieldLabel>
                <NativeSelect
                  className="customizer-select"
                  id="customizer-body-font"
                  value={config.bodyFont}
                  onChange={(event) => update({ bodyFont: event.target.value as FontName })}
                >
                  {fontOptions.map((option) => (
                    <NativeSelectOption key={option.value} value={option.value}>{option.label}</NativeSelectOption>
                  ))}
                </NativeSelect>
              </Field>

              <Field>
                <FieldLabel htmlFor="customizer-heading-font">Heading font</FieldLabel>
                <NativeSelect
                  className="customizer-select"
                  id="customizer-heading-font"
                  value={config.headingFont}
                  onChange={(event) => update({ headingFont: event.target.value as FontName })}
                >
                  {fontOptions.map((option) => (
                    <NativeSelectOption key={option.value} value={option.value}>{option.label}</NativeSelectOption>
                  ))}
                </NativeSelect>
              </Field>

              <FieldSet className="customizer-typeset-fields">
                <FieldLegend variant="label">Typeset rhythm</FieldLegend>
                <FieldDescription>
                  Adjust text size, line height, vertical flow and reading measure together.
                </FieldDescription>
                <div className="customizer-rhythm-grid">
                  <Field>
                    <FieldLabel htmlFor="customizer-typeset-size">Base size</FieldLabel>
                    <InputGroup>
                      <InputGroupInput
                        id="customizer-typeset-size"
                        type="number"
                        min="12"
                        max="24"
                        step="1"
                        value={config.typesetSize}
                        onChange={(event) => updateTypesetValue("typesetSize", event.target.value, 12, 24)}
                      />
                      <InputGroupAddon align="inline-end"><InputGroupText>px</InputGroupText></InputGroupAddon>
                    </InputGroup>
                  </Field>
                  <Field>
                    <FieldLabel htmlFor="customizer-typeset-leading">Leading</FieldLabel>
                    <InputGroup>
                      <InputGroupInput
                        id="customizer-typeset-leading"
                        type="number"
                        min="1.3"
                        max="2.4"
                        step="0.05"
                        value={config.typesetLeading}
                        onChange={(event) => updateTypesetValue("typesetLeading", event.target.value, 1.3, 2.4)}
                      />
                      <InputGroupAddon align="inline-end"><InputGroupText>×</InputGroupText></InputGroupAddon>
                    </InputGroup>
                  </Field>
                  <Field>
                    <FieldLabel htmlFor="customizer-typeset-flow">Block flow</FieldLabel>
                    <InputGroup>
                      <InputGroupInput
                        id="customizer-typeset-flow"
                        type="number"
                        min="0.75"
                        max="2.5"
                        step="0.05"
                        value={config.typesetFlow}
                        onChange={(event) => updateTypesetValue("typesetFlow", event.target.value, 0.75, 2.5)}
                      />
                      <InputGroupAddon align="inline-end"><InputGroupText>em</InputGroupText></InputGroupAddon>
                    </InputGroup>
                  </Field>
                  <Field>
                    <FieldLabel htmlFor="customizer-typeset-measure">Measure</FieldLabel>
                    <InputGroup>
                      <InputGroupInput
                        id="customizer-typeset-measure"
                        type="number"
                        min="40"
                        max="90"
                        step="1"
                        value={config.typesetMeasure}
                        onChange={(event) => updateTypesetValue("typesetMeasure", event.target.value, 40, 90)}
                      />
                      <InputGroupAddon align="inline-end"><InputGroupText>ch</InputGroupText></InputGroupAddon>
                    </InputGroup>
                  </Field>
                </div>
              </FieldSet>

            </FieldGroup>

            <fieldset className="customizer-fieldset">
              <legend>Mode</legend>
              <div className="customizer-choice-grid" role="group" aria-label="Customizer mode">
                {(["light", "dark"] as const).map((option) => (
                  <Button
                    key={option}
                    type="button"
                    size="sm"
                    variant={mode === option ? "outline" : "ghost"}
                    aria-pressed={mode === option}
                    onClick={() => onModeChange(option)}
                  >
                    {option.charAt(0).toUpperCase() + option.slice(1)}
                  </Button>
                ))}
              </div>
            </fieldset>
          </div>

          <div className="customizer-actions">
            <Button type="button" variant="outline" onClick={() => copyShareLink()}>
              {copied === "link" ? <CheckIcon data-icon="inline-start" /> : <LinkIcon data-icon="inline-start" />}
              {copied === "link" ? "Link copied" : "Share preset"}
            </Button>
            <Button
              type="button"
              variant="ghost"
              onClick={() => {
                onConfigChange({ ...defaultCustomizerConfig })
                onDensityChange("comfortable")
                onModeChange("light")
              }}
            >
              <RefreshCwIcon data-icon="inline-start" />
              Reset
            </Button>
          </div>
        </aside>

        <div className="customizer-workspace">
          <div className="customizer-workspace-header">
            <div>
              <Badge variant="secondary">Live preview</Badge>
              <h2>Design with the real components</h2>
              <p>Every change applies to the same source a developer installs.</p>
            </div>
            <div className="customizer-workspace-actions">
              <Button type="button" variant="outline" onClick={() => copy(css, "css")}>
                {copied === "css" ? <CheckIcon data-icon="inline-start" /> : <CopyIcon data-icon="inline-start" />}
                {copied === "css" ? "CSS copied" : "Copy CSS"}
              </Button>
              <Button type="button" onClick={() => copy(registryTheme, "json")}>
                {copied === "json" ? <CheckIcon data-icon="inline-start" /> : <CopyIcon data-icon="inline-start" />}
                {copied === "json" ? "Preset copied" : "Copy preset"}
              </Button>
              <Button
                type="button"
                variant="ghost"
                size="icon"
                aria-label="Download theme preset"
                onClick={() => downloadText("ui-foundation-theme.json", registryTheme, "application/json")}
              >
                <DownloadIcon />
              </Button>
            </div>
          </div>

          <div className="customizer-preview-grid">
            <Card className="customizer-preview-card customizer-preview-card--hero">
              <CardHeader>
                <CardTitle>Project workspace</CardTitle>
                <CardDescription>Configure a source-first product interface.</CardDescription>
                <CardAction><Badge>Active</Badge></CardAction>
              </CardHeader>
              <CardContent className="customizer-preview-form">
                <FieldGroup>
                  <Field>
                    <FieldLabel htmlFor="preview-project-name">Project name</FieldLabel>
                    <Input id="preview-project-name" defaultValue="Digital services" />
                    <FieldDescription>Visible to everyone in the workspace.</FieldDescription>
                  </Field>
                  <Field>
                    <FieldLabel htmlFor="preview-framework">Framework</FieldLabel>
                    <NativeSelect className="customizer-select" id="preview-framework" defaultValue="react">
                      <NativeSelectOption value="react">React + Base UI</NativeSelectOption>
                      <NativeSelectOption value="next">Next.js</NativeSelectOption>
                      <NativeSelectOption value="vite">Vite</NativeSelectOption>
                    </NativeSelect>
                  </Field>
                  <div className="customizer-preview-actions">
                    <Button>Save changes</Button>
                    <Button variant="outline">Preview</Button>
                    <Button variant="ghost">Cancel</Button>
                  </div>
                </FieldGroup>
              </CardContent>
            </Card>

            <Card className="customizer-preview-card">
              <CardHeader>
                <CardTitle>Preferences</CardTitle>
                <CardDescription>Controls follow the selected density.</CardDescription>
              </CardHeader>
              <CardContent>
                <FieldGroup>
                  <Field orientation="horizontal">
                    <FieldLabel htmlFor="preview-notifications">Notifications</FieldLabel>
                    <Switch id="preview-notifications" defaultChecked />
                  </Field>
                  <Field orientation="horizontal">
                    <Checkbox id="preview-analytics" defaultChecked />
                    <FieldLabel htmlFor="preview-analytics">Share anonymous analytics</FieldLabel>
                  </Field>
                </FieldGroup>
              </CardContent>
            </Card>

            <Card className="customizer-preview-card">
              <CardHeader>
                <CardTitle>Adoption</CardTitle>
                <CardDescription>Chart colors use the selected palette.</CardDescription>
              </CardHeader>
              <CardContent>
                <ChartContainer
                  config={previewChartConfig}
                  className="h-48 w-full aspect-auto"
                  role="img"
                  aria-label="Monthly UI Foundation adoption"
                >
                  <AreaChart accessibilityLayer data={previewChartData} margin={{ left: 0, right: 8 }}>
                    <defs>
                      <linearGradient id="customizer-chart-fill" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="var(--color-value)" stopOpacity={0.42} />
                        <stop offset="95%" stopColor="var(--color-value)" stopOpacity={0.04} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid vertical={false} />
                    <XAxis dataKey="month" tickLine={false} axisLine={false} tickMargin={8} />
                    <ChartTooltip cursor={false} content={<ChartTooltipContent indicator="line" />} />
                    <Area
                      dataKey="value"
                      type="monotone"
                      fill="url(#customizer-chart-fill)"
                      fillOpacity={0.4}
                      stroke="var(--color-value)"
                      strokeWidth={2}
                      isAnimationActive={false}
                    />
                  </AreaChart>
                </ChartContainer>
              </CardContent>
            </Card>

            <Card className="customizer-preview-card customizer-preview-card--typeset">
              <CardContent>
                <Typeset as="article">
                  <Badge variant="secondary">Typography</Badge>
                  <h2>Type that belongs to the same theme</h2>
                  <p>
                    Fonts, size, leading, flow and measure travel with the same portable preset.
                    The preview uses the installable Typeset component rather than a mock specimen.
                  </p>
                  <blockquote>Good reading rhythm is a system decision, not a page-level patch.</blockquote>
                  <ul>
                    <li>Semantic headings and body content</li>
                    <li>Portable CSS variables for every adapter</li>
                  </ul>
                  <a href="#foundations">Review the foundation</a>
                </Typeset>
              </CardContent>
            </Card>

            <Alert className="customizer-preview-alert">
              <SparklesIcon />
              <AlertTitle>Preset ready to use</AlertTitle>
              <AlertDescription>
                Download the JSON and install it with the pinned shadcn CLI, or copy the CSS directly.
              </AlertDescription>
            </Alert>
          </div>
        </div>
      </div>
    </section>
  )
}

export { Customizer }
