import AxeBuilder from "@axe-core/playwright"
import { expect, test } from "@playwright/test"
import fs from "node:fs"

const componentCount = JSON.parse(
  fs.readFileSync(new URL("../registry/catalog.json", import.meta.url), "utf8")
).components.length as number
const blockCount = JSON.parse(
  fs.readFileSync(new URL("../registry/catalog.json", import.meta.url), "utf8")
).blocks.length as number
const themeTokenCount = Object.keys(JSON.parse(
  fs.readFileSync(new URL("../tokens/themes/neutral.json", import.meta.url), "utf8")
).modes.light).length as number
const foundationTokenCount = JSON.parse(
  fs.readFileSync(new URL("../tokens/foundations.json", import.meta.url), "utf8")
).groups.reduce(
  (count: number, group: { tokens: unknown[] }) => count + group.tokens.length,
  0
) as number
const densityContract = JSON.parse(
  fs.readFileSync(new URL("../tokens/densities.json", import.meta.url), "utf8")
) as {
  default: string
  profiles: Array<{ name: string; control: { height: Record<string, string> } }>
}

test.beforeEach(async ({ page }) => {
  await page.goto("/")
})

test("renders the complete local component catalog", async ({ page }) => {
  await expect(
    page.getByRole("heading", {
      level: 1,
      name: "Source-first components. Base UI behavior. Identity optional.",
    })
  ).toBeVisible()
  await expect(page.locator("article.component-row")).toHaveCount(componentCount)
  await expect(page.getByText(`${componentCount} of ${componentCount} available locally`)).toBeVisible()

  const overflow = await page.evaluate(
    () => document.documentElement.scrollWidth - document.documentElement.clientWidth
  )
  expect(overflow).toBe(0)
})

test("switches between the neutral and optional TIS theme", async ({ page }) => {
  await page.getByRole("button", { name: "TIS", exact: true }).click()
  await page.getByRole("button", { name: "Dark", exact: true }).click()

  await expect(page.locator("html")).toHaveAttribute("data-ui-theme", "tis")
  await expect(page.locator("html")).toHaveClass(/dark/)

  const tokens = await page.evaluate(() => {
    const styles = getComputedStyle(document.documentElement)
    return {
      background: styles.getPropertyValue("--background").trim(),
      primary: styles.getPropertyValue("--primary").trim(),
    }
  })
  expect(tokens).toEqual({ background: "#0c111d", primary: "#84adff" })
})

