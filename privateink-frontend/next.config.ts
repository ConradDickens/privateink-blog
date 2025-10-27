import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Don't use 'export' for client-side heavy apps with dynamic routes
  // Use standard Next.js build for production deployment
  images: {
    unoptimized: true,
  },
};

export default nextConfig;
