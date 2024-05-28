import { type NextApiRequest, type NextApiResponse } from 'next';
import { NextResponse, NextRequest } from 'next/server'
import axios from 'axios';
import puppeteer from 'puppeteer';
import { any, array } from 'zod';
import { time } from 'console';

const websites = [
    { url: 'https://www.sideprojectors.com/#/', selector: '', clickkNeeded: true }
]

interface ProjectData {
    title: string;
    description: string;
    sale_amount: string;
    project_link: string;
}


export async function POST(req: Request) {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();

    await page.goto('https://www.sideprojectors.com/#/')

    const titles = await page.$$eval('.name', elements =>
        elements.map(e => e.textContent?.replace(/\n/g, '').trim())
    )

    const description = await page.$$eval('.pitch', elements =>
        elements.map(e => e.textContent?.replace(/\n/g, '').trim())
    )

    const sale_amount = await page.$$eval('.bg-blue-500.inline-block.py-1.px-4.font-semibold.rounded', elements =>
        elements.map(e => e.textContent?.replace(/\n/g, '').trim())
    )

    const project_link = await page.$$eval('a.project-item.w-full', anchors =>
        anchors.map(anchor => anchor.href)
    )

    const data: ProjectData[] = titles.map((title, index) => ({
        title: title ?? '',
        description: description[index] ?? '',
        sale_amount: sale_amount[index] ?? '',
        project_link: project_link[index] ?? '',
    }));

    await browser.close()

    return NextResponse.json(data)
}


// export async function POST(req: Request) {
//     const browser = await puppeteer.launch();
//     const page = await browser.newPage();

//     try {
//         await page.goto('https://www.sideprojectors.com/#/');

//         const allData: ProjectData[] = [];

//         async function scrapePage() {
//             const data = await page.evaluate(() => {
//                 const titles = Array.from(document.querySelectorAll('.name')).map(e => e.textContent?.replace(/\n/g, '').trim() ?? '');
//                 const description = Array.from(document.querySelectorAll('.pitch')).map(e => e.textContent?.replace(/\n/g, '').trim() ?? '');
//                 const sale_amount = Array.from(document.querySelectorAll('.bg-blue-500.inline-block.py-1.px-4.font-semibold.rounded')).map(e => e.textContent?.replace(/\n/g, '').trim() ?? '');
//                 const project_link = Array.from(document.querySelectorAll('a.project-item.w-full')).map(anchor => (anchor as HTMLAnchorElement).href);

//                 // const titles = await page.$$eval('.name', elements =>
//                 //     elements.map(e => e.textContent?.replace(/\n/g, '').trim())
//                 // )

//                 // const description = await page.$$eval('.pitch', elements =>
//                 //     elements.map(e => e.textContent?.replace(/\n/g, '').trim())
//                 // )

//                 // const sale_amount = await page.$$eval('.bg-blue-500.inline-block.py-1.px-4.font-semibold.rounded', elements =>
//                 //     elements.map(e => e.textContent?.replace(/\n/g, '').trim())
//                 // )

//                 // const project_link = await page.$$eval('a.project-item.w-full', anchors =>
//                 //     anchors.map(anchor => anchor.href)
//                 // )

//                 return titles.map((title, index) => ({
//                     title,
//                     description: description[index] ?? '',
//                     sale_amount: sale_amount[index] ?? '',
//                     project_link: project_link[index] ?? ''
//                 })) as ProjectData[];
//             })

//             allData.push(...data)
//         }

//         await scrapePage();

//         let lastPageReached = false;

//         while (!lastPageReached) {
//             const nextPageLink = await page.$('.pagination-link')

//             if (!nextPageLink) {
//                 console.log('No more pages. Exiting.')
//                 lastPageReached = true;
//             } else {
//                 await nextPageLink.click();

//                 await page.waitForNavigation({ waitUntil: 'networkidle2', timeout: 90000 })

//                 const URL = page.url();
//                 console.log(URL)

//                 await scrapePage()
//             }
//         }

//         return NextResponse.json({ data: allData })
//     } catch (error) {
//         return NextResponse.json({ error: 'An error occurred while scraping.' }, { status: 500 })
//     } finally {
//         await browser.close();
//     }
// }