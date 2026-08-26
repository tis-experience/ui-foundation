# Installation

UI Foundation is installed as owned source through the shadcn CLI. It is not consumed from a runtime `ui-foundation` npm package.

The distributed source is licensed under MIT. The public registry and every versioned release include the repository license.

## Compatibility

- Node.js 22 or later for the installation and build toolchain;
- React 19;
- Tailwind CSS 4;
- shadcn CLI 4.18.0;
- Base UI behavior primitives.

The consumer project must have a valid `components.json`. Run this before installing:

```bash
npx shadcn@4.18.0 info
```

The result must report `base: base`, Tailwind v4, the intended import aliases and the CSS entrypoint that will receive the theme variables. This adapter does not support Radix or `asChild`.

## Install source

Install one component from the public registry:

```bash
npx shadcn@4.18.0 add https://tis-experience.github.io/ui-foundation/releases/0.1.0-beta.0/r/button.json
```

The item resolves its own registry and npm dependencies. The installed TypeScript and CSS become part of the consuming project and can be reviewed before use:

```bash
npx shadcn@4.18.0 add https://tis-experience.github.io/ui-foundation/releases/0.1.0-beta.0/r/button.json --dry-run
```

Use `--diff` before updating an installed source file. Do not overwrite local adaptations without reviewing the diff.

## Theme and density

Neutral and Comfortable are the defaults. No root attribute is required.

Install the optional TIS identity:

```bash
npx shadcn@4.18.0 add https://tis-experience.github.io/ui-foundation/releases/0.1.0-beta.0/r/theme-tis.json
```

```html
<html data-ui-theme="tis" data-ui-density="comfortable">
```

Use `class="dark"` for Dark mode. Valid density values are `compact`, `comfortable` and `spacious`.

## Components, Blocks and Charts

- Component: install the matching item under `/r/<component>.json`.
- Block: install the Block item; its component dependencies are resolved automatically.
- Charts: install `chart-recipes`; it includes the six supported chart recipes and their dependencies.

Examples:

```bash
npx shadcn@4.18.0 add https://tis-experience.github.io/ui-foundation/releases/0.1.0-beta.0/r/data-table.json
npx shadcn@4.18.0 add https://tis-experience.github.io/ui-foundation/releases/0.1.0-beta.0/r/dashboard-overview.json
npx shadcn@4.18.0 add https://tis-experience.github.io/ui-foundation/releases/0.1.0-beta.0/r/chart-recipes.json
```

## Current and versioned URLs

`/r/<item>.json` follows the current public build. It is suitable for evaluation and controlled updates.

A published release uses `/releases/<version>/r/<item>.json`. Release URLs are immutable, contain versioned internal dependencies and publish a SHA-256 manifest. Use a versioned URL when a product needs reproducible installation.

## Verification in the consumer

After installation:

1. run the project TypeScript and production build;
2. verify Light and Dark modes;
3. verify the selected density at compact and wide widths;
4. exercise the keyboard path and focus restoration described by the component contract;
5. run the consumer accessibility suite.

The exact exports, files, dependencies and resolved behavior contract are available through `ai/manifest.json` and `contracts/components.json`.
