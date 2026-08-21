import { useState, type CSSProperties } from "react"
import { CheckIcon, CopyIcon } from "lucide-react"

import {
  densityProfiles,
  densityTokenCount,
  foundationTokenCount,
  foundationTokenGroups,
  themeSources,
  themeTokenCount,
  themeTokenGroups,
  tokenCount,
  type DensityName,
  type FoundationTokenType,
} from "@/catalog/foundation-data"
import { Button } from "@/components/ui/button"
import type { ModeName, ThemeName } from "@/catalog/theme-controls"
import type { CustomTheme } from "@/catalog/customizer-contract"

interface TokenReferenceProps {
  density: DensityName
  mode: ModeName
  theme: ThemeName
  customTheme: CustomTheme
}

type TokenPreviewType = FoundationTokenType | "color"

function tokenPreviewStyle(token: string, type: TokenPreviewType): CSSProperties {
  const reference = `var(--${token})`

  switch (type) {
    case "color":
      return { background: reference }
    case "radius":
      return { borderRadius: reference }
    case "fontFamily":
      return { fontFamily: reference }
    case "fontSize":
      return { fontSize: reference }
    case "lineHeight":
      return { lineHeight: reference }
    case "fontWeight":
      return { fontWeight: reference }
    case "letterSpacing":
      return { letterSpacing: reference }
    case "dimension":
      return { width: reference }
    case "borderWidth":
      return { borderWidth: reference }
    case "shadow":
      return { boxShadow: reference }
    default:
      return {}
  }
}

function tokenPreviewContent(type: TokenPreviewType) {
  if (type === "fontFamily" || type === "fontSize" || type === "fontWeight") return "Aa"
  if (type === "lineHeight") return "↕"
  if (type === "letterSpacing") return "AA"
  if (type === "duration" || type === "cubicBezier") return "→"
  return ""
}

function TokenReference({ customTheme, density, mode, theme }: TokenReferenceProps) {
  const [copied, setCopied] = useState<string | null>(null)
  const values = theme === "custom" ? customTheme.modes[mode] : themeSources[theme].modes[mode]
  const densityProfile = densityProfiles.find((profile) => profile.name === density)
  if (!densityProfile) throw new Error(`Unknown density profile: ${density}`)
  const densityPropertyNames = {
    height: "height",
    paddingInline: "padding-inline",
    gap: "gap",
    fontSize: "font-size",
    iconSize: "icon-size",
  } as const
  const densityTokens = Object.entries(densityProfile.control).flatMap(([property, scale]) =>
    Object.entries(scale).map(([size, value]) => ({
      name: `ui-control-${densityPropertyNames[property as keyof typeof densityPropertyNames]}-${size}`,
      type: property === "fontSize" ? "fontSize" as const : "dimension" as const,
      value,
    }))
  )

  async function copyToken(token: string) {
    await navigator.clipboard.writeText(`var(--${token})`)
    setCopied(token)
    window.setTimeout(
      () => setCopied((current) => (current === token ? null : current)),
      1600
    )
  }

  function tokenRow(token: string, type: TokenPreviewType, value: string, scope: string) {
    const previewClass = type === "color"
      ? "token-color-sample"
      : type === "radius"
        ? "token-radius-sample"
        : `token-foundation-sample token-foundation-sample--${type}`

    return (
      <div className="token-row" data-token={token} data-token-scope={scope} key={token}>
        <dt><code>--{token}</code></dt>
        <dd className="token-preview" aria-hidden="true">
          <span className={previewClass} style={tokenPreviewStyle(token, type)}>
            {tokenPreviewContent(type)}
          </span>
        </dd>
        <dd className="token-value"><code>{value}</code></dd>
        <dd>
          <Button
            type="button"
            size="icon-xs"
            variant="ghost"
            aria-label={`Copy --${token}`}
            onClick={() => copyToken(token)}
          >
            {copied === token ? <CheckIcon /> : <CopyIcon />}
          </Button>
        </dd>
      </div>
    )
  }

  return (
    <section className="reference-section" id="tokens" aria-labelledby="tokens-title">
      <div className="container">
        <div className="reference-heading">
          <div>
            <h2 id="tokens-title">Token reference</h2>
            <p>
              {tokenCount} variables · {theme === "tis" ? "TIS" : theme === "custom" ? "Custom" : "Neutral"} ·{" "}
              {mode === "dark" ? "Dark" : "Light"}
            </p>
          </div>
          <code>var(--token)</code>
        </div>

        <section className="token-contract" aria-labelledby="theme-token-title">
          <div className="token-contract-heading">
            <h3 id="theme-token-title">Theme</h3>
            <span>{themeTokenCount}</span>
          </div>
          <div className="token-groups">
            {themeTokenGroups.map((group) => (
              <section className="token-group" key={group.label}>
                <h4>{group.label}</h4>
                <dl className="token-list">
                  {group.tokens.map((token) => tokenRow(
                    token,
                    token === "radius" ? "radius" : "color",
                    values[token],
                    "theme"
                  ))}
                </dl>
              </section>
            ))}
          </div>
        </section>

        <section className="token-contract" aria-labelledby="density-token-title">
          <div className="token-contract-heading">
            <h3 id="density-token-title">Density · {densityProfile.label}</h3>
            <span>{densityTokenCount}</span>
          </div>
          <div className="token-groups">
            <section className="token-group">
              <h4>Active control scale</h4>
              <dl className="token-list">
                {densityTokens.map((token) => tokenRow(
                  token.name,
                  token.type,
                  token.value,
                  "density"
                ))}
              </dl>
            </section>
          </div>
        </section>

        <section className="token-contract" aria-labelledby="foundation-token-title">
          <div className="token-contract-heading">
            <h3 id="foundation-token-title">Core foundations</h3>
            <span>{foundationTokenCount}</span>
          </div>
          <div className="token-groups">
            {foundationTokenGroups.map((group) => (
              <section className="token-group" key={group.name}>
                <h4>{group.label}</h4>
                <dl className="token-list">
                  {group.tokens.map((token) => tokenRow(
                    token.name,
                    token.type,
                    token.value,
                    "foundation"
                  ))}
                </dl>
              </section>
            ))}
          </div>
        </section>
      </div>
      <div className="sr-only" aria-live="polite">
        {copied ? `CSS reference for ${copied} copied.` : ""}
      </div>
    </section>
  )
}

export { TokenReference }
