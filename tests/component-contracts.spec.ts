import { expect, test, type Locator, type Page } from "@playwright/test"

function component(page: Page, name: string) {
  return page.locator(`article.component-row[id="${name}"]`)
}

async function expectFocusInside(container: Locator) {
  await expect
    .poll(() => container.evaluate((element) => element.contains(document.activeElement)))
    .toBe(true)
}

test.beforeEach(async ({ page }) => {
  await page.goto("/#components")
})

test.describe("contract: accordion", () => {
  test("connects headings and panels while keeping trigger focus", async ({ page }) => {
    const row = component(page, "accordion")
    const overview = row.getByRole("button", { name: "What does source-first mean?" })
    const engine = row.getByRole("button", { name: "Where does behavior come from?" })

    await expect(row.getByRole("heading", { level: 3, name: "What does source-first mean?" })).toBeVisible()
    await expect(overview).toHaveAttribute("aria-expanded", "true")
    const panelId = await overview.getAttribute("aria-controls")
    expect(panelId).toBeTruthy()
    await expect(page.locator(`#${panelId}`)).toBeVisible()

    await overview.focus()
    await overview.press("Space")
    await expect(overview).toHaveAttribute("aria-expanded", "false")
    await expect(overview).toBeFocused()
    await overview.press("Enter")
    await expect(page.locator(`#${panelId}`)).toBeVisible()
    await expect(overview).toBeFocused()
    await overview.press("Tab")
    await expect(engine).toBeFocused()
  })
})

test.describe("contract: alert", () => {
  test("separates advisory status from urgent alert semantics", async ({ page }) => {
    const row = component(page, "alert")
    const advisory = row.getByRole("status")
    const urgent = row.getByRole("alert")

    await expect(advisory).toContainText("Ready to install")
    await expect(urgent).toContainText("Review required")
    await expect(row.getByRole("alert")).toHaveCount(1)
    await expect(row.getByRole("button", { name: "Review" })).toBeEnabled()
    await expect(advisory).not.toHaveAttribute("tabindex")
  })
})

test.describe("contract: alert-dialog", () => {
  test("labels, constrains focus and restores the trigger", async ({ page }) => {
    const trigger = component(page, "alert-dialog").getByRole("button", {
      name: "Delete project",
    })
    await trigger.focus()
    await trigger.press("Enter")

    const dialog = page.getByRole("alertdialog", { name: "Delete this project?" })
    await expect(dialog).toBeVisible()
    await expect(dialog).toHaveAccessibleDescription("This action cannot be undone.")
    await expect(page.getByRole("button", { name: "Cancel", exact: true })).toBeFocused()
    await page.keyboard.press("Shift+Tab")
    await expectFocusInside(dialog)
    await page.keyboard.press("Escape")
    await expect(trigger).toBeFocused()
  })
})

test.describe("contract: aspect-ratio", () => {
  test("constrains layout while the hosted figure owns semantics", async ({ page }) => {
    const row = component(page, "aspect-ratio")
    const figure = row.getByRole("figure", { name: "Widescreen component preview" })
    const ratio = row.locator('[data-slot="aspect-ratio"]')

    await expect(figure).toBeVisible()
    const dimensions = await ratio.evaluate((element) => ({
      height: element.getBoundingClientRect().height,
      width: element.getBoundingClientRect().width,
    }))
    expect(dimensions.width / dimensions.height).toBeCloseTo(16 / 9, 1)
    await expect(ratio).not.toHaveAttribute("tabindex")
  })
})

test.describe("contract: attachment", () => {
  test("keeps the card trigger and file action independently operable", async ({ page }) => {
    const row = component(page, "attachment")
    const remove = row.getByRole("button", { name: "Remove component-spec.pdf" })
    const preview = row.getByRole("button", { name: "Preview component-spec.pdf" })
    const status = row.locator("[data-contract-status]")

    await remove.focus()
    await remove.press("Space")
    await expect(status).toHaveText("Attachment removed")
    await expect(remove).toBeFocused()
    await remove.press("Tab")
    await expect(preview).toBeFocused()
    await preview.press("Enter")
    await expect(status).toHaveText("Attachment preview opened")

    const containerShadow = await row.locator('[data-slot="attachment"]').evaluate(
      (element) => getComputedStyle(element).boxShadow
    )
    expect(containerShadow).toBe("none")
  })
})

test.describe("contract: avatar", () => {
  test("names informative people and contextualizes group overflow", async ({ page }) => {
    const group = component(page, "avatar").getByRole("group", { name: "Project members" })

    await expect(group.getByRole("img", { name: "Ana Martins" })).toBeVisible()
    await expect(group.getByRole("img", { name: "João Silva" })).toBeVisible()
    await expect(group.getByRole("img", { name: "Rita Kiala" })).toBeVisible()
    await expect(group).toContainText("+4")
    await expect(group.getByRole("button")).toHaveCount(0)
  })
})

test.describe("contract: badge", () => {
  test("keeps labels passive and adds status semantics only to actual state", async ({ page }) => {
    const row = component(page, "badge")
    const specimen = row.locator(".component-specimen")

    await expect(specimen.getByText("Default", { exact: true })).toBeVisible()
    await expect(specimen.getByRole("status")).toHaveText("Blocked")
    await expect(specimen.getByRole("button")).toHaveCount(0)
  })
})

test.describe("contract: breadcrumb", () => {
  test("exposes a named path with native links and one current page", async ({ page }) => {
    const row = component(page, "breadcrumb")
    const navigation = row.getByRole("navigation", { name: "breadcrumb" })

    await expect(navigation.locator("ol")).toBeVisible()
    await expect(navigation.getByRole("link", { name: "Library" })).toHaveAttribute("href", "#top")
    await expect(navigation.getByRole("link", { name: "Components" })).toHaveAttribute("href", "#components")
    await expect(navigation.getByRole("link", { name: "Breadcrumb" })).toHaveAttribute("aria-current", "page")
    await expect(navigation.locator('[data-slot="breadcrumb-separator"]')).toHaveCount(2)
    await expect(navigation.locator('[data-slot="breadcrumb-separator"]').first()).toHaveAttribute("aria-hidden", "true")
  })
})

