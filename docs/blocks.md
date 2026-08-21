# Installable Blocks

Blocks are complete application patterns distributed as editable source. They are not new component primitives and do not add another token or behavior system.

## Dashboard Overview

```bash
npx shadcn@4.18.0 add https://tis-experience.github.io/ui-foundation/r/dashboard-overview.json
```

Responsive metrics, an accessible adoption chart and a named recent-activity table. Replace example data with application data after installation.

## Login Page

```bash
npx shadcn@4.18.0 add https://tis-experience.github.io/ui-foundation/r/login-page.json
```

Native email and password fields, autocomplete hints, persistent-session choice, password recovery and account request paths. Authentication and error handling remain application-owned.

## Settings Page

```bash
npx shadcn@4.18.0 add https://tis-experience.github.io/ui-foundation/r/settings-page.json
```

Workspace identity, locale and notification preferences in one labelled form. Persistence and authorization remain application-owned.

## Team Members

```bash
npx shadcn@4.18.0 add https://tis-experience.github.io/ui-foundation/r/team-members.json
```

Member identity, status, role and explicitly labelled row actions. Pass real member data and action handlers through the exported props.

Install commands pull every declared UI component dependency through the same local registry. Use `registry/catalog.json` or `public/ai/manifest.json` to inspect dependencies and exports before adapting a Block.
