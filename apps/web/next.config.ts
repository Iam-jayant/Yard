import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  transpilePackages: ["@yard/db", "@yard/types"],
};

export default nextConfig;
