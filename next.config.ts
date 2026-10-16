import type { NextConfig } from "next";

const nextConfig: NextConfig = {

  allowedDevOrigins: [
    "*.ngrok-free.app",
    "*.ngrok-free.dev",
  ],
  reactCompiler: true,
  async rewrites() {
    // Nest excludes OAuth, discovery, and MCP from its /api prefix.
    const backend = (process.env.BACKEND_URL ?? process.env.NEXT_PUBLIC_API_URL)?.replace(/\/+$/, '').replace(/\/api$/, '');
    if (!backend) return [];

    return [
      '/oauth/authorize',
      '/oauth/authorize/complete',
      '/oauth/token',
      '/oauth/register',
      '/.well-known/oauth-authorization-server',
      '/.well-known/oauth-protected-resource/mcp',
      '/mcp',
    ].map((source) => ({ source, destination: `${backend}${source}` }));
  },
};

export default nextConfig;
