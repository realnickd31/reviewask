import "./globals.css";
import type { Metadata } from "next";
import { Inter } from "next/font/google";

const inter = Inter({ subsets: ["latin"], display: "swap" });

export const metadata: Metadata = {
  title: "ReviewAsk — Google review requests for local service businesses",
  description: "Send customers a simple, one-tap Google review request after every job. $39/month, cancel anytime.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={`${inter.className} min-h-screen bg-slate-50 text-navy-900 antialiased`}>{children}</body>
    </html>
  );
}
