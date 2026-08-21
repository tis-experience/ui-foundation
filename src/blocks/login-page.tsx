import type { FormEventHandler } from "react"
import { ArrowRightIcon, ShieldCheckIcon } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { Field, FieldDescription, FieldGroup, FieldLabel } from "@/components/ui/field"
import { Input } from "@/components/ui/input"

interface LoginPageProps {
  description?: string
  onSubmit?: FormEventHandler<HTMLFormElement>
  title?: string
}

function LoginPage({
  description = "Use your organization account to continue.",
  onSubmit,
  title = "Welcome back",
}: LoginPageProps) {
  return (
    <section className="grid min-h-[32rem] place-items-center rounded-xl border bg-muted/40 p-4 sm:p-8" aria-labelledby="login-page-title">
      <Card className="w-full max-w-md">
        <CardHeader>
          <div className="mb-2 grid size-10 place-items-center rounded-lg bg-primary text-primary-foreground" aria-hidden="true">
            <ShieldCheckIcon className="size-5" />
          </div>
          <CardTitle className="text-2xl"><h2 id="login-page-title">{title}</h2></CardTitle>
          <CardDescription>{description}</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={onSubmit}>
            <FieldGroup>
              <Field>
                <FieldLabel htmlFor="login-page-email">Email</FieldLabel>
                <Input id="login-page-email" name="email" type="email" autoComplete="email" required />
              </Field>
              <Field>
                <div className="flex items-center justify-between gap-3">
                  <FieldLabel htmlFor="login-page-password">Password</FieldLabel>
                  <a className="text-sm text-primary underline-offset-4 hover:underline" href="#forgot-password">Forgot password?</a>
                </div>
                <Input id="login-page-password" name="password" type="password" autoComplete="current-password" required />
              </Field>
              <Field orientation="horizontal">
                <Checkbox id="login-page-remember" name="remember" />
                <FieldLabel htmlFor="login-page-remember">Keep me signed in</FieldLabel>
              </Field>
              <Button type="submit" className="w-full">
                Sign in
                <ArrowRightIcon data-icon="inline-end" />
              </Button>
              <FieldDescription className="text-center">
                Need access? <a href="#request-access">Request an account</a>.
              </FieldDescription>
            </FieldGroup>
          </form>
        </CardContent>
      </Card>
    </section>
  )
}

export { LoginPage, type LoginPageProps }
