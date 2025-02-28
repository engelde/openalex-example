'use client'

import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  getPaginationRowModel,
  useReactTable,
} from '@tanstack/react-table'

import { Button } from '@/components/ui/button'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { cn } from '@/lib/utils'
import type { Pagination, Work } from '@/types/openalex'

type DataTableProps = {
  data: Work[]
  fetchData: (page?: number) => Promise<void>
  columns: ColumnDef<Work>[]
  loading: boolean
  pagination: Pagination | null
}

export const DataTable = ({ data, fetchData, columns, loading, pagination }: DataTableProps) => {
  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    manualPagination: true,
    rowCount: data.length,
  })

  return (
    <div className="w-full">
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead key={header.id} className="text-nowrap">
                      {header.isPlaceholder
                        ? null
                        : flexRender(header.column.columnDef.header, header.getContext())}
                    </TableHead>
                  )
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && 'selected'}
                  className={cn('bg-green-50 hover:bg-green-100', {
                    'bg-red-50 hover:bg-red-100':
                      row.original.publication_year &&
                      parseInt(row.original.publication_year) % 2 === 0,
                  })}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={columns.length} className="h-24 text-center">
                  No results found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      <div className="flex items-center justify-end space-x-2 py-4">
        <div className="text-muted-foreground flex-1 text-sm">
          {pagination ? (pagination?.page - 1) * pagination?.per_page + 1 : 0}
          {' - '}
          {pagination
            ? pagination?.page * pagination?.per_page < pagination?.count
              ? pagination?.page * pagination?.per_page
              : pagination?.count
            : 0}{' '}
          of {pagination?.count || 0} row(s)
        </div>
        <div className="space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => fetchData(pagination ? pagination.page - 1 : 1)}
            disabled={loading || !pagination || pagination.page < 2}
            className="hover:cursor-pointer disabled:pointer-events-none"
          >
            Previous
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => fetchData(pagination ? pagination.page + 1 : 1)}
            disabled={
              loading || !pagination || pagination.page * pagination.per_page >= pagination.count
            }
            className="hover:cursor-pointer disabled:pointer-events-none"
          >
            Next
          </Button>
        </div>
      </div>
    </div>
  )
}