test("customizes, shares and exports a portable theme preset", async ({ page, context }) => {
  await context.grantPermissions(["clipboard-read", "clipboard-write"])
  await page.getByRole("link", { name: "Customize", exact: true }).click()
  await expect(page.getByRole("heading", { level: 2, name: "Customize" })).toBeVisible()

  const identity = page.getByRole("group", { name: "Identity" })
  await identity.getByRole("button", { name: "TIS", exact: true }).click()
  await expect(page.locator("html")).toHaveAttribute("data-ui-theme", "custom")
  await expect(page.getByRole("button", { name: "Corner radius preset: Default" })).toBeVisible()

  const tisRadius = await page.evaluate(() =>
    getComputedStyle(document.documentElement).getPropertyValue("--radius").trim()
  )
  expect(tisRadius).toBe("0.625rem")

  await page.getByRole("button", { name: "Base color preset: Slate" }).click()
  await page.getByRole("menuitemradio", { name: "Stone" }).click()
  const customBackground = await page.evaluate(() =>
    getComputedStyle(document.documentElement).getPropertyValue("--background").trim()
  )
  expect(customBackground).toBe("#fafaf9")

  await page.getByRole("button", { name: "Font preset: Geist" }).click()
  await page.getByRole("menuitemradio", { name: "Humanist" }).click()
  await expect(page.getByLabel("Body font")).toHaveValue("humanist")
  await expect(page.getByLabel("Heading font")).toHaveValue("humanist")

  await page.getByRole("button", { name: "Typeset preset: Default" }).click()
  await page.getByRole("menuitemradio", { name: "Reading" }).click()
  await expect(page.getByLabel("Base size")).toHaveValue("18")
  await expect(page.getByLabel("Leading")).toHaveValue("1.9")
  await expect(page.getByLabel("Block flow")).toHaveValue("1.5")
  await expect(page.getByLabel("Measure")).toHaveValue("68")

  const readingRhythm = await page.evaluate(() => {
    const root = getComputedStyle(document.documentElement)
    const typeset = document.querySelector<HTMLElement>('.customizer-preview-card--typeset [data-slot="typeset"]')
    if (!typeset) throw new Error("Typeset preview is missing")
    const styles = getComputedStyle(typeset)
    return {
      configuredFlow: root.getPropertyValue("--typeset-config-flow").trim(),
      configuredMeasure: root.getPropertyValue("--typeset-config-measure").trim(),
      configuredSize: root.getPropertyValue("--typeset-config-size").trim(),
      fontSize: styles.fontSize,
      lineHeight: styles.lineHeight,
    }
  })
  expect(readingRhythm).toEqual({
    configuredFlow: "1.5em",
    configuredMeasure: "68ch",
    configuredSize: "18px",
    fontSize: "18px",
    lineHeight: "34.2px",
  })

  await page.getByLabel("Leading").fill("2.05")
  await expect(page.getByRole("button", { name: "Typeset preset: Custom" })).toBeVisible()

  await page.getByLabel("Chart palette").selectOption("brand")
  await page.getByLabel("Heading font").selectOption("serif")
  await page.getByRole("button", { name: "Corner radius preset: Default" }).click()
  const largeRadiusOption = page.getByRole("menuitemradio", { name: "Large", exact: true })
  const pillRadiusOption = page.getByRole("menuitemradio", { name: "Pill / Full" })
  await expect(largeRadiusOption.locator(".customizer-radius-preview__surface")).toHaveCSS("border-radius", "14px")
  await expect(pillRadiusOption.locator(".customizer-radius-preview__surface")).toHaveCSS("border-radius", "14px")
  await expect(largeRadiusOption.locator(".customizer-radius-preview__control")).toHaveCSS("border-radius", "14px")
  await expect(pillRadiusOption.locator(".customizer-radius-preview__control")).toHaveCSS("border-radius", "9999px")
  await pillRadiusOption.click()
  await page.getByRole("button", { name: "Density preset: Comfortable" }).click()
  await page.getByRole("menuitemradio", { name: "Spacious" }).click()
  await page.getByRole("group", { name: "Customizer mode" }).getByRole("button", { name: "Dark" }).click()

  const theme = await page.evaluate(() => {
    const styles = getComputedStyle(document.documentElement)
    return {
      density: document.documentElement.dataset.uiDensity,
      fontHeading: styles.getPropertyValue("--font-heading").trim(),
      primary: styles.getPropertyValue("--primary").trim(),
      radius: styles.getPropertyValue("--radius").trim(),
      controlRadius: styles.getPropertyValue("--control-radius").trim(),
    }
  })
  expect(theme.density).toBe("spacious")
  expect(theme.fontHeading).toContain("Charter")
  expect(theme.primary).not.toBe("")
  expect(theme.radius).toBe("0.875rem")
  expect(theme.controlRadius).toBe("9999px")

  const radiusRoles = await page.evaluate(() => {
    const card = document.querySelector<HTMLElement>(".customizer-preview-card--hero")
    const button = [...document.querySelectorAll<HTMLElement>('[data-slot="button"]')]
      .find((element) => element.textContent?.trim() === "Save changes")
    const select = document.querySelector<HTMLElement>("#preview-framework")
    if (!card || !button || !select) throw new Error("Customizer radius specimens are missing")
    return {
      button: getComputedStyle(button).borderTopLeftRadius,
      card: getComputedStyle(card).borderTopLeftRadius,
      select: getComputedStyle(select).borderTopLeftRadius,
    }
  })
  expect(radiusRoles.button).toBe("9999px")
  expect(radiusRoles.select).toBe("9999px")
  expect(Number.parseFloat(radiusRoles.card)).toBeLessThanOrEqual(20)

  await page.getByRole("button", { name: "Copy preset" }).click()
  await expect(page.getByRole("button", { name: "Preset copied" })).toBeVisible()
  const preset = JSON.parse(await page.evaluate(() => navigator.clipboard.readText())) as {
    type: string
    css: Record<string, Record<string, string>>
    meta: { selectedDensity: string; previewMode: string }
  }
  expect(preset.type).toBe("registry:theme")
  expect(preset.css['[data-ui-theme="custom"]']["--font-heading"]).toContain("Charter")
  expect(preset.css['[data-ui-theme="custom"]']["--typeset-config-size"]).toBe("18px")
  expect(preset.css['[data-ui-theme="custom"]']["--typeset-config-leading"]).toBe("2.05")
  expect(preset.css['[data-ui-theme="custom"]']["--typeset-config-flow"]).toBe("1.5em")
  expect(preset.css['[data-ui-theme="custom"]']["--typeset-config-measure"]).toBe("68ch")
  expect(preset.css['[data-ui-theme="custom"]']["--radius"]).toBe("0.875rem")
  expect(preset.css['[data-ui-theme="custom"]']["--control-radius"]).toBe("9999px")
  expect(preset.meta.selectedDensity).toBe("spacious")
  expect(preset.meta.previewMode).toBe("dark")

  const downloadPromise = page.waitForEvent("download")
  await page.getByRole("button", { name: "Download theme preset" }).click()
  const download = await downloadPromise
  expect(download.suggestedFilename()).toBe("ui-foundation-theme.json")

  await page.getByRole("button", { name: "Share preset" }).click()
  await expect(page).toHaveURL(/preset=/)
  expect(await page.evaluate(() => navigator.clipboard.readText())).toContain("#customize")
  await page.reload()
  await expect(page.locator("html")).toHaveAttribute("data-ui-theme", "custom")
  await expect(page.locator("html")).toHaveAttribute("data-ui-density", "spacious")
  await expect(page.locator("html")).toHaveClass(/dark/)
  await expect(page.getByLabel("Heading font")).toHaveValue("serif")
  await expect(page.getByRole("button", { name: "Font preset: Custom pairing" })).toBeVisible()
  await expect(page.getByRole("button", { name: "Typeset preset: Custom" })).toBeVisible()
  await expect(page.getByLabel("Leading")).toHaveValue("2.05")
  await expect(page.getByRole("button", { name: "Corner radius preset: Pill / Full" })).toBeVisible()
  await expect(page.getByRole("button", { name: "Density preset: Spacious" })).toBeVisible()
})

