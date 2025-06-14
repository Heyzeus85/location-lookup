/** @type {import('next').NextConfig} */
const nextConfig = {
    output: 'export',
    trailingSlash: true,
    images: {
      unoptimized: true
    },
    // Enable static optimization
    experimental: {
      outputFileTracingRoot: undefined,
    }
  }
  
  module.exports = nextConfig