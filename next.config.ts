import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  devIndicators: false,
  images: {
    domains: ["originui.com", "img.clerk.com", "images.unsplash.com", "ui.aceternity.com", "avatar.vercel.sh"],
  },
  reactStrictMode: false,
};

export default nextConfig;