test.describe("contract: bubble", () => {
  test("exposes a named chronological conversation with speaker context", async ({ page }) => {
    const log = component(page, "bubble").getByRole("log", { name: "Theme support conversation" })
    const messages = log.getByRole("article")

    await expect(messages).toHaveCount(2)
    await expect(messages.nth(0)).toHaveAccessibleName("Question from developer")
    await expect(messages.nth(1)).toHaveAccessibleName("Answer from UI Foundation")
    await expect(messages.nth(0)).toContainText("Can I use the neutral theme?")
    await expect(messages.nth(1)).toContainText("The TIS identity is optional")
  })
})

test.describe("contract: button", () => {
  test("exposes native semantics and one activation per key", async ({ page }) => {
    const button = component(page, "button").getByRole("button", { name: "Primary" })
    await button.evaluate((element) => {
      element.dataset.contractActivations = "0"
      element.addEventListener("click", () => {
        element.dataset.contractActivations = String(
          Number(element.dataset.contractActivations) + 1
        )
      })
    })

    await button.focus()
    await button.press("Enter")
    await expect(button).toHaveAttribute("data-contract-activations", "1")
    await button.press("Space")
    await expect(button).toHaveAttribute("data-contract-activations", "2")
    await expect(button).toBeFocused()
  })
})

test.describe("contract: button-group", () => {
  test("groups independent native actions without roving selection", async ({ page }) => {
    const row = component(page, "button-group")
    const group = row.getByRole("group", { name: "Document actions" })
    const archive = group.getByRole("button", { name: "Archive" })
    const report = group.getByRole("button", { name: "Report" })

    await expect(group).toHaveAttribute("data-orientation", "horizontal")
    await expect(group.getByRole("button")).toHaveCount(3)
    await archive.focus()
    await archive.press("Enter")
    await expect(row.locator("[data-contract-status]")).toHaveText("Document archived")
    await archive.press("Tab")
    await expect(report).toBeFocused()
    await expect(archive).not.toHaveAttribute("aria-pressed", /.+/)
  })
})

test.describe("contract: calendar", () => {
  test("moves focus and commits the selected date from the keyboard", async ({ page }) => {
    const row = component(page, "calendar")
    const selectedDate = row.getByRole("button", {
      name: /Thursday, August 20th, 2026, selected/,
    })
    await selectedDate.focus()
    await selectedDate.press("ArrowRight")

    const nextDate = row.getByRole("button", {
      name: /Friday, August 21st, 2026/,
    })
    await expect(nextDate).toBeFocused()
    await nextDate.press("Enter")
    await expect(nextDate).toHaveAccessibleName(/selected/)
    await expect(nextDate).toBeFocused()
  })
})

test.describe("contract: card", () => {
  test("names a standalone region from a contextual heading", async ({ page }) => {
    const card = component(page, "card").getByRole("region", { name: "Component ownership" })

    await expect(card.getByRole("heading", { level: 4, name: "Component ownership" })).toBeVisible()
    await expect(card).toContainText("Source code remains in your project")
    const action = card.getByRole("button", { name: "View source" })
    await action.focus()
    await expect(action).toBeFocused()
    await expect(card).not.toHaveAttribute("tabindex")
  })
})

test.describe("contract: carousel", () => {
  test("names slides, preserves nested arrow keys and keeps control focus", async ({ page }) => {
    const row = component(page, "carousel")
    const carousel = row.getByRole("region", { name: "Featured components" })
    await expect(carousel.getByRole("group", { name: "1 of 3" })).toBeVisible()
    await expect(carousel.getByRole("group", { name: "2 of 3" })).toBeAttached()
    await expect(carousel.getByRole("group", { name: "3 of 3" })).toBeAttached()

    const previous = carousel.getByRole("button", { name: "Previous slide" })
    const next = carousel.getByRole("button", { name: "Next slide" })
    await expect(previous).toBeDisabled()

    const nestedInput = carousel.locator("input[data-carousel-contract]")
    await carousel.getByRole("group", { name: "1 of 3" }).evaluate((slide) => {
      const input = document.createElement("input")
      input.dataset.carouselContract = "true"
      input.setAttribute("aria-label", "Slide value")
      slide.append(input)
    })
    await nestedInput.focus()
    await nestedInput.press("ArrowRight")
    await expect(previous).toBeDisabled()

    await next.focus()
    await next.press("Enter")
    await expect(previous).toBeEnabled()
    await expect(next).toBeFocused()
    await next.press("Space")
    await expect(next).toBeDisabled()
  })
})

test.describe("contract: chart", () => {
  test("provides a named graphic and a concise textual trend summary", async ({ page }) => {
    const chart = component(page, "chart").getByRole("img", {
      name: "Monthly component installs",
    })

    await expect(chart).toHaveAccessibleDescription(
      "Installs increased each month from 86 in May to 212 in August."
    )
    await expect(chart.locator(".recharts-wrapper")).toBeVisible()
    await expect(chart.locator(".recharts-bar-rectangle")).toHaveCount(4)
  })
})

test.describe("contract: checkbox", () => {
  test("uses its visible label and toggles with Space", async ({ page }) => {
    const checkbox = component(page, "checkbox").getByRole("checkbox", {
      name: "Include optional theme preset",
    })
    await expect(checkbox).toBeChecked()
    await checkbox.focus()
    await checkbox.press("Space")
    await expect(checkbox).not.toBeChecked()
    await expect(checkbox).toBeFocused()
  })
})

test.describe("contract: collapsible", () => {
  test("toggles its related panel without adding a wrapper tab stop", async ({ page }) => {
    const row = component(page, "collapsible")
    const trigger = row.getByRole("button", { name: "Package details" })
    const panelId = await trigger.getAttribute("aria-controls")
    expect(panelId).toBeTruthy()
    const panel = page.locator(`#${panelId}`)

    await expect(trigger).toHaveAttribute("aria-expanded", "true")
    await expect(panel).toBeVisible()
    await trigger.focus()
    await trigger.press("Space")
    await expect(trigger).toHaveAttribute("aria-expanded", "false")
    await expect(trigger).toBeFocused()
    await trigger.press("Enter")
    await expect(panel).toBeVisible()
    await expect(trigger).toBeFocused()
    await expect(row.locator('[data-slot="collapsible"]')).not.toHaveAttribute("tabindex", /0/)
    await expect(row.locator('[data-slot="collapsible-content"]')).not.toHaveAttribute("tabindex", /0/)
  })
})

