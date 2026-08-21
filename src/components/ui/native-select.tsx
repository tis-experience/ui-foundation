import * as React from "react"

import { cn } from "@/lib/utils"
import { ChevronDownIcon } from "lucide-react"

type NativeSelectProps = Omit<React.ComponentProps<"select">, "size"> & {
  size?: "sm" | "default"
}

function NativeSelect({
  className,
  size = "default",
  ...props
}: NativeSelectProps) {
  return (
    <div
      className={cn(
        "group/native-select relative w-fit has-[select:disabled]:opacity-50",
        className
      )}
      data-slot="native-select-wrapper"
      data-size={size}
    >
      <select
        data-slot="native-select"
        data-size={size}
        className="h-[var(--ui-control-height-md)] w-full min-w-0 appearance-none rounded-[var(--control-radius)] border border-input bg-transparent py-1 pr-[calc(var(--ui-control-padding-inline-md)+var(--ui-control-icon-size-md))] pl-[var(--ui-control-padding-inline-md)] text-[length:var(--ui-control-font-size-md)] transition-colors outline-none select-none selection:bg-primary selection:text-primary-foreground placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 disabled:pointer-events-none disabled:cursor-not-allowed aria-invalid:border-destructive aria-invalid:ring-3 aria-invalid:ring-destructive/20 data-[size=sm]:h-[var(--ui-control-height-sm)] data-[size=sm]:px-[var(--ui-control-padding-inline-sm)] data-[size=sm]:pr-[calc(var(--ui-control-padding-inline-sm)+var(--ui-control-icon-size-sm))] data-[size=sm]:text-[length:var(--ui-control-font-size-sm)] data-[size=sm]:rounded-[var(--control-radius-sm)] dark:bg-input/30 dark:hover:bg-input/50 dark:aria-invalid:border-destructive/50 dark:aria-invalid:ring-destructive/40"
        {...props}
      />
      <ChevronDownIcon className="pointer-events-none absolute top-1/2 right-[var(--ui-control-padding-inline-md)] size-[var(--ui-control-icon-size-md)] -translate-y-1/2 text-muted-foreground select-none group-data-[size=sm]/native-select:right-[var(--ui-control-padding-inline-sm)] group-data-[size=sm]/native-select:size-[var(--ui-control-icon-size-sm)]" aria-hidden="true" data-slot="native-select-icon" />
    </div>
  )
}

function NativeSelectOption({
  className,
  ...props
}: React.ComponentProps<"option">) {
  return (
    <option
      data-slot="native-select-option"
      className={cn("bg-[Canvas] text-[CanvasText]", className)}
      {...props}
    />
  )
}

function NativeSelectOptGroup({
  className,
  ...props
}: React.ComponentProps<"optgroup">) {
  return (
    <optgroup
      data-slot="native-select-optgroup"
      className={cn("bg-[Canvas] text-[CanvasText]", className)}
      {...props}
    />
  )
}

export { NativeSelect, NativeSelectOptGroup, NativeSelectOption }
