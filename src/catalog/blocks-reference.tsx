import { useState } from "react"
import { CheckIcon, CopyIcon } from "lucide-react"

import { blocks, type CatalogBlock } from "@/catalog/catalog-data"
import { DashboardOverview } from "@/blocks/dashboard-overview"
import { LoginPage } from "@/blocks/login-page"
import { SettingsPage } from "@/blocks/settings-page"
import { TeamMembers } from "@/blocks/team-members"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { registryUrl } from "@/lib/public-url"

function BlockPreview({ name }: { name: CatalogBlock["name"] }) {
  switch (name) {
    case "dashboard-overview":
      return <DashboardOverview />
    case "login-page":
      return <LoginPage onSubmit={(event) => event.preventDefault()} />
    case "settings-page":
      return <SettingsPage onSubmit={(event) => event.preventDefault()} />
    case "team-members":
      return <TeamMembers />
  }
}

function BlocksReference() {
  const [copied, setCopied] = useState<string | null>(null)

  async function copyInstall(name: string) {
    await navigator.clipboard.writeText(`npx shadcn@4.18.0 add ${registryUrl(name)}`)
    setCopied(name)
    window.setTimeout(() => setCopied((current) => (current === name ? null : current)), 1800)
  }

  return (
    <section className="blocks-section" id="blocks" aria-labelledby="blocks-title">
      <div className="container">
        <div className="reference-heading">
          <div>
            <h2 id="blocks-title">Blocks</h2>
            <p>{blocks.length} installable application patterns composed from the same component source.</p>
          </div>
          <Badge variant="secondary">registry:block</Badge>
        </div>

        <div className="block-list">
          {blocks.map((block) => (
            <article className="block-entry" id={block.name} key={block.name}>
              <div className="block-entry-header">
                <div>
                  <div className="block-entry-title">
                    <h3>{block.title}</h3>
                    <Badge variant="outline">{block.category}</Badge>
                  </div>
                  <p>{block.description}</p>
                </div>
                <Button type="button" variant="outline" onClick={() => copyInstall(block.name)}>
                  {copied === block.name ? <CheckIcon data-icon="inline-start" /> : <CopyIcon data-icon="inline-start" />}
                  {copied === block.name ? "Copied" : "Copy install"}
                </Button>
              </div>
              <div className="block-preview">
                <BlockPreview name={block.name} />
              </div>
            </article>
          ))}
        </div>
      </div>
      <div className="sr-only" aria-live="polite">
        {copied ? `Install command for ${copied} copied.` : ""}
      </div>
    </section>
  )
}

export { BlocksReference }
