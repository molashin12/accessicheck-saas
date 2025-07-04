/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: [
      'lh3.googleusercontent.com', // Google profile images
      'avatars.githubusercontent.com', // GitHub profile images
    ],
  },
  // Optimize for scanning performance
  webpack: (config, { isServer }) => {
    if (isServer) {
      // Server-side optimizations for Puppeteer
      config.externals.push({
        puppeteer: 'commonjs puppeteer',
      });
    }
    return config;
  },
  // Security headers
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
            value: 'strict-origin-when-cross-origin',
          },
          {
            key: 'Permissions-Policy',
            value: 'camera=(), microphone=(), geolocation=()',
          },
        ],
      },
    ];
  },
  // API routes configuration
  async rewrites() {
    return [
      {
        source: '/api/scan/:path*',
        destination: '/api/scan/:path*',
      },
    ];
  },
};

module.exports = nextConfig;