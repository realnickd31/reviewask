import Link from "next/link";
export default function Logo({ dark = false, href = "/", compact = false }: { dark?: boolean; href?: string; compact?: boolean }) {
  return <Link href={href} aria-label="ReviewAsk" className={`flex items-center gap-2 text-[15px] font-semibold tracking-tight ${dark ? "text-navy-900" : "text-white"}`}>
    <svg viewBox="0 0 256 256" className="h-7 w-7 shrink-0" aria-hidden>
      {dark ? <circle cx="128" cy="128" r="120" fill="#0a1224" /> : <circle cx="128" cy="128" r="116" fill="#ffffff" fillOpacity={0.1} stroke="#ffffff" strokeOpacity={0.2} strokeWidth={8} />}
      <path fillRule="evenodd" fill="#fff" d="M84 196V60h52a38 38 0 0 1 8 75l34 61h-30l-31-58H110v58zM110 82h24a16 16 0 0 1 0 34h-24z" />
      <path d="M190 52l7 15 16 2-12 11 3 16-14-8-14 8 3-16-12-11 16-2z" fill="#a3e635" />
    </svg><span className={compact ? "hidden min-[400px]:inline" : undefined}>ReviewAsk</span></Link>;
}
