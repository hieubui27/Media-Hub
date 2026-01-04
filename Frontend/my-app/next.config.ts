import type { NextConfig } from "next";

const API_URL = process.env.NEXT_PUBLIC_API_URL;
const AUTH_API_BASE = `${API_URL}/api/auth`;
const MEDIA_API_BASE = `${API_URL}/api`;

const nextConfig: NextConfig = {
  async rewrites() {
    return [
      {
        source: '/api/remote/:path*', // Đường dẫn ảo trên localhost
        destination: `${MEDIA_API_BASE}/:path*`, // Đường dẫn thật ngrok
      },
      {
        source: '/api-proxy/:path*', // Unified proxy path
        destination: `${MEDIA_API_BASE}/:path*`,
      },
      // 1. Media Proxy (Handles query params automatically)
      {
        source: '/api/proxy/medias',
        destination: `${MEDIA_API_BASE}/medias`,
      },

      // 2. Auth Proxy (Wildcard catch-all for /api/proxy/auth/...)
      {
        source: '/api/proxy/auth/:path*',
        destination: `${AUTH_API_BASE}/:path*`,
      },

      // 3. Register Proxy (Specific mapping for your nested register paths)
      {
        source: '/api/proxy/register/:path*',
        destination: `${AUTH_API_BASE}/register/:path*`,
      },

      // 4. Individual Specific Mappings
      {
        source: '/api/proxy/login',
        destination: `${AUTH_API_BASE}/login`,
      },
      {
        source: '/api/proxy/me',
        destination: 'https://dummyjson.com/auth/me',
      },
      {
        source: '/api/auth/profile',
        destination: `${AUTH_API_BASE}/profile`,
      },
      {
        source: '/api/medias/latest',
        destination: `${MEDIA_API_BASE}/medias?page=1&limit=50`,
      },
      {
        source: '/api/medias/upload',
        destination: `${MEDIA_API_BASE}/medias`,
      },

      {
        source: '/api/medias/history',
        destination: `${MEDIA_API_BASE}/history`,
      },
      {
        source: '/api/:path*',
        destination: `${MEDIA_API_BASE}/:path*`, // URL backend ngrok của bạn
      },
      {
        source:'/admins/users/:path*',
        destination:`${MEDIA_API_BASE}/admin/users/:path*`
      },
      {
        // Khi gọi /api/proxy/... từ frontend
        source: "/api/proxy/:path*",
        // Sẽ được Next.js chuyển tiếp ngầm đến Backend
        // Đảm bảo bạn đã khai báo NEXT_PUBLIC_API_URL trong file .env
        destination: `${process.env.NEXT_PUBLIC_API_URL}/api/:path*`,
      },
    ];
  },
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: 'static.nutscdn.com' },
      { protocol: 'https', hostname: 'm.media-amazon.com' },
      { protocol: 'https', hostname: 'images-na.ssl-images-amazon.com' },
      { protocol: 'https', hostname: 'salt.tikicdn.com' },
      { protocol: 'https', hostname: 'vi.wikipedia.org' },
      { protocol: 'https', hostname: 'covers.openlibrary.org' },
      { protocol: 'https', hostname: 'placehold.co' },
      { protocol: 'https', hostname: 'encrypted-tbn0.gstatic.com' },
      {
        protocol: 'https',
        hostname: '**.ngrok-free.app',
      },
      // Thêm dòng này nếu bạn chạy ở localhost
      {
        protocol: 'http',
        hostname: 'localhost',
      },
    ],
  },
};

export default nextConfig;