test("renders functional installable blocks", async ({ page }) => {
  await page.getByRole("link", { name: "Blocks", exact: true }).click()
  await expect(page.locator("article.block-entry")).toHaveCount(blockCount)
  await expect(page.getByText(`${blockCount} installable application patterns`)).toBeVisible()

  await expect(page.getByRole("table", { name: "Recent workspace activity" })).toBeVisible()
  await expect(page.getByRole("img", { name: "Active users over six months" })).toBeVisible()

  const login = page.locator("#login-page")
  const email = login.getByRole("textbox", { name: "Email" })
  await login.getByRole("button", { name: "Sign in" }).click()
  await expect.poll(() => email.evaluate((input) => (input as HTMLInputElement).checkValidity())).toBe(false)
  await email.fill("team@example.com")
  await login.getByLabel("Password").fill("correct-horse-battery-staple")
  await login.getByRole("button", { name: "Sign in" }).click()
  await expect(login.getByRole("heading", { name: "Welcome back" })).toBeVisible()

  const settings = page.locator("#settings-page")
  await settings.getByLabel("Workspace name").fill("Experience Engineering")
  await settings.getByLabel("Default locale").selectOption("pt-BR")
  await settings.getByRole("button", { name: "Save settings" }).click()
  await expect(settings.getByLabel("Workspace name")).toHaveValue("Experience Engineering")

  await expect(page.getByRole("button", { name: "Actions for Ana Martins" })).toBeVisible()
  await expect(page.getByRole("button", { name: "Invite member" })).toBeVisible()
})

test("renders the accessible chart recipe gallery", async ({ page }) => {
  await page.getByRole("link", { name: "Charts", exact: true }).click()
  await expect(page.locator(".chart-recipe-grid article")).toHaveCount(6)
  await expect(page.locator('.chart-recipe-grid [role="img"]')).toHaveCount(6)
  await expect(page.locator(".chart-token-strip > div")).toHaveCount(5)
  await expect(page.locator(".chart-recipe-grid h3")).toHaveText([
    "Area",
    "Bar",
    "Line",
    "Pie",
    "Radar",
    "Radial",
  ])

  const summaryIds = await page.locator('.chart-recipe-grid [role="img"]').evaluateAll((charts) =>
    charts.map((chart) => chart.getAttribute("aria-describedby"))
  )
  expect(summaryIds.every(Boolean)).toBe(true)
  for (const summaryId of summaryIds) {
    await expect(page.locator(`#${summaryId}`)).toHaveClass(/sr-only/)
  }

  await page.getByRole("button", { name: "TIS", exact: true }).click()
  const chartColor = await page.evaluate(() =>
    getComputedStyle(document.documentElement).getPropertyValue("--chart-1").trim()
  )
  expect(chartColor).toBe("#0056e0")
})

test("publishes complete machine-readable sources for developers and AI", async ({ request }) => {
  const [manifestResponse, customizerResponse, llmsResponse, blockResponse, chartsResponse] = await Promise.all([
    request.get("/ai/manifest.json"),
    request.get("/ai/customizer.json"),
    request.get("/llms.txt"),
    request.get("/r/dashboard-overview.json"),
    request.get("/r/chart-recipes.json"),
  ])

  for (const response of [manifestResponse, customizerResponse, llmsResponse, blockResponse, chartsResponse]) {
    expect(response.ok()).toBe(true)
  }

  const manifest = await manifestResponse.json() as {
    blocks: unknown[]
    charts: unknown[]
    components: unknown[]
    theming: { customizer: { outputs: string[] } }
  }
  expect(manifest.components).toHaveLength(componentCount)
  expect(manifest.blocks).toHaveLength(blockCount)
  expect(manifest.charts).toHaveLength(1)
  expect(manifest.theming.customizer.outputs).toEqual(["css", "registry-theme", "share-url"])

  const block = await blockResponse.json() as { type: string; files: Array<{ target?: string }> }
  const charts = await chartsResponse.json() as { type: string; files: Array<{ target?: string }> }
  expect(block.type).toBe("registry:block")
  expect(block.files[0].target).toBe("src/blocks/dashboard-overview.tsx")
  expect(charts.type).toBe("registry:block")
  expect(charts.files[0].target).toBe("src/charts/chart-recipes.tsx")
})

