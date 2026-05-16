import type { NextConfig } from "next";
import path from "node:path";

const nextConfig: NextConfig = {
  turbopack: {
    root: path.resolve("./"),
  },
  output: "standalone",
  // tesseract.js loads its worker script via require.resolve at runtime
  // and bundles a native canvas backend; both must stay outside Next's
  // module graph or the worker path resolves to a /ROOT/ phantom in Docker.
  serverExternalPackages: ["tesseract.js", "@napi-rs/canvas", "unpdf", "officeparser"],
};

export default nextConfig;
