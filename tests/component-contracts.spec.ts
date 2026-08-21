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
