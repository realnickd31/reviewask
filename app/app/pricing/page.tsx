import Link from "next/link";
import Pricing from "@/components/Pricing";
import Footer from "@/components/Footer";
import Logo from "@/components/Logo";
export const metadata = { title: "Pricing", description: "ReviewAsk is $39/month or $390/year (save $78). 200 review requests a month, 7-day free trial, no contract.", alternates: { canonical: "/pricing" } };
export default function Page() { return <main className="bg-white"><header className="border-b border-slate-200"><div className="mx-auto flex h-14 max-w-5xl items-center gap-4 px-6"><Logo dark /><Link href="/login" className="ml-auto text-sm text-slate-700">Log in</Link><Link href="/signup" className="btn-navy px-3.5 py-2">Start free trial</Link></div></header><Pricing /><Footer /></main>; }
