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
    const nextButtonPath = "text=Next";
    const nextButton = await page.$(nextButtonPath);

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
//         await page.goto('https://www.sideprojectors.com/#/')

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
//             console.log("allData", allData)
//         }

//         async function scrollToBottom() {
//             let previousHeight;
//             while (true) {
//                 previousHeight = await page.evaluate('document.body.scrollHeight'); // Get the height of the document
//                 await page.evaluate('window.scrollTo(0, document.body.scrollHeight)'); // Scroll to the bottom of the page
//                 const currentHeight = await page.evaluate('document.body.scrollHeight'); // Check the new height of the document
//                 if (currentHeight === previousHeight) break; // If the height hasn't changed, we have reached the bottom
//                 page.setDefaultTimeout(3000)
//             }
//         }

//         // async function clickNextButton() {
//         //     const buttons = Array.from(document.querySelectorAll('.pagination-link'));
//         //     const targetButton = buttons.find(button => button.textContent?.trim() === 'Next') as HTMLElement;
//         //     await Promise.all([
//         //         page.evaluate(() => {

//         //             if (targetButton) {
//         //                 // eslint-disable-next-line @typescript-eslint/no-unsafe-call
//         //                 targetButton.click();
//         //             }
//         //         }),
//         //     ]);
//         // }
//         async function clickNextButton() {
//             const nextButtonClicked = await page.evaluate(() => {
//                 const buttons = Array.from(document.querySelectorAll('.pagination-link'));
//                 const targetButton = buttons.find(button => button.textContent?.trim() === 'Next');
//                 if (targetButton) {
//                     (targetButton as HTMLElement).click();
//                     return true;
//                 }
//                 return false;
//             });
//             return nextButtonClicked
//         }

//         await scrapePage();

//         while (true) {

//             await scrollToBottom();

//             const nextButtonClicked = await clickNextButton();
//             if (!nextButtonClicked) break;

//             // const nextButtonExists = await page.evaluate(() => {
//             //     const buttons = Array.from(document.querySelectorAll('.pagination-link'));
//             //     const targetButton = buttons.find(button => button.textContent?.trim() === 'Next');
//             //     return !!targetButton;
//             // });

//             // if (!nextButtonExists) break;

//             // await clickNextButton();
//             await page.waitForNavigation({ waitUntil: 'networkidle0' });
//             await scrapePage();
//         }
//         return NextResponse.json({ data: allData })

//     } catch (error) {
//         console.error('An error occurred while scraping.');
//         return new NextResponse('An error occurred while scraping.', { status: 500 })
//     } finally {
//         await browser.close();
//     }
// }