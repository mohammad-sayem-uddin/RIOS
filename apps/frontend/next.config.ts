import path from 'node:path';

import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  reactStrictMode: true,
  outputFileTracingRoot: path.join(__dirname, '../../'),
  eslint: {
    ignoreDuringBuilds: true,
  },

  /** Proxy API requests to the backend server in development */
  async rewrites() {
    return await Promise.resolve([
      {
        source: '/api/:path*',
        destination: 'http://localhost:3000/api/:path*',
      },
      {
        source: '/health/:path*',
        destination: 'http://localhost:3000/health/:path*',
      },
      {
        source: '/docs/:path*',
        destination: 'http://localhost:3000/docs/:path*',
      },
    ]);
  },

  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**',
      },
    ],
  },

  /** Reduce production bundle size */
  compiler: {
    removeConsole: process.env.NODE_ENV === 'production' ? { exclude: ['error', 'warn'] } : false,
  },
};

export default nextConfig;
