"use client"

import { useEffect, useState } from 'react';
import axios from 'axios';
import MaxWidthWrapper from '~/components/ui/Othercomponents/MaxWidthWrapper';


const Dashboard = () => {
    const [apiResponse, setApiResponse] = useState('')

    // useEffect(() => {
    //     const fetchData = async () => {
    //         try {
    //             await fetch('/api/hello')
    //                 // eslint-disable-next-line @typescript-eslint/no-unsafe-return, @typescript-eslint/no-unsafe-call
    //                 .then(response => response.json())
    //                 .then(data => console.log(data))
    //         } catch (error) {
    //             console.error('Error fetching data:', error);
    //             setApiResponse('An error occurred')
    //         }
    //     };

    //     // eslint-disable-next-line @typescript-eslint/no-floating-promises
    //     fetchData();
    // }, []);

    return (
        <>
            <MaxWidthWrapper className="mb-12 mt-28 sm:mt-40 flex flex-col items-center justify-center text-center">

            </MaxWidthWrapper>
        </>
    )
}

export default Dashboard