import { NextApiRequest, NextApiResponse } from 'next';
import { PrismaClient } from '@prisma/client';
import puppeteer, { Page } from 'puppeteer';
import { NextResponse } from 'next/server'

const prisma = new PrismaClient();

interface ProjectData {
    title: string;
    description: string;
    sale_amount: string;
    project_link: string;
}

// const hardcodedData = [
//     {
//         title: "1 Yr Old Writing & Editing Service-High Profitable",
//         description: "Yoga + VR - a winning combination for a project that will excel in future.",
//         sale_amount: "$10,000",
//         project_link: "https://indiemaker.co/listings/vr-yoga-training"
//     },
//     {
//         title: "Ultimate Resource for High-Quality Icons and Logos",
//         description: "A directory service and newsletter helping users discover affiliates and partner progra...",
//         sale_amount: "$12,500",
//         project_link: "https://indiemaker.co/listings/free-svg-icon-website"
//     },
//     {
//         title: "Masterminds.Blog",
//         description: "Ideal domain name for innovators, entrepreneurs and visionaries",
//         sale_amount: "$For sale ⋅ ~ $2,000 negotiable",
//         project_link: "https://www.sideprojectors.com/project/43700/mastermindsblog"
//     },
//     {
//         title: "IndieAnalytics",
//         description: "Web Analytics, Waitlists, and Contact Us submissions in one dashboard",
//         sale_amount: "For sale ⋅ ~ $2,700,000 negotiable",
//         project_link: "https://www.sideprojectors.com/project/43838/indieanalytics"
//     },
//     {
//         title: "EXGOLAND | Metaverse Powered by AI",
//         description: "EXGOLAND is a metaverse powered by AI built on the Solana blockchain",
//         sale_amount: "For sale⋅ > $5,000",
//         project_link: "https://www.sideprojectors.com/project/43784/exgoland-metaverse-powered-by-ai"
//     },
//     {
//         title: "Kitty Sniper – Solana Telegram Trading Bot",
//         description: "A fully built our Solana trading bot for telegram with fee structure",
//         sale_amount: "For sale ⋅ ~ $880 negotiable",
//         project_link: "https://www.sideprojectors.com/project/43786/kitty-sniper-solana-telegram-trading-bot"
//     },
//     {
//         title: "GrowthBX | Branding & Marketing Agency - Blog",
//         description: "Agency and Blog on Branding and Marketing",
//         sale_amount: "For sale ⋅ ~ $500 negotiable",
//         project_link: "https://www.sideprojectors.com/project/43732/growthbx-branding-marketing-agency-blog"
//     },
//     {
//         title: "ChatPlayground AI",
//         description: "Achieve Better AI Answers 73%of the Time with Multiple Chatbots",
//         sale_amount: "For sale ⋅ > $700",
//         project_link: "https://www.sideprojectors.com/project/43619/chatplayground-ai"
//     },
//     {
//         title: "Vectorize",
//         description: "Fast, Accurate, Production-Ready RAG Pipelines",
//         sale_amount: "For sale ⋅ > $700",
//         project_link: "https://www.sideprojectors.com/project/43837/vectorize"
//     },
//     {
//         title: "Beautiful Writer",
//         description: "An ultra minimalist writing app.",
//         sale_amount: "For sale ⋅ Contact for price",
//         project_link: "https://www.sideprojectors.com/project/43783/beautiful-writer"
//     }
// ];

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

    const browser = await puppeteer.launch()
    const page = await browser.newPage();
    let saleAmountsData: string[] = []
    const allData: ProjectData[] = []; // Array to hold data from all sites

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
    try {
        const data = await scrapePage();

        const dataToInsert = data.map(item => ({
            title: item.title,
            description: item.description,
            sale_amount: item.sale_amount,
            project_link: item.project_link
        }));

        const newData = await prisma.data.createMany({
            data: dataToInsert,
            skipDuplicates: true
        })

        return Response.json({ success: true, data: newData });
    } catch (error) {
        console.error('Error scraping and storing data:', error);
        return NextResponse.json({ success: false });
    } finally {
        await prisma.$disconnect();
    }
}

// export async function POST(req: NextApiRequest) {
//     try {
//         const newData = await prisma.data.createMany({
//             data: hardcodedData,
//             skipDuplicates: true // Skips records that would violate any unique constraints
//         });

//         return Response.json({ success: true, data: newData });
//     } catch (error) {
//         console.error('Error inserting data:', error);
//         return Response.json({ success: false });
//     } finally {
//         await prisma.$disconnect();
//     }
// }
