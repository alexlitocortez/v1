import { type NextApiRequest, type NextApiResponse } from 'next';
import { NextResponse, NextRequest } from 'next/server'
import axios from 'axios';
import puppeteer, { Page } from 'puppeteer';
import { any, array, record, string } from 'zod';
import { time } from 'console';
import { request } from 'http';
import { PrismaClient } from '@prisma/client';
import { Payment } from '~/app/dashboard/data';

const prisma = new PrismaClient();

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
            url: 'https://nicheinvestor.com/listings-all/',
            selectors: { titles: '.es-listing__title', descriptions: '.es-excerpt.es-listing--hide-on-grid', saleAmounts: '.es-badges.es-listing--hide-on-list > .es-price', projectLinks: '.es-listing__title > a' }
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

async function createDataRecords() {
    const data = await scrapePage();
    // eslint-disable-next-line @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access
    await prisma.data.createMany({
        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
        data,
        skipDuplicates: true
    })
}

async function extractNumber(string: string) {
    const numericString = string.replace(/[^0-9]/g, '');
    const number = numericString ? parseInt(numericString) : null;
    return number;
}

async function processRecords(records: Payment[]): Promise<number[]> {
    // Define an external array to store all values
    const allNumbers: number[] = [];

    // Process each record asynchronously
    const promises = records.map(async (item) => {
        const number = await extractNumber(item.sale_amount);
        if (number !== null) {
            allNumbers.push(number);
        }
    });

    await Promise.all(promises);

    return allNumbers;
}


export async function POST(req: Request) {
    // await createDataRecords();
    const fetchedRecords: Payment[] = await prisma.data.findMany();
    if (!Array.isArray(fetchedRecords)) {
        throw new Error("Fetched records is not an array");
    }

    const allNumbers = await processRecords(fetchedRecords)

    return NextResponse.json({ data: fetchedRecords, sale_amount: allNumbers })
}

