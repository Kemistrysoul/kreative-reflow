"use client"

import * as React from "react"
import { isValidElement, type ReactNode } from "react"
import * as SelectPrimitive from "@radix-ui/react-select"
import { cva, type VariantProps } from "class-variance-authority"
import { Check, ChevronDown, ChevronUp } from "lucide-react"

import { cn } from "@/lib/utils"

const SelectContext = React.createContext<{
  indicatorPosition: "left" | "right"
  indicatorVisibility: boolean
  indicator: ReactNode
}>({
  indicatorPosition: "left",
  indicator: null,
  indicatorVisibility: true,
})

function Select({
  indicatorPosition = "left",
  indicatorVisibility = true,
  indicator,
  ...props
}: {
  indicatorPosition?: "left" | "right"
  indicatorVisibility?: boolean
  indicator?: ReactNode
} & React.ComponentProps<typeof SelectPrimitive.Root>) {
  return (
    <SelectContext.Provider
      value={{ indicatorPosition, indicatorVisibility, indicator }}
    >
      <SelectPrimitive.Root {...props} />
    </SelectContext.Provider>
  )
}

function SelectGroup({
  ...props
}: React.ComponentProps<typeof SelectPrimitive.Group>) {
  return <SelectPrimitive.Group data-slot="select-group" {...props} />
}

function SelectValue({
  ...props
}: React.ComponentProps<typeof SelectPrimitive.Value>) {
  return <SelectPrimitive.Value data-slot="select-value" {...props} />
}

const selectTriggerVariants = cva(
  "flex w-full items-center justify-between border border-[#151419]/12 bg-[#FBFBFB] font-montserrat text-[#151419] shadow-[0_10px_30px_rgba(21,20,25,0.04)] outline-none transition-all duration-200 data-[placeholder]:text-[#151419]/38 focus:border-[#FC6E20] focus:ring-2 focus:ring-[#FC6E20]/20 disabled:cursor-not-allowed disabled:opacity-50 [&>span]:line-clamp-1",
  {
    variants: {
      size: {
        sm: "h-9 gap-1 rounded-[10px] px-3 text-xs",
        md: "h-11 gap-1.5 rounded-[12px] px-4 text-sm",
        lg: "min-h-14 gap-2 rounded-[14px] px-4 text-sm",
      },
    },
    defaultVariants: {
      size: "md",
    },
  },
)

export interface SelectTriggerProps
  extends React.ComponentProps<typeof SelectPrimitive.Trigger>,
    VariantProps<typeof selectTriggerVariants> {}

function SelectTrigger({
  className,
  children,
  size,
  ...props
}: SelectTriggerProps) {
  return (
    <SelectPrimitive.Trigger
      data-slot="select-trigger"
      className={cn(selectTriggerVariants({ size }), className)}
      {...props}
    >
      {children}
      <SelectPrimitive.Icon asChild>
        <ChevronDown className="-me-0.5 h-4 w-4 opacity-60 transition-transform duration-200 group-data-[state=open]:rotate-180" />
      </SelectPrimitive.Icon>
    </SelectPrimitive.Trigger>
  )
}

function SelectScrollUpButton({
  className,
  ...props
}: React.ComponentProps<typeof SelectPrimitive.ScrollUpButton>) {
  return (
    <SelectPrimitive.ScrollUpButton
      data-slot="select-scroll-up-button"
      className={cn(
        "flex cursor-default items-center justify-center py-1 text-[#151419]/55",
        className,
      )}
      {...props}
    >
      <ChevronUp className="h-4 w-4" />
    </SelectPrimitive.ScrollUpButton>
  )
}

function SelectScrollDownButton({
  className,
  ...props
}: React.ComponentProps<typeof SelectPrimitive.ScrollDownButton>) {
  return (
    <SelectPrimitive.ScrollDownButton
      data-slot="select-scroll-down-button"
      className={cn(
        "flex cursor-default items-center justify-center py-1 text-[#151419]/55",
        className,
      )}
      {...props}
    >
      <ChevronDown className="h-4 w-4" />
    </SelectPrimitive.ScrollDownButton>
  )
}

