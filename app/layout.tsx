import type { Metadata } from "next";
import "./globals.css";

const isGitHubPagesBuild = process.env.GITHUB_PAGES === "true";
const repositoryName = process.env.GITHUB_REPOSITORY?.split("/").at(-1) ?? "Bco-2-485-guide";
const basePath = isGitHubPagesBuild ? `/${repositoryName}` : "";
const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://soldier-admin-guide.eliancastro990.chatgpt.site";
const publicAsset = (path: string) => `${basePath}${path}`;

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: "B Co 2-485 Soldier Guide",
  description: "Administrative, digital-access, and readiness resources for B Co 2-485 Soldiers.",
  openGraph: { title: "B Co 2-485 Soldier Guide", description: "Administrative, digital-access, and readiness resources.", url: siteUrl, images: [publicAsset("/og.png")] },
  twitter: { card: "summary_large_image", title: "B Co 2-485 Soldier Guide", description: "Administrative, digital-access, and readiness resources.", images: [publicAsset("/og.png")] },
  icons: { icon: publicAsset("/favicon.svg"), shortcut: publicAsset("/favicon.svg") },
};
export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) { return <html lang="en"><body>{children}</body></html>; }
