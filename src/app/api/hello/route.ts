import { type NextApiRequest, type NextApiResponse } from 'next';
import { NextResponse, NextRequest } from 'next/server'
import axios from 'axios';
import puppeteer from 'puppeteer';


export async function POST(req: Request) {
    const data = await req.json() as string
    console.log("data", data)

    const browser = await puppeteer.launch()
    const page = await browser.newPage()

    // Navigate the page to a URL
    await page.goto(data)

    const paragraphWithClass = await page.evaluate(() => {
        const paragraph = document.querySelector('p.hero__subtitle')

        if (paragraph) {
            return paragraph.textContent
        } else {
            return null;
        }
    })

    console.log(paragraphWithClass)

    await browser.close()

    return NextResponse.json({ message: 'successful ya hurt!' })
}

// scrape multiple SaaS pages
// figure out how to scrape multiple pages