function SelectContent({
  className,
  children,
  position = "popper",
  ...props
}: React.ComponentProps<typeof SelectPrimitive.Content>) {
  return (
    <SelectPrimitive.Portal>
      <SelectPrimitive.Content
        data-slot="select-content"
        className={cn(
          "relative z-50 max-h-96 min-w-[8rem] overflow-hidden rounded-[14px] border border-[#151419]/12 bg-[#FBFBFB] font-montserrat text-sm text-[#151419] shadow-[0_24px_70px_rgba(21,20,25,0.18)] data-[state=closed]:animate-out data-[state=open]:animate-in data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2",
          position === "popper" &&
            "data-[side=bottom]:translate-y-1.5 data-[side=left]:-translate-x-1.5 data-[side=right]:translate-x-1.5 data-[side=top]:-translate-y-1.5",
          className,
        )}
        position={position}
        {...props}
      >
        <SelectScrollUpButton />
        <SelectPrimitive.Viewport
          className={cn(
            "p-1.5",
            position === "popper" &&
              "h-[var(--radix-select-trigger-height)] w-full min-w-[var(--radix-select-trigger-width)]",
          )}
        >
          {children}
        </SelectPrimitive.Viewport>
        <SelectScrollDownButton />
      </SelectPrimitive.Content>
    </SelectPrimitive.Portal>
  )
}

function SelectLabel({
  className,
  ...props
}: React.ComponentProps<typeof SelectPrimitive.Label>) {
  return (
    <SelectPrimitive.Label
      data-slot="select-label"
      className={cn(
        "px-8 py-1.5 text-xs font-bold uppercase tracking-[0.14em] text-[#151419]/48",
        className,
      )}
      {...props}
    />
  )
}

function SelectItem({
  className,
  children,
  ...props
}: React.ComponentProps<typeof SelectPrimitive.Item>) {
  const { indicatorPosition, indicatorVisibility, indicator } =
    React.useContext(SelectContext)

  return (
    <SelectPrimitive.Item
      data-slot="select-item"
      className={cn(
        "relative flex w-full cursor-default select-none items-center rounded-[10px] py-2 text-sm text-[#151419] outline-none transition-colors hover:bg-[#FC6E20]/12 focus:bg-[#FC6E20]/12 data-[disabled]:pointer-events-none data-[disabled]:opacity-50",
        indicatorPosition === "left" ? "pe-2 ps-8" : "pe-8 ps-2",
        className,
      )}
      {...props}
    >
      {indicatorVisibility &&
        (indicator && isValidElement(indicator) ? (
          indicator
        ) : (
          <span
            className={cn(
              "absolute flex h-3.5 w-3.5 items-center justify-center",
              indicatorPosition === "left" ? "start-2" : "end-2",
            )}
          >
            <SelectPrimitive.ItemIndicator>
              <Check className="h-4 w-4 text-[#FC6E20]" />
            </SelectPrimitive.ItemIndicator>
          </span>
        ))}
      <SelectPrimitive.ItemText>{children}</SelectPrimitive.ItemText>
    </SelectPrimitive.Item>
  )
}

function SelectIndicator({
  children,
  className,
  ...props
}: React.ComponentProps<typeof SelectPrimitive.ItemIndicator>) {
  const { indicatorPosition } = React.useContext(SelectContext)

  return (
    <span
      data-slot="select-indicator"
      className={cn(
        "absolute top-1/2 flex -translate-y-1/2 items-center justify-center",
        indicatorPosition === "left" ? "start-2" : "end-2",
        className,
      )}
      {...props}
    >
      <SelectPrimitive.ItemIndicator>
        {children}
      </SelectPrimitive.ItemIndicator>
    </span>
  )
}

function SelectSeparator({
  className,
  ...props
}: React.ComponentProps<typeof SelectPrimitive.Separator>) {
  return (
    <SelectPrimitive.Separator
      data-slot="select-separator"
      className={cn("-mx-1.5 my-1.5 h-px bg-[#151419]/10", className)}
      {...props}
    />
  )
}

export {
  Select,
  SelectContent,
  SelectGroup,
  SelectIndicator,
  SelectItem,
  SelectLabel,
  SelectScrollDownButton,
  SelectScrollUpButton,
  SelectSeparator,
  SelectTrigger,
  SelectValue,
}
