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
