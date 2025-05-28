/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
  },
  productionBrowserSourceMaps: true, // Enable source maps in production
  webpack: (config, { dev, isServer }) => {
    // Essential fallbacks for Web3 libraries
    config.resolve.fallback = {
      fs: false,
      net: false,
      tls: false,
    }

    // Configure source maps
    if (!isServer) {
      config.devtool = dev ? "eval-source-map" : "source-map"
    }

    return config
  },
}

module.exports = nextConfig
