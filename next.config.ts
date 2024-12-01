import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  output: 'export',
  images: {
    unoptimized: true,
  },
  basePath: '/coffee-grinder-converter',
  assetPrefix: '/coffee-grinder-converter/',
}

export default nextConfig