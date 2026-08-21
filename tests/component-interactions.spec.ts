import { expect, test, type Page } from "@playwright/test"
import fs from "node:fs"

const componentNames = JSON.parse(
  fs.readFileSync(new URL("../registry/catalog.json", import.meta.url), "utf8")
).components.map((component: { name: string }) => component.name) as string[]

function component(page: Page, name: string) {
  return page.locator(`article.component-row[id="${name}"]`)
}

test.beforeEach(async ({ page }) => {
  await page.goto("/#components")
})

test("renders a real specimen and install action for every catalog component", async ({ page }) => {
  const rows = page.locator("article.component-row")
  await expect(rows).toHaveCount(componentNames.length)

  const rendered = await rows.evaluateAll((articles) =>
    articles.map((article) => {
      const specimen = article.querySelector<HTMLElement>(".component-specimen")
      const bounds = specimen?.getBoundingClientRect()
      return {
        childCount: specimen?.childElementCount ?? 0,
        height: bounds?.height ?? 0,
        id: article.id,
        width: bounds?.width ?? 0,
      }
    })
  )

  expect(rendered.map(({ id }) => id)).toEqual(componentNames)
  expect(
    rendered.filter(({ childCount, height, width }) => childCount === 0 || height === 0 || width === 0)
  ).toEqual([])

  for (const name of componentNames) {
    await expect(component(page, name).getByRole("button", { name: "Install" })).toBeEnabled()
  }
})

test("keeps native and composed form controls editable and stateful", async ({ page }) => {
  const input = component(page, "input").getByRole("textbox", { name: "Example input" })
  await input.fill("Foundation")
  await expect(input).toHaveValue("Foundation")

  const groupedInput = component(page, "input-group").getByRole("textbox", {
    name: "Search documentation",
  })
  await groupedInput.fill("Dialog")
  await expect(groupedInput).toHaveValue("Dialog")

  const textarea = component(page, "textarea").getByRole("textbox", {
    name: "Example textarea",
  })
  await textarea.fill("Keyboard and screen reader behavior")
  await expect(textarea).toHaveValue("Keyboard and screen reader behavior")

  const checkbox = component(page, "checkbox").getByRole("checkbox", {
    name: "Include optional theme preset",
  })
  await expect(checkbox).toBeChecked()
  await checkbox.click()
  await expect(checkbox).not.toBeChecked()

  const switchControl = component(page, "switch").getByRole("switch", {
    name: "Use dark mode",
  })
  await expect(switchControl).toBeChecked()
  await switchControl.click()
  await expect(switchControl).not.toBeChecked()

  const nativeSelect = component(page, "native-select").getByRole("combobox", {
    name: "Release channel",
  })
  await nativeSelect.selectOption("preview")
  await expect(nativeSelect).toHaveValue("preview")

  const select = component(page, "select").getByRole("combobox", { name: "Team" })
  await select.click()
  await page.getByRole("option", { name: "Engineering", exact: true }).click()
  await expect(select).toContainText("Engineering")
})

