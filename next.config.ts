import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  devIndicators: false,
  images: {
    domains: [
      "originui.com",
      "img.clerk.com",
      "images.unsplash.com",
      "ui.aceternity.com",
      "avatar.vercel.sh",
    ],
  },
  reactStrictMode: false,

  eslint: {
    // This allows builds to complete even if there are ESLint errors
    ignoreDuringBuilds: true,
  },
};

export default nextConfig;
