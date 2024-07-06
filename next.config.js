/**
 * Run `build` or `dev` with `SKIP_ENV_VALIDATION` to skip env validation. This is especially useful
 * for Docker builds.
 */

/** @type {import("next").NextConfig} */
const nextConfig = {
    reactStrictMode: true,
    experimental: {
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        serverComponentsExternalPackages: ['@prisma/client', 'bcrypt']
    },
};

export default nextConfig;