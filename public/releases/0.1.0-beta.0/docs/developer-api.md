# Developer API

UI Foundation has a source API rather than a monolithic package API. A component's public contract is the combination of its registry item, TypeScript exports and resolved behavior contract.

## Canonical entrypoints

| Need | Source |
| --- | --- |
| Discover components and installation commands | `ai/manifest.json` |
| Read exact exports and source files | component entry in `ai/manifest.json` |
| Read semantics, keyboard, focus and composition | `contracts/components.json` |
| Inspect dependencies and install payload | `r/<component>.json` |
| Inspect conceptual metadata | `registry/catalog.json` |
| Inspect theme and foundation values | `tokens/*.json` |

The public sources are rooted at `https://tis-experience.github.io/ui-foundation/releases/0.1.0-beta.0/`.

## Component API

After installation, import from the path configured by the consumer's shadcn aliases:

```tsx
import { Button } from "@/components/ui/button"

export function SaveAction() {
  return <Button>Save</Button>
}
```

The installed TypeScript definition is authoritative for props. The manifest lists every named export, including compound parts such as `DialogTrigger`, `DialogContent`, `DialogTitle` and `DialogDescription`.

## Behavior API

Every catalog component has one resolved contract with:

- semantic classification and behavior owner;
- keyboard strategy;
- focus management;
- responsive responsibility;
- required states;
- consumer responsibilities;
- upstream sources and automated evidence.

All 66 current components have `verification.level: "interaction-tested"`. Consumers still own application-specific labels, content, validation, data and business actions.

## Composition rules

- use Base UI's `render` API for custom triggers; never translate examples to Radix `asChild`;
- keep compound children inside their required group or root;
- use `Field` for form labels, descriptions and errors;
- preserve component state attributes and semantic tokens;
- use layout classes around a component, but do not replace its identity, typography or state styling with hardcoded values;
- preserve the visible 2px focus outline and its 2px offset.

## Updating owned source

Source ownership allows product-specific changes, but changes should remain deliberate:

1. inspect the current registry item;
2. run `shadcn add <item-url> --dry-run`;
3. use `--diff` for each installed file;
4. merge upstream changes without discarding local adaptations;
5. repeat TypeScript, production, interaction and accessibility tests.

If an adaptation changes semantics, keyboard behavior, focus, required composition or public states, treat it as a forked component contract and document it locally.

## API for AI agents

Agents must begin with `ai/manifest.json`, then read the selected entries in `contracts/components.json`, and finally install or inspect the real registry payload. Generated markup based only on a component name is not a valid use of the library.
