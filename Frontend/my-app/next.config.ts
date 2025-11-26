import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async rewrites() {
    return [
      {
        source: '/api/proxy/login', // You call this path on localhost
        destination: 'https://ea82c9976156.ngrok-free.app/api/auth/login', // Next.js forwards it here
      },
      {
        source: '/api/proxy/register/request', // You call this path on localhost
        destination: 'https://ea82c9976156.ngrok-free.app/api/auth/register/request', // Next.js forwards it here
      },
      {
        source: '/api/proxy/register/confirm', // You call this path on localhost
        destination: 'https://ea82c9976156.ngrok-free.app/api/auth/register/confirm', // Next.js forwards it here
      },
      {
        source: '/api/proxy/me', // You call this path on localhost
        destination: 'https://dummyjson.com/auth/me', // Next.js forwards it here
      },
      {
        source: '/api/proxy/', // You call this path on localhost
        destination: 'https://ea82c9976156.ngrok-free.app/api/auth/', // Next.js forwards it here
      },
      {
        source: '/api/proxy/auth/password-reset/request', // You call this path on localhost
        destination: 'https://ea82c9976156.ngrok-free.app/api/auth/password-reset/request', // Next.js forwards it here
      },
      {
        source: '/api/proxy/auth/password-reset/request', // You call this path on localhost
        destination: 'https://ea82c9976156.ngrok-free.app/api/auth/password-reset/request', // Next.js forwards it here
      },
      {
        source: '/api/proxy/auth/password-reset/confirm', // You call this path on localhost
        destination: 'https://ea82c9976156.ngrok-free.app/api/auth/password-reset/confirm', // Next.js forwards it here
      },
    ];
  },
};

export default nextConfig;
