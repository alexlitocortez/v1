import { ColumnDef } from "@tanstack/react-table"


export type Payment = {
    name: string
    description: string
    sale_amount: string
}

export const columns: ColumnDef<Payment>[] = [
    {
        accessorKey: "Name",
        header: "Name",
    },
    {
        accessorKey: "Description",
        header: "Description"
    },
    {
        accessorKey: "Sale Amount",
        header: "Sale Amount"
    }
]





