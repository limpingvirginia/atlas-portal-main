import type { NextConfig } from "next";

const repoName = "atlas-portal-main";

const nextConfig: NextConfig = {
  output: "export",
  trailingSlash: true,
  basePath: process.env.NODE_ENV === "production" ? `/${repoName}` : undefined,
  assetPrefix: process.env.NODE_ENV === "production" ? `/${repoName}/` : undefined,
  images: {
    unoptimized: true,
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
