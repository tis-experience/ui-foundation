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

### Start from a new Vite project

For a new React project, initialize Vite and shadcn before adding UI Foundation items:

```bash
npm create vite@9.2.0 my-app -- --template react-ts
cd my-app
npm install
npm install --save-dev tailwindcss@4.3.3 @tailwindcss/vite@4.3.3
npx shadcn@4.18.0 init --template vite --base base --preset nova --yes --no-monorepo
npx shadcn@4.18.0 info
```

The CLI input is `--preset nova --base base`; the resulting `components.json` reports the combined style as `base-nova`.

TypeScript 6 does not require `baseUrl` for aliases. Keep the alias paths relative to the configuration file:

```json
{
  "compilerOptions": {
    "paths": { "@/*": ["./src/*"] }
  }
}
```

Use `fileURLToPath` in Vite so aliases also work when the project path contains spaces:

```ts
import { fileURLToPath, URL } from "node:url"
import react from "@vitejs/plugin-react"
import tailwindcss from "@tailwindcss/vite"
import { defineConfig } from "vite"

export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      "@": fileURLToPath(new URL("./src", import.meta.url)),
    },
  },
})
```

## Install source

Install one component from the public registry:

```bash
npx shadcn@4.18.0 add https://tis-experience.github.io/ui-foundation/r/button.json
```

The item resolves its own registry and npm dependencies. The installed TypeScript and CSS become part of the consuming project and can be reviewed before use:

```bash
npx shadcn@4.18.0 add https://tis-experience.github.io/ui-foundation/r/button.json --dry-run
```

Use `--diff` before updating an installed source file. Do not overwrite local adaptations without reviewing the diff.

## Theme and density

Neutral and Comfortable are the defaults. No root attribute is required.

Install the optional TIS identity:

```bash
npx shadcn@4.18.0 add https://tis-experience.github.io/ui-foundation/r/theme-tis.json
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
npx shadcn@4.18.0 add https://tis-experience.github.io/ui-foundation/r/data-table.json
npx shadcn@4.18.0 add https://tis-experience.github.io/ui-foundation/r/dashboard-overview.json
npx shadcn@4.18.0 add https://tis-experience.github.io/ui-foundation/r/chart-recipes.json
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

The repository runs these same checks against a generated consumer in a temporary path containing spaces. Its smoke app composes Dashboard Overview, Settings Page, Tabs, Dialog, forms, themes and density controls before validating build, keyboard behavior, focus restoration, 320px layout and axe.

## Runnable consumer example

The same application used by the clean-consumer harness is published as a separate build at:

```text
https://tis-experience.github.io/ui-foundation/examples/consumer/
```

It can also be opened through **Example app** in the public catalog navigation. The public entry reuses `fixtures/consumer-template/src/App.tsx`, so the maintained test fixture and the visible application cannot silently become different implementations.
