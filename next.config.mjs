
/** @type {import('next').NextConfig} */
const nextConfig = {
  async rewrites() {
    return [
      {
        source: '/api-proxy/:path*',
        destination: 'https://deppi-api-j1il.onrender.com/:path*',
      },
    ]
  },
}

export default nextConfig
