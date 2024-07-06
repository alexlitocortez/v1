/**
 * Run `build` or `dev` with `SKIP_ENV_VALIDATION` to skip env validation. This is especially useful
 * for Docker builds.
 */
await import("./src/env.js");
import { env } from "process";

/** @type {import("next").NextConfig} */
const nextConfig = {
    reactStrictMode: true,
    experimental: {
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        serverComponentsExternalPackages: ['@prisma/client', 'bcrypt']
    },
    env: {
        NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL
    }
};

export default nextConfig;