import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    remotePatterns: [
      {
        // Firebase Storage — case files, police report photos
        protocol: "https",
        hostname: "*.firebasestorage.app",
      },
      {
        // Firebase Storage legacy format
        protocol: "https",
        hostname: "firebasestorage.googleapis.com",
      },
    ],
  },
  // Allow server actions (used by intake API)
  experimental: {
    serverActions: {
      allowedOrigins: ["texastotalloss.com", "www.texastotalloss.com"],
    },
  },
};

export default nextConfig;
