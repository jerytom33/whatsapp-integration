import type { NextConfig } from "next";
import { withWorkflow } from "workflow/next";

const nextConfig: NextConfig = {
  async headers() {
    return [
      {
        source: "/:path*",
        headers: [
          { key: "Access-Control-Allow-Origin", value: "*" },
          { key: "Access-Control-Allow-Methods", value: "GET,OPTIONS,PATCH,DELETE,POST,PUT" },
          { key: "X-Frame-Options", value: "ALLOWALL" },
          { key: "Content-Security-Policy", value: "frame-ancestors 'self' http://localhost:5173 *" }
        ],
      },
    ];
  },
  webpack: (config) => {
    config.watchOptions = {
        poll: 1000,
        aggregateTimeout: 300,
    };
    return config;
  },
};

export default withWorkflow(nextConfig);
