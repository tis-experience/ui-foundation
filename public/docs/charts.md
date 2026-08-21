# Chart recipes

Install the six chart recipes as editable source:

```bash
npx shadcn@4.18.0 add https://tis-experience.github.io/ui-foundation/r/chart-recipes.json
```

The registry item installs the token-aware Chart wrapper and pinned Recharts dependency. It exports:

- `AreaChartRecipe` for continuous volume and trend;
- `BarChartRecipe` for ranked categories;
- `LineChartRecipe` for change over time;
- `PieChartRecipe` for a small number of parts within a whole;
- `RadarChartRecipe` for multivariate profiles;
- `RadialChartRecipe` for one bounded progress value.

All recipes use `--chart-1` through `--chart-5`, so Neutral, TIS and custom palettes apply without component changes.

## Accessibility requirements

- Keep an accessible name on the chart container.
- Keep the Recharts accessibility layer enabled.
- Preserve or replace the concise text summary shipped with each recipe.
- Do not use color as the only series distinction; retain labels, legend or direct annotation.
- Add a data table when users must read, compare or copy exact values.
- Avoid animation that ignores `prefers-reduced-motion`; the supplied recipes disable series animation by default.
