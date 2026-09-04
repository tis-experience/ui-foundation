# Changelog

All notable changes to UI Foundation will be documented in this file.

## [Unreleased]

### Added

- Public, independently bundled consumer application at `/examples/consumer/`, linked from the catalog and sourced from the same fixture used by the clean-install harness.
- Real clean-consumer application harness covering installable Blocks, theme and density controls, keyboard navigation, Dialog focus restoration, responsive layout and axe after a production build.

### Fixed

- Expose the runnable consumer application as a primary action in the catalog introduction instead of relying on the overflowable header navigation.
- Open Date Picker on its selected date when the value belongs to a different month than the current date.
- Update the transitive `fast-uri` and `qs` dependencies to versions without known production advisories.
- Preserve native link semantics in the public example return action and keep the Dashboard activity table within narrow mobile cards without creating an inaccessible scroll region.
- Document the current shadcn 4.18 Vite initialization flags, TypeScript 6 alias configuration and path-safe Vite alias resolution.

## [0.1.0-beta.0] - 2026-08-26

### Added

- Reproducible source-registry release harness with immutable version snapshots, SHA-256 manifests, compatibility metadata and a no-write rehearsal gate.
- Developer installation, source API and release documentation plus a clean-consumer smoke test for the hosted registry.
- Standalone construction and maintenance harness adapted from proven DS TIS governance principles, with read-only preflight, explicit behavior profiles and resolved contracts for all 66 components.
- Pull-request CI running the same build, clean consumer, interaction and accessibility gates required for GitHub Pages publication.
- Standalone React foundation using shadcn source distribution and Base UI 1.7.0 behavior.
- Neutral light/dark theme and optional standalone TIS light/dark preset.
- Local catalog of 66 installable components with interactive examples.
- Second component wave covering Alert Dialog, Avatar, Breadcrumb, Button Group, Collapsible, Empty, Hover Card, Input Group, Item, Kbd, Native Select, Progress, Tabs, Toggle, and Toggle Group.
- Third component wave covering Aspect Ratio, Carousel, Context Menu, Direction, Drawer, Dropdown Menu, Menubar, Navigation Menu, Resizable, Scroll Area, Sheet, Sidebar, and Slider.
- Final component wave covering Attachment, Bubble, Calendar, Chart, Combobox, Command, Input OTP, Marker, Message, Message Scroller, Pagination, Questionnaire, Sonner, Table, and Toast.
- Installable Data Table, Date Picker, Form, and Typography compositions with real source and registry contracts.
- Local shadcn registry with a base item, optional TIS theme, and component items.
- Clean Vite consumer smoke test, responsive browser checks, and WCAG A/AA automation.
- Machine-readable component catalog and AI usage guidance.
- Separate Foundations and Tokens references: visual scales for color, typography, spacing, radius, borders, elevation and motion, plus a complete technical token inventory.
- Machine-readable core foundation contract distributed through the shadcn base item and exposed to AI consumers.
- Compact, Comfortable and Spacious density profiles, with Comfortable as the default and shared control scales for height, padding, gap, typography and icons.
- Density controls and complete active-density token reference in the local catalog.
- Integrated customizer for identity, neutral base, brand color, chart palette, body and heading fonts, radius, density and mode, using a live preview of the real components.
- Integrated Fonts + Typeset presets with editable size, leading, flow and measure, a real component preview and portable CSS/registry output.
- Portable customizer outputs for CSS, shadcn `registry:theme` JSON and shareable URLs, backed by `tokens/customizer.json`.
- Four installable `registry:block` application patterns: Dashboard Overview, Login Page, Settings Page and Team Members.
- Installable Chart Recipes bundle with accessible Area, Bar, Line, Pie, Radar and Radial examples.
- Separate human and machine-readable Blocks, Charts and customization documentation.
- Public GitHub Pages distribution for the interactive catalog, shadcn registry, token contracts, schemas, documentation and AI manifest.
- Component-level browser contracts for every catalog specimen plus direct keyboard, form, menu, disclosure, scrolling and semantic coverage across previously untested families.
- First interaction-tested contract wave for 12 high-risk controls and overlays, publishing exact semantics, keyboard outcomes, focus management, composition rules, official upstream references and matching Playwright evidence.
- Second interaction-tested contract wave for 12 form and data-entry components, raising published behavior evidence to 24 of 66 catalog components.
- Third interaction-tested contract wave for 12 disclosure, navigation and overlay components, raising published behavior evidence to 36 of 66 catalog components.
- Fourth interaction-tested contract wave for Attachment, Breadcrumb, Button Group, Chart, Data Table, Message Scroller, Progress, Resizable, Scroll Area, Sonner, Toast and Toggle, raising published behavior evidence to 48 of 66 catalog components.
- Final interaction-tested contract wave for the 18 remaining content, feedback and utility components, completing published behavior evidence for all 66 catalog components.

