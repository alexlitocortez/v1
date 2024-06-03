import { type NextApiRequest, type NextApiResponse } from 'next';
import { NextResponse, NextRequest } from 'next/server'
import axios from 'axios';
import puppeteer, { Page } from 'puppeteer';
import { any, array, string } from 'zod';
import { time } from 'console';
import { request } from 'http';

interface ProjectData {
    title: string;
    description: string;
    sale_amount: string;
    project_link: string;
}

interface Site {
    url: string;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    // scrape: (page: Page) => Promise<ProjectData[]>;
}

async function scrapePage() {
    // make array for selectors
    const sites = [
        {
            url: 'https://www.sideprojectors.com/#/',
            selectors: { titles: '.name', descriptions: '.pitch', saleAmounts: '.bg-blue-500.inline-block.py-1.px-4.font-semibold.rounded', projectLinks: 'a.project-item.w-full' } //25 results
        },
        {
            url: 'https://indiemaker.co/',
            selectors: { titles: '.details.pad-2 > h2', descriptions: '.details.pad-2 > p', saleAmounts: '.primary-text.bold', projectLinks: 'a.listing-card' }
        },
        {
            url: 'https://www.microns.io/',
            selectors: { titles: '.h5-heading.listings', descriptions: '.body-text.s-light.opacity-70', saleAmounts: '.listing-card-infoblock > h5', projectLinks: 'a.listing-card-link.w-inline-block' }
        },
        {
            url: 'https://nicheinvestor.com/search/?sort=newest&es=1&address=&min_price=&max_price=&es_category=45&es_status[0]=120&sort-1=newest&paged-1=1',
            selectors: { titles: '.es-listing__title', descriptions: '.es-excerpt.es-listing--hide-on-grid', saleAmounts: '.es-price', projectLinks: '.es-listing__title > a' }
        },
    ]

    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    let saleAmountsData: string[] = []
    const allData = []; // Array to hold data from all sites


    for (const site of sites) {
        const { url, selectors } = site;

        await page.goto(url);

        const { titles, descriptions, saleAmounts, projectLinks } = selectors

        const titlesData = await page.$$eval(titles, elements =>
            elements.map(e => e.textContent?.replace(/\n/g, '').trim())
        );

        const descriptionsData = await page.$$eval(descriptions, elements =>
            elements.map(e => e.textContent?.replace(/\n/g, '').trim())
        );

        if (url === "https://www.microns.io/") {
            saleAmountsData = await page.$$eval(saleAmounts, elements => {
                return elements
                    .filter(e => e.textContent?.includes('$'))
                    .map(e => e.textContent?.replace(/\n/g, '').trim() ?? '')
            }
            );
        } else {
            saleAmountsData = await page.$$eval(saleAmounts, elements =>
                elements.map(e => e.textContent?.replace(/\n/g, '').trim() ?? '')
            );
        }



        const projectLinksData = await page.$$eval(projectLinks, anchors =>
            anchors.map(anchor => {
                if (anchor instanceof HTMLAnchorElement) {
                    return anchor.href
                }
                return null;
            }).filter(href => href !== null)
        );

        const data = titlesData.map((title, index) => ({
            title: title ?? '',
            description: descriptionsData[index] ?? '',
            sale_amount: saleAmountsData[index] ?? '',
            project_link: projectLinksData[index] ?? ''
        }))

        allData.push(...data)

    }
    return allData
}

export async function POST(req: Request) {
    const data = await scrapePage();
    return NextResponse.json({ data: data })
}



// export async function POST(req: Request) {
//     const browser = await puppeteer.launch();
//     const page = await browser.newPage();

//     try {
//         await page.goto('https://www.sideprojectors.com/#/', { waitUntil: 'networkidle2' });


//         async function scrapePage() {
//             const titles = await page.$$eval('.name', elements =>
//                 elements.map(e => e.textContent?.replace(/\n/g, '').trim())
//             );

//             const descriptions = await page.$$eval('.pitch', elements =>
//                 elements.map(e => e.textContent?.replace(/\n/g, '').trim())
//             );

//             const saleAmounts = await page.$$eval('.bg-blue-500.inline-block.py-1.px-4.font-semibold.rounded', elements =>
//                 elements.map(e => e.textContent?.replace(/\n/g, '').trim())
//             );

//             const projectLinks = await page.$$eval('a.project-item.w-full', anchors =>
//                 anchors.map(anchor => anchor.href)
//             );

//             const data: ProjectData[] = titles.map((title, index) => ({
//                 title: title ?? '',
//                 description: descriptions[index] ?? '',
//                 sale_amount: saleAmounts[index] ?? '',
//                 project_link: projectLinks[index] ?? '',
//             }));

//             return data
//         }

//         const data = await scrapePage();

//         // let lastPageReached = false;

//         // while (!lastPageReached) {
//         //     // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
//         //     // const nextPageLink = await page.$('button:has-text["Next"]');
//         //     // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-call
//         //     const nextPageLink = await page.$('/html/body/div[2]/div/div[3]/div/div[2]/div/div[3]/ul/li[11]/button')

//         //     if (!nextPageLink) {
//         //         console.log('No more pages. Exiting.');
//         //         lastPageReached = true;
//         //     } else {
//         //         await Promise.all([
//         //             page.click('button.pagination-link'),
//         //             page.waitForNavigation({ waitUntil: 'networkidle2', timeout: 90000 }),
//         //         ]);

