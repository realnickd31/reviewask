"use client";
import { useEffect, useState } from "react";
// DB stores SQLite datetime('now') = UTC "YYYY-MM-DD HH:MM:SS". Render in the viewer's (account owner's) browser timezone.
function toDate(t: string) { return new Date(/[zZ]|[+-]\d\d:?\d\d$/.test(t) ? t : t.replace(" ", "T") + "Z"); }
const OPTS: Intl.DateTimeFormatOptions = { month: "short", day: "numeric", hour: "numeric", minute: "2-digit", timeZoneName: "short" };
export default function LocalTime({ t, prefix = "" }: { t: string; prefix?: string }) {
  const d = toDate(t);
  const [s, setS] = useState<string | null>(null);
  useEffect(() => { setS(d.toLocaleString(undefined, OPTS)); }, [t]); // eslint-disable-line react-hooks/exhaustive-deps
  return <time dateTime={d.toISOString()} suppressHydrationWarning>{prefix}{s ?? d.toLocaleDateString("en-US", { month: "short", day: "numeric", timeZone: "UTC" })}</time>;
}
