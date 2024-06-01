import { type NextApiRequest, type NextApiResponse } from 'next';
import { NextResponse, NextRequest } from 'next/server'
import axios from 'axios';
import puppeteer, { Page } from 'puppeteer';
import { any, array, string } from 'zod';
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

interface Site {
    url: string;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    scrape: (page: Page) => Promise<ProjectData[]>;
}

const sites: Site[] = [
    {
        url: 'https://www.sideprojectors.com/#/',
        scrape: async (page: Page): Promise<ProjectData[]> => {
            await page.goto('https://www.sideprojectors.com/#/', { waitUntil: 'networkidle2' });
            // Extract data from the page
            return await page.evaluate(() => {
                const titles = Array.from(document.querySelectorAll('.name')).map(e => e.textContent?.replace(/\n/g, '').trim() ?? '');
                const descriptions = Array.from(document.querySelectorAll('.pitch')).map(e => e.textContent?.replace(/\n/g, '').trim() ?? '');
                const saleAmounts = Array.from(document.querySelectorAll('.bg-blue-500.inline-block.py-1.px-4.font-semibold.rounded')).map(e => e.textContent?.replace(/\n/g, '').trim() ?? '');
                const projectLinks = Array.from(document.querySelectorAll('a.project-item.w-full')).map(anchor => (anchor as HTMLAnchorElement).href);

                const data: ProjectData[] = titles.map((title, index) => ({
                    title: title ?? '',
                    description: descriptions[index] ?? '',
                    sale_amount: saleAmounts[index] ?? '',
                    project_link: projectLinks[index] ?? '',
                })) as ProjectData[]

                console.log("data", data)

                return data
            });
        }
    },
]

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const scrapeSite = async (site: Site): Promise<{ data: any }> => {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    const data = await site.scrape(page);
    await browser.close();
    return { data };
};

// Function to scrape all sites concurrently
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const scrapeAllSites = async (sites: Site[]): Promise<{ data: any }[]> => {
    const scrapingPromises = sites.map(site => scrapeSite(site));
    const results = await Promise.all(scrapingPromises);
    return results;
};

// Main execution
export async function POST(req: Request) {
    try {
        const results = await scrapeAllSites(sites);
        return NextResponse.json({ data: results })
    } catch (error) {
        console.error('Error scraping websites:', error);
    }
};






// export async function POST(req: Request) {
//     const browser = await puppeteer.launch();
//     const page = await browser.newPage();

//     try {
//         await page.goto('https://www.sideprojectors.com/#/', { waitUntil: 'networkidle2' });

//         const allData = [];

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

//         let lastPageReached = false;

//         while (!lastPageReached) {
//             // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
//             // const nextPageLink = await page.$('button:has-text["Next"]');
//             // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-call
//             const nextPageLink = await page.$('/html/body/div[2]/div/div[3]/div/div[2]/div/div[3]/ul/li[11]/button')

//             if (!nextPageLink) {
//                 console.log('No more pages. Exiting.');
//                 lastPageReached = true;
//             } else {
//                 await Promise.all([
//                     page.click('button.pagination-link'),
//                     page.waitForNavigation({ waitUntil: 'networkidle2', timeout: 90000 }),
//                 ]);

//                 await scrapePage();
//             }
//         }

//         await new Promise(resolve => setTimeout(resolve, 2000)); // 2-second delay to return data in JSON


//         return NextResponse.json({ data: data });
//     } catch (error) {
//         return NextResponse.json({ error: 'An error occurred while scraping.' }, { status: 500 });
//     } finally {
//         await browser.close();
//     }
// }

// FOR indimaker.co

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

// FOR microns.io

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

