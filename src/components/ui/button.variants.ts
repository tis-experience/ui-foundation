import { cva, type VariantProps } from "class-variance-authority"

const buttonVariants = cva(
  "group/button inline-flex shrink-0 items-center justify-center rounded-[var(--control-radius)] border border-transparent bg-clip-padding font-medium whitespace-nowrap transition-all outline-none select-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 active:not-aria-[haspopup]:translate-y-px disabled:pointer-events-none disabled:opacity-50 aria-invalid:border-destructive aria-invalid:ring-3 aria-invalid:ring-destructive/20 dark:aria-invalid:border-destructive/50 dark:aria-invalid:ring-destructive/40 [&_svg]:pointer-events-none [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground hover:bg-primary/80",
        outline:
          "border-border bg-background hover:bg-muted hover:text-foreground aria-expanded:bg-muted aria-expanded:text-foreground dark:border-input dark:bg-input/30 dark:hover:bg-input/50",
        secondary:
          "bg-secondary text-secondary-foreground hover:bg-[color-mix(in_oklch,var(--secondary),var(--foreground)_5%)] aria-expanded:bg-secondary aria-expanded:text-secondary-foreground",
        ghost:
          "hover:bg-muted hover:text-foreground aria-expanded:bg-muted aria-expanded:text-foreground dark:hover:bg-muted/50",
        destructive:
          "bg-destructive/10 text-destructive hover:bg-destructive/20 focus-visible:border-destructive/40 focus-visible:ring-destructive/20 dark:bg-destructive/20 dark:hover:bg-destructive/30 dark:focus-visible:ring-destructive/40",
        link: "text-primary underline-offset-4 hover:underline",
      },
      size: {
        default:
          "h-[var(--ui-control-height-md)] gap-[var(--ui-control-gap-md)] px-[var(--ui-control-padding-inline-md)] text-[length:var(--ui-control-font-size-md)] has-data-[icon=inline-end]:pr-[calc(var(--ui-control-padding-inline-md)-0.125rem)] has-data-[icon=inline-start]:pl-[calc(var(--ui-control-padding-inline-md)-0.125rem)] [&_svg:not([class*='size-'])]:size-[var(--ui-control-icon-size-md)]",
        xs: "h-6 gap-1 rounded-[var(--control-radius-sm)] px-2 text-xs in-data-[slot=button-group]:rounded-[var(--control-radius-sm)] has-data-[icon=inline-end]:pr-1.5 has-data-[icon=inline-start]:pl-1.5 [&_svg:not([class*='size-'])]:size-3",
        sm: "h-[var(--ui-control-height-sm)] gap-[var(--ui-control-gap-sm)] rounded-[var(--control-radius-sm)] px-[var(--ui-control-padding-inline-sm)] text-[length:var(--ui-control-font-size-sm)] in-data-[slot=button-group]:rounded-[var(--control-radius-sm)] has-data-[icon=inline-end]:pr-[calc(var(--ui-control-padding-inline-sm)-0.125rem)] has-data-[icon=inline-start]:pl-[calc(var(--ui-control-padding-inline-sm)-0.125rem)] [&_svg:not([class*='size-'])]:size-[var(--ui-control-icon-size-sm)]",
        lg: "h-[var(--ui-control-height-lg)] gap-[var(--ui-control-gap-lg)] px-[var(--ui-control-padding-inline-lg)] text-[length:var(--ui-control-font-size-lg)] has-data-[icon=inline-end]:pr-[calc(var(--ui-control-padding-inline-lg)-0.125rem)] has-data-[icon=inline-start]:pl-[calc(var(--ui-control-padding-inline-lg)-0.125rem)] [&_svg:not([class*='size-'])]:size-[var(--ui-control-icon-size-lg)]",
        icon: "size-[var(--ui-control-height-md)] [&_svg:not([class*='size-'])]:size-[var(--ui-control-icon-size-md)]",
        "icon-xs":
          "size-6 rounded-[var(--control-radius-sm)] in-data-[slot=button-group]:rounded-[var(--control-radius-sm)] [&_svg:not([class*='size-'])]:size-3",
        "icon-sm":
          "size-[var(--ui-control-height-sm)] rounded-[var(--control-radius-sm)] in-data-[slot=button-group]:rounded-[var(--control-radius-sm)] [&_svg:not([class*='size-'])]:size-[var(--ui-control-icon-size-sm)]",
        "icon-lg": "size-[var(--ui-control-height-lg)] [&_svg:not([class*='size-'])]:size-[var(--ui-control-icon-size-lg)]",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

type ButtonVariantProps = VariantProps<typeof buttonVariants>

export { buttonVariants, type ButtonVariantProps }
