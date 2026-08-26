# ADR-003 — Portable customizer contract

- Status: Accepted
- Date: 2026-08-20

## Context

UI Foundation needs a customization experience comparable in capability to shadcn Create while remaining a standalone library whose contracts can later be reimplemented in other technologies. Color, typography, radius and density cannot live in disconnected tools because they jointly determine the perceived size, hierarchy and identity of the interface.

## Decision

Define `tokens/customizer.json` as the machine-readable customization contract. The human interface lives at `/#customize` and controls:

- identity source: Neutral, TIS or Custom;
- neutral base color;
- brand color;
- chart palette;
- body and heading font stacks;
- Typeset presets and editable size, leading, block flow and reading measure;
- radius;
- Compact, Comfortable or Spacious density;
- Light or Dark preview mode.

Typography is part of the same customization surface as color and geometry. Fonts and Typeset rhythm are one contract: `--font-sans` and `--font-heading` select the stacks, while `--typeset-config-size`, `--typeset-config-leading`, `--typeset-config-flow` and `--typeset-config-measure` configure long-form content. Density remains a separate runtime selector because products may need to switch it independently from identity, but it is selected and documented in the same preset experience.

The customizer uses the real library components in its live preview and exports three portable results: CSS variables, a shadcn `registry:theme` JSON item, and a shareable URL. Base UI remains the fixed behavior engine and Lucide remains the fixed icon library; neither is a theme choice.

Neutral is the default. TIS is an optional preset that carries the identity's essence without importing DS TIS source, token naming or runtime dependencies. Custom brand colors are adjusted when necessary so focus indicators preserve at least 3:1 contrast against their adjacent surface.

## Consequences

- A developer can install or copy the generated output without design handoff.
- A designer or AI can start from the same live, executable contract.
- Future technology adapters can consume `tokens/customizer.json` and implement a native equivalent.
- Adding a new customizer option requires updating the JSON contract, schema, UI, export serializer and tests together.
- The alpha offers curated local/system font stacks; downloading or licensing external fonts remains an application decision.
