import type { NextConfig } from "next";

const nextConfig: NextConfig = {

  allowedDevOrigins: [
    "*.ngrok-free.app",
    "*.ngrok-free.dev",
  ],
  reactCompiler: true,
};

export default nextConfig;
