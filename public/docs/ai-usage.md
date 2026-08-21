# AI usage guide

UI Foundation exposes one source of truth for agents: `public/ai/manifest.json`. Read it before generating a screen, selecting components, or changing library source.

## For an AI building an application

1. Select the theme explicitly: `neutral` by default, `tis` only when that identity is requested, or a generated `custom` preset when its configuration is supplied.
2. Select density explicitly: `comfortable` by default, `compact` for data-heavy interfaces, or `spacious` for generous and touch-oriented interfaces.
3. Use only components whose `status` is `alpha` or later in the manifest.
4. Install each component from the source registry; do not recreate its markup from memory.
5. Use the exported component composition and Base UI `render` API. Never translate examples to `asChild`.
6. Compose form controls with `Field`, visible labels, descriptions, stable IDs, and errors.
7. Preserve the theme, density and foundation tokens. Do not add brand hex values or fixed control heights inside component classes.
8. Prefer an installable Block when it already matches the requested page pattern; adapt its owned source instead of rebuilding the composition from memory.
9. Use `chart-recipes` for Area, Bar, Line, Pie, Radar or Radial visualizations. Preserve its text summary and add a table when exact values are part of the task.
10. Provide a short implementation record: components and Blocks selected, theme, density, states covered, keyboard behavior, and responsive checks.

## For a designer using AI before Figma exists

Ask the AI for a **component plan**, not an invented design library. A valid plan contains:

- the user goal and primary task;
- selected UI Foundation components by exact manifest name;
- page hierarchy and component composition;
- required states: empty, loading, error, disabled, focus, success;
- responsive behavior at compact and wide widths;
- accessibility notes and content rules;
- theme selection as a separate decision.
- density selection as a separate decision, using Comfortable when no product constraint says otherwise.
- a Block selection when an existing application pattern provides a credible starting point;
- a Chart choice with textual interpretation when data visualization is required.

The output can be rendered directly in the catalog stack as a working prototype. It must not claim a Figma component or visual contract exists.

## Prompt template

```text
Use UI Foundation and read https://tis-experience.github.io/ui-foundation/ai/manifest.json first.
Goal: <user task>
Theme: neutral | tis | custom preset URL/config
Density: compact | comfortable | spacious (default: comfortable)
Platform: React
Constraints: use only listed components, Blocks and chart recipes; Base UI behavior; no Radix/asChild; no hardcoded brand colors.
Deliver: component plan, working screen, loading/error/empty states, keyboard path, responsive behavior, and the exact registry items used.
```

## Sources agents may trust

1. `public/ai/manifest.json`
2. `registry/catalog.json`
3. `tokens/foundation.schema.json` and `tokens/foundations.json`
4. `tokens/density.schema.json` and `tokens/densities.json`
5. `tokens/theme.schema.json` and `tokens/themes/*.json`
6. `tokens/customizer.schema.json` and `tokens/customizer.json`
7. generated registry items under `public/r`
8. component source under `src/components/ui`, Block source under `src/blocks`, and chart recipes under `src/charts`

Screenshots and prose examples are illustrative and do not override these files.
