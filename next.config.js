/** @type {import('next').NextConfig} */
const nextConfig = {
    // Remove output: 'export' to enable API routes
    trailingSlash: true,
    images: {
      unoptimized: true
    },
    // Enable compression for better performance
    compress: true,
    // Enable powered by header removal for cleaner responses
    poweredByHeader: false,
    // Enable strict mode for better development
    reactStrictMode: true,
    // Enable SWC minification for better performance
    swcMinify: true,
    // Add security headers
    async headers() {
      return [
        {
          source: '/(.*)',
          headers: [
            {
              key: 'X-Frame-Options',
              value: 'DENY',
            },
            {
              key: 'X-Content-Type-Options',
              value: 'nosniff',
            },
            {
              key: 'Referrer-Policy',
              value: 'origin-when-cross-origin',
            },
            {
              key: 'X-DNS-Prefetch-Control',
              value: 'on',
            },
          ],
        },
      ]
    },
  }
  
  module.exports = nextConfig