//         //         await scrapePage();
//         //     }
//         // }

//         await new Promise(resolve => setTimeout(resolve, 2000)); // 2-second delay to return data in JSON


//         return NextResponse.json({ data: data });
//     } catch (error) {
//         return NextResponse.json({ error: 'An error occurred while scraping.' }, { status: 500 });
//     } finally {
//         await browser.close();
//     }
// }


// export async function POST(req: Request) {
//     const browser = await puppeteer.launch();
//     const page = await browser.newPage();

//     try {
//         await page.goto('https://indiemaker.co/', { waitUntil: 'networkidle2' });

//         const allData = [];

//         async function scrapePage() {
//             const titles = await page.$$eval('.details.pad-2 > h2', elements =>
//                 elements.map(e => e.textContent?.replace(/\n/g, '').trim())
//             );

//             const descriptions = await page.$$eval('.details.pad-2 > p', elements =>
//                 elements.map(e => e.textContent?.replace(/\n/g, '').trim())
//             );

//             const saleAmounts = await page.$$eval('.primary-text.bold', elements =>
//                 elements.map(e => e.textContent?.replace(/\n/g, '').trim())
//             );

//             const projectLinks = await page.$$eval('a.listing-card', anchors =>
//                 anchors.map(anchor => anchor.href)
//             );

//             const data: ProjectData[] = titles.map((title, index) => ({
//                 title: title ?? '',
//                 description: descriptions[index] ?? '',
//                 sale_amount: saleAmounts[index] ?? '',
//                 project_link: projectLinks[index] ?? '',
//             })) as ProjectData[]

//             return data
//         }

//         const data = await scrapePage();

//         await new Promise(resolve => setTimeout(resolve, 2000)); // 2-second delay to return data in JSON

//         return NextResponse.json({ data: data });
//     } catch (error) {
//         return NextResponse.json({ error: 'An error occurred while scraping.' }, { status: 500 });
//     } finally {
//         await browser.close();
//     }
// }


// export async function POST(req: Request) {
//     const browser = await puppeteer.launch();
//     const page = await browser.newPage();

//     try {
//         await page.goto('https://www.microns.io/', { waitUntil: 'networkidle2' });

//         const allData = [];

//         async function scrapePage() {
//             const titles = await page.$$eval('.h5-heading.listings', elements =>
//                 elements.map(e => e.textContent?.replace(/\n/g, '').trim())
//             );

//             const descriptions = await page.$$eval('.body-text.s-light.opacity-70', elements =>
//                 elements.map(e => e.textContent?.replace(/\n/g, '').trim())
//             );

//             const saleAmounts = await page.$$eval('.listing-card-infoblock > h5', elements => {
//                 return elements
//                     .filter(e => e.textContent?.includes('$'))
//                     .map(e => e.textContent?.replace(/\n/g, '').trim())
//             }
//             );

//             const projectLinks = await page.$$eval('a.listing-card-link.w-inline-block', anchors =>
//                 anchors.map(anchor => anchor.href)
//             );

//             const data: ProjectData[] = titles.map((title, index) => ({
//                 title: title ?? '',
//                 description: descriptions[index] ?? '',
//                 sale_amount: saleAmounts[index] ?? '',
//                 project_link: projectLinks[index] ?? '',
//             })) as ProjectData[]

//             return data
//         }

//         const data = await scrapePage();

//         await new Promise(resolve => setTimeout(resolve, 2000)); // 2-second delay to return data in JSON

//         return NextResponse.json({ data: data });
//     } catch (error) {
//         return NextResponse.json({ error: 'An error occurred while scraping.' }, { status: 500 });
//     } finally {
//         await browser.close();
//     }
// }


// export async function POST(req: Request) {
//     const browser = await puppeteer.launch();
//     const page = await browser.newPage();

//     try {
//         await page.goto('https://nicheinvestor.com/search/?sort=newest&es=1&address=&min_price=&max_price=&es_category=45&es_status[0]=120&sort-1=newest&paged-1=1', { waitUntil: 'networkidle2' });

//         const allData = [];

//         async function scrapePage() {
//             const titles = await page.$$eval('.es-listing__title', elements =>
//                 elements.map(e => e.textContent?.replace(/\n/g, '').trim())
//             );

//             const descriptions = await page.$$eval('.es-excerpt.es-listing--hide-on-grid', elements =>
//                 elements.map(e => e.textContent?.replace(/\n/g, '').trim())
//             );

//             const saleAmounts = await page.$$eval('.es-price', elements =>
//                 elements.map(e => e.textContent?.replace(/\n/g, '').trim())
//             );

//             const projectLinks = await page.$$eval('.es-listing__title > a', anchors =>
//                 anchors.map(anchor => anchor.href)
//             );

//             const data: ProjectData[] = titles.map((title, index) => ({
//                 title: title ?? '',
//                 description: descriptions[index] ?? '',
//                 sale_amount: saleAmounts[index] ?? '',
//                 project_link: projectLinks[index] ?? '',
//             })) as ProjectData[]

//             return data
//         }

//         const data = await scrapePage();

//         await new Promise(resolve => setTimeout(resolve, 2000)); // 2-second delay to return data in JSON

//         return NextResponse.json({ data: data });
//     } catch (error) {
//         return NextResponse.json({ error: 'An error occurred while scraping.' }, { status: 500 });
//     } finally {
//         await browser.close();
//     }
// }

