"use client"

import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table"

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import useMediaQuery from "@/hooks/use-media-query"
import { Avatar, AvatarFallback } from "./avatar"
import { Badge } from "./badge"

export function DataTable({
  columns,
  data,
}) {
  const isMobile = useMediaQuery("(max-width: 640px)")
  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
  })

  return (
    <div className="rounded-md border">
      <Table>
        {!isMobile && <TableHeader>
          {table.getHeaderGroups().map((headerGroup) => (
            <TableRow key={headerGroup.id}>
              {headerGroup.headers.map((header) => {
                return (
                  <TableHead key={header.id}>
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                  </TableHead>
                )
              })}
            </TableRow>
          ))}
        </TableHeader>
        }
        <TableBody>
          {table.getRowModel().rows?.length ? (
            table.getRowModel().rows.map((row) => (
              <TableRow
                key={row.id}
                data-state={row.getIsSelected() && "selected"}
              >
                {!isMobile ? row.getVisibleCells().map((cell) => (
                  <TableCell key={cell.id}>
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </TableCell>
                ))
                :
                <TableCell className='flex flex-col items-center gap-1'>
                  <div className="flex justify-between w-full items-center">
                    <div className="flex gap-1 items-center">
                      <Avatar>
                        <AvatarFallback className='font-bold'>B</AvatarFallback>
                      </Avatar>
                      <p className="font-bold">$2000</p>
                    </div>
                    <p>2024-10-5</p>
                  </div>
                  {/* <p className="truncate w-full text-gray-700">
                    This is a description of the transaction.
                  </p> */}
                  <div className="flex justify-start">
                    <Badge>Income</Badge>
                  </div>
                </TableCell>
                }
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={columns.length} className="h-24 text-center">
                No results.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  )
}
