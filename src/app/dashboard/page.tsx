"use client";

import { useEffect, useState } from 'react';
import MaxWidthWrapper from '~/components/ui/Othercomponents/MaxWidthWrapper';
import { DataTable } from '~/components/ui/Othercomponents/DataTable';
import { type Payment, columns } from './data';
import { Progress } from '~/components/ui/progress';
import { Button } from '~/components/ui/button';
import { useRouter } from 'next/navigation';
import { useAppContext } from '~/context';

interface ApiResponse {
    data: Payment[]
    salesAmount: number[]
}

async function getData(): Promise<ApiResponse> {
    try {
        const res = await fetch('/api/hello', {
            method: 'POST',
            body: JSON.stringify('https://www.sideprojectors.com/#/')
        })

        // Handle response if necessary
        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
        const result = await res.json();

        console.log("response from server", (result as ApiResponse).data)
        console.log("sales amount context", (result as ApiResponse).salesAmount)

        if (result && typeof result === 'object' && 'data' in result && Array.isArray((result as ApiResponse).data)) {
            const data: Payment[] = (result as ApiResponse).data.map((item, index) => ({
                id: item.id ?? index.toString(),
                title: item.title,
                description: item.description,
                sale_amount: item.sale_amount,
                project_link: item.project_link
            }));
            // eslint-disable-next-line @typescript-eslint/no-empty-function

            // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access
            return { data, salesAmount: result.sale_amount };
        } else {
            console.error('Invalid response format:', result);
            return { data: [], salesAmount: [] };
        }
    } catch (error) {
        console.error(error)
        return { data: [], salesAmount: [] };
    }
}

const Dashboard = () => {
    const [data, setData] = useState<Payment[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const router = useRouter();
    const { nameContext, setNameContext } = useAppContext();
    const { setSalesAmountContext } = useAppContext();

    const handleRowSelection = (payment: Payment, isSelected: boolean) => {
        setNameContext(prev =>
            isSelected ? [...prev, payment] : prev.filter(p => p !== payment)
        );
    };

    const handleCheckout = () => {
        if (typeof window !== "undefined") {
            router.push(`/comparison`);
        }
    };

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await getData();
                if (response) {
                    setData(response.data)
                    setSalesAmountContext(response.salesAmount)
                    setLoading(false)
                } else {
                    return
                }
            } catch (error) {
                console.log("Error", error)
            }
        }
        // eslint-disable-next-line @typescript-eslint/no-floating-promises
        fetchData()
    }, []);

    return (
        <>
            <MaxWidthWrapper className="mb-12 mt-28 sm:mt-40 flex flex-col items-center justify-center text-center">
                {
                    nameContext?.length > 1 ? <Button variant='outline' onClick={handleCheckout}>Checkout</Button> : data?.length > 0 ? <div>Check 2 rows</div> : null
                }
                {!loading && data?.length > 0 && <DataTable columns={columns} data={data} nameContext={nameContext} onRowSelectionChange={handleRowSelection} />}
                {loading && data?.length === 0 && <Progress value={50} />}
            </MaxWidthWrapper>
        </>
    )
}

export default Dashboard

