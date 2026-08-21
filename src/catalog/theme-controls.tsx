import { MoonIcon, SunIcon } from "lucide-react"

import { Button } from "@/components/ui/button"
import type { DensityName } from "@/catalog/foundation-data"

type ThemeName = "neutral" | "tis" | "custom"
type ModeName = "light" | "dark"

interface ThemeControlsProps {
  density: DensityName
  mode: ModeName
  onDensityChange: (density: DensityName) => void
  onModeChange: (mode: ModeName) => void
  onThemeChange: (theme: ThemeName) => void
  theme: ThemeName
}

function ThemeControls({
  density,
  mode,
  onDensityChange,
  onModeChange,
  onThemeChange,
  theme,
}: ThemeControlsProps) {
  return (
    <div className="theme-controls" aria-label="Appearance controls">
      <fieldset className="segmented-field segmented-field--theme">
        <legend>Theme</legend>
        <div className="segmented-control segmented-control--theme">
          {(["neutral", "tis", "custom"] as const).map((option) => (
            <Button
              key={option}
              type="button"
              size="sm"
              variant={theme === option ? "outline" : "ghost"}
              aria-pressed={theme === option}
              onClick={() => onThemeChange(option)}
            >
              {option === "tis" ? "TIS" : option.charAt(0).toUpperCase() + option.slice(1)}
            </Button>
          ))}
        </div>
      </fieldset>

      <fieldset className="segmented-field">
        <legend>Mode</legend>
        <div className="segmented-control">
          <Button
            type="button"
            size="sm"
            variant={mode === "light" ? "outline" : "ghost"}
            aria-pressed={mode === "light"}
            onClick={() => onModeChange("light")}
          >
            <SunIcon data-icon="inline-start" />
            Light
          </Button>
          <Button
            type="button"
            size="sm"
            variant={mode === "dark" ? "outline" : "ghost"}
            aria-pressed={mode === "dark"}
            onClick={() => onModeChange("dark")}
          >
            <MoonIcon data-icon="inline-start" />
            Dark
          </Button>
        </div>
      </fieldset>

      <fieldset className="segmented-field segmented-field--density">
        <legend>Density</legend>
        <div className="segmented-control segmented-control--density">
          {(["compact", "comfortable", "spacious"] as const).map((option) => (
            <Button
              key={option}
              type="button"
              size="sm"
              variant={density === option ? "outline" : "ghost"}
              aria-pressed={density === option}
              onClick={() => onDensityChange(option)}
            >
              {option.charAt(0).toUpperCase() + option.slice(1)}
            </Button>
          ))}
        </div>
      </fieldset>
    </div>
  )
}

export { ThemeControls, type ModeName, type ThemeName }
