import {
  densityProfiles,
  densityTokenCount,
  foundationTokenCount,
  foundationValue,
  themeTokenCount,
  type DensityName,
} from "@/catalog/foundation-data"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

const surfaces = [
  { name: "Background", value: "background" },
  { name: "Card", value: "card" },
  { name: "Muted", value: "muted" },
  { name: "Primary", value: "primary" },
] as const

const typographyScale = [
  { label: "Display", token: "text-4xl" },
  { label: "Heading", token: "text-2xl" },
  { label: "Subheading", token: "text-lg" },
  { label: "Body", token: "text-base" },
  { label: "Small", token: "text-sm" },
  { label: "Caption", token: "text-xs" },
] as const

const fontFamilies = [
  { label: "Sans", token: "font-sans" },
  { label: "Heading", token: "font-heading" },
  { label: "Mono", token: "font-mono" },
] as const

const fontWeights = [
  { label: "Regular", token: "font-weight-normal" },
  { label: "Medium", token: "font-weight-medium" },
  { label: "Semibold", token: "font-weight-semibold" },
  { label: "Bold", token: "font-weight-bold" },
] as const

const spacingSteps = [1, 2, 3, 4, 6, 8, 12, 16] as const
const radii = ["sm", "md", "lg", "xl", "2xl", "3xl", "4xl"] as const
const shadows = ["xs", "sm", "md", "lg"] as const
const durations = ["fast", "normal", "slow"] as const

interface FoundationReferenceProps {
  density: DensityName
}

function FoundationReference({ density }: FoundationReferenceProps) {
  return (
    <section className="reference-section" id="foundations" aria-labelledby="foundations-title">
      <div className="container">
        <div className="reference-heading">
          <div>
            <h2 id="foundations-title">Foundations</h2>
            <p>
              {foundationTokenCount} core tokens · {densityTokenCount} active density tokens · {themeTokenCount} theme tokens
            </p>
          </div>
          <code>tokens/foundations.json</code>
        </div>

        <section className="foundation-section" aria-labelledby="color-title">
          <div className="foundation-section-heading">
            <h3 id="color-title">Color</h3>
            <code>semantic pairs</code>
          </div>
          <div className="surface-specimens">
            {surfaces.map((surface) => (
              <div className="surface-specimen" data-surface={surface.value} key={surface.value}>
                <strong>{surface.name}</strong>
                <code>--{surface.value}</code>
              </div>
            ))}
          </div>
        </section>

        <section className="foundation-section" aria-labelledby="typography-title">
          <div className="foundation-section-heading">
            <h3 id="typography-title">Typography</h3>
            <code>family · size · line-height · weight · tracking</code>
          </div>
          <div className="typography-foundation">
            <div className="font-family-specimens">
              {fontFamilies.map((font) => (
                <div
                  className="font-family-specimen"
                  key={font.token}
                  style={{ fontFamily: `var(--${font.token})` }}
                >
                  <span>{font.label}</span>
                  <strong>Aa</strong>
                  <code>--{font.token}</code>
                </div>
              ))}
            </div>
            <div className="type-scale" aria-label="Type scale">
              {typographyScale.map((item) => (
                <div className="type-scale-row" key={item.token}>
                  <div>
                    <span>{item.label}</span>
                    <code>--{item.token}</code>
                  </div>
                  <p
                    style={{
                      fontSize: `var(--${item.token})`,
                      lineHeight: `var(--${item.token}--line-height)`,
                    }}
                  >
                    Interface typography
                  </p>
                </div>
              ))}
            </div>
            <div className="font-weight-specimens" aria-label="Font weights">
              {fontWeights.map((weight) => (
                <div key={weight.token} style={{ fontWeight: `var(--${weight.token})` }}>
                  <span>{weight.label}</span>
                  <strong>{foundationValue(weight.token)}</strong>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="foundation-section" aria-labelledby="spacing-title">
          <div className="foundation-section-heading">
            <h3 id="spacing-title">Spacing</h3>
            <code>--spacing × multiplier</code>
          </div>
          <div className="spacing-specimens">
            {spacingSteps.map((step) => (
              <div className="spacing-specimen" key={step}>
                <span
                  style={{ width: `calc(var(--spacing) * ${step})` }}
                  aria-hidden="true"
                />
                <code>{step}</code>
              </div>
            ))}
          </div>
        </section>

        <section className="foundation-section" aria-labelledby="density-title">
          <div className="foundation-section-heading">
            <h3 id="density-title">Density</h3>
            <code>sm · md · lg</code>
          </div>
          <div className="density-profiles">
            {densityProfiles.map((profile) => (
              <article
                className="density-profile"
                data-active={density === profile.name}
                key={profile.name}
              >
                <div>
                  <h4>{profile.label}</h4>
                  {density === profile.name ? <span>Active</span> : null}
                </div>
                <p>{profile.description}</p>
                <div className="density-scale" aria-label={`${profile.label} control heights`}>
                  {(["sm", "md", "lg"] as const).map((size) => (
                    <div key={size}>
                      <span style={{ height: profile.control.height[size] }} aria-hidden="true" />
                      <code>{size} · {profile.control.height[size]}</code>
                    </div>
                  ))}
                </div>
              </article>
            ))}
          </div>
        </section>

        <section className="foundation-section" aria-labelledby="radius-title">
          <div className="foundation-section-heading">
            <h3 id="radius-title">Radius</h3>
            <code>theme base → derived scale</code>
          </div>
          <div className="radius-specimens">
            {radii.map((radius) => (
              <div className="radius-specimen" key={radius}>
                <span style={{ borderRadius: `var(--radius-${radius})` }} aria-hidden="true" />
                <code>{radius}</code>
              </div>
            ))}
          </div>
        </section>

        <section className="foundation-section" aria-labelledby="border-title">
          <div className="foundation-section-heading">
            <h3 id="border-title">Borders and focus</h3>
            <code>2px outline · 2px offset</code>
          </div>
          <div className="border-foundation">
            <div className="border-specimens">
              <span data-width="default">Default · 1px</span>
              <span data-width="strong">Strong · 2px</span>
            </div>
            <div className="focus-specimen">
              <Button variant="outline">Default focus</Button>
              <Input aria-invalid="true" aria-label="Error focus" defaultValue="Invalid value" />
              <Input aria-label="Read-only focus" value="Read-only value" readOnly />
            </div>
          </div>
        </section>

        <section className="foundation-section" aria-labelledby="elevation-title">
          <div className="foundation-section-heading">
            <h3 id="elevation-title">Elevation</h3>
            <code>--shadow-*</code>
          </div>
          <div className="elevation-specimens">
            {shadows.map((shadow) => (
              <div key={shadow} style={{ boxShadow: `var(--shadow-${shadow})` }}>
                <code>{shadow}</code>
              </div>
            ))}
          </div>
        </section>

        <section className="foundation-section" aria-labelledby="motion-title">
          <div className="foundation-section-heading">
            <h3 id="motion-title">Motion</h3>
            <code>duration + easing</code>
          </div>
          <div className="motion-specimens">
            {durations.map((duration) => (
              <div className="motion-specimen" data-slot="motion-specimen" key={duration} tabIndex={0}>
                <span
                  style={{ transitionDuration: `var(--duration-${duration})` }}
                  aria-hidden="true"
                />
                <div>
                  <strong>{duration}</strong>
                  <code>{foundationValue(`duration-${duration}`)}</code>
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>
    </section>
  )
}

export { FoundationReference }
