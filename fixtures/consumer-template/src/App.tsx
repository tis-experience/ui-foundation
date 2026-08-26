import { useEffect, useState, type FormEvent } from "react"
import { CircleHelpIcon, MoonIcon, PaletteIcon, PlusIcon, SunIcon } from "lucide-react"

import { DashboardOverview } from "@/blocks/dashboard-overview"
import { SettingsPage } from "@/blocks/settings-page"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Field, FieldContent, FieldDescription, FieldError, FieldGroup, FieldLabel } from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { NativeSelect, NativeSelectOption } from "@/components/ui/native-select"
import { Switch } from "@/components/ui/switch"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"

type Density = "compact" | "comfortable" | "spacious"
type Identity = "neutral" | "tis"

interface NewWorkItemDialogProps {
  onCreated: (title: string) => void
}

function NewWorkItemDialog({ onCreated }: NewWorkItemDialogProps) {
  const [open, setOpen] = useState(false)

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const form = event.currentTarget
    const data = new FormData(form)
    onCreated(String(data.get("title")))
    form.reset()
    setOpen(false)
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger render={<Button />}>
        <PlusIcon data-icon="inline-start" />
        New work item
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create work item</DialogTitle>
          <DialogDescription>Add an item to the service operations queue.</DialogDescription>
        </DialogHeader>
        <form id="new-work-item" className="flex flex-col gap-4" onSubmit={handleSubmit}>
          <FieldGroup>
            <Field>
              <FieldLabel htmlFor="work-item-title">Title</FieldLabel>
              <Input id="work-item-title" name="title" required autoFocus />
              <FieldDescription>Use a short, actionable description.</FieldDescription>
            </Field>
            <Field>
              <FieldLabel htmlFor="work-item-priority">Priority</FieldLabel>
              <NativeSelect id="work-item-priority" name="priority" className="w-full">
                <NativeSelectOption value="normal">Normal</NativeSelectOption>
                <NativeSelectOption value="high">High</NativeSelectOption>
                <NativeSelectOption value="urgent">Urgent</NativeSelectOption>
              </NativeSelect>
            </Field>
          </FieldGroup>
        </form>
        <DialogFooter>
          <DialogClose render={<Button type="button" variant="outline" />}>Cancel</DialogClose>
          <Button type="submit" form="new-work-item">Create item</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

function ComponentStates() {
  return (
    <section className="grid gap-4 lg:grid-cols-2" aria-labelledby="component-states-title">
      <h2 id="component-states-title" className="sr-only">Component states</h2>
      <Card>
        <CardHeader>
          <CardTitle>Actions</CardTitle>
          <CardDescription>Variants, focus, disabled state and contextual help.</CardDescription>
        </CardHeader>
        <CardContent className="flex flex-wrap items-center gap-3">
          <Button>Primary action</Button>
          <Button variant="secondary">Secondary</Button>
          <Button variant="outline">Outline</Button>
          <Button variant="destructive">Delete draft</Button>
          <Button disabled>Unavailable</Button>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger render={<Button variant="outline" size="icon" aria-label="View keyboard guidance" />}>
                <CircleHelpIcon />
              </TooltipTrigger>
              <TooltipContent>View keyboard guidance</TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </CardContent>
        <CardFooter className="text-xs text-muted-foreground">Tab through every enabled action to inspect the focus outline.</CardFooter>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Fields</CardTitle>
          <CardDescription>Default, read-only, invalid and boolean input states.</CardDescription>
        </CardHeader>
        <CardContent>
          <FieldGroup>
            <Field>
              <FieldLabel htmlFor="consumer-name">Service name</FieldLabel>
              <Input id="consumer-name" defaultValue="Citizen portal" />
              <FieldDescription>Editable field using Comfortable density by default.</FieldDescription>
            </Field>
            <Field>
              <FieldLabel htmlFor="consumer-id">Service ID</FieldLabel>
              <Input id="consumer-id" defaultValue="SRV-0482" readOnly />
              <FieldDescription>Read-only controls keep a neutral focus outline.</FieldDescription>
            </Field>
            <Field data-invalid>
              <FieldLabel htmlFor="consumer-owner">Owner email</FieldLabel>
              <Input id="consumer-owner" defaultValue="invalid" aria-invalid aria-describedby="consumer-owner-error" />
              <FieldError id="consumer-owner-error">Enter a valid email address.</FieldError>
            </Field>
            <Field orientation="horizontal">
              <FieldContent>
                <FieldLabel htmlFor="consumer-monitoring">Continuous monitoring</FieldLabel>
                <FieldDescription>Receive an alert when availability drops.</FieldDescription>
              </FieldContent>
              <Switch id="consumer-monitoring" defaultChecked />
            </Field>
          </FieldGroup>
        </CardContent>
      </Card>
    </section>
  )
}

function App() {
  const [density, setDensity] = useState<Density>("comfortable")
  const [identity, setIdentity] = useState<Identity>("neutral")
  const [dark, setDark] = useState(false)
  const [status, setStatus] = useState("Consumer ready")

  useEffect(() => {
    const root = document.documentElement
    root.dataset.uiDensity = density
    root.classList.toggle("dark", dark)
    if (identity === "tis") root.dataset.uiTheme = "tis"
    else root.removeAttribute("data-ui-theme")
  }, [dark, density, identity])

  return (
    <div className="mx-auto flex min-h-svh w-full max-w-7xl flex-col px-4 py-5 sm:px-6 lg:px-8">
      <header className="flex flex-col gap-5 border-b pb-5 sm:flex-row sm:items-start sm:justify-between">
        <div className="flex flex-col gap-1">
          <div className="flex flex-wrap items-center gap-2">
            <h1 className="font-heading text-2xl font-semibold tracking-tight">Operations Workspace</h1>
            <Badge variant="outline">Source-owned registry</Badge>
          </div>
          <p className="max-w-2xl text-sm text-muted-foreground">A standalone project installed from UI Foundation.</p>
        </div>

        <div className="flex flex-wrap items-center gap-2" aria-label="Appearance controls">
          <label className="sr-only" htmlFor="density">Density</label>
          <NativeSelect
            id="density"
            aria-label="Interface density"
            value={density}
            onChange={(event) => setDensity(event.target.value as Density)}
          >
            <NativeSelectOption value="compact">Compact</NativeSelectOption>
            <NativeSelectOption value="comfortable">Comfortable</NativeSelectOption>
            <NativeSelectOption value="spacious">Spacious</NativeSelectOption>
          </NativeSelect>
          <Button
            type="button"
            variant="outline"
            aria-pressed={identity === "tis"}
            onClick={() => setIdentity((current) => current === "tis" ? "neutral" : "tis")}
          >
            <PaletteIcon data-icon="inline-start" />
            {identity === "tis" ? "TIS" : "Neutral"}
          </Button>
          <Button
            type="button"
            variant="outline"
            size="icon"
            aria-label={dark ? "Use light mode" : "Use dark mode"}
            aria-pressed={dark}
            onClick={() => setDark((current) => !current)}
          >
            {dark ? <SunIcon /> : <MoonIcon />}
          </Button>
        </div>
      </header>

      <main className="flex-1 py-6">
        <p className="sr-only" role="status" aria-live="polite">{status}</p>
        <Tabs defaultValue="overview">
          <TabsList variant="line" aria-label="Workspace sections">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="settings">Settings</TabsTrigger>
            <TabsTrigger value="components">Component states</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="pt-6">
            <div className="flex flex-col gap-5">
              <div className="flex justify-end">
                <NewWorkItemDialog onCreated={(title) => setStatus(`Work item ${title} created`)} />
              </div>
              <DashboardOverview title="Service operations" />
            </div>
          </TabsContent>

          <TabsContent value="settings" className="pt-6">
            <div className="mx-auto max-w-3xl">
              <SettingsPage onSubmit={(event) => {
                event.preventDefault()
                setStatus("Workspace settings saved")
              }} />
            </div>
          </TabsContent>

          <TabsContent value="components" className="pt-6">
            <ComponentStates />
          </TabsContent>
        </Tabs>
      </main>

      <footer className="border-t py-4 text-xs text-muted-foreground">Installed as owned source through shadcn.</footer>
    </div>
  )
}

export default App
