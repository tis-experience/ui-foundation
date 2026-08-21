import catalogSource from "../../registry/catalog.json"

type CatalogComponent = (typeof catalogSource.components)[number]
type CatalogBlock = (typeof catalogSource.blocks)[number]

const catalog = catalogSource
const components = catalog.components
const blocks = catalog.blocks
const releaseFilters = ["all", "recently-added"] as const
const categories = Array.from(
  new Set(components.map((component) => component.category))
).sort((a, b) => a.localeCompare(b))
const filters = [...releaseFilters, ...categories]

function minorReleaseLine(version: string) {
  const match = /^(\d+)\.(\d+)\./.exec(version)
  return match ? `${match[1]}.${match[2]}` : version
}

function isRecentlyAdded(component: CatalogComponent) {
  return (
    "introducedIn" in component &&
    typeof component.introducedIn === "string" &&
    minorReleaseLine(component.introducedIn) === minorReleaseLine(catalog.version)
  )
}

export {
  catalog,
  blocks,
  categories,
  components,
  filters,
  isRecentlyAdded,
  releaseFilters,
  type CatalogComponent,
  type CatalogBlock,
}
