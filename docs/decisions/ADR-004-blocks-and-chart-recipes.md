# ADR-004 — Blocks and chart recipes

- Status: Accepted
- Date: 2026-08-20

## Context

Individual components are insufficient for teams and AI agents that need to begin from a working application pattern. Treating every screen or visualization as a new component would, however, confuse reusable primitives with product composition.

## Decision

Distribute application Blocks and chart recipes as shadcn `registry:block` items. They are composed exclusively from the existing UI Foundation components and semantic contracts.

The first application set contains Dashboard Overview, Login Page, Settings Page and Team Members. The first chart bundle contains Area, Bar, Line, Pie, Radar and Radial recipes built with the existing Chart component and Recharts.

Blocks own layout and example content but do not introduce another behavior engine, token set or hidden data layer. Product authorization, persistence, analytics, server data, routing and validation policies remain consumer-owned.

Every chart recipe must provide an accessible name, Recharts accessibility layer and a concise text summary. When exact values are part of the user's task, consumers must also expose a data table or equivalent textual representation.

## Consequences

- Teams can install a complete starting point and edit owned source.
- Blocks and chart recipes appear separately from the component inventory in both human and AI catalogs.
- Registry tests must install these items in a clean consumer together with their component dependencies.
- A composition graduates to a component only when it establishes a reusable behavioral or semantic contract beyond layout.
