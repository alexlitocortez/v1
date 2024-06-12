"use client";

import { Item } from "@radix-ui/react-dropdown-menu";
import Link from "next/link";
import { useEffect, useState } from "react";
import MaxWidthWrapper from "~/components/ui/Othercomponents/MaxWidthWrapper";
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "~/components/ui/card";
import { useAppContext } from '~/context'; // Import the custom hook


const Comparison = () => {
    const { nameContext, setNameContext } = useAppContext();
    const { salesAmountContext, setSalesAmountContext } = useAppContext();

    useEffect(() => {
        console.log("name context", nameContext)
    }, []);

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
                {salesAmountContext.map((item) => (
                    <ul key={item}>
                        <li>{item}</li>
                    </ul>
                ))}
            </MaxWidthWrapper>
        </>
    )
}

export default Comparison

