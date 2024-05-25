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

// How to select button with puppeteer

// export async function POST(req: Request) {
//     const browser = await puppeteer.launch();
//     const page = await browser.newPage();
//     const nextButtonPath = "text=Next";
//     const nextButton = await page.$(nextButtonPath);

//     await page.goto('https://www.sideprojectors.com/#/')

//     let hasNextPage = true;
//     const allData: ProjectData[] = []

//     while (hasNextPage) {
//         const titles = await page.$$eval('.name', elements =>
//             elements.map(e => e.textContent?.replace(/\n/g, '').trim())
//         )

//         const description = await page.$$eval('.pitch', elements =>
//             elements.map(e => e.textContent?.replace(/\n/g, '').trim())
//         )

//         const sale_amount = await page.$$eval('.bg-blue-500.inline-block.py-1.px-4.font-semibold.rounded', elements =>
//             elements.map(e => e.textContent?.replace(/\n/g, '').trim())
//         )

//         const project_link = await page.$$eval('a.project-item.w-full', anchors =>
//             anchors.map(anchor => anchor.href)
//         )

//         const data: ProjectData[] = titles.map((title, index) => ({
//             title: title ?? '',
//             description: description[index] ?? '',
//             sale_amount: sale_amount[index] ?? '',
//             project_link: project_link[index] ?? '',
//         }));

//         allData.concat(data)

//         if (nextButton) {
//             await Promise.all([
//                 page.waitForNavigation({ waitUntil: 'networkidle0' }),
//                 page.click(nextButtonPath)
//             ])
//         } else {
//             hasNextPage = false
//         }
//     }

//     await browser.close()

//     return NextResponse.json(allData)
// }

export async function POST(req: Request) {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();

    await page.goto('https://www.sideprojectors.com/#/')

    const allData: ProjectData[] = [];

    async function scrapePage() {
        // const data = await page.evaluate(async () => {
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

        const data = titles.map((title, index) => ({
            title: title ?? '',
            description: description[index] ?? '',
            sale_amount: sale_amount[index] ?? '',
            project_link: project_link[index] ?? ''
        })) as ProjectData[];
        // })
        allData.push(...data)
    }

    // async function scrollToBottom() {
    //     let previousHeight;
    //     while (true) {
    //         previousHeight = await page.evaluate('document.body.scrollHeight'); // Get the height of the document
    //         await page.evaluate('window.scrollTo(0, document.body.scrollHeight)'); // Scroll to the bottom of the page
    //         const currentHeight = await page.evaluate('document.body.scrollHeight'); // Check the new height of the document
    //         if (currentHeight === previousHeight) break; // If the height hasn't changed, we have reached the bottom
    //     }
    // }

    await scrapePage()

    await Promise.all([
        page.evaluate(() => {
            const buttons = Array.from(document.querySelectorAll('.pagination-link'));
            const targetButton = buttons.find(button => button.textContent?.trim() === 'Next') as HTMLElement;
            if (targetButton) {
                // eslint-disable-next-line @typescript-eslint/no-unsafe-call
                targetButton.click();
            }
        }),
    ]);

    await browser.close()

    return NextResponse.json({ message: 'it works!', data: allData })
}