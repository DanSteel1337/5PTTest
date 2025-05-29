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
  productionBrowserSourceMaps: true,
  experimental: {
    optimizePackageImports: ["@rainbow-me/rainbowkit", "wagmi", "viem"],
  },
  webpack: (config, { dev, isServer }) => {
    // Essential fallbacks for Web3 libraries
    config.resolve.fallback = {
      fs: false,
      net: false,
      tls: false,
      crypto: false,
      stream: false,
      url: false,
      zlib: false,
      http: false,
      https: false,
      assert: false,
      os: false,
      path: false,
    }

    // Configure source maps
    if (!isServer) {
      config.devtool = dev ? "eval-source-map" : "source-map"
    }

    // Optimize bundle splitting
    config.optimization = {
      ...config.optimization,
      splitChunks: {
        ...config.optimization.splitChunks,
        cacheGroups: {
          ...config.optimization.splitChunks?.cacheGroups,
          web3: {
            name: "web3",
            chunks: "all",
            test: /[\\/]node_modules[\\/](@rainbow-me|wagmi|viem|@walletconnect)[\\/]/,
            priority: 20,
          },
        },
      },
    }

    return config
  },
  // Optimize font loading
  optimizeFonts: true,
  // Reduce bundle size
  swcMinify: true,
}

module.exports = nextConfig
