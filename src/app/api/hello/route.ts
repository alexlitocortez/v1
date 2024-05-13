import { type NextApiRequest, type NextApiResponse } from 'next';
import { NextResponse, NextRequest } from 'next/server'
import * as cheerio from 'cheerio';
import axios from 'axios';
import { error } from 'console';


export async function POST(req: Request) {
    const data = await req.json() as string
    console.log("data received", data)

    const response = await axios.get(data)

    const html = response.data as string

    const $ = cheerio.load(html)

    const downloads = $('.hero__subtitle p').text()
    console.log("downloads", downloads)

    return NextResponse.json({ message: 'get it!' })
}

// try {

//     // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
//     const response = await axios.get(data);

//     // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
//     const html = response.data;

//     // Load HTML content into Cheerio
//     // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
//     const $ = cheerio.load(html);

//     // Extract data from the webpage using Cheerio selectors
//     const downloads = $('.markdown p').text();

//     // Return the extracted data
//     return NextResponse.json({ downloads: downloads })
// } catch (error) {
//     console.error('Error fetching data:', error)
//     res.status(500).json({ error: 'An error occurred while fetching data' })
// }


