"use client";
import { useEffect } from "react";

// Closes <details data-menu> dropdowns on outside tap, link tap, or Escape.
export default function MenuCloser() {
  useEffect(() => {
    const close = (e: Event) => document.querySelectorAll<HTMLDetailsElement>("details[data-menu][open]").forEach((d) => {
      const t = e.target as Node | null;
      if (e.type === "keydown" || !t || !d.contains(t) || (t as Element).closest?.("a")) d.open = false;
    });
    const key = (e: KeyboardEvent) => { if (e.key === "Escape") close(e); };
    document.addEventListener("click", close); document.addEventListener("keydown", key);
    return () => { document.removeEventListener("click", close); document.removeEventListener("keydown", key); };
  }, []);
  return null;
}
