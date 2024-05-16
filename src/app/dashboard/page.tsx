"use client"

import { useEffect, useState } from 'react';
import MaxWidthWrapper from '~/components/ui/Othercomponents/MaxWidthWrapper';
import { Input } from '~/components/ui/input';
import { Button } from "~/components/ui/button";
import { type FormEvent } from 'react';
import { DataTable } from '~/components/ui/Othercomponents/DataTable';
import { Payment, columns } from './data';

async function getData(): Promise<Payment[]> {
    // Fetch data from your API here.
    return [
        {
            id: "728ed52f",
            amount: 100,
            status: "pending",
        },
    ]
}


const Dashboard = () => {
    const [inputValue, setInputValue] = useState('');
    const [data, setData] = useState<Payment[]>([])

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await getData();
                setData(response)
            } catch (error) {
                console.error('Error fetching data:', error)
            }
        }
        fetchData().catch(error => {
            // Handle any uncaught errors here
            console.error('Unhandled error:', error);
        });
    }, [])

    async function onSubmit(event: FormEvent<HTMLFormElement>) {
        event.preventDefault();

        try {
            const res = await fetch('/api/hello', {
                method: 'POST',
                body: JSON.stringify(inputValue)
            })

            // Handle response if necessary
            // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
            const response = await res.json();
            console.log('Response from server:', response);
        } catch (error) {
            // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
            console.error(error)
        }
    }

    return (
        <>
            <MaxWidthWrapper className="mb-12 mt-28 sm:mt-40 flex flex-col items-center justify-center text-center">
                <form onSubmit={onSubmit}>
                    <Input value={inputValue} onChange={(e) => setInputValue(e.target.value)} id='inputValue' type='inputValue' />
                    <Button type='submit'>Search</Button>
                </form>
                <DataTable columns={columns} data={data} />
            </MaxWidthWrapper>
        </>
    )
}

export default Dashboard