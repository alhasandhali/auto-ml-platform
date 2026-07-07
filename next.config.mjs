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
      {
        source: '/api/tasks/:task_id',
        destination: `${process.env.FASTAPI_URL || 'https://dataset-api-fastapi.onrender.com'}/tasks/:task_id`,
      },
      {
        source: '/api/auth/:path*',
        destination: `${process.env.AUTH_API_URL || 'http://localhost:8000'}/:path*`,
      },
    ]
  },
}

export default nextConfig
