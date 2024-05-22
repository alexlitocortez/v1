import { type NextApiRequest, type NextApiResponse } from 'next';
import { NextResponse, NextRequest } from 'next/server'
import axios from 'axios';
import puppeteer from 'puppeteer';

const websites = [
    { url: 'https://www.sideprojectors.com/#/', selector: '', clickkNeeded: true }
]

// export async function POST(req: Request) {
//     const data = await req.json() as string
//     console.log("data", data)

//     const browser = await puppeteer.launch()
//     const page = await browser.newPage()

//     await page.goto(data)

//     await page.setViewport({ width: 1080, height: 1024 })

//     const descriptionText = await page.$$eval('.description', elements =>
//         elements.map(e => e.textContent)
//     )

//     console.log(descriptionText)

//     await browser.close()

//     return NextResponse.json({ message: 'successful ya hurt!' })
// }


export async function POST(req: Request) {
    const data = await req.json() as string
    console.log("data", data)

    const browser = await puppeteer.launch()
    const page = await browser.newPage()

    await page.goto(data)

    const titles = await page.$$eval('.name', elements =>
        elements.map(e => e.textContent)
    )

    const description = await page.$$eval('.pitch', elements =>
        elements.map(e => e.textContent)
    )

    const sale_amount = await page.$$eval('.bg-blue-500.inline-block.py-1.px-4.font-semibold.rounded', elements =>
        elements.map(e => e.textContent)
    )

    await browser.close()

    return NextResponse.json({ titles: titles, description: description, sale_amount: sale_amount })
}