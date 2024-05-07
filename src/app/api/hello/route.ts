import { type NextApiRequest, type NextApiResponse } from 'next';
import * as cheerio from 'cheerio';
import axios from 'axios';

export async function GET() {
    return new Response("Hello world!")
}

