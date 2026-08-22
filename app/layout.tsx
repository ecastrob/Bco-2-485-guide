import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL("https://soldier-admin-guide.eliancastro990.chatgpt.site"),
  title: "B Co 2-485 Soldier Guide",
  description: "Administrative, digital-access, and readiness resources for B Co 2-485 Soldiers.",
  openGraph: { title: "B Co 2-485 Soldier Guide", description: "Administrative, digital-access, and readiness resources.", images: ["/og.png"] },
  twitter: { card: "summary_large_image", title: "B Co 2-485 Soldier Guide", description: "Administrative, digital-access, and readiness resources.", images: ["/og.png"] },
  icons: { icon: "/favicon.svg", shortcut: "/favicon.svg" },
};
export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) { return <html lang="en"><body>{children}</body></html>; }
