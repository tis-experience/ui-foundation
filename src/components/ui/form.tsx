import * as React from "react"

import { cn } from "@/lib/utils"
import { FieldGroup } from "@/components/ui/field"

type FormProps = React.ComponentProps<"form"> & {
  pending?: boolean
}

function Form({ className, pending = false, ...props }: FormProps) {
  return (
    <form
      data-slot="form"
      data-pending={pending || undefined}
      aria-busy={pending || undefined}
      className={cn("flex w-full flex-col gap-6", className)}
      {...props}
    />
  )
}

function FormBody({ className, ...props }: React.ComponentProps<typeof FieldGroup>) {
  return (
    <FieldGroup
      data-slot="form-body"
      className={cn("gap-5", className)}
      {...props}
    />
  )
}

function FormActions({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="form-actions"
      className={cn(
        "flex flex-col-reverse gap-2 sm:flex-row sm:justify-end",
        className
      )}
      {...props}
    />
  )
}

export { Form, FormActions, FormBody, type FormProps }
