# ADR-001 — Standalone, source-first architecture

- Status: Accepted
- Date: 2026-08-20

## Context

An earlier experiment mixed the existing TIS design system, shadcn components, provider-specific behavior, and multiple token contracts. The result was difficult to understand and impossible to replicate cleanly across technologies.

## Decision

Create UI Foundation as an independent product with a neutral default theme, an optional TIS adapter, Base UI as the React primitive engine, and shadcn source distribution. Official shadcn compositions and specialized external controls may keep their own behavior engine when the dependency and ownership are explicit in the component catalog and contract. They do not replace Base UI or become a second primitive layer. Figma is not part of this phase.

Future technology implementations will share contracts and intent, not runtime component code.

## Consequences

- A developer can install and own the source without a design handoff.
- TIS identity remains optional and replaceable.
- React-specific decisions do not leak into future adapters.
- The project requires explicit machine-readable contracts and consumer tests.
- A future Figma library must begin as a separate, approved phase and consume the stabilized contract rather than drive this alpha.
