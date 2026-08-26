import type { Metadata, Viewport } from "next";
import "./globals.css";

const isGitHubPagesBuild = process.env.GITHUB_PAGES === "true";
const repositoryName = process.env.GITHUB_REPOSITORY?.split("/").at(-1) ?? "Bco-2-485-guide";
const basePath = isGitHubPagesBuild ? `/${repositoryName}` : "";
const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://soldier-admin-guide.eliancastro990.chatgpt.site";
const publicAsset = (path: string) => `${basePath}${path}`;
const googleAnalyticsId = "G-ZYXG181TKD";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: "Delta Rays 3-323 Soldier Guide",
  description: "Administrative, digital-access, and readiness resources for Delta Rays 3-323 Soldiers.",
  openGraph: { title: "Delta Rays 3-323 Soldier Guide", description: "Administrative, digital-access, and readiness resources.", url: siteUrl, images: [publicAsset("/og.png")] },
  twitter: { card: "summary_large_image", title: "Delta Rays 3-323 Soldier Guide", description: "Administrative, digital-access, and readiness resources.", images: [publicAsset("/og.png")] },
  icons: { icon: publicAsset("/favicon.svg"), shortcut: publicAsset("/favicon.svg") },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="en">
    <head>
      <script async src={`https://www.googletagmanager.com/gtag/js?id=${googleAnalyticsId}`}></script>
      <script dangerouslySetInnerHTML={{ __html: `window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments);}gtag('js',new Date());gtag('config','${googleAnalyticsId}',{anonymize_ip:true});` }}></script>
    </head>
    <body>{children}</body>
  </html>;
}
