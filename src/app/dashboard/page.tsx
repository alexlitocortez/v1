"use client"

import { useEffect, useState } from 'react';
import MaxWidthWrapper from '~/components/ui/Othercomponents/MaxWidthWrapper';
import { DataTable } from '~/components/ui/Othercomponents/DataTable';
import { type Payment, columns } from './data';
import { Progress } from '~/components/ui/progress';

interface ApiResponse {
    data: Payment[]
    result: Payment[]
}

async function getData(): Promise<Payment[]> {
    try {
        const res = await fetch('/api/hello', {
            method: 'POST',
            body: JSON.stringify('https://www.sideprojectors.com/#/')
        })

        // Handle response if necessary
        const result: unknown = await res.json();

        console.log("response from server", (result as ApiResponse).data)

        if (result && typeof result === 'object' && 'data' in result && Array.isArray((result as ApiResponse).data)) {
            const data: Payment[] = (result as ApiResponse).data;
            // eslint-disable-next-line @typescript-eslint/no-empty-function

            return data
        } else {
            console.error('Invalid response format:', result);
            return [];
        }
    } catch (error) {
        console.error(error)
        return []
    }
}


const Dashboard = () => {
    const [data, setData] = useState<Payment[]>([]);
    const [loading, setLoading] = useState<boolean>(true); // State to track loading status

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await getData();
                if (response) {
                    setData(response)
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

    // useEffect(() => {
    //     // eslint-disable-next-line @typescript-eslint/no-misused-promises
    //     const intervalId = setInterval(async () => {
    //         if (data.length === 0) {
    //             try {
    //                 // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-call
    //                 if (data.length > 0) {
    //                     // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
    //                     // setData(newData);
    //                     clearInterval(intervalId); // Stop fetching once data is received
    //                 }
    //             } catch (error) {
    //                 console.error("Error fetching data:", error);
    //             }
    //         }
    //     }, 5000); // Fetch data every 5 seconds

    //     return () => clearInterval(intervalId); // Cleanup on component unmount
    // }, [data]); // Run whenever data changes



    return (
        <>
            <MaxWidthWrapper className="mb-12 mt-28 sm:mt-40 flex flex-col items-center justify-center text-center">
                {!loading && data?.length > 0 && <DataTable columns={columns} data={data} />}
                {loading && data?.length === 0 && <Progress value={50} />}
            </MaxWidthWrapper>
        </>
    )
}

export default Dashboard

