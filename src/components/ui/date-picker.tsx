"use client"

import * as React from "react"
import { CalendarIcon } from "lucide-react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import {
  Popover,
  PopoverContent,
  PopoverTitle,
  PopoverTrigger,
} from "@/components/ui/popover"

type DatePickerProps = {
  calendarProps?: Omit<
    React.ComponentProps<typeof Calendar>,
    "mode" | "selected" | "onSelect"
  >
  className?: string
  contentProps?: Omit<React.ComponentProps<typeof PopoverContent>, "children">
  defaultOpen?: boolean
  defaultValue?: Date
  disabled?: boolean
  formatValue?: (date: Date) => string
  name?: string
  onOpenChange?: (open: boolean) => void
  onValueChange?: (date: Date | undefined) => void
  open?: boolean
  placeholder?: string
  popoverLabel?: string
  triggerProps?: Omit<React.ComponentProps<typeof Button>, "children" | "disabled">
  value?: Date | null
}

function defaultFormatValue(date: Date) {
  return new Intl.DateTimeFormat(undefined, { dateStyle: "medium" }).format(date)
}

function serializeDate(date: Date) {
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, "0")
  const day = String(date.getDate()).padStart(2, "0")
  return `${year}-${month}-${day}`
}

function DatePicker({
  calendarProps,
  className,
  contentProps,
  defaultOpen = false,
  defaultValue,
  disabled = false,
  formatValue = defaultFormatValue,
  name,
  onOpenChange,
  onValueChange,
  open,
  placeholder = "Pick a date",
  popoverLabel = "Choose a date",
  triggerProps,
  value,
}: DatePickerProps) {
  const [internalValue, setInternalValue] = React.useState<Date | undefined>(
    defaultValue
  )
  const [internalOpen, setInternalOpen] = React.useState(defaultOpen)
  const selected = value === undefined ? internalValue : value ?? undefined
  const isOpen = open === undefined ? internalOpen : open

  function setOpen(nextOpen: boolean) {
    if (open === undefined) setInternalOpen(nextOpen)
    onOpenChange?.(nextOpen)
  }

  function setSelected(nextValue: Date | undefined) {
    if (value === undefined) setInternalValue(nextValue)
    onValueChange?.(nextValue)
    if (nextValue) setOpen(false)
  }

  return (
    <div data-slot="date-picker" className={cn("w-fit", className)}>
      {name ? (
        <input
          type="hidden"
          disabled={disabled}
          name={name}
          value={selected ? serializeDate(selected) : ""}
        />
      ) : null}
      <Popover open={isOpen} onOpenChange={setOpen}>
        <PopoverTrigger
          disabled={disabled}
          render={
            <Button
              type="button"
              variant="outline"
              data-empty={!selected}
              className="justify-start text-left font-normal data-[empty=true]:text-muted-foreground"
              {...triggerProps}
              disabled={disabled}
            />
          }
        >
          <CalendarIcon data-icon="inline-start" aria-hidden="true" />
          {selected ? formatValue(selected) : placeholder}
        </PopoverTrigger>
        <PopoverContent
          align="start"
          className="w-auto p-0"
          {...contentProps}
        >
          <PopoverTitle className="sr-only">{popoverLabel}</PopoverTitle>
          <Calendar
            mode="single"
            selected={selected}
            onSelect={setSelected}
            autoFocus
            {...calendarProps}
          />
        </PopoverContent>
      </Popover>
    </div>
  )
}

export { DatePicker, type DatePickerProps }
