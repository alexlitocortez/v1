"use client";

import { useEffect, useState } from "react";
import { useAppContext } from '~/context'; // Import the custom hook

const Comparison = () => {
    const { nameContext, setNameContext } = useAppContext();

    useEffect(() => {
        console.log("name context", nameContext)
    }, []);

    return (
        <div>
            {nameContext.map((item) => (
                <div key={item.id}>
                    {item.description}
                </div>
            ))}
        </div>
    )
}

export default Comparison

