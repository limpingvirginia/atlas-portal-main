import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Unmatched paths proxy to the demo app (multi-zone). Fallback phase runs
  // after ALL Next routes including dynamic ones like /api/auth/[...all] —
  // a vercel.json rewrite would shadow dynamic routes instead.
  async rewrites() {
    return {
      beforeFiles: [],
      afterFiles: [],
      fallback: [
        {
          source: "/:path*",
          destination: "https://nextjs-dashboard.shadcnuidashboard.com/:path*"
        }
      ]
    };
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "**"
      },
      {
        protocol: "http",
        hostname: "**"
      }
    ]
  }
};

export default nextConfig;
