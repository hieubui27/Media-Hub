import type { NextConfig } from "next";

const AUTH_API_BASE = 'https://8dcbf8a962a3.ngrok-free.app/api/auth';
const MEDIA_API_BASE = 'https://8dcbf8a962a3.ngrok-free.app/api';

const nextConfig: NextConfig = {
  async rewrites() {
    return [
      {
        source: '/api/remote/:path*', // Đường dẫn ảo trên localhost
        destination: 'https://8dcbf8a962a3.ngrok-free.app/api/:path*', // Đường dẫn thật ngrok
      },
      {
        source: '/api-proxy/:path*', // Unified proxy path
        destination: 'https://8dcbf8a962a3.ngrok-free.app/api/:path*',
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
        destination: `https://8dcbf8a962a3.ngrok-free.app/api/medias?page=1&limit=50`,
      },
      {
        source: '/api/medias/upload',
        destination: `https://8dcbf8a962a3.ngrok-free.app/api/medias`,
      },

      {
        source: '/api/medias/history',
        destination: `https://8dcbf8a962a3.ngrok-free.app/api/history`,
      },
      {
        source: '/api/:path*',
        destination: 'https://8dcbf8a962a3.ngrok-free.app/api/:path*', // URL backend ngrok của bạn
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
    ],
  },
};

export default nextConfig;