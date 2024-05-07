/**
 * Run `build` or `dev` with `SKIP_ENV_VALIDATION` to skip env validation. This is especially useful
 * for Docker builds.
 */
await import("./src/env.js");

/** @type {import("next").NextConfig} */
const nextConfig = {
    experimental: {
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-expect-error
        serverActions: true,
        serverComponentsExternalPackages: ['@prisma/client', 'bcrypt']
    }
};

export default nextConfig;