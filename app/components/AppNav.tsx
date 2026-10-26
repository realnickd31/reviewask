import Link from "next/link";
import Logo from "./Logo";
export default function AppNav() {
  return <header className="border-b border-slate-200 bg-white"><div className="mx-auto flex h-14 max-w-5xl items-center justify-between px-4">
    <Logo dark /><nav className="flex items-center gap-1 text-sm font-medium text-slate-600">
      <Link href="/quick" className="rounded-md px-3 py-1.5 font-semibold text-navy-900 hover:bg-slate-100">Quick ask</Link>
      <Link href="/dashboard" className="rounded-md px-3 py-1.5 hover:bg-slate-100 hover:text-navy-900">Dashboard</Link>
      <Link href="/settings" className="rounded-md px-3 py-1.5 hover:bg-slate-100 hover:text-navy-900">Settings</Link>
      <form action="/api/auth/logout" method="post"><button className="rounded-md px-3 py-1.5 hover:bg-slate-100 hover:text-navy-900">Log out</button></form>
    </nav></div></header>;
}