test.describe("contract: combobox", () => {
  test("filters, commits and clears while keeping input focus", async ({ page }) => {
    const row = component(page, "combobox")
    const input = row.getByRole("combobox", {
      name: "Team",
    })
    await row.getByRole("button", { name: "Clear selection" }).click()
    await expect(input).toHaveValue("")
    await expect(input).toBeFocused()

    await input.focus()
    await input.fill("Eng")
    await expect(page.getByRole("option", { name: "Engineering" })).toBeVisible()
    await input.press("ArrowDown")
    await input.press("Enter")
    await expect(input).toHaveValue("Engineering")
    await expect(input).toBeFocused()

    await row.getByRole("button", { name: "Clear selection" }).click()
    await expect(input).toHaveValue("")
    await expect(input).toBeFocused()
  })
})

test.describe("contract: command", () => {
  test("filters and executes the active command while input focus remains", async ({ page }) => {
    const row = component(page, "command")
    const input = row.getByRole("combobox", { name: "Search commands" })
    await input.focus()
    await input.fill("copy")
    const copyCommand = row.getByRole("option", { name: /Copy install command/ })
    await expect(copyCommand).toBeVisible()
    await input.press("ArrowDown")
    await expect(copyCommand).toHaveAttribute("aria-selected", "true")
    await expect(input).toBeFocused()
    await input.press("Enter")
    await expect(row.getByText("Copy install command executed", { exact: true })).toBeVisible()
    await expect(input).toBeFocused()

    await input.fill("not available")
    await expect(row.getByText("No command found.", { exact: true })).toBeVisible()
  })
})

test.describe("contract: context-menu", () => {
  test("supplements an equivalent visible keyboard menu", async ({ page }) => {
    const row = component(page, "context-menu")
    const visibleTrigger = row.getByRole("button", { name: "Actions" })
    await visibleTrigger.focus()
    await visibleTrigger.press("ArrowDown")
    await expect(page.getByRole("menuitem", { name: "Open", exact: true })).toBeFocused()
    await page.keyboard.press("Escape")
    await expect(visibleTrigger).toBeFocused()

    await row.getByText("Right-click this area", { exact: true }).click({ button: "right" })
    await expect(page.getByRole("menuitem", { name: "Duplicate ⌘D" })).toBeVisible()
    await page.keyboard.press("Escape")
  })
})

test.describe("contract: date-picker", () => {
  test("commits a date, serializes it and restores trigger focus", async ({ page }) => {
    const row = component(page, "date-picker")
    const trigger = row.locator('[data-slot="popover-trigger"]')
    await expect(trigger).toHaveAccessibleName("Release date")
    await trigger.focus()
    await trigger.press("Enter")

    const dialog = page.getByRole("dialog", { name: "Choose a release date" })
    await expect(dialog).toBeVisible()
    const selectedDate = dialog.getByRole("button", {
      name: /Thursday, August 20th, 2026, selected/,
    })
    await expect(selectedDate).toBeFocused()
    await selectedDate.press("ArrowRight")
    const nextDate = dialog.getByRole("button", {
      name: /Friday, August 21st, 2026/,
    })
    await nextDate.press("Enter")

    await expect(dialog).toBeHidden()
    await expect(trigger).toContainText("2026-08-21")
    await expect(row.locator('input[type="hidden"][name="releaseDate"]')).toHaveValue("2026-08-21")
    await expect(trigger).toBeFocused()
  })
})

test.describe("contract: data-table", () => {
  test("sorts, filters and paginates through named native controls", async ({ page }) => {
    const row = component(page, "data-table")
    const table = row.getByRole("table", { name: "Installable components" })
    const componentHeader = table.getByRole("columnheader", { name: "Component" })
    const sort = componentHeader.getByRole("button", { name: "Component" })

    await expect(componentHeader).toHaveAttribute("aria-sort", "none")
    await sort.focus()
    await sort.press("Enter")
    await expect(componentHeader).toHaveAttribute("aria-sort", "ascending")
    await expect(sort).toBeFocused()

    const filter = row.getByRole("textbox", { name: "Filter components" })
    await filter.fill("Table")
    await expect(table.getByRole("row")).toHaveCount(2)
    await expect(table).toContainText("Table")
    await expect(row.getByText("1 results")).toBeVisible()
    await expect(row.getByRole("button", { name: "Go to previous page" })).toBeDisabled()
    await expect(row.getByRole("button", { name: "Go to next page" })).toBeDisabled()
  })
})

test.describe("contract: dialog", () => {
  test("labels, constrains focus and restores the trigger", async ({ page }) => {
    const trigger = component(page, "dialog").getByRole("button", {
      name: "Open dialog",
    })
    await trigger.focus()
    await trigger.press("Space")

    const dialog = page.getByRole("dialog", { name: "Install component" })
    await expect(dialog).toBeVisible()
    await expect(dialog).toHaveAccessibleDescription(
      "The source and required dependencies will be added to your project."
    )
    await expect(page.getByRole("button", { name: "Install", exact: true })).toBeFocused()
    await page.keyboard.press("Tab")
    await expectFocusInside(dialog)
    await page.keyboard.press("Escape")
    await expect(trigger).toBeFocused()
  })
})

test.describe("contract: direction", () => {
  test("applies RTL visually while preserving logical DOM and tab order", async ({ page }) => {
    const group = component(page, "direction").getByRole("group", { name: "RTL example" })
    const first = group.getByRole("button", { name: "الأول" })
    const next = group.getByRole("button", { name: "التالي" })

    await expect(group).toHaveAttribute("dir", "rtl")
    await expect(group.getByRole("button").nth(0)).toHaveText("الأول")
    await first.focus()
    await first.press("Tab")
    await expect(next).toBeFocused()
  })
})

