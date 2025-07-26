import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  async rewrites() {
    return {
      beforeFiles: [
        {
          source: '/:path*',
          has: [
            {
              type: 'host',
              value: '(?<subdomain>.*)\\.flavorr\\.in',
            },
          ],
          destination: '/:subdomain/:path*',
        },
      ],
    }
  },
  async headers() {
    return [
      {
        source: '/:username',
        headers: [
          {
            key: 'Cache-Control',
            value: 'no-cache, no-store, must-revalidate',
          },
        ],
      },
    ]
  },
}

export default nextConfig