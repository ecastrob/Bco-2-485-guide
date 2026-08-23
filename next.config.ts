import type { NextConfig } from "next";

const isGitHubPagesBuild = process.env.GITHUB_PAGES === "true";
const repositoryName = process.env.GITHUB_REPOSITORY?.split("/").at(-1) ?? "Bco-2-485-guide";

const nextConfig: NextConfig = isGitHubPagesBuild
  ? {
      basePath: `/${repositoryName}`,
      images: { unoptimized: true },
      output: "export",
      trailingSlash: true,
      typescript: { tsconfigPath: "tsconfig.pages.json" },
    }
  : {};

export default nextConfig;
