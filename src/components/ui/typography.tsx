import * as React from "react"

import { cn } from "@/lib/utils"

import "@/components/ui/typography.css"

type TypesetElement = "article" | "div" | "section"

type TypesetProps = React.HTMLAttributes<HTMLElement> & {
  as?: TypesetElement
  density?: "compact" | "default" | "comfortable"
}

function Typeset({
  as: Component = "div",
  className,
  density = "default",
  ...props
}: TypesetProps) {
  return (
    <Component
      data-slot="typeset"
      data-density={density}
      className={cn(
        "typeset",
        density !== "default" && `typeset-${density}`,
        className
      )}
      {...props}
    />
  )
}

function TypesetScroll({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="typeset-scroll"
      className={cn("typeset-scroll", className)}
      {...props}
    />
  )
}

export { Typeset, TypesetScroll, type TypesetProps }
