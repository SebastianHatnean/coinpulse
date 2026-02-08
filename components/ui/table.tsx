"use client"

import * as React from "react"

import { cn } from "@/lib/utils"

/**
 * Render a styled table wrapped in a horizontally scrollable container.
 *
 * @returns A DOM structure: a container `div` with data-slot="table-container" that holds a `table` element with applied styling and forwarded props.
 */
function Table({ className, ...props }: React.ComponentProps<"table">) {
  return (
    <div
      data-slot="table-container"
      className="relative w-full overflow-x-auto"
    >
      <table
        data-slot="table"
        className={cn("w-full caption-bottom text-sm", className)}
        {...props}
      />
    </div>
  )
}

/**
 * Renders a table header (<thead>) element with standardized styling and a `data-slot="table-header"` attribute.
 *
 * Forwards remaining props to the underlying `<thead>` element.
 *
 * @returns The rendered `<thead>` element.
 */
function TableHeader({ className, ...props }: React.ComponentProps<"thead">) {
  return (
    <thead
      data-slot="table-header"
      className={cn("[&_tr]:border-b", className)}
      {...props}
    />
  )
}

/**
 * Renders a styled table body (<tbody>) element with a data-slot attribute for layout hooks.
 *
 * @returns A `<tbody>` element with merged class names and a `data-slot="table-body"` attribute.
 */
function TableBody({ className, ...props }: React.ComponentProps<"tbody">) {
  return (
    <tbody
      data-slot="table-body"
      className={cn("[&_tr:last-child]:border-0", className)}
      {...props}
    />
  )
}

/**
 * Renders a styled table footer element.
 *
 * @param className - Additional CSS classes to merge with the component's default footer styles
 * @returns The `<tfoot>` element with footer styling, a `data-slot="table-footer"` attribute, and any forwarded props
 */
function TableFooter({ className, ...props }: React.ComponentProps<"tfoot">) {
  return (
    <tfoot
      data-slot="table-footer"
      className={cn(
        "bg-muted/50 border-t font-medium [&>tr]:last:border-b-0",
        className
      )}
      {...props}
    />
  )
}

/**
 * Renders a table row (<tr>) element with standardized styling and a data-slot attribute.
 *
 * Forwards all standard <tr> props to the rendered element.
 *
 * @param className - Optional additional class names to merge with the component's default styles
 * @returns A <tr> element with hover background, selected-state background, bottom border, and transition styles applied
 */
function TableRow({ className, ...props }: React.ComponentProps<"tr">) {
  return (
    <tr
      data-slot="table-row"
      className={cn(
        "hover:bg-muted/50 data-[state=selected]:bg-muted border-b transition-colors",
        className
      )}
      {...props}
    />
  )
}

/**
 * Renders a styled table header cell (<th>).
 *
 * Accepts standard `<th>` props and merges a provided `className` with the component's default styles.
 *
 * @returns A `<th>` element with the component's default styling and any forwarded props.
 */
function TableHead({ className, ...props }: React.ComponentProps<"th">) {
  return (
    <th
      data-slot="table-head"
      className={cn(
        "text-foreground h-10 px-2 text-left align-middle font-medium whitespace-nowrap [&:has([role=checkbox])]:pr-0 [&>[role=checkbox]]:translate-y-[2px]",
        className
      )}
      {...props}
    />
  )
}

/**
 * Renders a table data cell (<td>) with consistent padding, alignment, and checkbox-aware spacing.
 *
 * @returns A `<td>` element with standardized styling, `data-slot="table-cell"`, and all provided props forwarded.
 */
function TableCell({ className, ...props }: React.ComponentProps<"td">) {
  return (
    <td
      data-slot="table-cell"
      className={cn(
        "p-2 align-middle whitespace-nowrap [&:has([role=checkbox])]:pr-0 [&>[role=checkbox]]:translate-y-[2px]",
        className
      )}
      {...props}
    />
  )
}

/**
 * Renders a styled table caption element.
 *
 * @returns The rendered `<caption>` element with a `data-slot="table-caption"` attribute and default muted, small-caption styling; additional props are forwarded to the element.
 */
function TableCaption({
  className,
  ...props
}: React.ComponentProps<"caption">) {
  return (
    <caption
      data-slot="table-caption"
      className={cn("text-muted-foreground mt-4 text-sm", className)}
      {...props}
    />
  )
}

export {
  Table,
  TableHeader,
  TableBody,
  TableFooter,
  TableHead,
  TableRow,
  TableCell,
  TableCaption,
}