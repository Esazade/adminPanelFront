/** @type {import('next').NextConfig} */
const API = process.env.NEXT_PUBLIC_API_BASE || 'http://localhost:5000';

const nextConfig = {
  async rewrites() {
    return [
      { source: '/uploads/:path*', destination: `${API}/uploads/:path*` },
    ];
  },
};

export default nextConfig;
