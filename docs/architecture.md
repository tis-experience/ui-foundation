# Architecture

## Decision

UI Foundation is a clean, source-first component library whose core contracts can be replicated across technologies without sharing runtime code.

The React adapter uses five deliberately separate layers:

1. **Foundation contract** — typography, spacing, radius scale, borders, elevation and motion in `tokens/foundations.json`.
2. **Density contract** — Compact, Comfortable and Spacious control scales in `tokens/densities.json`. Comfortable is the default; the active profile jointly controls height, inline padding, gap, font size and icon size.
3. **Theme contract** — semantic color pairs and the theme radius base with light and dark modes. Neutral is the default; TIS is an optional adapter.
4. **Behavior adapter** — Base UI primitives provide interaction, focus management, keyboard behavior, and ARIA relationships.
5. **Distribution adapter** — shadcn installs readable source files and the foundation, density and theme contracts into the consumer project.

Focus is shared by all identities and densities: one 2px solid semantic outline sits 2px outside the focused element, with no halo. The outline follows the target radius, its color comes from the active theme or state, and forced-colors mode uses the system Highlight color.

The portable customizer contract lives in `tokens/customizer.json`. Its human interface changes identity, typography, radius, chart palette and density together, previews the real components, and exports CSS, a shadcn theme item or a shareable URL.

Blocks and chart recipes are `registry:block` compositions. They consume the same component source and tokens but remain separate from the primitive component inventory.

The catalog application consumes the same source and is therefore an integration surface, not a separate implementation.

## What is intentionally absent

- No dependency on `ds-tis`.
- No Figma library or Figma sync.
- No Ark UI, Zag, Radix UI, or provider mixing in the React adapter.
- No universal component runtime shared by future frameworks.
- No public package or hosted registry in the local alpha phase.

## Replication to another technology

A future adapter may reuse:

- `tokens/foundation.schema.json` and `tokens/foundations.json`;
- `tokens/density.schema.json` and `tokens/densities.json`;
- `tokens/theme.schema.json` and the theme JSON files;
- `tokens/customizer.schema.json` and `tokens/customizer.json`;
- the semantic component descriptions and accessibility expectations in `registry/catalog.json`;
- component names, categories, conceptual anatomy, and content guidance;
- the AI manifest generated under `public/ai`.
- the conceptual composition, content and accessibility contracts of Blocks and chart recipes.

It must replace:

- React component source;
- Base UI with the technology-appropriate behavior engine;
- shadcn installation with that ecosystem's distribution mechanism;
- tests and examples with technology-native equivalents.

This separation prevents the earlier failure mode in which multiple libraries, token systems, and implementation models were presented as one design system.
