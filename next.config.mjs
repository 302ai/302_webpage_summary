/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: false,
  experimental: {
    serverComponentsExternalPackages: ['pino', 'pino-pretty'],
    serverActions: {
      allowedOrigins: ['*.302ai.cn']
    }
  },
  output: 'standalone',
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'file.302.ai',
      },
    ],
  },
}

export default nextConfig
