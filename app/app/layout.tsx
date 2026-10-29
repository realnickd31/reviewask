import "./globals.css";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import AnalyticsBeacon from "@/components/AnalyticsBeacon";

const inter = Inter({ subsets: ["latin"], display: "swap" });

const title = "ReviewAsk — Automatic Google review requests for any business";
const description = "Automatic Google review requests by email, with one follow-up. For any business. $39/month, 7-day free trial, no contract.";
export const metadata: Metadata = {
  metadataBase: new URL("https://getreviewask.com"),
  title: { default: title, template: "%s — ReviewAsk" },
  description,
  openGraph: { type: "website", siteName: "ReviewAsk", url: "https://getreviewask.com", title, description },
  twitter: { card: "summary_large_image", title, description },
};
export const viewport = { themeColor: "#0a1224", width: "device-width", initialScale: 1 };

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={`${inter.className} min-h-screen bg-slate-50 text-navy-900 antialiased`}><a href="#main" className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-50 focus:rounded-md focus:bg-white focus:px-4 focus:py-2 focus:text-navy-900 focus:shadow">Skip to content</a>{children}<AnalyticsBeacon /></body>
    </html>
  );
}
