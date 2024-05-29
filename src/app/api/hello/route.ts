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

// export async function POST(req: Request) {
//     const browser = await puppeteer.launch();
//     const page = await browser.newPage();

//     await page.goto('https://www.sideprojectors.com/#/')

//     const titles = await page.$$eval('.name', elements =>
//         elements.map(e => e.textContent?.replace(/\n/g, '').trim())
//     )

//     const description = await page.$$eval('.pitch', elements =>
//         elements.map(e => e.textContent?.replace(/\n/g, '').trim())
//     )

//     const sale_amount = await page.$$eval('.bg-blue-500.inline-block.py-1.px-4.font-semibold.rounded', elements =>
//         elements.map(e => e.textContent?.replace(/\n/g, '').trim())
//     )

//     const project_link = await page.$$eval('a.project-item.w-full', anchors =>
//         anchors.map(anchor => anchor.href)
//     )

//     const data: ProjectData[] = titles.map((title, index) => ({
//         title: title ?? '',
//         description: description[index] ?? '',
//         sale_amount: sale_amount[index] ?? '',
//         project_link: project_link[index] ?? '',
//     }));

//     await browser.close()

//     return NextResponse.json(data)
// }

export async function POST(req: Request) {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    const nextPageLink = await page.$('.pagination-link--active > .pagination-link');

    try {
        await page.goto('https://www.sideprojectors.com/#/', { waitUntil: 'networkidle2' });

        const allData = [];

        async function scrapePage() {
            const titles = await page.$$eval('.name', elements =>
                elements.map(e => e.textContent?.replace(/\n/g, '').trim())
            );

            const descriptions = await page.$$eval('.pitch', elements =>
                elements.map(e => e.textContent?.replace(/\n/g, '').trim())
            );

            const saleAmounts = await page.$$eval('.bg-blue-500.inline-block.py-1.px-4.font-semibold.rounded', elements =>
                elements.map(e => e.textContent?.replace(/\n/g, '').trim())
            );

            const projectLinks = await page.$$eval('a.project-item.w-full', anchors =>
                anchors.map(anchor => anchor.href)
            );

            const data: ProjectData[] = titles.map((title, index) => ({
                title: title ?? '',
                description: descriptions[index] ?? '',
                sale_amount: saleAmounts[index] ?? '',
                project_link: projectLinks[index] ?? '',
            }));

            return data
        }

        const data = await scrapePage();

        // let lastPageReached = false;

        // while (!lastPageReached) {
        //     const nextPageLink = await page.$('.pagination-link--active > .pagination-link');

        // if (!nextPageLink) {
        //     console.log('No more pages. Exiting.');
        //     // lastPageReached = true;
        // } else {
        //     await Promise.all([
        //         nextPageLink.click(),
        //         page.waitForNavigation({ waitUntil: 'networkidle2', timeout: 90000 }),
        //     ]);

        //     await scrapePage();
        // }
        // }

        await new Promise(resolve => setTimeout(resolve, 2000)); // 2-second delay for example


        return NextResponse.json({ data: data });
    } catch (error) {
        return NextResponse.json({ error: 'An error occurred while scraping.' }, { status: 500 });
    } finally {
        await browser.close();
    }
}




