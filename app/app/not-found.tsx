import Link from "next/link";
import Logo from "@/components/Logo";
import Footer from "@/components/Footer";
export const metadata = { title: "Page not found", robots: { index: false } };
export default function NotFound() {
  const l = "font-medium text-navy-900 underline underline-offset-4";
  return <div><header className="border-b border-slate-200 bg-white"><div className="mx-auto flex h-14 max-w-3xl items-center px-4"><Logo dark /></div></header>
    <main id="main" className="mx-auto max-w-3xl space-y-4 px-4 py-16 text-slate-700">
      <h1 className="text-3xl font-semibold text-navy-900">We couldn&apos;t find that page</h1>
      <p>The link may be old or mistyped. These can help:</p>
      <ul className="list-disc space-y-1 pl-5">
        <li><Link href="/" className={l}>Home</Link>: automatic Google review asks after every job</li>
        <li><Link href="/pricing" className={l}>Pricing</Link>: $39/month, 7-day free trial</li>
        <li><Link href="/guides" className={l}>Guides</Link>: getting reviews in your trade</li>
      </ul>
      <p className="text-sm text-slate-500">Still stuck? <a href="mailto:support@getreviewask.com" className="underline">support@getreviewask.com</a></p>
    </main><Footer /></div>;
}
