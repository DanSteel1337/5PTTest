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
  webpack: (config) => {
    config.resolve.fallback = { fs: false, net: false, tls: false }

    // Add special handling for RainbowKit CSS
    config.module.rules.push({
      test: /\.css$/,
      use: ["style-loader", "css-loader"],
      include: /node_modules\/@rainbow-me\/rainbowkit/,
    })

    return config
  },
}

module.exports = nextConfig
