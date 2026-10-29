import Link from "next/link";
import Logo from "./Logo";
import { currentUser } from "@/lib/session";
import { isAdminUser } from "@/lib/admin";

export default async function AppNav() {
  const u = await currentUser();
  const admin = isAdminUser(u);
  return <header className="border-b border-slate-200 bg-white"><div className="mx-auto flex h-14 max-w-5xl items-center justify-between gap-2 px-3 sm:px-4">
    <div className="shrink-0"><Logo dark compact href={admin ? "/admin" : "/dashboard"} /></div><nav className="flex items-center gap-0 text-[13px] sm:gap-1 sm:text-sm font-medium text-slate-600">
      {!admin && <>
      <Link href="/quick" className="whitespace-nowrap rounded-md px-[7px] py-2.5 sm:px-3 sm:py-1.5 font-semibold text-navy-900 hover:bg-slate-100">Quick ask</Link>
      <Link href="/dashboard" className="whitespace-nowrap rounded-md px-[7px] py-2.5 sm:px-3 sm:py-1.5 hover:bg-slate-100 hover:text-navy-900"><span className="sm:hidden">Home</span><span className="hidden sm:inline">Dashboard</span></Link>
      <Link href="/settings" className="whitespace-nowrap rounded-md px-[7px] py-2.5 sm:px-3 sm:py-1.5 hover:bg-slate-100 hover:text-navy-900">Settings</Link>
      </>}
      {admin && <Link href="/admin" className="whitespace-nowrap rounded-md px-[7px] py-2.5 sm:px-3 sm:py-1.5 hover:bg-slate-100 hover:text-navy-900">Admin</Link>}
      <form action="/api/auth/logout" method="post"><button type="submit" className="whitespace-nowrap rounded-md px-[7px] py-2.5 sm:px-3 sm:py-1.5 hover:bg-slate-100 hover:text-navy-900">Log out</button></form>
    </nav></div></header>;
}
