import type { FormEventHandler } from "react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Field, FieldDescription, FieldGroup, FieldLabel } from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { NativeSelect, NativeSelectOption } from "@/components/ui/native-select"
import { Separator } from "@/components/ui/separator"
import { Switch } from "@/components/ui/switch"

interface SettingsPageProps {
  onSubmit?: FormEventHandler<HTMLFormElement>
}

function SettingsPage({ onSubmit }: SettingsPageProps) {
  return (
    <section className="grid gap-5" aria-labelledby="settings-page-title">
      <header>
        <h2 id="settings-page-title" className="font-heading text-2xl font-semibold tracking-tight">Workspace settings</h2>
        <p className="text-sm text-muted-foreground">Manage identity, localization and notifications.</p>
      </header>

      <form onSubmit={onSubmit}>
        <Card>
          <CardHeader>
            <CardTitle>General</CardTitle>
            <CardDescription>Information shown across the workspace.</CardDescription>
          </CardHeader>
          <CardContent>
            <FieldGroup>
              <Field>
                <FieldLabel htmlFor="settings-workspace-name">Workspace name</FieldLabel>
                <Input id="settings-workspace-name" name="workspaceName" defaultValue="Digital services" required />
                <FieldDescription>Use a clear name people can recognize.</FieldDescription>
              </Field>
              <Field>
                <FieldLabel htmlFor="settings-locale">Default locale</FieldLabel>
                <NativeSelect id="settings-locale" name="locale" defaultValue="pt-AO" className="w-full max-w-sm">
                  <NativeSelectOption value="pt-AO">Português (Angola)</NativeSelectOption>
                  <NativeSelectOption value="pt-BR">Português (Brasil)</NativeSelectOption>
                  <NativeSelectOption value="en">English</NativeSelectOption>
                </NativeSelect>
              </Field>
              <Separator />
              <Field orientation="horizontal">
                <div className="flex-1">
                  <FieldLabel htmlFor="settings-weekly-summary">Weekly summary</FieldLabel>
                  <FieldDescription>Receive an email with activity and adoption trends.</FieldDescription>
                </div>
                <Switch id="settings-weekly-summary" name="weeklySummary" defaultChecked />
              </Field>
              <Field orientation="horizontal">
                <div className="flex-1">
                  <FieldLabel htmlFor="settings-product-updates">Product updates</FieldLabel>
                  <FieldDescription>Receive important release and maintenance notices.</FieldDescription>
                </div>
                <Switch id="settings-product-updates" name="productUpdates" defaultChecked />
              </Field>
            </FieldGroup>
          </CardContent>
          <CardFooter className="justify-end gap-2">
            <Button type="reset" variant="ghost">Reset</Button>
            <Button type="submit">Save settings</Button>
          </CardFooter>
        </Card>
      </form>
    </section>
  )
}

export { SettingsPage, type SettingsPageProps }
