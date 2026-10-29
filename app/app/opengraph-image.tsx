import { ImageResponse } from "next/og";
export const runtime = "edge";
export const alt = "ReviewAsk — automatic Google review requests for any business, $39/month";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";
export default function Image() {
  return new ImageResponse(<div style={{ width: "100%", height: "100%", display: "flex", flexDirection: "column", justifyContent: "space-between", background: "#0a1224", color: "white", padding: 72, fontFamily: "sans-serif" }}>
    <div style={{ display: "flex", alignItems: "center", gap: 16, fontSize: 36, fontWeight: 700 }}><svg width="56" height="56" viewBox="0 0 256 256"><circle cx="128" cy="128" r="120" fill="#0a1224" /><path d="M84 196V60h52a38 38 0 0 1 8 75l34 61h-30l-31-58H110v58z" fill="#fff" /><path d="M110 82h24a16 16 0 0 1 0 34h-24z" fill="#0a1224" /><path d="M190 52l7 15 16 2-12 11 3 16-14-8-14 8 3-16-12-11 16-2z" fill="#a3e635" /></svg>ReviewAsk</div>
    <div style={{ display: "flex", flexDirection: "column" }}><div style={{ fontSize: 64, fontWeight: 700, lineHeight: 1.1 }}>Every customer gets a Google review request — automatically.</div>
      <div style={{ marginTop: 28, fontSize: 30, color: "#a3e635" }}>For any business · $39/month · 7-day free trial</div></div>
    <div style={{ fontSize: 26, color: "rgba(255,255,255,0.6)" }}>getreviewask.com</div>
  </div>, size);
}