test("applies the three density profiles to real controls", async ({ page }) => {
  await expect(page.locator("html")).toHaveAttribute("data-ui-density", densityContract.default)
  const densityGroup = page.getByRole("group", { name: "Density" })
  const mediumControls = [
    page.getByPlaceholder("Search components"),
    page.locator('[data-slot="select-trigger"]'),
    page.locator('[data-slot="native-select"]'),
    page.locator('[data-slot="input-group"]').first(),
    page.locator('[data-slot="toggle"]'),
    page.locator('[data-slot="input-otp-slot"]').first(),
  ]
  const smallButton = page
    .getByRole("group", { name: "Filter by release status" })
    .getByRole("button", { name: "All", exact: true })

  for (const profile of densityContract.profiles) {
    const label = profile.name.charAt(0).toUpperCase() + profile.name.slice(1)
    const mediumHeight = `${Number.parseFloat(profile.control.height.md) * 16}px`
    const smallHeight = `${Number.parseFloat(profile.control.height.sm) * 16}px`
    await densityGroup.getByRole("button", { name: label, exact: true }).click()
    await expect(page.locator("html")).toHaveAttribute("data-ui-density", profile.name)
    for (const control of mediumControls) {
      await expect.poll(() => control.evaluate((element) => getComputedStyle(element).height)).toBe(
        mediumHeight
      )
    }
    await expect.poll(() => smallButton.evaluate((element) => getComputedStyle(element).height)).toBe(
      smallHeight
    )
  }
})

test("uses one radius-aware semantic outline without a focus halo", async ({ page }) => {
  await page.getByRole("link", { name: "Foundations", exact: true }).click()
  const defaultButton = page.getByRole("button", { name: "Default focus" })
  const errorInput = page.getByRole("textbox", { name: "Error focus" })
  const readOnlyInput = page.getByRole("textbox", { name: "Read-only focus" })
  const states = [
    { theme: "Neutral", mode: "Light" },
    { theme: "Neutral", mode: "Dark" },
    { theme: "TIS", mode: "Light" },
    { theme: "TIS", mode: "Dark" },
  ] as const

  for (const state of states) {
    await page.getByRole("button", { name: state.theme, exact: true }).click()
    await page.getByRole("button", { name: state.mode, exact: true }).click()
    await page.waitForTimeout(200)
    for (const [control, token] of [
      [defaultButton, "--ring"],
      [errorInput, "--destructive"],
      [readOnlyInput, "--muted-foreground"],
    ] as const) {
      await page.keyboard.press("Tab")
      await control.focus()
      await expect(control).toBeFocused()
      const focus = await control.evaluate((element, expectedToken) => {
        const styles = getComputedStyle(element)
        const tokenColor = getComputedStyle(document.documentElement).getPropertyValue(expectedToken).trim()
        const toRgba = (color: string) => {
          const canvas = document.createElement("canvas")
          canvas.width = 1
          canvas.height = 1
          const context = canvas.getContext("2d", { willReadFrequently: true })
          if (!context) throw new Error("Canvas color normalization is unavailable")
          context.fillStyle = color
          context.fillRect(0, 0, 1, 1)
          return Array.from(context.getImageData(0, 0, 1, 1).data)
        }
        return {
          borderRadius: styles.borderRadius,
          boxShadow: styles.boxShadow,
          expectedColor: toRgba(tokenColor),
          outlineColor: toRgba(styles.outlineColor),
          outlineOffset: styles.outlineOffset,
          outlineStyle: styles.outlineStyle,
          outlineWidth: styles.outlineWidth,
          ringShadow: styles.getPropertyValue("--tw-ring-shadow").trim(),
        }
      }, token)
      expect(focus.outlineWidth).toBe("2px")
      expect(focus.outlineOffset).toBe("2px")
      expect(focus.outlineStyle).toBe("solid")
      expect(focus.outlineColor).toEqual(focus.expectedColor)
      expect(focus.borderRadius).not.toBe("0px")
      expect(focus.ringShadow).toBe("0 0 #0000")
    }
  }

  await page.emulateMedia({ forcedColors: "active" })
  await page.keyboard.press("Tab")
  await defaultButton.focus()
  const forcedColorsFocus = await defaultButton.evaluate((element) => {
    const styles = getComputedStyle(element)
    return {
      boxShadow: styles.boxShadow,
      outlineStyle: styles.outlineStyle,
      outlineWidth: styles.outlineWidth,
      ringShadow: styles.getPropertyValue("--tw-ring-shadow").trim(),
    }
  })
  expect(forcedColorsFocus.outlineWidth).toBe("2px")
  expect(forcedColorsFocus.outlineStyle).toBe("solid")
  expect(forcedColorsFocus.ringShadow).toBe("0 0 #0000")
  await page.emulateMedia({ forcedColors: "none" })
})

