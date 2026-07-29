import type { Metadata } from "next";
import { GeistSans } from "geist/font/sans";
import { GeistMono } from "geist/font/mono";
import { siteConfig } from "@/config/site";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.url),
  title: {
    default: "PORTFOLIO",
    template: "%s — PORTFOLIO",
  },
  description: siteConfig.tagline,
  keywords: [
    "AI Engineer",
    "Platform Engineer",
    "DevOps Engineer",
    "Agentic AI",
    "MLOps",
    "LangGraph",
    "MCP",
    siteConfig.name,
  ],
  authors: [{ name: siteConfig.name, url: siteConfig.url }],
  creator: siteConfig.name,
  openGraph: {
    type: "website",
    url: siteConfig.url,
    title: "PORTFOLIO",
    description: siteConfig.tagline,
    siteName: "PORTFOLIO",
  },
  twitter: {
    card: "summary_large_image",
    title: "PORTFOLIO",
    description: siteConfig.tagline,
  },
  icons: {
    icon: "/favicon.ico",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${GeistSans.variable} ${GeistMono.variable} dark h-full antialiased`}
    >
      <body className="bg-background text-foreground flex min-h-full flex-col">
        {children}
      </body>
    </html>
  );
}
