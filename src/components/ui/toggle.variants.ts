import { cva, type VariantProps } from "class-variance-authority"

const toggleVariants = cva(
  "group/toggle inline-flex items-center justify-center rounded-[var(--control-radius)] font-medium whitespace-nowrap transition-all outline-none hover:bg-muted hover:text-foreground focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50 disabled:pointer-events-none disabled:opacity-50 aria-invalid:border-destructive aria-invalid:ring-destructive/20 aria-pressed:bg-muted data-[state=on]:bg-muted dark:aria-invalid:ring-destructive/40 [&_svg]:pointer-events-none [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        default: "bg-transparent",
        outline: "border border-input bg-transparent hover:bg-muted",
      },
      size: {
        default:
          "h-[var(--ui-control-height-md)] min-w-[var(--ui-control-height-md)] gap-[var(--ui-control-gap-md)] px-[var(--ui-control-padding-inline-md)] text-[length:var(--ui-control-font-size-md)] [&_svg:not([class*='size-'])]:size-[var(--ui-control-icon-size-md)]",
        sm: "h-[var(--ui-control-height-sm)] min-w-[var(--ui-control-height-sm)] gap-[var(--ui-control-gap-sm)] rounded-[var(--control-radius-sm)] px-[var(--ui-control-padding-inline-sm)] text-[length:var(--ui-control-font-size-sm)] [&_svg:not([class*='size-'])]:size-[var(--ui-control-icon-size-sm)]",
        lg: "h-[var(--ui-control-height-lg)] min-w-[var(--ui-control-height-lg)] gap-[var(--ui-control-gap-lg)] px-[var(--ui-control-padding-inline-lg)] text-[length:var(--ui-control-font-size-lg)] [&_svg:not([class*='size-'])]:size-[var(--ui-control-icon-size-lg)]",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

type ToggleVariantProps = VariantProps<typeof toggleVariants>

export { toggleVariants, type ToggleVariantProps }
