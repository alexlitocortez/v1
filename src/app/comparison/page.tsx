"use client";

import Link from "next/link";
import MaxWidthWrapper from "~/components/ui/Othercomponents/MaxWidthWrapper";
import {
    Card,
    CardContent,
    CardDescription,
    CardTitle,
} from "~/components/ui/card";
import LineChart from "~/components/ui/linechart";
import { useAppContext } from '~/context';


const Comparison = () => {
    const { nameContext } = useAppContext();
    const { salesAmountContext } = useAppContext();

    console.log("salesAmountContext", salesAmountContext)

    const getAverage = () => {
        if (salesAmountContext.length === 0) {
            return '';
        }
        const sum = salesAmountContext.reduce((acc, currentValue) => acc + currentValue, 0);
        const average = (sum / salesAmountContext.length).toFixed(2);
        return average;
    };

    return (
        <>
            <MaxWidthWrapper>
                {nameContext.map((item) => (
                    <Card key={item.id} className="p-3 mb-3">
                        <CardTitle>{item.title}</CardTitle>
                        <CardContent className="flex justify-between p-3">
                            <span className="border-white">
                                {item.sale_amount}
                            </span>
                            <span>
                                <Link href={item.project_link}>Link</Link>
                            </span>
                        </CardContent>
                        <CardDescription>{item.description}</CardDescription>
                    </Card>
                ))}
                <div>
                    <LineChart />
                </div>
            </MaxWidthWrapper>
        </>
    )
}

export default Comparison