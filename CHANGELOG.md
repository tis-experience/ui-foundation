# Changelog

All notable changes to UI Foundation will be documented in this file.

## [Unreleased]

### Added

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

### Fixed

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
