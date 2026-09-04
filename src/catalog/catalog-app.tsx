import { Fragment, useEffect, useMemo, useState } from "react"
import { CheckIcon, CopyIcon, SearchIcon } from "lucide-react"

import { ComponentPreview } from "@/catalog/component-preview"
import {
  defaultDensity,
  tokenCount,
  type DensityName,
} from "@/catalog/foundation-data"
import { FoundationReference } from "@/catalog/foundation-reference"
import { TokenReference } from "@/catalog/token-reference"
import { Customizer } from "@/catalog/customizer"
import { BlocksReference } from "@/catalog/blocks-reference"
import { ChartsReference } from "@/catalog/charts-reference"
import {
  buildCustomTheme,
  decodeCustomizerConfig,
  defaultCustomizerConfig,
  identityPresets,
  type CustomizerConfig,
} from "@/catalog/customizer-contract"
import {
  categories,
  components,
  filters,
  isRecentlyAdded,
  releaseFilters,
} from "@/catalog/catalog-data"
import {
  ThemeControls,
  type ModeName,
  type ThemeName,
} from "@/catalog/theme-controls"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { buttonVariants } from "@/components/ui/button.variants"
import { Input } from "@/components/ui/input"
import { registryUrl } from "@/lib/public-url"

type CatalogView = "blocks" | "charts" | "components" | "customize" | "foundations" | "tokens"

const views: Array<{ label: string; value: CatalogView }> = [
  { label: "Components", value: "components" },
  { label: "Blocks", value: "blocks" },
  { label: "Charts", value: "charts" },
  { label: "Customize", value: "customize" },
  { label: "Foundations", value: "foundations" },
  { label: "Tokens", value: "tokens" },
]

function normalizeCategory(category: string) {
  return category
    .split("-")
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ")
}

function getInitialFilter() {
  const parameters = new URLSearchParams(window.location.search)
  const filter = parameters.get("filter")
  if (filter && filters.includes(filter)) return filter

  const legacyCategory = parameters.get("category")
  if (legacyCategory === "new") return "recently-added"
  return legacyCategory && categories.includes(legacyCategory) ? legacyCategory : "all"
}

function getViewFromHash(): CatalogView {
  const value = window.location.hash.slice(1)
  if (value === "styles") {
    window.history.replaceState(null, "", "#foundations")
    return "foundations"
  }
  return value === "tokens" || value === "foundations" || value === "customize" || value === "blocks" || value === "charts"
    ? value
    : "components"
}

