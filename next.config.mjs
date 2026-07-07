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
        destination: `https://auth-api-fastapi-2ls5.onrender.com/:path*`,
      },
      {
        source: '/api/datasets/:path*',
        destination: `${process.env.FASTAPI_URL || 'https://dataset-api-fastapi.onrender.com'}/datasets/:path*`,
      },
      {
        source: '/api/save-dataset',
        destination: `${process.env.FASTAPI_URL || 'https://dataset-api-fastapi.onrender.com'}/save-dataset`,
      },
      {
        source: '/api/analyses/:path*',
        destination: `${process.env.FASTAPI_URL || 'https://dataset-api-fastapi.onrender.com'}/analyses/:path*`,
      },
    ]
  },
}

export default nextConfig