test.describe("contract: drawer", () => {
  test("traps focus and supports keyboard dismissal without swipe", async ({ page }) => {
    const trigger = component(page, "drawer").getByRole("button", { name: "Open drawer" })
    await trigger.focus()
    await trigger.press("Enter")

    const dialog = page.getByRole("dialog", { name: "Install component" })
    await expect(dialog).toBeVisible()
    await expect(dialog).toHaveAccessibleDescription("Review the source files before adding them.")
    await expectFocusInside(dialog)
    await page.keyboard.press("Tab")
    await expectFocusInside(dialog)
    await page.keyboard.press("Escape")
    await expect(trigger).toBeFocused()

    await trigger.press("Space")
    const cancel = page.getByRole("button", { name: "Cancel", exact: true })
    await cancel.focus()
    await cancel.press("Space")
    await expect(dialog).toBeHidden()
    await expect(trigger).toBeFocused()
  })
})

test.describe("contract: dropdown-menu", () => {
  test("opens from the keyboard, navigates items and restores focus", async ({ page }) => {
    const trigger = component(page, "dropdown-menu").getByRole("button", {
      name: "Open menu",
    })
    await trigger.focus()
    await trigger.press("ArrowDown")
    await expect(page.getByRole("menuitem", { name: "Open", exact: true })).toBeFocused()
    await page.keyboard.press("End")
    await expect(page.getByRole("menuitem", { name: "Delete", exact: true })).toBeFocused()
    await page.keyboard.press("Escape")
    await expect(trigger).toBeFocused()
  })
})

test.describe("contract: empty", () => {
  test("connects heading, description and a keyboard recovery action", async ({ page }) => {
    const row = component(page, "empty")
    const region = row.getByRole("region", { name: "No components selected" })
    const action = region.getByRole("button", { name: "Browse components" })

    await expect(region.getByRole("heading", { level: 4 })).toHaveText("No components selected")
    await expect(region).toContainText("Choose a component to add it to the project")
    await expect(region.locator('[data-slot="empty-icon"] svg')).toHaveAttribute("aria-hidden", "true")
    await action.focus()
    await action.press("Enter")
    await expect(row.locator("[data-contract-status]")).toHaveText("Component browser opened")
  })
})

test.describe("contract: field", () => {
  test("connects label, description and error without adding a tab stop", async ({ page }) => {
    const row = component(page, "field")
    const input = row.getByRole("textbox", { name: "Project name" })
    await expect(input).toHaveAccessibleDescription(
      "Used in the generated package metadata. Project name is required."
    )
    await expect(input).toHaveAttribute("aria-invalid", "true")
    await expect(row.getByRole("alert")).toHaveText("Project name is required.")
    await row.getByText("Project name", { exact: true }).click()
    await expect(input).toBeFocused()
  })
})

test.describe("contract: form", () => {
  test("preserves native validation, submission and focus order", async ({ page }) => {
    const form = component(page, "form").getByRole("form", {
      name: "Project settings",
    })
    const input = form.getByRole("textbox", { name: "Project name" })
    await form.evaluate((element) => {
      element.dataset.contractSubmissions = "0"
      element.addEventListener("submit", () => {
        element.dataset.contractSubmissions = String(
          Number(element.dataset.contractSubmissions) + 1
        )
      })
    })

    await input.focus()
    await input.press("Enter")
    await expect(form).toHaveAttribute("data-contract-submissions", "0")
    await expect(input).toBeFocused()

    await input.fill("Customer portal")
    await input.press("Enter")
    await expect(form).toHaveAttribute("data-contract-submissions", "1")

    await page.setViewportSize({ width: 320, height: 900 })
    await input.focus()
    await page.keyboard.press("Tab")
    await expect(form.getByRole("button", { name: "Reset" })).toBeFocused()
    await page.keyboard.press("Tab")
    await expect(form.getByRole("button", { name: "Save project" })).toBeFocused()
  })
})

test.describe("contract: hover-card", () => {
  test("previews a real link without moving focus into the popup", async ({ page }) => {
    const row = component(page, "hover-card")
    const trigger = row.getByRole("link", { name: "@ui-foundation" })
    await expect(trigger).toHaveAttribute("href", "#components")
    await trigger.focus()

    const popup = page.locator('[data-slot="hover-card-content"]')
    await expect(popup).toBeVisible()
    await expect(popup).not.toHaveAttribute("role", "dialog")
    await expect(popup).not.toHaveAttribute("role", "tooltip")
    await expect(trigger).toBeFocused()
    await page.keyboard.press("Escape")
    await expect(popup).toBeHidden()
    await expect(trigger).toBeFocused()
  })
})

test.describe("contract: input", () => {
  test("edits natively and remains focusable but immutable when read-only", async ({ page }) => {
    const input = component(page, "input").getByRole("textbox", {
      name: "Example input",
    })
    await input.focus()
    await input.fill("Foundation")
    await input.press("Backspace")
    await expect(input).toHaveValue("Foundatio")

    await input.evaluate((element: HTMLInputElement) => {
      element.readOnly = true
    })
    await input.pressSequentially("X")
    await expect(input).toHaveValue("Foundatio")
    await expect(input).toBeFocused()
  })
})

test.describe("contract: input-group", () => {
  test("keeps one named control and focuses input or textarea from addons", async ({ page }) => {
    const row = component(page, "input-group")
    const input = row.getByRole("textbox", { name: "Search documentation" })
    const textarea = row.getByRole("textbox", { name: "Review notes" })

    await row.locator('[data-slot="input-group-addon"]').first().click()
    await expect(input).toBeFocused()
    await input.fill("Dialog")
    await expect(input).toHaveValue("Dialog")

    await row.getByText("Note", { exact: true }).click()
    await expect(textarea).toBeFocused()
    await textarea.fill("Keyboard behavior")
    await expect(textarea).toHaveValue("Keyboard behavior")
  })
})

