"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from 'next/navigation';
import { Payment } from '~/app/dashboard/data';


const Comparison = () => {
    const [selectedRows, setSelectedRows] = useState<Payment[]>([]);

    useEffect(() => {
        "hi"
    }, []);

    return "hi"
}

export default Comparison

