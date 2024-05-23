import { ColumnDef } from "@tanstack/react-table"


export type Payment = {
    title: string
    description: string
    sale_amount: string
}

export const columns: ColumnDef<Payment>[] = [
    {
        accessorKey: "title",
        header: "Title",
    },
    {
        accessorKey: "description",
        header: "Description"
    },
    {
        accessorKey: "sale_amount",
        header: "Sale Amount"
    }
]





