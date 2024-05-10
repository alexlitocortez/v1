import { type NextApiRequest, type NextApiResponse } from 'next';
import { NextResponse } from 'next/server'
import * as cheerio from 'cheerio';
import axios from 'axios';
import puppeteer from 'puppeteer';
import { error } from 'console';

// export async function GET(request: Request) {
//     const responseString = 'Hello world!'
//     return NextResponse.json({ message: responseString })
// }

export async function GET(req: NextApiRequest, res: NextApiResponse) {
    try {
        const response = await axios.get('https://cheerio.js.org/blog');
        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
        const html = response.data;

        // Load HTML content into Cheerio
        // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
        const $ = cheerio.load(html);

        // Extract data from the webpage using Cheerio selectors
        const downloads = $('.markdown p').text();

        // Return the extracted data
        return NextResponse.json({ downloads: downloads })
    } catch (error) {
        console.error('Error fetching data:', error)
        res.status(500).json({ error: 'An error occurred while fetching data' })
    }
}
