import Link from "next/link";
export default function Logo({ dark = false }: { dark?: boolean }) {
  return <Link href="/" className={`flex items-center gap-2 text-[15px] font-semibold tracking-tight ${dark ? "text-navy-900" : "text-white"}`}>
    <span className={`grid h-7 w-7 place-items-center rounded-md ${dark ? "bg-navy-900" : "bg-white/10 ring-1 ring-white/15"}`}>
      <svg viewBox="0 0 16 16" className="h-3.5 w-3.5 fill-lime" aria-hidden><path d="M8 1.5l1.9 4.1 4.5.5-3.4 3 1 4.4L8 11.2 4 13.5l1-4.4-3.4-3 4.5-.5z" /></svg>
    </span>ReviewAsk</Link>;
}
