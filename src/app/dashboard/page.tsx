"use client"

import { useEffect, useState } from 'react';
import axios from 'axios';
import MaxWidthWrapper from '~/components/ui/Othercomponents/MaxWidthWrapper';
import Grid from '@mui/material/Grid';
import { Card } from '~/components/ui/card';
import { Input } from '~/components/ui/input';
import { Button } from "~/components/ui/button"
import { FormEvent } from 'react'

interface ResponseData {
    key1: string;
}

const Dashboard = () => {
    const [inputValue, setInputValue] = useState('');
    const [responseData, setResponseData] = useState<ResponseData | null>(null);


    // useEffect(() => {
    //     const fetchData = async () => {
    //         try {
    //             await fetch('/api/hello')
    //                 // eslint-disable-next-line @typescript-eslint/no-unsafe-return, @typescript-eslint/no-unsafe-call
    //                 .then(response => {
    //                     return response.json()
    //                 })
    //                 .then(data => console.log(data))
    //         } catch (error) {
    //             console.error('Error fetching data:', error);
    //             setApiResponse('An error occurred')
    //         }
    //     };

    //     // eslint-disable-next-line @typescript-eslint/no-floating-promises
    //     fetchData();
    // }, []);

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
                <Grid container spacing={2}>
                    <Grid item xs={12}>
                        <Card>Hi</Card>
                    </Grid>
                    <Grid item xs={12}>
                        <Card>Hi</Card>
                    </Grid>
                    <Grid item xs={12}>
                        <Card>Hi</Card>
                    </Grid>
                    <Grid item xs={12}>
                        <Card>Hi</Card>
                    </Grid>
                </Grid>
            </MaxWidthWrapper>
        </>
    )
}

export default Dashboard