test("keeps focus outlines inside horizontally scrolling filter containers", async ({ page }) => {
  for (const viewport of [
    { width: 1280, height: 720 },
    { width: 390, height: 844 },
  ]) {
    await page.setViewportSize(viewport)
    await page.reload()

    const filterStrip = page.locator(".catalog-filter-strip")
    const filters = filterStrip.getByRole("button")
    const filterCount = await filters.count()
    await page.getByPlaceholder("Search components").focus()

    for (let index = 0; index < filterCount; index += 1) {
      const filter = filters.nth(index)
      await page.keyboard.press("Tab")
      await expect(filter).toBeFocused()

      const geometry = await filter.evaluate((element) => {
        const strip = element.closest(".catalog-filter-strip")
        if (!(strip instanceof HTMLElement)) {
          throw new Error("Catalog filter strip was not found")
        }

        const elementRect = element.getBoundingClientRect()
        const stripRect = strip.getBoundingClientRect()
        const styles = getComputedStyle(element)
        const focusFootprint =
          Number.parseFloat(styles.outlineWidth) + Number.parseFloat(styles.outlineOffset)

        return {
          bottom: elementRect.bottom + focusFootprint,
          left: elementRect.left - focusFootprint,
          right: elementRect.right + focusFootprint,
          stripBottom: stripRect.bottom,
          stripLeft: stripRect.left,
          stripRight: stripRect.right,
          stripTop: stripRect.top,
          top: elementRect.top - focusFootprint,
        }
      })

      expect(geometry.top).toBeGreaterThanOrEqual(geometry.stripTop - 0.5)
      expect(geometry.bottom).toBeLessThanOrEqual(geometry.stripBottom + 0.5)
      expect(geometry.left).toBeGreaterThanOrEqual(geometry.stripLeft - 0.5)
      expect(geometry.right).toBeLessThanOrEqual(geometry.stripRight + 0.5)
    }
  }
})

test("keeps focus visible for interactive controls inside clipped component containers", async ({ page }) => {
  const sortButton = page
    .locator('[data-slot="data-table"]')
    .getByRole("button", { name: "Component", exact: true })
  await page.keyboard.press("Tab")
  await sortButton.focus()

  const tableGeometry = await sortButton.evaluate((element) => {
    const container = element.closest('[data-slot="table-container"]')
    if (!(container instanceof HTMLElement)) {
      throw new Error("Table scroll container was not found")
    }

    const elementRect = element.getBoundingClientRect()
    const containerRect = container.getBoundingClientRect()
    const styles = getComputedStyle(element)
    const focusFootprint =
      Number.parseFloat(styles.outlineWidth) + Number.parseFloat(styles.outlineOffset)

    return {
      left: elementRect.left - focusFootprint,
      right: elementRect.right + focusFootprint,
      containerLeft: containerRect.left,
      containerRight: containerRect.right,
    }
  })
  expect(tableGeometry.left).toBeGreaterThanOrEqual(tableGeometry.containerLeft - 0.5)
  expect(tableGeometry.right).toBeLessThanOrEqual(tableGeometry.containerRight + 0.5)

  for (const [targetSlot, containerSlot] of [
    ["message-scroller-viewport", "message-scroller"],
    ["resizable-handle", "resizable-panel-group"],
  ] as const) {
    const target = page.locator(`[data-slot="${targetSlot}"]`).first()
    await page.keyboard.press("Tab")
    await target.focus()
    await expect(target).toBeFocused()

    const focus = await target.evaluate((element, parentSlot) => {
      const container = element.closest(`[data-slot="${parentSlot}"]`)
      if (!(container instanceof HTMLElement)) {
        throw new Error(`Focus container ${parentSlot} was not found`)
      }

      const targetStyles = getComputedStyle(element)
      const containerStyles = getComputedStyle(container)
      return {
        containerOutlineOffset: containerStyles.outlineOffset,
        containerOutlineStyle: containerStyles.outlineStyle,
        containerOutlineWidth: containerStyles.outlineWidth,
        containerRadius: containerStyles.borderRadius,
        targetOutlineStyle: targetStyles.outlineStyle,
      }
    }, containerSlot)

    expect(focus.targetOutlineStyle).toBe("none")
    expect(focus.containerOutlineWidth).toBe("2px")
    expect(focus.containerOutlineOffset).toBe("2px")
    expect(focus.containerOutlineStyle).toBe("solid")
    expect(focus.containerRadius).not.toBe("0px")
  }
})