### Fixed

- Make Separator decorative by default with an explicit structural opt-in, hide Skeleton shapes from assistive technology and align the final 18 specimens with their semantic content contracts.
- Align the fourth-wave catalog specimens with their public contracts: independent Attachment actions, native Button Group actions, named scroll regions, stable live content, accessible chart summaries, actionable toasts and stateful Toggle behavior.
- Remove inherited attachment focus halos, preserve per-control outlines and expose the Scroll Area viewport API required for named keyboard-scrollable regions.
- Forward Toggle Group orientation and merged consumer styles to Base UI so visual direction and roving keyboard focus stay aligned.
- Stop Carousel from intercepting arrow keys in nested controls, preserve consumer click handlers and publish named carousel and slide specimens.
- Replace the Hover Card button specimen with a real destination link and align Menubar groups, Navigation Menu current state and Pagination disabled links with their public contracts.
- Relate Sidebar triggers to generated controlled regions, expose expanded state, ignore repeated global shortcuts and preserve a visible mobile close path.
- Keep Sheet content scroll-reachable at mobile widths and install the positioned-body base rule required by Drawer on iOS Safari.
- Connect visible labels, descriptions and errors across form specimens while preserving native validation, submission and responsive focus order.
- Normalize scalar Slider values to a single indexed thumb and render the library focus outline on the actual focused control.
- Name Date Picker popups, keep serialized values aligned with disabled state and restore trigger focus after selection.
- Propagate invalid state to Input OTP groups and keep a single labeled, autocomplete-aware native input.
- Focus both Input and Textarea controls from Input Group addons and give Combobox clear and chip removal actions stable names.
- Document the narrow behavior-owner exception for official shadcn compositions without introducing a second primitive engine.
- Align the Tooltip specimen with Base UI's visual-only guidance by giving its icon trigger a matching accessible name and keeping the popup supplementary.
- Provide a visible keyboard-operable action menu alongside the Context Menu specimen and a programmatic group name for the Radio Group specimen.
- Upgrade GitHub Pages workflows to current Node 24-based Actions while retaining Node 22 as the library build runtime.
- Restore Calendar arrow-key focus movement by attaching the DayPicker focus ref to each rendered day button.
- Preserve native link semantics in Pagination instead of exposing page navigation links as buttons through the Base UI Button adapter.
- Publish absolute shadcn registry dependency URLs so public installs resolve the base item and composed dependencies correctly.
- Allow the complete 24-state WCAG theme and catalog matrix to finish on slower CI runners without reducing coverage.
- Separate control and surface radius roles so Pill / Full affects controls while cards, panels, dialogs and other containers remain at Large.
- Align the TIS theme and customizer preset with the Default radius option.
- Add a Pill / Full radius option to custom themes and portable presets.
- Replace basic style selects with editable shadcn-style presets for base color, font, corner radius and density.
- Preserve complete focus outlines inside scrolling and clipped containers, including catalog filters, Data Table, Message Scroller and Resizable.
- Keep the first category filter visible when the desktop toolbar needs horizontal scrolling.
- Separate the version-derived `Recently added` release filter from permanent component categories.
- Raise Neutral muted-content contrast above WCAG AA and preserve full-contrast labels in style specimens.
- Replace the combined focus halo and ring with one radius-aware 2px outline at a 2px offset, using brand, error and neutral read-only state colors plus forced-colors support.