function CatalogApp() {
  const initialPreset = decodeCustomizerConfig(new URLSearchParams(window.location.search).get("preset"))
  const [theme, setTheme] = useState<ThemeName>(initialPreset ? "custom" : "neutral")
  const [mode, setMode] = useState<ModeName>(initialPreset?.mode ?? "light")
  const [density, setDensity] = useState<DensityName>(initialPreset?.density ?? defaultDensity)
  const [customizerConfig, setCustomizerConfig] = useState<CustomizerConfig>(
    initialPreset ?? { ...defaultCustomizerConfig }
  )
  const [view, setView] = useState<CatalogView>(getViewFromHash)
  const [filter, setFilter] = useState(getInitialFilter)
  const [query, setQuery] = useState("")
  const [copied, setCopied] = useState<string | null>(null)
  const customTheme = useMemo(() => buildCustomTheme(customizerConfig), [customizerConfig])

  useEffect(() => {
    const root = document.documentElement
    const customProperties = [
      ...Object.keys(customTheme.modes.light),
      ...Object.keys(customTheme.typography),
    ]
    customProperties.forEach((property) => root.style.removeProperty(`--${property}`))
    root.dataset.uiTheme = theme
    root.dataset.uiDensity = density
    root.classList.toggle("dark", mode === "dark")
    root.style.colorScheme = mode
    if (theme === "custom") {
      Object.entries(customTheme.modes[mode]).forEach(([property, value]) => {
        root.style.setProperty(`--${property}`, value)
      })
      Object.entries(customTheme.typography).forEach(([property, value]) => {
        root.style.setProperty(`--${property}`, value)
      })
    }
  }, [customTheme, density, mode, theme])

  useEffect(() => {
    function updateView() {
      setView(getViewFromHash())
    }

    window.addEventListener("hashchange", updateView)
    return () => window.removeEventListener("hashchange", updateView)
  }, [])

  const visibleComponents = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase()
    return components.filter((component) => {
      const matchesFilter =
        filter === "all" ||
        (filter === "recently-added"
          ? isRecentlyAdded(component)
          : component.category === filter)
      const matchesQuery =
        !normalizedQuery ||
        component.name.includes(normalizedQuery) ||
        component.title.toLowerCase().includes(normalizedQuery) ||
        component.description.toLowerCase().includes(normalizedQuery)
      return matchesFilter && matchesQuery
    })
  }, [filter, query])

  async function copyInstall(name: string) {
    const command = `npx shadcn@4.18.0 add ${registryUrl(name)}`
    await navigator.clipboard.writeText(command)
    setCopied(name)
    window.setTimeout(
      () => setCopied((current) => (current === name ? null : current)),
      1800
    )
  }

  function selectFilter(nextFilter: string) {
    const url = new URL(window.location.href)
    url.searchParams.delete("category")
    if (nextFilter === "all") url.searchParams.delete("filter")
    else url.searchParams.set("filter", nextFilter)
    window.history.replaceState(null, "", url)
    setFilter(nextFilter)
  }

  function selectTheme(nextTheme: ThemeName) {
    setTheme(nextTheme)
    if (nextTheme === "neutral" || nextTheme === "tis") {
      setCustomizerConfig({ ...identityPresets[nextTheme], density, mode })
    }
  }

  function updateCustomizer(config: CustomizerConfig) {
    setCustomizerConfig(config)
    setDensity(config.density)
    setMode(config.mode)
    setTheme("custom")
  }

  function updateDensity(nextDensity: DensityName) {
    setDensity(nextDensity)
    setCustomizerConfig((current) => ({ ...current, density: nextDensity }))
  }

  function updateMode(nextMode: ModeName) {
    setMode(nextMode)
    setCustomizerConfig((current) => ({ ...current, mode: nextMode }))
  }

  const themeLabel = theme === "tis" ? "TIS" : theme === "custom" ? "Custom" : "Neutral"
  const modeLabel = mode === "dark" ? "Dark" : "Light"
  const densityLabel = density.charAt(0).toUpperCase() + density.slice(1)

  return (
    <div className="app-shell">
      <a className="skip-link" href={`#${view}`}>Skip to reference</a>
      <header className="site-header">
        <div className="container header-inner">
          <a className="brand" href="#components" aria-label="UI Foundation components">UI Foundation</a>
          <nav className="site-nav" aria-label="Library reference">
            {views.map((item) => (
              <Fragment key={item.value}>
                <a
                  href={`#${item.value}`}
                  aria-current={view === item.value ? "page" : undefined}
                >
                  {item.label}
                </a>
                {item.value === "charts" ? (
                  <a href="./examples/consumer/">Example app</a>
                ) : null}
              </Fragment>
            ))}
          </nav>
        </div>
      </header>

      <main id="top">
        <section className="intro-section">
          <div className="container intro-grid">
            <div className="intro-copy">
              {view === "components" ? (
                <>
                  <h1>Source-first components. Base UI behavior. Identity optional.</h1>
                  <p>
                    Install accessible React source into the project, keep full ownership, and
                    choose the neutral theme or the optional TIS identity.
                  </p>
                  <div className="intro-actions">
                    <a className={buttonVariants()} href="./examples/consumer/">
                      Open example app
                    </a>
                  </div>
                  <div className="install-block" aria-label="Install command">
                    <span>Install</span>
                    <code>npx shadcn@4.18.0 add {registryUrl("button")}</code>
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon-sm"
                      aria-label="Copy install command"
                      onClick={() => copyInstall("button")}
                    >
                      {copied === "button" ? <CheckIcon /> : <CopyIcon />}
                    </Button>
                  </div>
                </>
              ) : view === "tokens" ? (
                <>
                  <h1>Tokens</h1>
                  <p>{tokenCount} CSS variables · {themeLabel} · {modeLabel} · {densityLabel}</p>
                </>
              ) : view === "blocks" ? (
                <>
                  <h1>Application patterns, ready to install.</h1>
                  <p>
                    Complete screens composed from the library source, with responsive behavior
                    and accessible interactions already in place.
                  </p>
                </>
              ) : view === "charts" ? (
                <>
                  <h1>Charts that inherit the active system.</h1>
                  <p>
                    Accessible Area, Bar, Line, Pie, Radar and Radial recipes powered by Recharts
                    and the same theme contract as every component.
                  </p>
                </>
              ) : view === "customize" ? (
                <>
                  <h1>Create a complete interface preset.</h1>
                  <p>
                    Tune identity, typography, radius and control density together, then export
                    a portable shadcn theme.
                  </p>
                </>
              ) : (
                <>
                  <h1>Foundations</h1>
                  <p>
                    Color · typography · density · spacing · radius · borders · elevation · motion
                  </p>
                </>
              )}
            </div>
            <ThemeControls
              density={density}
              mode={mode}
              onDensityChange={updateDensity}
              onModeChange={updateMode}
              onThemeChange={selectTheme}
              theme={theme}
            />
          </div>
        </section>

        {view === "components" ? (
        <section className="catalog-section" id="components">
          <div className="container">
            <div className="catalog-toolbar">
              <label className="search-field">
                <SearchIcon aria-hidden="true" />
                <span className="sr-only">Search components</span>
                <Input
                  value={query}
                  onChange={(event) => setQuery(event.target.value)}
                  placeholder="Search components"
                />
              </label>
              <div
                className="catalog-filter-strip"
                onFocusCapture={(event) => {
                  event.target.scrollIntoView({ block: "nearest", inline: "nearest" })
                }}
              >
                <div className="release-filter" role="group" aria-label="Filter by release status">
                  {releaseFilters.map((item) => (
                    <Button
                      key={item}
                      type="button"
                      size="sm"
                      variant={filter === item ? "outline" : "ghost"}
                      aria-pressed={filter === item}
                      onClick={() => selectFilter(item)}
                    >
                      {item === "all" ? "All" : "Recently added"}
                    </Button>
                  ))}
                </div>
                <span className="filter-divider" aria-hidden="true" />
                <div className="category-filter" role="group" aria-label="Filter by category">
                  {categories.map((item) => (
                    <Button
                      key={item}
                      type="button"
                      size="sm"
                      variant={filter === item ? "outline" : "ghost"}
                      aria-pressed={filter === item}
                      onClick={() => selectFilter(item)}
                    >
                      {normalizeCategory(item)}
                    </Button>
                  ))}
                </div>
              </div>
            </div>

            <div className="catalog-heading">
              <div>
                <h2>Components</h2>
                <p>{visibleComponents.length} of {components.length} available locally</p>
              </div>
              <Badge variant="secondary">Base UI 1.7.0</Badge>
            </div>

            {visibleComponents.length > 0 ? (
              <div className="component-list">
                {visibleComponents.map((component) => (
                  <article className="component-row" id={component.name} key={component.name}>
                    <div className="component-meta">
                      <div>
                        <div className="component-title">
                          <h3>{component.title}</h3>
                          {isRecentlyAdded(component) ? (
                            <Badge variant="secondary">New</Badge>
                          ) : null}
                        </div>
                        <p>{component.description}</p>
                      </div>
                      <div className="component-actions">
                        <code>{component.name}</code>
                        <Button
                          type="button"
                          variant="ghost"
                          size="xs"
                          onClick={() => copyInstall(component.name)}
                        >
                          {copied === component.name ? (
                            <CheckIcon data-icon="inline-start" />
                          ) : (
                            <CopyIcon data-icon="inline-start" />
                          )}
                          {copied === component.name ? "Copied" : "Install"}
                        </Button>
                      </div>
                    </div>
                    <div className="component-specimen">
                      <ComponentPreview name={component.name} />
                    </div>
                  </article>
                ))}
              </div>
            ) : (
              <div className="empty-state" role="status">
                <h3>No matching components</h3>
                <p>Try another term or reset the filters.</p>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    setQuery("")
                    selectFilter("all")
                  }}
                >
                  Reset filters
                </Button>
              </div>
            )}
          </div>
        </section>
        ) : null}

        {view === "customize" ? (
          <Customizer
            config={customizerConfig}
            density={density}
            mode={mode}
            onConfigChange={updateCustomizer}
            onDensityChange={updateDensity}
            onModeChange={updateMode}
          />
        ) : null}
        {view === "blocks" ? <BlocksReference /> : null}
        {view === "charts" ? <ChartsReference /> : null}
        {view === "tokens" ? (
          <TokenReference
            customTheme={customTheme}
            density={density}
            mode={mode}
            theme={theme}
          />
        ) : null}
        {view === "foundations" ? <FoundationReference density={density} /> : null}

      </main>

      <div className="sr-only" aria-live="polite">
        {copied ? `Install command for ${copied} copied.` : ""}
      </div>
    </div>
  )
}

export { CatalogApp }
