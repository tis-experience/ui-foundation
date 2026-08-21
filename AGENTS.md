# AGENTS.md — UI Foundation

This file is the operating contract for humans and AI agents working in this repository.

## Required preflight

Before the first repository change, run:

```bash
npm run agent:preflight
```

Read `docs/maintenance.md` for the standalone contract, responsibilities and release evidence. The preflight is read-only and reports branch, worktree state, contract coverage and generated-surface freshness.

## Product boundary

- UI Foundation is a standalone product. It must not import, link to, or require `ds-tis`.
- The neutral theme is the default. TIS is an optional standalone adapter under `tokens/themes/tis.json`.
- Figma is intentionally out of scope until the owner starts a separate design-library phase.
- React is the first technology adapter. Future adapters may reuse the theme and component contracts, but they must keep their own behavior engine, source, tests, and distribution.

## Architecture contract

- Distribution: shadcn source registry.
- React primitives use Base UI. Official shadcn compositions and specialized external controls may own behavior only when their dependency and external behavior profile are explicit in the catalog and component contract.
- Styling: Tailwind CSS plus core variables generated from `tokens/foundations.json`, control variables generated from `tokens/densities.json`, and semantic variables generated from the active theme contract.
- Never add Radix UI to this adapter or replace Base UI as the primitive engine.
- Use Base UI's `render` composition API. Do not use Radix's `asChild` convention.
- Components consume semantic variables such as `--primary`, `--background`, and `--ring`. Do not hardcode identity colors in component source.
- Typography, spacing, radius scale, borders, elevation and motion come from `tokens/foundations.json`; do not document a foundation token that is absent from that contract or the installed base item.
- Control height, inline padding, gap, font size and icon size come from the active profile in `tokens/densities.json`. Comfortable is the default; components must not reintroduce fixed control heights for sm, md or lg.
- Every theme must implement exactly the same light and dark token keys.

## Component workflow

1. Read the official shadcn page and the matching Base UI primitive documentation.
2. Classify the component and record it in `registry/catalog.json` before calling it supported. New entries must include `introducedIn` with the release version; the catalog derives the temporary `Recently added` filter from the current minor release line.
3. Assign exactly one behavior profile in `contracts/component-contracts.json`. Change or add a profile only when ownership, keyboard, responsive strategy, required states or consumer responsibility actually differs. Add an `interactionContracts` entry only with a matching `test.describe("contract: <name>")` group that proves its semantics, keyboard and focus behavior.
4. Add or update source in `src/components/ui`.
5. Preserve accessible names, keyboard behavior, focus visibility, reduced motion, and forced state semantics.
6. Regenerate the registry, resolved contracts and AI surfaces.
7. Prove installation in the clean consumer fixture.
8. Run browser tests in all theme and mode combinations.

## Required gates

```bash
npm run test
npm run test:consumer
npm run test:e2e
```

`npm run test` validates generated contracts, TypeScript, lint, and the production catalog build. The consumer test proves source installation into a separate Vite project. The browser test proves interaction, responsive behavior, and automated WCAG A/AA checks.

`npm test` also rehearses a versioned source-registry release in a temporary directory. After `main` deploys, run `npm run test:consumer:public` to prove the hosted registry from a clean project. `npm run release:stage -- --version <approved-version>` is reserved for an owner-approved version change and must never overwrite an existing release directory.

## Forbidden without owner approval

- Writing to Figma.
- Importing or copying implementation files from `ds-tis`.
- Publishing to npm, GitHub Pages, Vercel, or another external service.
- Creating a remote repository, commit, tag, push, or pull request.
- Replacing Base UI, changing the default theme, or merging technology adapters into one runtime.
- Using `--force`, `--legacy-peer-deps`, unpinned `latest`, or silent compatibility overrides.