test("documents the complete token and foundation contracts", async ({ page }) => {
  await page.getByRole("link", { name: "Tokens", exact: true }).click()
  await expect(page).toHaveURL(/#tokens$/)
  await expect(page.getByRole("heading", { level: 1, name: "Tokens" })).toBeVisible()
  await expect(page.locator("[data-token]")).toHaveCount(
    themeTokenCount + foundationTokenCount + 15
  )
  await expect(page.locator("[data-token-scope=theme]")).toHaveCount(themeTokenCount)
  await expect(page.locator("[data-token-scope=foundation]")).toHaveCount(foundationTokenCount)
  await expect(page.locator("[data-token-scope=density]")).toHaveCount(15)
  await expect(page.locator("[data-token=primary] .token-value")).toHaveText("oklch(0.205 0 0)")
  await expect(page.locator("[data-token=text-base] .token-value")).toHaveText("1rem")
  await expect(page.locator("[data-token=duration-normal] .token-value")).toHaveText("150ms")
  await expect(page.locator("[data-token=ui-control-height-md] .token-value")).toHaveText("2.5rem")

  await page.getByRole("group", { name: "Density" }).getByRole("button", {
    name: "Compact",
    exact: true,
  }).click()
  await expect(page.locator("[data-token=ui-control-height-md] .token-value")).toHaveText("2rem")

  await page.getByRole("button", { name: "TIS", exact: true }).click()
  await page.getByRole("button", { name: "Dark", exact: true }).click()
  await expect(page.locator("[data-token=primary] .token-value")).toHaveText("#84adff")
  await expect(page.getByRole("button", { name: "Copy --primary", exact: true })).toBeVisible()

  await page.getByRole("link", { name: "Foundations", exact: true }).click()
  await expect(page).toHaveURL(/#foundations$/)
  await expect(page.getByRole("heading", { level: 1, name: "Foundations" })).toBeVisible()
  await expect(page.locator(".font-family-specimen")).toHaveCount(3)
  await expect(page.locator(".type-scale-row")).toHaveCount(6)
  await expect(page.locator(".spacing-specimen")).toHaveCount(8)
  await expect(page.locator(".density-profile")).toHaveCount(3)
  await expect(page.locator('.density-profile[data-active="true"] h4')).toHaveText("Compact")
  await expect(page.locator(".radius-specimen")).toHaveCount(7)
  await expect(page.locator(".surface-specimen")).toHaveCount(4)
  await expect(page.locator(".elevation-specimens > div")).toHaveCount(4)
  await expect(page.locator(".motion-specimen")).toHaveCount(3)
  await expect(page.getByRole("button", { name: "Default focus" })).toBeVisible()

  await page.goto("/#styles")
  await expect(page).toHaveURL(/#foundations$/)
  await expect(page.getByRole("heading", { level: 1, name: "Foundations" })).toBeVisible()
})

test("filters by search and category", async ({ page }) => {
  const search = page.getByPlaceholder("Search components")
  await search.fill("alert dialog")
  await expect(page.locator("article.component-row")).toHaveCount(1)
  await expect(page.getByRole("heading", { name: "Alert Dialog", exact: true })).toBeVisible()

  await search.clear()
  await page.getByRole("button", { name: "Overlay", exact: true }).click()
  await expect(page.locator("article.component-row")).toHaveCount(7)
  await expect(page.locator("article.component-row h3")).toHaveText([
    "Alert Dialog",
    "Dialog",
    "Drawer",
    "Hover Card",
    "Popover",
    "Sheet",
    "Tooltip",
  ])

  const releaseFilter = page.getByRole("group", { name: "Filter by release status" })
  const categoryFilter = page.getByRole("group", { name: "Filter by category" })
  await expect(releaseFilter.getByRole("button", { name: "Recently added" })).toBeVisible()
  await expect(categoryFilter.getByRole("button", { name: "Recently added" })).toHaveCount(0)

  await releaseFilter.getByRole("button", { name: "Recently added" }).click()
  await expect(page.locator("article.component-row")).toHaveCount(4)
  await expect(page.locator("article.component-row h3")).toHaveText([
    "Data Table",
    "Date Picker",
    "Form",
    "Typography",
  ])
  await expect(page.getByText("4 of 66 available locally")).toBeVisible()
  await expect(page).toHaveURL(/filter=recently-added/)

  await page.goto("/?filter=recently-added#components")
  await expect(page.locator("article.component-row h3")).toHaveText([
    "Data Table",
    "Date Picker",
    "Form",
    "Typography",
  ])
})

test("keeps overlay interactions keyboard-safe", async ({ page }) => {
  await page.getByRole("button", { name: "Overlay", exact: true }).click()

  const alertDialogTrigger = page.getByRole("button", { name: "Delete project", exact: true })
  await alertDialogTrigger.click()
  await expect(page.getByRole("alertdialog", { name: "Delete this project?" })).toBeVisible()
  await expect(page.getByRole("button", { name: "Cancel", exact: true })).toBeFocused()
  await page.keyboard.press("Escape")
  await expect(alertDialogTrigger).toBeFocused()

  const dialogTrigger = page.getByRole("button", { name: "Open dialog", exact: true })
  await dialogTrigger.click()
  await expect(page.getByRole("dialog", { name: "Install component" })).toBeVisible()
  await expect(page.getByRole("button", { name: "Install", exact: true })).toBeFocused()
  await page.keyboard.press("Escape")
  await expect(dialogTrigger).toBeFocused()

  const popoverTrigger = page.getByRole("button", { name: "Open popover", exact: true })
  await popoverTrigger.click()
  await expect(page.getByRole("dialog", { name: "Theme preset" })).toBeVisible()
  await page.keyboard.press("Escape")
  await expect(popoverTrigger).toBeFocused()
})

test("keeps wave two disclosure and selection behavior functional", async ({ page }) => {
  const collapsibleTrigger = page.getByRole("button", { name: "Package details" })
  await expect(collapsibleTrigger).toHaveAttribute("aria-expanded", "true")
  await collapsibleTrigger.click()
  await expect(collapsibleTrigger).toHaveAttribute("aria-expanded", "false")

  await page.getByRole("tab", { name: "Code" }).click()
  await expect(page.getByRole("tabpanel")).toContainText("Installable source registry entry")

  const boldToggle = page.getByRole("button", { name: "Toggle bold" })
  await expect(boldToggle).toHaveAttribute("aria-pressed", "true")
  await boldToggle.click()
  await expect(boldToggle).toHaveAttribute("aria-pressed", "false")

  const italicToggle = page.getByRole("button", { name: "Italic" })
  await italicToggle.click()
  await expect(italicToggle).toHaveAttribute("aria-pressed", "true")
})

test("keeps wave three menus, overlays and value controls functional", async ({ page }) => {
  const dropdownTrigger = page.getByRole("button", { name: "Open menu", exact: true })
  await dropdownTrigger.click()
  await expect(page.getByRole("menuitem", { name: "Open", exact: true })).toBeVisible()
  await page.keyboard.press("Escape")
  await expect(dropdownTrigger).toBeFocused()

  const contextTarget = page.getByText("Right-click this area", { exact: true })
  await contextTarget.click({ button: "right" })
  await expect(page.getByRole("menuitem", { name: "Duplicate ⌘D" })).toBeVisible()
  await page.keyboard.press("Escape")

  const drawerTrigger = page.getByRole("button", { name: "Open drawer", exact: true })
  await drawerTrigger.click()
  await expect(page.getByRole("dialog", { name: "Install component" })).toBeVisible()
  await page.keyboard.press("Escape")
  await expect(drawerTrigger).toBeFocused()

  const sheetTrigger = page.getByRole("button", { name: "Open sheet", exact: true })
  await sheetTrigger.click()
  await expect(page.getByRole("dialog", { name: "Component settings" })).toBeVisible()
  await page.keyboard.press("Escape")
  await expect(sheetTrigger).toBeFocused()

  const slider = page.getByRole("slider", { name: "Volume" })
  await expect(slider).toHaveAttribute("aria-valuenow", "35")
  await slider.focus()
  await page.keyboard.press("ArrowRight")
  await expect(slider).toHaveAttribute("aria-valuenow", "36")

  const nextSlide = page.getByRole("button", { name: "Next slide" })
  await expect(nextSlide).toBeEnabled()
  await nextSlide.click()
  await expect(page.getByRole("button", { name: "Previous slide" })).toBeEnabled()
})

test("keeps final form, command and notification components functional", async ({ page }) => {
  const combobox = page.getByPlaceholder("Choose a team")
  await combobox.click()
  await page.getByRole("option", { name: "Engineering" }).click()
  await expect(combobox).toHaveValue("Engineering")

  const commandSearch = page.getByRole("combobox", { name: "Search commands" })
  await commandSearch.fill("copy")
  await expect(page.locator("[data-slot=command-item]", { hasText: "Copy install command" })).toBeVisible()

  const otp = page.getByRole("textbox", { name: "Verification code" })
  await otp.pressSequentially("654")
  await expect.poll(() => otp.inputValue()).toContain("654")

  const tisChoice = page.getByRole("radio", { name: "TIS" })
  await tisChoice.click()
  await expect(tisChoice).toBeChecked()

  await page.getByRole("button", { name: "Show Sonner toast" }).click()
  await expect(page.getByText("Theme saved", { exact: true })).toBeVisible()

  await page.getByRole("button", { name: "Show Base UI toast" }).click()
  await expect(page.getByText("Component installed", { exact: true })).toBeVisible()
})

test("keeps the four installable compositions functional", async ({ page }) => {
  const dataTable = page.locator("[data-slot=data-table]")
  const tableFilter = page.getByRole("textbox", { name: "Filter components" })
  await tableFilter.fill("tab")
  await expect(dataTable.getByRole("cell", { name: "Table", exact: true })).toBeVisible()
  await expect(dataTable.getByText("1 results", { exact: true })).toBeVisible()

  await tableFilter.clear()
  await dataTable.getByRole("button", { name: "Component", exact: true }).click()
  await expect(dataTable.getByRole("columnheader", { name: "Component" })).toHaveAttribute(
    "aria-sort",
    "ascending"
  )
  await dataTable.getByRole("button", { name: "Go to next page" }).click()
  await expect(dataTable.getByRole("cell", { name: "Table", exact: true })).toBeVisible()

  const datePicker = page.getByRole("button", { name: "2026-08-20" })
  await datePicker.click()
  await expect(
    page.locator("[data-slot=popover-content] [data-slot=calendar]")
  ).toBeVisible()
  await page.keyboard.press("Escape")
  await expect(datePicker).toBeFocused()

  const form = page.locator("[data-slot=form]")
  const projectName = form.getByRole("textbox", { name: "Project name" })
  await form.getByRole("button", { name: "Save project" }).click()
  await expect.poll(() => projectName.evaluate((input) => (input as HTMLInputElement).checkValidity())).toBe(false)
  await projectName.fill("Customer portal")
  await expect.poll(() => projectName.evaluate((input) => (input as HTMLInputElement).checkValidity())).toBe(true)

  await expect(
    page.getByRole("heading", { level: 4, name: "Readable content" })
  ).toBeVisible()
})

test("has no automated WCAG A or AA violations in core themes", async ({ page }) => {
  test.setTimeout(120_000)

  const states = [
    { theme: "neutral", mode: "Light" },
    { theme: "neutral", mode: "Dark" },
    { theme: "tis", mode: "Light" },
    { theme: "tis", mode: "Dark" },
  ] as const

  for (const view of ["blocks", "charts", "components", "customize", "foundations", "tokens"]) {
    await page.goto(`/#${view}`)
    for (const state of states) {
      const appearanceControls = page.getByLabel("Appearance controls")
      await appearanceControls.getByRole("button", {
        name: state.theme === "neutral" ? "Neutral" : "TIS",
        exact: true,
      }).click()
      await appearanceControls.getByRole("button", { name: state.mode, exact: true }).click()
      await page.waitForTimeout(250)

      const results = await new AxeBuilder({ page })
        .withTags(["wcag2a", "wcag2aa", "wcag21a", "wcag21aa", "wcag22aa"])
        .analyze()
      expect(results.violations).toEqual([])
    }
  }
})

test("keeps generated custom themes free of automated WCAG A or AA violations", async ({ page }) => {
  await page.goto("/#customize")
  const cases = [
    { base: "Neutral", brand: "#0056e0" },
    { base: "Slate", brand: "#7c3aed" },
    { base: "Stone", brand: "#0f766e" },
    { base: "Zinc", brand: "#b42318" },
  ]

  for (const customCase of cases) {
    await page.getByRole("button", { name: /Base color preset:/ }).click()
    await page.getByRole("menuitemradio", { name: customCase.base }).click()
    await page.getByRole("textbox", { name: "Brand color", exact: true }).fill(customCase.brand)
    for (const mode of ["Light", "Dark"] as const) {
      await page.getByRole("group", { name: "Customizer mode" }).getByRole("button", { name: mode }).click()
      await page.waitForTimeout(200)
      const results = await new AxeBuilder({ page })
        .withTags(["wcag2a", "wcag2aa", "wcag21a", "wcag21aa", "wcag22aa"])
        .analyze()
      expect(results.violations).toEqual([])
    }
  }
})

test("remains usable without horizontal overflow at 320px and 390px", async ({ page }) => {
  for (const width of [320, 390]) {
    await page.setViewportSize({ width, height: 844 })
    for (const view of ["blocks", "charts", "components", "customize", "foundations", "tokens"]) {
      await page.goto(`/#${view}`)
      if (view === "components") {
        await expect(page.locator("article.component-row")).toHaveCount(componentCount)
      }

      const metrics = await page.evaluate(() => ({
        clientWidth: document.documentElement.clientWidth,
        scrollWidth: document.documentElement.scrollWidth,
      }))
      expect(metrics.scrollWidth).toBe(metrics.clientWidth)
    }
  }
})
