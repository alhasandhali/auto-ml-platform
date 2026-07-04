/** @type {import('next').NextConfig} */
const nextConfig = {
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
  },
  async rewrites() {
    return [
      {
        source: '/api/analyze',
        destination: `${process.env.FASTAPI_URL || 'https://dataset-api-fastapi.onrender.com'}/analyze`,
      },
    ]
  },
}

export default nextConfig
