import type { NextConfig } from "next";
import { withWorkflow } from "workflow/next";

const nextConfig: NextConfig = {
  serverExternalPackages: ["express", "shopify-api-node", "pg", "morgan", "body-parser", "cors"],
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
  webpack: (config, { isServer }) => {
    if (isServer) {
        config.externals.push("express", "shopify-api-node", "pg", "morgan", "body-parser", "cors");
    }
    config.resolve.alias['express/lib/view.js'] = require('path').resolve(__dirname, 'mock-view.js');
    config.watchOptions = {
        poll: 1000,
        aggregateTimeout: 300,
    };
    return config;
  },
};

export default withWorkflow(nextConfig);
