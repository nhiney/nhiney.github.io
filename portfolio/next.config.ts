import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "export",
  trailingSlash: true,
  // The local demo is opened at 127.0.0.1. Next.js 16 otherwise serves the
  // HTML but blocks its dev-only client runtime, leaving Canvas effects inert.
  allowedDevOrigins: ["127.0.0.1"],
  images: {
    unoptimized: true,
  },
};

export default nextConfig;
