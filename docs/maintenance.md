# Construction and maintenance harness

UI Foundation borrows proven operating ideas from DS TIS without importing its implementation, tokens, Figma workflow, or multi-provider architecture. The shared principle is simple: repository contracts and executable evidence must be sufficient for a developer or AI agent to continue the work without relying on chat history.

## What is reused from DS TIS

- a read-only preflight before the first change;
- machine-readable component contracts rather than prose-only claims;
- documentation generated from repository sources;
- a clean consumer installation as a release gate;
- independent browser, keyboard, responsive and WCAG evidence;
- a branch and pull request before production publication.

## What is intentionally not reused

- no `ds-tis` import, package, CSS, token or runtime dependency;
- no Figma gate or Figma source of truth in this phase;
- no HTML/CSS, Ark/Zag or other technology implementation inside the React adapter;
- no Foundation → Semantic → Component token hierarchy copied from DS TIS;
- no multi-agent ceremony when one scoped change and its executable checks are enough.

## Sources of truth

1. `AGENTS.md` — product boundary and required workflow.
2. `contracts/component-contracts.json` — reusable behavior profiles and the explicit profile assigned to every component.
3. `registry/catalog.json` — names, source files, dependencies and component-specific accessibility guidance.
4. `tokens/*.json` — portable visual contracts.
5. component, Block and chart source — installed implementation.
6. generated registry, AI manifest and documentation — derived distribution artifacts.

The public `contracts/components.json` resolves every component profile into a complete individual contract. Agents should read that file together with `ai/manifest.json`; screenshots and catalog copy do not override them.

## Roles

The harness uses three responsibilities. One person or agent may perform more than one locally, but CI remains the independent verifier before merge.

### Contract maintainer

- classifies the pattern and selects or changes its contract profile;
- verifies behavior ownership: Base UI, browser, external package or library composition;
- defines required states, responsive responsibility and consumer obligations;
- changes the schema before adding an unsupported contract concept.

### Component implementer

- reads the official shadcn recipe and matching Base UI or upstream documentation;
- changes source without breaking the standalone boundary;
- adds a real catalog specimen and direct interaction coverage where behavior changes;
- regenerates registry and AI surfaces.

### Verifier and release maintainer

- reviews the scoped diff and generated artifacts;
- runs all three required gates;
- verifies a clean registry installation in a separate project;
- publishes through a pull request and confirms the public artifact after deploy.

## Workflow

1. Run `npm run agent:preflight` and isolate unrelated changes.
2. Read the component contract, catalog entry, source and current tests.
3. Consult current primary documentation for the relevant shadcn recipe and behavior engine.
4. Change the contract first when the public responsibility or behavior changes.
5. Implement the smallest source change and add direct evidence for the affected interaction.
6. Run `npm run build:all` to regenerate registry, contracts and AI surfaces.
7. Run `npm test`, `npm run test:consumer` and `npm run test:e2e`.
8. Review `git diff --check` and the exact staged paths.
9. Open a pull request. CI must pass before merge.
10. After `main` deploys, verify the catalog, manifest and affected registry items publicly.

## Contract changes

Do not create a new profile merely because one component has different copy or styling. Create or change a profile only when at least one of these responsibilities differs:

- semantic classification;
- behavior owner;
- keyboard strategy;
- responsive strategy;
- required public states;
- consumer responsibilities.

Every catalog component must map to exactly one existing profile. `npm run check:contracts` blocks missing components, unknown profiles, version drift and non-alphabetical assignments.

## Evidence required in a pull request

- affected component names and contract profiles;
- source and generated registry files changed;
- direct interaction or semantic scenarios added or updated;
- `npm test` result;
- `npm run test:consumer` result;
- `npm run test:e2e` result;
- public verification when the change reaches `main`.
