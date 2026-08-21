# ADR-005 — Standalone maintenance harness

Status: Accepted

Date: 2026-08-21

## Context

UI Foundation needs to be maintainable by developers and AI agents without recreating the process complexity or implementation coupling of DS TIS. The existing catalog, registry, consumer test and AI manifest already provide a useful base, but component responsibilities and release gates were not yet explicit enough for autonomous maintenance.

## Decision

Adopt a small repository-native harness:

- read-only agent preflight;
- reusable behavior profiles with an explicit assignment for every component;
- resolved public component contracts for developers and AI;
- generated documentation and machine-readable sources checked for drift;
- full validation on pull requests and again before GitHub Pages deployment;
- current Node 24-based GitHub Actions while retaining Node 22 as the library build runtime.

The harness reuses governance principles learned in DS TIS, not its implementation. UI Foundation remains independent from `ds-tis`, Figma and other technology adapters.

## Consequences

- A new component cannot enter the catalog without a known behavior profile.
- A behavior ownership change becomes a contract change, not an undocumented implementation detail.
- Pull requests receive the same build, consumer and browser gates used for publication.
- Future adapters may consume the resolved conceptual contracts while replacing React, Base UI, shadcn and their tests.

## Alternatives considered

- Copy the DS TIS agent run system: rejected because Figma, token sync and multiple output providers are outside the current product boundary.
- Keep accessibility as one prose field per component: rejected because it does not define ownership, keyboard strategy, responsive responsibility or required states.
- Run validation only after merge: rejected because it allows known failures to reach `main` before the first remote gate.
