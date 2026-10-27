import Logo from "./Logo";
import Footer from "./Footer";
export default function Legal({ title, children }: { title: string; children: React.ReactNode }) {
  return <div><header className="border-b border-slate-200 bg-white"><div className="mx-auto flex h-14 max-w-3xl items-center px-4"><Logo dark /><a href="/login" className="ml-auto mr-4 text-sm text-slate-700">Log in</a><a href="/signup" className="btn-navy px-3.5 py-2">Start free trial</a></div></header>
    <main id="main" className="mx-auto max-w-3xl space-y-4 [&_a:not(.btn-navy)]:text-navy-900 px-4 py-12 leading-relaxed text-slate-700 [&_h2]:mt-6 [&_h2]:text-lg [&_h2]:font-semibold [&_h2]:text-navy-900">
      <h1 className="text-3xl font-semibold text-navy-900">{title}</h1><p className="text-sm text-slate-500">Last updated: October 2026</p>{children}</main><Footer /></div>;
}
