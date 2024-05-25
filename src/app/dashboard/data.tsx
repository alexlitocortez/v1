import { ColumnDef } from "@tanstack/react-table"


export type Payment = {
    title: string
    description: string
    sale_amount: string
    project_link: string
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
    },
    {
        accessorKey: "project_link",
        header: "Project Link",
        cell: ({ row }) => (
            <a href={row.original.project_link} target="_blank" rel="noopener noreferrer" className="underline decoration-sky-500">
                Link
            </a>
        ),
    }
]





