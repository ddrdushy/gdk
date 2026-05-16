import type { NextConfig } from "next";
import path from "node:path";

const nextConfig: NextConfig = {
  turbopack: {
    root: path.resolve("./"),
  },
  output: "standalone",
};

export default nextConfig;
