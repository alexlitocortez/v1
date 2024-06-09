"use client";

import { useState } from "react";
import Link from "next/link";

import {
    ColumnDef,
    flexRender,
    getCoreRowModel,
    useReactTable,
    getPaginationRowModel,
} from "@tanstack/react-table";

import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "../table";

import { Button } from "../button";
import { Payment } from "~/app/dashboard/data";
import { Checkbox } from "../checkbox";
import { boolean } from "zod";


interface DataTableProps<TData, TValue> {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    columns: ColumnDef<Payment, any>[];
    data: Payment[];
    selectedRows: Payment[];
    onRowSelectionChange: (payment: Payment, isSelected: boolean) => void;
}


export function DataTable<TData, TValue>({
    columns,
    data,
    selectedRows,
    onRowSelectionChange
}: DataTableProps<TData, TValue>) {
    const [rowSelection, setRowSelection] = useState({})
    const table = useReactTable<Payment>({
        data,
        columns,
        getCoreRowModel: getCoreRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
        onRowSelectionChange: setRowSelection,
        state: {
            rowSelection
        },
    })

    console.log("selected rows", selectedRows)


    return (
        <>
            <div className="p-3">
                {table.getFilteredSelectedRowModel().rows.length} of{" "}
                {table.getFilteredRowModel().rows.length} row(s) selected.
            </div>
            <div className="rounded-md border ">
                <Table>
                    <TableHeader>
                        {table.getHeaderGroups().map((headerGroup) => (
                            <TableRow key={headerGroup.id}>
                                {headerGroup.headers.map((header) => {
                                    return (
                                        <TableHead key={header.id} className="text-left text-white p-5">
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
                    <TableBody>
                        {table.getRowModel().rows?.length ? (
                            table.getRowModel().rows.map((row) => {
                                const isSelected = selectedRows.some(payment => payment.id === row.original.id);
                                return (
                                    <TableRow
                                        key={row.id}
                                        data-state={isSelected && "selected"}
                                    >
                                        {row.getVisibleCells().map((cell) => (
                                            <TableCell key={cell.id} className="text-left">
                                                {cell.column.id === "select" ? (
                                                    <Checkbox
                                                        checked={isSelected}
                                                        onCheckedChange={(value) => onRowSelectionChange(row.original, Boolean(value))}
                                                        aria-label="Select row"
                                                    />
                                                ) : (
                                                    flexRender(cell.column.columnDef.cell, cell.getContext())
                                                )}
                                            </TableCell>
                                        ))}
                                    </TableRow>
                                )
                            })
                        ) : (
                            <TableRow>
                                <TableCell colSpan={columns.length} className="h-24 text-center">
                                    No results.
                                </TableCell>
                            </TableRow>
                        )}
                        {/* {table.getRowModel().rows?.length ? (
                            table.getRowModel().rows.map((row) => (
                                <TableRow
                                    key={row.id}
                                    data-state={row.getIsSelected() && "selected"}
                                    onClick={() => console.log("row original", row.original)}
                                >
                                    {row.getVisibleCells().map((cell) => (
                                        <TableCell key={cell.id} className="text-left">
                                            {flexRender(cell.column.columnDef.cell, cell.getContext())}
                                        </TableCell>
                                    ))}
                                </TableRow>
                            ))
                        ) : (
                            <TableRow>
                                <TableCell colSpan={columns.length} className="h-24 text-center">
                                    No results.
                                </TableCell>
                            </TableRow>
                        )} */}
                    </TableBody>
                </Table>
                <div className="flex items-center justify-end space-x-2 py-4">
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => table.previousPage()}
                        disabled={!table.getCanPreviousPage()}
                        className="text-white"
                    >
                        Previous
                    </Button>
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => table.nextPage()}
                        disabled={!table.getCanNextPage()}
                        className="text-white"
                    >
                        Next
                    </Button>
                </div>
            </div>
        </>
    )
}