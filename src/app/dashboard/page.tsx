"use client"

import { useEffect, useState } from 'react';
import MaxWidthWrapper from '~/components/ui/Othercomponents/MaxWidthWrapper';
import { DataTable } from '~/components/ui/Othercomponents/DataTable';
import { type Payment, columns } from './data';

// async function getData(): Promise<Payment[]> {
//     try {
//         const res = await fetch('/api/hello', {
//             method: 'POST',
//             body: JSON.stringify('https://www.sideprojectors.com/#/')
//         })

//         // Handle response if necessary
//         // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
//         const data: Payment[] = await res.json();
//         console.log('Response from server:', data);
//         return data
//     } catch (error) {
//         // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
//         console.error(error)
//         return []
//     }
// }


const Dashboard = () => {
    const [data, setData] = useState<Payment[]>([])

    useEffect(() => {
        const fetchData = async () => {
            try {
                const res = await fetch('/api/hello', {
                    method: 'POST',
                    body: JSON.stringify('https://www.sideprojectors.com/#/')
                })
                // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
                const data: Payment[] = await res.json();
                const response = data;
                setData(response)
                console.log("titles", data)
            } catch (error) {
                console.error('Error fetching data:', error)
            }
        }
        fetchData().catch(error => {
            // Handle any uncaught errors here
            console.error('Unhandled error:', error);
        });
    }, [])

    return (
        <>
            <MaxWidthWrapper className="mb-12 mt-28 sm:mt-40 flex flex-col items-center justify-center text-center">
                <DataTable columns={columns} data={data} />
            </MaxWidthWrapper>
        </>
    )
}

export default Dashboard