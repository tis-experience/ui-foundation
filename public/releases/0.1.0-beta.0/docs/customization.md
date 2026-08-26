# Customization

The integrated customizer is available at `/#customize`. It applies changes to the real component source shown in the live preview.

## What can be changed

- Identity: Neutral, TIS or Custom.
- Base color: Neutral, Slate, Stone or Zinc.
- Brand color: used by primary actions, focus and derived accents.
- Chart palette: Brand, Categorical or Neutral.
- Body font and heading font in one theme workflow.
- Typeset rhythm: Compact, Default or Reading presets, with editable size, leading, block flow and reading measure.
- Radius: None, Small, Default, Large or Pill / Full. Pill applies to controls; containers remain capped at Large.
- Density: Compact, Comfortable or Spacious.
- Mode: Light or Dark.

The complete option contract lives in `tokens/customizer.json`. It is deliberately independent from React so future technology adapters can reproduce the same choices.

## Outputs

### CSS

Copy the generated light and dark CSS variable selectors. Apply `data-ui-theme="custom"` to the document root and add `class="dark"` for Dark mode.

### shadcn theme item

Download `ui-foundation-theme.json`, then install it into a configured shadcn project:

```bash
npx shadcn@4.18.0 add ./ui-foundation-theme.json
```

The generated file is a `registry:theme` item and depends on `ui-base` for foundations, focus and density behavior.

### Shareable preset

Use **Share preset** to store the customizer choices in the URL. The URL contains configuration only; it does not upload the project or send data to a service.

## Accessibility behavior

The customizer recalculates custom action and focus colors against the active surface. Focus continues to use the library contract: one 2px solid outline, 2px offset, no halo, error color for invalid controls, neutral color for read-only controls and system Highlight in forced-colors mode.

Typography is customized in the same surface because font metrics affect layout and perceived density. Geist is bundled in the local reference; Humanist, Serif and System are portable system-stack choices. A consumer that replaces these stacks with hosted or licensed font files owns loading and licensing.

The generated theme includes `--font-sans`, `--font-heading`, `--typeset-config-size`, `--typeset-config-leading`, `--typeset-config-flow` and `--typeset-config-measure`. The installable `Typeset` component consumes those variables directly, so the live preview and the developer output use the same contract.
