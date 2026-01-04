import type { NextConfig } from "next";

const API_URL = process.env.NEXT_PUBLIC_API_URL;
const AUTH_API_BASE = `${API_URL}/api/auth`;
const MEDIA_API_BASE = `${API_URL}/api`;

const nextConfig: NextConfig = {
  async rewrites() {
    return [
      {
        source: '/api/remote/:path*',
        destination: `${MEDIA_API_BASE}/:path*`,
      },
      {
        source: '/api-proxy/:path*',
        destination: `${MEDIA_API_BASE}/:path*`,
      },
      // 1. Media Proxy
      {
        source: '/api/proxy/medias',
        destination: `${MEDIA_API_BASE}/medias`,
      },

      // 2. Auth Proxy
      {
        source: '/api/proxy/auth/:path*',
        destination: `${AUTH_API_BASE}/:path*`,
      },

      // 3. Register Proxy
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

      // --- PHẦN ADMIN: GIỮ NGUYÊN CÁC QUY TẮC KHÁC, CHỈ CHỈNH ADMIN ---
      {
        // Khớp với cuộc gọi `${API_BASE_URL}/admin/:path*`
        source: '/api/proxy/admin/:path*',
        destination: `${MEDIA_API_BASE}/admin/:path*`,
      },
      // -------------------------------------------------------------

      {
        source: '/api/:path*',
        destination: `${MEDIA_API_BASE}/:path*`, 
      },
      {
        source: '/admin/users/:path*',
        destination: `${MEDIA_API_BASE}/admin/users/:path*`
      },
      {
        source: "/api/proxy/:path*",
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
      {
        protocol: 'http',
        hostname: 'localhost',
      },
    ],
  },
};

export default nextConfig;