"use client"

import { useEffect, useState } from 'react';
import MaxWidthWrapper from '~/components/ui/Othercomponents/MaxWidthWrapper';
import { DataTable } from '~/components/ui/Othercomponents/DataTable';
import { type Payment, columns } from './data';
import { Progress } from '~/components/ui/progress';

async function getData(): Promise<Payment[]> {
    try {
        const res = await fetch('/api/hello', {
            method: 'POST',
            body: JSON.stringify('https://www.sideprojectors.com/#/')
        })

        // Handle response if necessary
        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
        const data: Payment[] = await res.json();
        console.log('Response from server:', data);
        return data
    } catch (error) {
        // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
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
                setData(response)
                setLoading(false)
            } catch (error) {
                console.log("Error", error)
            }
        }
        // eslint-disable-next-line @typescript-eslint/no-floating-promises
        fetchData()
    }, []);

    useEffect(() => {
        // eslint-disable-next-line @typescript-eslint/no-misused-promises
        const intervalId = setInterval(async () => {
            if (data.length === 0) {
                try {
                    const newData = await getData();
                    if (newData.length > 0) {
                        setData(newData);
                        clearInterval(intervalId); // Stop fetching once data is received
                    }
                } catch (error) {
                    console.error("Error fetching data:", error);
                }
            }
        }, 5000); // Fetch data every 5 seconds

        return () => clearInterval(intervalId); // Cleanup on component unmount
    }, [data]); // Run whenever data changes



    return (
        <>
            <MaxWidthWrapper className="mb-12 mt-28 sm:mt-40 flex flex-col items-center justify-center text-center">
                {!loading && data.length > 0 && <DataTable columns={columns} data={data} />}
                {!loading && data.length === 0 && <Progress value={50} />}
            </MaxWidthWrapper>
        </>
    )
}

export default Dashboard