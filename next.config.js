/**
 * Run `build` or `dev` with `SKIP_ENV_VALIDATION` to skip env validation. This is especially useful
 * for Docker builds.
 */

const { BundleAnalyzerPlugin } = require('webpack-bundle-analyzer');

/** @type {import("next").NextConfig} */
const nextConfig = {
    reactStrictMode: true,
    experimental: {
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        serverComponentsExternalPackages: ['@prisma/client', 'bcrypt']
    },
    webpack: (config, { isServer }) => {
        if (!isServer) {
            config.plugins.push(new BundleAnalyzerPlugin());
        }
        return config;
    },
};

export default nextConfig;


// module.exports = {
//     webpack: (config, { isServer }) => {
//       if (!isServer) {
//         config.plugins.push(new BundleAnalyzerPlugin());
//       }
//       return config;
//     },
//   };