test("keeps disclosure, menu and contextual overlay behavior keyboard-safe", async ({ page }) => {
  const firstAccordionTrigger = component(page, "accordion").getByRole("button", {
    name: "What does source-first mean?",
  })
  const secondAccordionTrigger = component(page, "accordion").getByRole("button", {
    name: "Where does behavior come from?",
  })
  await expect(firstAccordionTrigger).toHaveAttribute("aria-expanded", "true")
  await firstAccordionTrigger.click()
  await expect(firstAccordionTrigger).toHaveAttribute("aria-expanded", "false")
  await secondAccordionTrigger.click()
  await expect(secondAccordionTrigger).toHaveAttribute("aria-expanded", "true")

  const menubarTrigger = component(page, "menubar").getByRole("menuitem", { name: "File" })
  await menubarTrigger.click()
  await expect(page.getByRole("menuitem", { name: "New file ⌘N" })).toBeVisible()
  await page.keyboard.press("Escape")
  await expect(menubarTrigger).toBeFocused()

  const navigationTrigger = component(page, "navigation-menu").getByRole("button", {
    name: "Components",
  })
  await navigationTrigger.click()
  await expect(page.getByRole("link", { name: "Browse catalog" })).toBeVisible()
  await page.keyboard.press("Escape")
  await expect(navigationTrigger).toBeFocused()

  const tooltipTrigger = component(page, "tooltip").getByRole("button", {
    name: "Copy component source",
  })
  await component(page, "tooltip").getByRole("button", { name: "Install" }).focus()
  await page.keyboard.press("Tab")
  await expect(tooltipTrigger).toBeFocused()
  await expect(page.getByText("Copy component source", { exact: true })).toBeVisible()

  const hoverCardTrigger = component(page, "hover-card").getByRole("link", {
    name: "@ui-foundation",
  })
  await hoverCardTrigger.hover()
  await expect(page.getByText("Source components with optional identity presets.")).toBeVisible()
})

test("keeps calendar, resizable and scroll surfaces operable", async ({ page }) => {
  const calendar = component(page, "calendar")
  const selectedDate = calendar.getByRole("button", {
    name: /Thursday, August 20th, 2026, selected/,
  })
  const nextDate = calendar.getByRole("button", {
    name: /Friday, August 21st, 2026/,
  })
  await calendar.getByRole("button", { name: "Go to the Next Month" }).focus()
  await page.keyboard.press("Tab")
  await expect(selectedDate).toBeFocused()
  await expect(selectedDate.locator("xpath=..")).toHaveAttribute("data-focused", "true")
  await page.keyboard.press("ArrowRight")
  await expect(nextDate.locator("xpath=..")).toHaveAttribute("data-focused", "true")
  await expect(nextDate).toBeFocused()

  const resizeHandle = component(page, "resizable").getByRole("separator")
  await resizeHandle.focus()
  await expect(resizeHandle).toBeFocused()
  const initialSize = await resizeHandle.getAttribute("aria-valuenow")
  await page.keyboard.press("ArrowRight")
  await expect.poll(() => resizeHandle.getAttribute("aria-valuenow")).not.toBe(initialSize)

  for (const name of ["scroll-area", "message-scroller"]) {
    const viewport = component(page, name).locator('[data-slot$="viewport"]')
    const overflow = await viewport.evaluate((element) => ({
      clientHeight: element.clientHeight,
      scrollHeight: element.scrollHeight,
    }))
    expect(overflow.scrollHeight).toBeGreaterThan(overflow.clientHeight)
    await viewport.evaluate((element) => element.scrollTo({ top: element.scrollHeight }))
    await expect.poll(() => viewport.evaluate((element) => element.scrollTop)).toBeGreaterThan(0)
  }
})

test("exposes accessible semantics for status, data and navigation specimens", async ({ page }) => {
  await expect(component(page, "attachment").getByRole("button", {
    name: "Remove component-spec.pdf",
  })).toBeEnabled()
  await expect(component(page, "avatar").getByLabel("Project members")).toBeVisible()
  await expect(component(page, "button-group").getByRole("group", {
    name: "Document actions",
  })).toBeVisible()
  await expect(component(page, "chart").getByRole("img", {
    name: "Monthly component installs",
  })).toBeVisible()
  await expect(component(page, "progress").getByRole("progressbar", {
    name: "Installation",
  })).toHaveAttribute("aria-valuenow", "68")
  await expect(component(page, "table").getByRole("table", {
    name: "Installed components",
  })).toBeVisible()
  await expect(component(page, "skeleton").getByRole("status", {
    name: "Loading content",
  })).toBeVisible()
  await expect(component(page, "pagination").getByRole("link", {
    name: "Page 1",
  })).toHaveAttribute("aria-current", "page")
})
