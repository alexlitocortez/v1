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
            method: 'GET',
        })

        const result: unknown = await res.json();

        console.log("response from server", (result as ApiResponse).data)

        if (result && typeof result === 'object' && 'data' in result && Array.isArray((result as ApiResponse).data)) {
            const data: Payment[] = (result as ApiResponse).data.map((item, index) => ({
                id: item.id ?? index.toString(),
                title: item.title,
                description: item.description,
                sale_amount: item.sale_amount,
                project_link: item.project_link
            }));

            return { data, salesAmount: (result as ApiResponse).salesAmount };
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
    const router = useRouter();
    const [data, setData] = useState<Payment[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
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
                setData(response.data);
                // setSalesAmountContext(response.salesAmount); // Set salesAmount context if needed
            } catch (error) {
                console.log("Error", error);
            } finally {
                setLoading(false);
            }
        }
        fetchData().catch((error) => {
            console.error("Error during fetchData:", error);
        });
    }, [setSalesAmountContext]);

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

