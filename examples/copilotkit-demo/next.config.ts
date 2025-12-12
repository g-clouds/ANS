import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  serverExternalPackages: ["pino", "thread-stream", "@copilotkit/runtime"],
};

export default nextConfig;