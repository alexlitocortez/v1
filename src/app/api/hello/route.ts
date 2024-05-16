import { type NextApiRequest, type NextApiResponse } from 'next';
import { NextResponse, NextRequest } from 'next/server'
import axios from 'axios';
import puppeteer from 'puppeteer';

const websites = [
    { url: 'https://www.sideprojectors.com/#/', selector: '', clickNeeded: true }
]

export async function POST(req: Request) {
    const data = await req.json() as string
    console.log("data", data)

    const browser = await puppeteer.launch()
    const page = await browser.newPage()

    // Navigate the page to a URL
    await page.goto(data)


    // const resultLinks = await page.$$('a');

    const result = await page.$("//a[contains(., 'None')]")



    console.log(result)

    // page.setDefaultTimeout(3000)

    // const checkbox = document.querySelector('input[type="checkbox"]#input-project-type-saas')

    await browser.close()

    return NextResponse.json({ message: 'successful ya hurt!' })
}



