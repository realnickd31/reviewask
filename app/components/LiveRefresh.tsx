"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
// Keeps server-rendered dashboard data (History/Scheduled) fresh without a manual reload.
export default function LiveRefresh({ everyMs = 15000 }: { everyMs?: number }) {
  const router = useRouter();
  useEffect(() => {
    const tick = () => { if (document.visibilityState === "visible") router.refresh(); };
    const id = setInterval(tick, everyMs);
    window.addEventListener("focus", tick); document.addEventListener("visibilitychange", tick);
    return () => { clearInterval(id); window.removeEventListener("focus", tick); document.removeEventListener("visibilitychange", tick); };
  }, [router, everyMs]);
  return null;
}