test.describe("contract: input-otp", () => {
  test("uses one real input for typing, paste semantics and invalid slots", async ({ page }) => {
    const row = component(page, "input-otp")
    const input = row.getByRole("textbox", { name: "Verification code" })
    await expect(row.getByRole("textbox")).toHaveCount(1)
    await expect(input).toHaveAttribute("autocomplete", "one-time-code")
    await expect(input).toHaveAttribute("aria-invalid", "true")
    await expect(row.locator('[data-slot="input-otp-group"][data-invalid="true"]')).toHaveCount(2)

    await input.focus()
    await input.fill("654321")
    await expect(input).toHaveValue("654321")
    await input.press("Backspace")
    await expect(input).toHaveValue("65432")
    await expect(input).toBeFocused()
  })
})

test.describe("contract: item", () => {
  test("names standalone content and keeps its action independently operable", async ({ page }) => {
    const row = component(page, "item")
    const article = row.getByRole("article", { name: "Registry connected" })
    const action = article.getByRole("button", { name: "Inspect" })

    await expect(article.getByRole("heading", { level: 4 })).toHaveText("Registry connected")
    await expect(article).toContainText("Component source can be installed locally")
    await expect(article.locator('[data-slot="item-media"] svg')).toHaveAttribute("aria-hidden", "true")
    await action.focus()
    await action.press("Space")
    await expect(row.locator("[data-contract-status]")).toHaveText("Registry details opened")
  })
})

test.describe("contract: kbd", () => {
  test("uses native keycap markup next to the command meaning", async ({ page }) => {
    const row = component(page, "kbd")
    const specimen = row.locator(".component-specimen")
    const keys = specimen.locator("kbd")

    await expect(specimen).toContainText("Open search")
    await expect(keys).toHaveCount(2)
    await expect(keys.nth(0)).toHaveText("⌘")
    await expect(keys.nth(1)).toHaveText("K")
    await expect(specimen.getByRole("button")).toHaveCount(0)
  })
})

test.describe("contract: label", () => {
  test("binds visible text to one control and transfers focus on activation", async ({ page }) => {
    const row = component(page, "label")
    const label = row.getByText("Visible label", { exact: true })
    const input = row.getByRole("textbox", { name: "Visible label" })

    await expect(label).toHaveAttribute("for")
    await label.click()
    await expect(input).toBeFocused()
  })
})

test.describe("contract: marker", () => {
  test("keeps status meaningful without decorative icon or separator", async ({ page }) => {
    const marker = component(page, "marker").getByRole("status")

    await expect(marker).toHaveText(/12 components validated/)
    await expect(marker.locator('[data-slot="marker-icon"]')).toHaveAttribute("aria-hidden", "true")
    await expect(marker).not.toHaveAttribute("tabindex")
  })
})

test.describe("contract: menubar", () => {
  test("uses roving trigger focus and restores the active trigger", async ({ page }) => {
    const row = component(page, "menubar")
    const file = row.getByRole("menuitem", { name: "File" })
    const edit = row.getByRole("menuitem", { name: "Edit" })

    await file.focus()
    await file.press("ArrowRight")
    await expect(edit).toBeFocused()
    await edit.press("ArrowLeft")
    await expect(file).toBeFocused()
    await file.press("ArrowDown")
    await expect(page.getByRole("menuitem", { name: /^New file/ })).toBeFocused()
    await page.keyboard.press("End")
    await expect(page.getByRole("menuitem", { name: "Close", exact: true })).toBeFocused()
    await page.keyboard.press("Escape")
    await expect(file).toBeFocused()
  })
})

test.describe("contract: message", () => {
  test("exposes sender, content and delivery state as one named article", async ({ page }) => {
    const article = component(page, "message").getByRole("article", {
      name: "Message from UI Foundation",
    })

    await expect(article).toContainText("UI Foundation")
    await expect(article).toContainText("The component is ready to install")
    await expect(article).toContainText("Delivered")
    await expect(article.getByRole("button")).toHaveCount(0)
  })
})

test.describe("contract: message-scroller", () => {
  test("names the transcript and offers a keyboard scroll-to-end control", async ({ page }) => {
    const row = component(page, "message-scroller")
    const log = row.getByRole("log", { name: "Component conversation" })
    const viewport = row.locator('[data-slot="message-scroller-viewport"]')
    const toEnd = row.getByRole("button", { name: "Scroll to end" })

    await expect(log.locator('[data-slot="message-scroller-item"]')).toHaveCount(4)
    await expect(log).toHaveAttribute("aria-live", "polite")
    await expect(toEnd).toBeEnabled()
    await toEnd.focus()
    await toEnd.press("Enter")
    await expect.poll(() => viewport.evaluate((element) => element.scrollTop)).toBeGreaterThan(0)
    await expect(viewport).toBeFocused()
  })
})

test.describe("contract: native-select", () => {
  test("uses its visible label and native keyboard selection", async ({ page }) => {
    const select = component(page, "native-select").getByRole("combobox", {
      name: "Release channel",
    })
    await select.focus()
    await select.press("p")
    await expect(select).toHaveValue("preview")
    await expect(select).toBeFocused()
  })
})

test.describe("contract: navigation-menu", () => {
  test("names the landmark, traverses top-level items and restores the trigger", async ({ page }) => {
    const navigation = component(page, "navigation-menu").getByRole("navigation", { name: "Primary" })
    const trigger = navigation.getByRole("button", { name: "Components" })
    const themes = navigation.getByRole("link", { name: "Themes" })
    await trigger.focus()
    await trigger.press("ArrowRight")
    await expect(themes).toBeFocused()
    await themes.press("ArrowLeft")
    await expect(trigger).toBeFocused()

    await trigger.press("Enter")
    const current = page.getByRole("link", { name: "Browse catalog" })
    await expect(current).toBeVisible()
    await expect(current).toHaveAttribute("aria-current", "page")
    await expect(current).toBeFocused()
    await current.press("ArrowDown")
    await expect(page.getByRole("link", { name: "Installation" })).toBeFocused()
    await page.keyboard.press("Escape")
    await expect(trigger).toBeFocused()
  })
})

