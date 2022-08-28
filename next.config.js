/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  experimental: {
    outputStandalone: true,
  },
  webpack: (config) => {
    // To read `schema.graphql` in app/pages/api/graphql.ts
    config.module.rules.push({
      test: /\.graphql$/,
      exclude: /node_modules/,
      loader: 'graphql-tag/loader'
    });
    return config
  },
}

module.exports = nextConfig
