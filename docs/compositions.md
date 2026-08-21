# Installable compositions

These shadcn patterns are distributed here as real source because this library treats every catalog entry as directly usable. They remain compositions of smaller components rather than new behavior engines.

## Data Table

Install `data-table` to receive a reusable TanStack Table v9 composition plus its Table, Input and Button dependencies.

```bash
npx shadcn@4.18.0 add https://tis-experience.github.io/ui-foundation/r/data-table.json
```

Define columns with `createDataTableColumnHelper`, then render `DataTable`. Enable only the filter and pagination controls the product needs.

- Use `scope="col"` on column headers.
- Set `aria-sort` on the active sortable header.
- Use `Pagination` when results are paged.
- Keep virtualization and server-side data fetching in the consuming application; the registry item does not hide those product decisions.

## Date Picker

Install `date-picker` to receive the controlled or uncontrolled composition of `Button`, `Calendar`, and `Popover`.

```bash
npx shadcn@4.18.0 add https://tis-experience.github.io/ui-foundation/r/date-picker.json
```

```tsx
const [date, setDate] = React.useState<Date | null>(null)

<DatePicker
  value={date}
  onValueChange={(nextDate) => setDate(nextDate ?? null)}
  placeholder="Choose a date"
/>
```

Use a visible field label and state the expected format when the date can also be typed.

## Form

Install `form` for a native form wrapper, `FormBody` based on `FieldGroup`, and responsive `FormActions`. Validation remains native or application-owned.

```bash
npx shadcn@4.18.0 add https://tis-experience.github.io/ui-foundation/r/form.json
```

```tsx
<Form onSubmit={handleSubmit}>
  <FormBody>
    <Field>
      <FieldLabel htmlFor="project-name">Project name</FieldLabel>
      <Input id="project-name" name="projectName" required />
      <FieldDescription>Used in the workspace navigation.</FieldDescription>
    </Field>
  </FormBody>
  <FormActions>
    <Button type="submit">Save</Button>
  </FormActions>
</Form>
```

Keep errors adjacent to their controls and connect them with `aria-describedby`. Validation libraries are application choices, not hidden dependencies of the component library.

## Typography

Install `typography` to receive the token-aware `Typeset` wrapper and its owned CSS, based on shadcn/typeset. Its default rhythm consumes the font, size, leading, flow and measure variables emitted by the integrated customizer.

```bash
npx shadcn@4.18.0 add https://tis-experience.github.io/ui-foundation/r/typography.json
```

```tsx
<Typeset as="article">
  <h1>Release notes</h1>
  <p>Semantic content keeps its native structure and follows the active theme.</p>
</Typeset>
```

Use headings in document order and keep paragraphs, lists, code, quotes and tables semantically correct. `TypesetScroll` is available for wide tables.

Use `density="compact"` or `density="comfortable"` only as a local editorial override. Omitting `density` keeps the component connected to the active theme preset.
