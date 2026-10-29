import Link from "next/link";
import Pricing from "@/components/Pricing";
import Footer from "@/components/Footer";
import Logo from "@/components/Logo";
export const metadata = { title: { absolute: "ReviewAsk Pricing: $39/month Google Review Requests, No Contract" }, description: "ReviewAsk is $39/month or $390/year (save $78) for automatic Google review requests: 200 requests a month, 7-day free trial, no contract.", alternates: { canonical: "/pricing" } };
export default function Page() { return <main id="main" className="bg-white"><header className="border-b border-slate-200"><div className="mx-auto flex h-14 max-w-5xl items-center gap-4 px-6"><Logo dark /><Link href="/login" className="ml-auto text-sm text-slate-700">Log in</Link><Link href="/signup" className="btn-navy px-3.5 py-2">Start free trial</Link></div></header><h1 className="mx-auto max-w-3xl px-6 pt-14 text-center text-3xl font-semibold tracking-tight text-navy-900 sm:text-4xl">Simple pricing. No contract.</h1><Pricing /><p className="pb-16 text-center text-sm text-slate-600">Questions? See the <Link href="/#faq" className="underline underline-offset-4">FAQ</Link></p><Footer /></main>; }
