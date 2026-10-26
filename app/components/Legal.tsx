import Logo from "./Logo";
import Footer from "./Footer";
export default function Legal({ title, children }: { title: string; children: React.ReactNode }) {
  return <div><header className="border-b border-slate-200 bg-white"><div className="mx-auto flex h-14 max-w-3xl items-center px-4"><Logo dark /></div></header>
    <main className="mx-auto max-w-3xl space-y-4 px-4 py-12 leading-relaxed text-slate-700 [&_h2]:mt-6 [&_h2]:text-lg [&_h2]:font-semibold [&_h2]:text-navy-900">
      <h1 className="text-3xl font-semibold text-navy-900">{title}</h1><p className="text-sm text-slate-500">Last updated: October 2026</p>{children}</main><Footer /></div>;
}
