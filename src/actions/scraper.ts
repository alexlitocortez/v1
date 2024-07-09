"use server";

import puppeteer from 'puppeteer';

export async function scrapeDownloads() {
    const browser = await puppeteer.launch()
    const page = await browser.newPage()

    await page.goto('https://www.npmjs.com/package/puppeteer')
    await page.screenshot({ path: 'screenshot.png' })
    await browser.close()
}