"use client"

import * as React from "react"
import { useTable, type Column, type ColumnDef, type RowData } from "@tanstack/react-table"
import { ArrowDownIcon, ArrowUpDownIcon, ArrowUpIcon } from "lucide-react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { dataTableFeatures, type DataTableFeatures } from "@/components/ui/data-table.features"
import { Input } from "@/components/ui/input"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

type DataTableFilter = {
  columnId: string
  label: string
  placeholder?: string
}

type DataTableProps<TData extends RowData> = {
  ariaLabel: string
  caption?: React.ReactNode
  className?: string
  columns: ColumnDef<DataTableFeatures, TData>[]
  data: TData[]
  emptyMessage?: React.ReactNode
  filter?: DataTableFilter
  pageSize?: number
  pagination?: boolean
  showSelectionSummary?: boolean
}

type DataTableColumnHeaderProps<TData extends RowData, TValue> = {
  className?: string
  column: Column<DataTableFeatures, TData, TValue>
  title: string
}

function DataTableColumnHeader<TData extends RowData, TValue>({
  className,
  column,
  title,
}: DataTableColumnHeaderProps<TData, TValue>) {
  const direction = column.getIsSorted()

  if (!column.getCanSort()) {
    return <span className={className}>{title}</span>
  }

  return (
    <Button
      type="button"
      variant="ghost"
      size="sm"
      className={className}
      onClick={column.getToggleSortingHandler()}
    >
      {title}
      {direction === "asc" ? (
        <ArrowUpIcon data-icon="inline-end" aria-hidden="true" />
      ) : direction === "desc" ? (
        <ArrowDownIcon data-icon="inline-end" aria-hidden="true" />
      ) : (
        <ArrowUpDownIcon data-icon="inline-end" aria-hidden="true" />
      )}
    </Button>
  )
}

function sortDirection(value: false | "asc" | "desc") {
  if (value === "asc") return "ascending" as const
  if (value === "desc") return "descending" as const
  return "none" as const
}

function DataTable<TData extends RowData>({
  ariaLabel,
  caption,
  className,
  columns,
  data,
  emptyMessage = "No results.",
  filter,
  pageSize = 10,
  pagination = true,
  showSelectionSummary = false,
}: DataTableProps<TData>) {
  const table = useTable({
    features: dataTableFeatures,
    columns,
    data,
    initialState: {
      pagination: {
        pageIndex: 0,
        pageSize: pagination ? pageSize : Number.POSITIVE_INFINITY,
      },
    },
  })

  const filterColumn = filter ? table.getColumn(filter.columnId) : undefined
  const rows = table.getRowModel().rows
  const pageCount = table.getPageCount()
  const pageIndex = table.state.pagination.pageIndex

  return (
    <div data-slot="data-table" className={cn("flex w-full flex-col gap-3", className)}>
      {filter && filterColumn ? (
        <Input
          aria-label={filter.label}
          placeholder={filter.placeholder ?? filter.label}
          value={(filterColumn.getFilterValue() as string | undefined) ?? ""}
          onChange={(event) => filterColumn.setFilterValue(event.target.value)}
          className="max-w-sm"
        />
      ) : null}

      <div className="overflow-hidden rounded-lg border">
        <Table aria-label={ariaLabel}>
          {caption ? <caption className="sr-only">{caption}</caption> : null}
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <TableHead
                    key={header.id}
                    scope="col"
                    aria-sort={sortDirection(header.column.getIsSorted())}
                  >
                    {header.isPlaceholder ? null : (
                      <table.FlexRender header={header} />
                    )}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {rows.length ? (
              rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() ? "selected" : undefined}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      <table.FlexRender cell={cell} />
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={Math.max(table.getVisibleLeafColumns().length, 1)}
                  className="h-24 text-center text-muted-foreground"
                >
                  {emptyMessage}
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {pagination || showSelectionSummary ? (
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="text-sm text-muted-foreground" aria-live="polite">
            {showSelectionSummary
              ? `${table.getFilteredSelectedRowModel().rows.length} of ${table.getFilteredRowModel().rows.length} selected`
              : `${table.getFilteredRowModel().rows.length} results`}
          </div>
          {pagination ? (
            <div className="flex items-center gap-2">
              <span className="text-sm text-muted-foreground">
                Page {Math.min(pageIndex + 1, Math.max(pageCount, 1))} of {Math.max(pageCount, 1)}
              </span>
              <Button
                type="button"
                variant="outline"
                size="sm"
                aria-label="Go to previous page"
                disabled={!table.getCanPreviousPage()}
                onClick={() => table.previousPage()}
              >
                Previous
              </Button>
              <Button
                type="button"
                variant="outline"
                size="sm"
                aria-label="Go to next page"
                disabled={!table.getCanNextPage()}
                onClick={() => table.nextPage()}
              >
                Next
              </Button>
            </div>
          ) : null}
        </div>
      ) : null}
    </div>
  )
}

export {
  DataTable,
  DataTableColumnHeader,
  type DataTableColumnHeaderProps,
  type DataTableFilter,
  type DataTableProps,
}
