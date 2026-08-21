# ADR-002 — Density and focus contract

- Status: Accepted
- Date: 2026-08-20

## Context

The upstream Nova styling uses compact controls, while UI Foundation must support dense product surfaces, general-purpose applications, and more generous touch-oriented experiences without forking every component. The original translucent shadcn focus halo does not provide uniformly strong contrast across themes and becomes visually noisy when combined with another solid focus layer.

## Decision

Define three density profiles in `tokens/densities.json`:

- Compact: 28 / 32 / 36px for sm / md / lg controls;
- Comfortable: 32 / 40 / 48px and the default profile;
- Spacious: 40 / 48 / 56px.

Each profile controls height, inline padding, gap, font size, and icon size through the same CSS variable names. Identity and density remain independent selections.

Use one 2px solid outline with a 2px offset and no halo. The outline follows the focused target's computed radius so its outer curve remains consistent with the component. The active theme owns the default ring color, invalid controls use the destructive semantic color, read-only controls use the neutral muted-foreground color, and forced-colors mode uses the system Highlight color. Invalid takes precedence when a control is both invalid and read-only.

## Consequences

- Product teams can change density without replacing components or the Base UI behavior engine.
- Components must consume the density variables instead of fixed sm, md, and lg control sizes.
- Comfortable becomes the stable baseline for catalog examples, generated registry source, and AI guidance.
- Every theme must provide ring, destructive and neutral read-only colors that visibly contrast with their surrounding surfaces.
- Focus tests must verify the outline width, offset, state color, curvature, absence of a halo, all theme/mode combinations, and forced-colors fallback.