test.describe("contract: pagination", () => {
  test("uses native destinations, one current page and a disabled previous link", async ({ page }) => {
    const navigation = component(page, "pagination").getByRole("navigation", { name: "Component pages" })
    const previous = navigation.locator('[aria-label="Go to previous page"]')
    await expect(previous).toHaveAttribute("aria-disabled", "true")
    await expect(previous).not.toHaveAttribute("href")
    await expect(previous).toHaveAttribute("tabindex", "-1")
    await expect(navigation.locator('[aria-current="page"]')).toHaveCount(1)
    await expect(navigation.locator('[data-slot="pagination-ellipsis"]')).toHaveAttribute("aria-hidden", "true")

    const pageTwo = navigation.getByRole("link", { name: "Page 2" })
    await pageTwo.focus()
    await pageTwo.press("Enter")
    await expect(page).toHaveURL(/#page-2$/)
  })
})

test.describe("contract: popover", () => {
  test("exposes dialog semantics and restores focus on Escape", async ({ page }) => {
    const trigger = component(page, "popover").getByRole("button", {
      name: "Open popover",
    })
    await trigger.focus()
    await trigger.press("Enter")
    await expect(trigger).toHaveAttribute("aria-expanded", "true")
    await expect(page.getByRole("dialog", { name: "Theme preset" })).toBeVisible()
    await page.keyboard.press("Escape")
    await expect(trigger).toHaveAttribute("aria-expanded", "false")
    await expect(trigger).toBeFocused()
  })
})

test.describe("contract: progress", () => {
  test("connects the visible label and determinate value", async ({ page }) => {
    const progress = component(page, "progress").getByRole("progressbar", {
      name: "Installation",
    })

    await expect(progress).toHaveAttribute("aria-valuemin", "0")
    await expect(progress).toHaveAttribute("aria-valuemax", "100")
    await expect(progress).toHaveAttribute("aria-valuenow", "68")
    await expect(progress).toContainText("68%")
    await expect(progress.locator('[data-slot="progress-indicator"]')).toHaveAttribute("data-progressing", "")
  })
})

test.describe("contract: questionnaire", () => {
  test("validates, advances, preserves answers and submits from the keyboard", async ({ page }) => {
    const form = component(page, "questionnaire").getByRole("form", {
      name: "Identity setup",
    })
    const progress = form.getByRole("progressbar")
    const next = form.getByRole("button", { name: "Next" })

    await expect(progress).toHaveAttribute("aria-valuenow", "1")
    await next.click()
    await expect(form.getByRole("alert")).toBeVisible()

    const neutral = form.getByRole("radio", { name: "Neutral" })
    await expect(neutral).toBeFocused()
    await page.keyboard.press("2")
    const tis = form.getByRole("radio", { name: "TIS" })
    await expect(tis).toBeChecked()
    await expect(tis).toBeFocused()
    await tis.press("Enter")

    await expect(progress).toHaveAttribute("aria-valuenow", "2")
    const presetItem = form.locator('[data-slot="questionnaire-item"][data-active]')
    await expect(presetItem).toContainText("Name the preset")
    await expect(presetItem).toBeFocused()
    const presetName = form.getByRole("textbox", { name: "Name the preset" })

    await form.getByRole("button", { name: "Previous" }).click()
    await expect(tis).toBeChecked()
    await tis.press("Enter")
    await expect(presetItem).toBeFocused()

    await form.evaluate((element) => {
      element.dataset.contractSubmissions = "0"
      element.addEventListener("submit", () => {
        element.dataset.contractSubmissions = String(
          Number(element.dataset.contractSubmissions) + 1
        )
      })
    })
    await presetName.fill("TIS digital")
    await presetName.press("Control+Enter")
    await expect(form).toHaveAttribute("data-contract-submissions", "1")
  })
})

test.describe("contract: radio-group", () => {
  test("labels the group and moves selection with arrow keys", async ({ page }) => {
    const group = component(page, "radio-group").getByRole("radiogroup", {
      name: "Distribution",
    })
    const source = group.getByRole("radio", { name: "Source files" })
    const packageOption = group.getByRole("radio", { name: "Package" })
    await expect(source).toBeChecked()
    await source.focus()
    await source.press("ArrowDown")
    await expect(packageOption).toBeChecked()
    await expect(packageOption).toBeFocused()
  })
})

test.describe("contract: resizable", () => {
  test("exposes a keyboard adjustable separator and visible focus", async ({ page }) => {
    const row = component(page, "resizable")
    const separator = row.getByRole("separator")
    const initialValue = await separator.getAttribute("aria-valuenow")

    await expect(separator).toHaveAttribute("aria-valuemin")
    await expect(separator).toHaveAttribute("aria-valuemax")
    await separator.focus()
    await separator.press("ArrowRight")
    await expect.poll(() => separator.getAttribute("aria-valuenow")).not.toBe(initialValue)
    await expect(separator).toBeFocused()

    const focusStyle = await row.locator('[data-slot="resizable-panel-group"]').evaluate((element) => {
      const style = getComputedStyle(element)
      return { offset: style.outlineOffset, style: style.outlineStyle, width: style.outlineWidth }
    })
    expect(focusStyle).toEqual({ offset: "2px", style: "solid", width: "2px" })
  })
})

test.describe("contract: scroll-area", () => {
  test("keeps a named native scroll viewport keyboard operable", async ({ page }) => {
    const viewport = component(page, "scroll-area").getByRole("region", {
      name: "Component list",
    })

    const overflow = await viewport.evaluate((element) => ({
      clientHeight: element.clientHeight,
      scrollHeight: element.scrollHeight,
    }))
    expect(overflow.scrollHeight).toBeGreaterThan(overflow.clientHeight)
    await viewport.focus()
    await viewport.press("PageDown")
    await expect.poll(() => viewport.evaluate((element) => element.scrollTop)).toBeGreaterThan(0)
    await expect(viewport).toBeFocused()
  })
})

test.describe("contract: select", () => {
  test("opens, navigates and commits an option from the keyboard", async ({ page }) => {
    const select = component(page, "select").getByRole("combobox", { name: "Team" })
    await select.focus()
    await select.press("ArrowDown")
    await expect(select).toHaveAttribute("aria-expanded", "true")
    await page.keyboard.press("ArrowDown")
    await expect(page.getByRole("option", { name: "Engineering" })).toBeFocused()
    await page.keyboard.press("Enter")
    await expect(select).toContainText("Engineering")
    await expect(select).toBeFocused()
  })
})

test.describe("contract: separator", () => {
  test("distinguishes one structural divider from a decorative divider", async ({ page }) => {
    const row = component(page, "separator")
    const structural = row.getByRole("separator")
    const decorative = row.locator('[data-slot="separator"][aria-hidden="true"]')

    await expect(structural).toHaveAttribute("aria-orientation", "horizontal")
    await expect(structural).not.toHaveAttribute("tabindex")
    await expect(decorative).toHaveCount(1)
    await expect(decorative).toHaveAttribute("role", "presentation")
  })
})

test.describe("contract: sheet", () => {
  test("keeps close paths reachable at mobile width and restores the trigger", async ({ page }) => {
    await page.setViewportSize({ width: 320, height: 568 })
    const trigger = component(page, "sheet").getByRole("button", { name: "Open sheet" })
    await trigger.focus()
    await trigger.press("Space")

    const dialog = page.getByRole("dialog", { name: "Component settings" })
    await expect(dialog).toBeVisible()
    await expect(dialog).toHaveAccessibleDescription("Configure the local source before installation.")
    await expectFocusInside(dialog)
    await expect.poll(async () => {
      const box = await dialog.boundingBox()
      return box ? { left: Math.round(box.x), right: Math.round(box.x + box.width) } : null
    }).toEqual({ left: 80, right: 320 })
    const close = dialog.getByRole("button", { name: "Close" })
    await expect(close).toBeVisible()
    await close.click()
    await expect(trigger).toBeFocused()

    await trigger.press("Enter")
    await page.keyboard.press("Escape")
    await expect(trigger).toBeFocused()
  })
})

test.describe("contract: sidebar", () => {
  test("relates its trigger, current destination and responsive mobile dialog", async ({ page }) => {
    const row = component(page, "sidebar")
    const navigation = row.getByRole("navigation", { name: "Component catalog" })
    const current = navigation.getByRole("link", { name: "Components" })
    await expect(current).toHaveAttribute("aria-current", "page")

    const trigger = row.getByRole("button", { name: "Toggle Sidebar" })
    const controlledId = await trigger.getAttribute("aria-controls")
    expect(controlledId).toBeTruthy()
    await expect(page.locator(`#${controlledId}`)).toBeAttached()
    await expect(trigger).toHaveAttribute("aria-expanded", "true")
    await trigger.focus()
    await trigger.press("Space")
    await expect(trigger).toHaveAttribute("aria-expanded", "false")
    await expect(trigger).toBeFocused()
    await page.keyboard.press("Control+b")
    await expect(trigger).toHaveAttribute("aria-expanded", "true")

    await page.setViewportSize({ width: 390, height: 700 })
    await expect(trigger).toHaveAttribute("aria-expanded", "false")
    await trigger.press("Enter")
    const mobileDialog = page.getByRole("dialog", { name: "Sidebar" })
    await expect(mobileDialog).toBeVisible()
    await expect(mobileDialog.getByRole("button", { name: "Close" })).toBeVisible()
    await page.keyboard.press("Escape")
    await expect(trigger).toBeFocused()
  })
})

test.describe("contract: skeleton", () => {
  test("marks one busy status while hiding every visual placeholder", async ({ page }) => {
    const status = component(page, "skeleton").getByRole("status", { name: "Loading content" })
    const shapes = status.locator('[data-slot="skeleton"]')

    await expect(status).toHaveAttribute("aria-busy", "true")
    await expect(shapes).toHaveCount(3)
    for (const shape of await shapes.all()) {
      await expect(shape).toHaveAttribute("aria-hidden", "true")
      await expect(shape).not.toHaveAttribute("tabindex")
    }
  })
})

test.describe("contract: slider", () => {
  test("exposes one scalar thumb with keyboard range semantics and visible focus", async ({ page }) => {
    const row = component(page, "slider")
    const slider = row.getByRole("slider", { name: "Volume" })
    await expect(row.getByRole("slider")).toHaveCount(1)
    await expect(slider).toHaveAttribute("aria-valuenow", "35")

    await slider.focus()
    await slider.press("ArrowRight")
    await expect(slider).toHaveAttribute("aria-valuenow", "36")
    await slider.press("Home")
    await expect(slider).toHaveAttribute("aria-valuenow", "0")
    await slider.press("End")
    await expect(slider).toHaveAttribute("aria-valuenow", "100")

    const focusStyle = await row.locator('[data-slot="slider-thumb"]').evaluate((element) => {
      const style = getComputedStyle(element)
      return {
        offset: style.outlineOffset,
        style: style.outlineStyle,
        width: style.outlineWidth,
      }
    })
    expect(focusStyle).toEqual({ offset: "2px", style: "solid", width: "2px" })
  })
})

test.describe("contract: sonner", () => {
  test("announces success and keeps its optional action keyboard operable", async ({ page }) => {
    const row = component(page, "sonner")
    await row.getByRole("button", { name: "Show Sonner toast" }).click()

    const toast = page.locator('[data-sonner-toast]').filter({ hasText: "Theme saved" })
    await expect(toast).toBeVisible()
    await expect(toast).toHaveAttribute("data-type", "success")
    const action = page.getByRole("button", { name: "Undo theme change" })
    await action.focus()
    await action.press("Enter")
    await expect(row.locator("[data-contract-status]")).toHaveText("Theme change undone")
  })
})

test.describe("contract: spinner", () => {
  test("names standalone loading status and hides the spinner inside a named button", async ({ page }) => {
    const row = component(page, "spinner")

    await expect(row.getByRole("status", { name: "Loading", exact: true })).toBeVisible()
    await expect(row.getByRole("status", { name: "Loading preview" })).toBeVisible()
    const saving = row.getByRole("button", { name: "Saving" })
    await expect(saving).toBeDisabled()
    await expect(saving.locator('[data-slot="spinner"]')).toHaveAttribute("aria-hidden", "true")
  })
})

test.describe("contract: switch", () => {
  test("uses its visible label and toggles with Space", async ({ page }) => {
    const switchControl = component(page, "switch").getByRole("switch", {
      name: "Use dark mode",
    })
    await expect(switchControl).toBeChecked()
    await switchControl.focus()
    await switchControl.press("Space")
    await expect(switchControl).not.toBeChecked()
    await expect(switchControl).toBeFocused()
  })
})

test.describe("contract: table", () => {
  test("uses a caption, scoped headers and native row order", async ({ page }) => {
    const table = component(page, "table").getByRole("table", { name: "Installed components" })

    await expect(table.locator("caption")).toHaveText("Installed components")
    await expect(table.getByRole("columnheader", { name: "Component" })).toHaveAttribute("scope", "col")
    await expect(table.getByRole("columnheader", { name: "Status" })).toHaveAttribute("scope", "col")
    await expect(table.getByRole("row")).toHaveCount(3)
    await expect(table.getByRole("button")).toHaveCount(0)
  })
})

test.describe("contract: tabs", () => {
  test("associates tabs and panels and activates with arrow navigation", async ({ page }) => {
    const row = component(page, "tabs")
    const preview = row.getByRole("tab", { name: "Preview" })
    const code = row.getByRole("tab", { name: "Code" })
    await expect(preview).toHaveAttribute("aria-selected", "true")
    await preview.focus()
    await preview.press("ArrowRight")
    await expect(code).toBeFocused()
    await expect(code).toHaveAttribute("aria-selected", "false")
    await code.press("Enter")
    await expect(code).toHaveAttribute("aria-selected", "true")
    await expect(row.getByRole("tabpanel")).toContainText(
      "Installable source registry entry."
    )
  })
})

test.describe("contract: textarea", () => {
  test("edits multiple lines and remains focusable but immutable when read-only", async ({ page }) => {
    const textarea = component(page, "textarea").getByRole("textbox", {
      name: "Example textarea",
    })
    await textarea.focus()
    await textarea.fill("Line one")
    await textarea.press("Enter")
    await textarea.pressSequentially("Line two")
    await expect(textarea).toHaveValue("Line one\nLine two")

    await textarea.evaluate((element: HTMLTextAreaElement) => {
      element.readOnly = true
    })
    await textarea.pressSequentially("X")
    await expect(textarea).toHaveValue("Line one\nLine two")
    await expect(textarea).toBeFocused()
  })
})

test.describe("contract: toast", () => {
  test("announces content and exposes action and close controls", async ({ page }) => {
    const row = component(page, "toast")
    await row.getByRole("button", { name: "Show Base UI toast" }).click()

    const toast = page.locator('[data-slot="toast"]').filter({ hasText: "Component installed" })
    await expect(toast).toBeVisible()
    await expect(toast).toContainText("Source files are now in your project.")
    const action = page.getByRole("button", { name: "Undo install" })
    await action.focus()
    await action.press("Space")
    await expect(row.locator("[data-contract-status]")).toHaveText("Installation undone")
    await expect(page.getByRole("button", { name: "Close toast" })).toBeEnabled()
  })
})

test.describe("contract: toggle", () => {
  test("uses its visible name and preserves focus while toggling pressed state", async ({ page }) => {
    const toggle = component(page, "toggle").getByRole("button", { name: "Bold" })

    await expect(toggle).toHaveAttribute("aria-pressed", "true")
    await toggle.focus()
    await toggle.press("Space")
    await expect(toggle).toHaveAttribute("aria-pressed", "false")
    await expect(toggle).toBeFocused()

    const focusStyle = await toggle.evaluate((element) => {
      const style = getComputedStyle(element)
      return { offset: style.outlineOffset, style: style.outlineStyle, width: style.outlineWidth }
    })
    expect(focusStyle).toEqual({ offset: "2px", style: "solid", width: "2px" })
  })
})

test.describe("contract: toggle-group", () => {
  test("aligns roving focus and selection with horizontal and vertical orientation", async ({ page }) => {
    const row = component(page, "toggle-group")
    const formatting = row.getByRole("group", { name: "Text formatting" })
    const bold = formatting.getByRole("button", { name: "Bold" })
    const italic = formatting.getByRole("button", { name: "Italic" })
    await expect(bold).toHaveAttribute("aria-pressed", "true")
    await bold.focus()
    await bold.press("ArrowRight")
    await expect(italic).toBeFocused()
    await italic.press("Space")
    await expect(italic).toHaveAttribute("aria-pressed", "true")
    await expect(bold).toHaveAttribute("aria-pressed", "true")

    const alignment = row.getByRole("group", { name: "Text alignment" })
    const left = alignment.getByRole("button", { name: "Left" })
    const center = alignment.getByRole("button", { name: "Center" })
    await expect(left).toHaveAttribute("aria-pressed", "true")
    await left.focus()
    await left.press("ArrowDown")
    await expect(center).toBeFocused()
    await center.press("Space")
    await expect(center).toHaveAttribute("aria-pressed", "true")
    await expect(left).toHaveAttribute("aria-pressed", "false")
  })
})

test.describe("contract: tooltip", () => {
  test("supplements a named trigger without taking focus and dismisses on Escape", async ({ page }) => {
    const trigger = component(page, "tooltip").getByRole("button", {
      name: "Copy component source",
    })
    await component(page, "tooltip").getByRole("button", { name: "Install" }).focus()
    await page.keyboard.press("Tab")
    await expect(trigger).toBeFocused()
    const visualTooltip = page.getByText("Copy component source", {
      exact: true,
    })
    await expect(visualTooltip).toBeVisible()
    await expect(page.getByRole("tooltip")).toHaveCount(0)
    await expect(trigger).toBeFocused()
    await page.keyboard.press("Escape")
    await expect(visualTooltip).toBeHidden()
    await expect(trigger).toBeFocused()
  })
})

test.describe("contract: typography", () => {
  test("preserves native article, heading, paragraph and list semantics", async ({ page }) => {
    const article = component(page, "typography").getByRole("article")

    await expect(article.getByRole("heading", { level: 4, name: "Readable content" })).toBeVisible()
    await expect(article.locator("p")).toContainText("Semantic HTML follows the active theme")
    await expect(article.getByRole("list")).toBeVisible()
    await expect(article.getByRole("listitem")).toHaveCount(2)
    await expect(article).not.toHaveAttribute("tabindex")
  })
})
