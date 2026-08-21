import * as React from "react"
import { OTPInput, OTPInputContext } from "input-otp"

import { cn } from "@/lib/utils"
import { MinusIcon } from "lucide-react"

const InputOTPInvalidContext = React.createContext(false)

function InputOTP({
  className,
  containerClassName,
  defaultValue,
  value,
  onChange,
  ...props
}: React.ComponentProps<typeof OTPInput> & {
  containerClassName?: string
}) {
  const [uncontrolledValue, setUncontrolledValue] = React.useState(
    typeof defaultValue === "string" ? defaultValue : ""
  )
  const controlled = typeof value === "string"
  const currentValue = controlled ? value : uncontrolledValue
  const invalid = props["aria-invalid"] === true || props["aria-invalid"] === "true"

  return (
    <InputOTPInvalidContext.Provider value={invalid}>
      <OTPInput
        data-slot="input-otp"
        containerClassName={cn(
          "cn-input-otp flex items-center has-disabled:opacity-50",
          containerClassName
        )}
        spellCheck={false}
        value={currentValue}
        onChange={(nextValue) => {
          if (!controlled) setUncontrolledValue(nextValue)
          onChange?.(nextValue)
        }}
        className={cn("disabled:cursor-not-allowed", className)}
        {...props}
      />
    </InputOTPInvalidContext.Provider>
  )
}

function InputOTPGroup({ className, ...props }: React.ComponentProps<"div">) {
  const invalid = React.useContext(InputOTPInvalidContext)

  return (
    <div
      data-slot="input-otp-group"
      data-invalid={invalid || undefined}
      className={cn(
        "flex items-center rounded-lg data-[invalid=true]:border-destructive data-[invalid=true]:ring-3 data-[invalid=true]:ring-destructive/20 dark:data-[invalid=true]:ring-destructive/40",
        className
      )}
      {...props}
    />
  )
}

function InputOTPSlot({
  index,
  className,
  ...props
}: React.ComponentProps<"div"> & {
  index: number
}) {
  const inputOTPContext = React.useContext(OTPInputContext)
  const invalid = React.useContext(InputOTPInvalidContext)
  const { char, hasFakeCaret, isActive } = inputOTPContext?.slots[index] ?? {}

  return (
    <div
      data-slot="input-otp-slot"
      data-active={isActive}
      data-invalid={invalid || undefined}
      className={cn(
        "relative flex size-[var(--ui-control-height-md)] items-center justify-center border-y border-r border-input text-[length:var(--ui-control-font-size-md)] transition-all outline-none first:rounded-l-lg first:border-l last:rounded-r-lg data-[invalid=true]:border-destructive data-[active=true]:z-10 data-[active=true]:border-ring data-[active=true]:ring-3 data-[active=true]:ring-ring/50 data-[active=true][data-invalid=true]:border-destructive data-[active=true][data-invalid=true]:ring-destructive/20 dark:bg-input/30 dark:data-[active=true][data-invalid=true]:ring-destructive/40",
        className
      )}
      {...props}
    >
      {char}
      {hasFakeCaret && (
        <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
          <div className="h-4 w-px animate-caret-blink bg-foreground duration-1000" />
        </div>
      )}
    </div>
  )
}

function InputOTPSeparator({ ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="input-otp-separator"
      className="flex items-center [&_svg:not([class*='size-'])]:size-4"
      role="separator"
      {...props}
    >
      <MinusIcon
      />
    </div>
  )
}

export { InputOTP, InputOTPGroup, InputOTPSlot, InputOTPSeparator }
