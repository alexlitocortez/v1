import { type ColumnDef } from "@tanstack/react-table";
import { Checkbox } from "../../components/ui/checkbox"



export type Payment = {
    title: string
    description: string
    sale_amount: string
    project_link: string
}

export const columns: ColumnDef<Payment>[] = [
    {
        id: "select",
        // header: ({ table }) => (
        //     <Checkbox
        //         checked={
        //             table.getIsAllPageRowsSelected() ||
        //             (table.getIsSomePageRowsSelected() && "indeterminate")
        //         }
        //         onCheckedChange={(value: boolean) => table.toggleAllPageRowsSelected(!!value)}
        //         aria-label="Select all"
        //     />
        // ),
        cell: ({ row }) => (
            <Checkbox
                checked={row.getIsSelected()}
                onCheckedChange={(value: boolean) => row.toggleSelected(!!value)}
                aria-label="Select row"
            />
        ),
        enableSorting: false,
        enableHiding: false,
    },
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
            row.original.project_link ? (
                <a href={row.original.project_link} target="_blank" rel="noopener noreferrer" className="underline decoration-sky-500">
                    Link
                </a>
            ) : null
        ),
    }
]





