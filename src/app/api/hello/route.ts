import { NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client';
import { Payment } from '~/app/dashboard/data';

const prisma = new PrismaClient();

async function extractNumber(string: string) {
    const numericString = string.replace(/[^0-9]/g, '');
    const number = numericString ? parseInt(numericString) : null;
    return number;
}

async function processRecords(records: Payment[]): Promise<number[]> {
    // Define an external array to store all values
    const allNumbers: number[] = [];

    // Process each record asynchronously
    const promises = records.map(async (item) => {
        const number = await extractNumber(item.sale_amount);
        if (number !== null) {
            allNumbers.push(number);
        }
    });

    await Promise.all(promises);

    return allNumbers;
}


export async function POST() {
    // await createDataRecords();
    const fetchedRecords: Payment[] = await prisma.data.findMany();
    if (!Array.isArray(fetchedRecords)) {
        throw new Error("Fetched records is not an array");
    }

    const allNumbers = await processRecords(fetchedRecords)

    return NextResponse.json({ data: fetchedRecords, sale_amount: allNumbers })
}

