import type { NextConfig } from "next";
import path from "path";

const isGithubPages = process.env.GITHUB_PAGES === "true";
const repoName = "/-canteen-management-system.";

const nextConfig: NextConfig = {
  output: "export",
  basePath: isGithubPages ? repoName : "",
  assetPrefix: isGithubPages ? repoName : "",
  images: {
    unoptimized: true,
  },
  turbopack: {
    root: path.resolve(__dirname),
  },
};

export default nextConfig;
