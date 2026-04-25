import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: false, // strict mode double-mounts tear WebSocket connections
  reactCompiler: true,
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com",
        port: "",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "dwdwn8b5ye.ufs.sh",
        port: "",
        pathname: "/**",
      },
    ],
  },
};

export default nextConfig;
