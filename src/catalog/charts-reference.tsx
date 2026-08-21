import { useState, type ReactNode } from "react"
import { CheckIcon, CopyIcon } from "lucide-react"

import {
  AreaChartRecipe,
  BarChartRecipe,
  LineChartRecipe,
  PieChartRecipe,
  RadarChartRecipe,
  RadialChartRecipe,
} from "@/charts/chart-recipes"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { registryUrl } from "@/lib/public-url"

const recipes: Array<{ description: string; name: string; preview: ReactNode }> = [
  { name: "Area", description: "Compare volume and trend across continuous series.", preview: <AreaChartRecipe /> },
  { name: "Bar", description: "Rank discrete categories with a shared quantitative scale.", preview: <BarChartRecipe /> },
  { name: "Line", description: "Show change over time without emphasizing area.", preview: <LineChartRecipe /> },
  { name: "Pie", description: "Show a small number of parts within a whole.", preview: <PieChartRecipe /> },
  { name: "Radar", description: "Compare multivariate profiles against a common target.", preview: <RadarChartRecipe /> },
  { name: "Radial", description: "Communicate one bounded progress value with text support.", preview: <RadialChartRecipe /> },
]

function ChartsReference() {
  const [copied, setCopied] = useState(false)

  async function copyInstall() {
    const url = registryUrl("chart-recipes")
    await navigator.clipboard.writeText(`npx shadcn@4.18.0 add ${url}`)
    setCopied(true)
    window.setTimeout(() => setCopied(false), 1800)
  }

  return (
    <section className="charts-section" id="charts" aria-labelledby="charts-title">
      <div className="container">
        <div className="reference-heading charts-heading">
          <div>
            <h2 id="charts-title">Chart recipes</h2>
            <p>Six responsive Recharts patterns using the active theme palette.</p>
          </div>
          <Button type="button" variant="outline" onClick={copyInstall}>
            {copied ? <CheckIcon data-icon="inline-start" /> : <CopyIcon data-icon="inline-start" />}
            {copied ? "Copied" : "Copy install"}
          </Button>
        </div>

        <div className="chart-token-strip" aria-label="Active chart palette">
          {Array.from({ length: 5 }, (_, index) => (
            <div key={index}>
              <span style={{ background: `var(--chart-${index + 1})` }} aria-hidden="true" />
              <code>--chart-{index + 1}</code>
            </div>
          ))}
        </div>

        <div className="chart-recipe-grid">
          {recipes.map((recipe) => (
            <article key={recipe.name}>
              <Card className="chart-recipe-card">
                <CardHeader>
                  <CardTitle><h3>{recipe.name}</h3></CardTitle>
                  <CardDescription>{recipe.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <figure>{recipe.preview}</figure>
                </CardContent>
              </Card>
            </article>
          ))}
        </div>

        <div className="chart-guidance">
          <Badge variant="secondary">Accessibility</Badge>
          <p>
            Every recipe ships with an accessible name, Recharts accessibility layer and a text
            summary. For product data, also provide a table when exact values are part of the task.
          </p>
        </div>
      </div>
      <div className="sr-only" aria-live="polite">{copied ? "Chart recipe install command copied." : ""}</div>
    </section>
  )
}

export { ChartsReference }
