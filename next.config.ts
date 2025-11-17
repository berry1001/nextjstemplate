import type { NextConfig } from "next";
import path from "node:path";

const LOADER = path.resolve(
  __dirname,
  "src/visual-edits/component-tagger-loader.js",
);

const nextConfig: NextConfig = {
  output: "standalone",
  images: {
    unoptimized: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  devIndicators: false,
  typescript: {
    ignoreBuildErrors: true,
  },
  webpack: (config: any) => {
    config.module.rules.push({
      test: /\.(tsx|jsx)$/,
      exclude: /node_modules/,
      use: [LOADER],
    });
    return config;
  },
  turbopack: {
    rules: {
      "*.{jsx,tsx}": {
        loaders: [LOADER],
      },
    },
  },
};

export default nextConfig;
