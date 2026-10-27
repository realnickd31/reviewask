import "./globals.css";
import type { Metadata } from "next";
import { Inter } from "next/font/google";

const inter = Inter({ subsets: ["latin"], display: "swap" });

const title = "ReviewAsk — Automatic Google review requests for Jobber & field-service businesses";
const description = "Send a Google review request after every finished job in Jobber or Housecall Pro, with one day-3 follow-up. $39/month, 7-day free trial, no contract.";
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
      <body className={`${inter.className} min-h-screen bg-slate-50 text-navy-900 antialiased`}><a href="#main" className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-50 focus:rounded-md focus:bg-white focus:px-4 focus:py-2 focus:text-navy-900 focus:shadow">Skip to content</a>{children}</body>
    </html>
  );
}
