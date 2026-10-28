import { ImageResponse } from "next/og";
export const runtime = "edge";
export const alt = "ReviewAsk — automatic Google review requests for any business, $39/month";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";
export default function Image() {
  return new ImageResponse(<div style={{ width: "100%", height: "100%", display: "flex", flexDirection: "column", justifyContent: "space-between", background: "#0a1224", color: "white", padding: 72, fontFamily: "sans-serif" }}>
    <div style={{ display: "flex", alignItems: "center", gap: 16, fontSize: 36, fontWeight: 700 }}><div style={{ width: 56, height: 56, borderRadius: 12, background: "#1a2747", display: "flex", alignItems: "center", justifyContent: "center", }}><svg width="30" height="30" viewBox="0 0 16 16"><path fill="#a3e635" d="M8 1.5l1.9 4.1 4.5.5-3.4 3 1 4.4L8 11.2 4 13.5l1-4.4-3.4-3 4.5-.5z" /></svg></div>ReviewAsk</div>
    <div style={{ display: "flex", flexDirection: "column" }}><div style={{ fontSize: 64, fontWeight: 700, lineHeight: 1.1 }}>Every finished job gets a Google review request — automatically.</div>
      <div style={{ marginTop: 28, fontSize: 30, color: "#a3e635" }}>More Google reviews, automatically · $39/month · 7-day free trial</div></div>
    <div style={{ fontSize: 26, color: "rgba(255,255,255,0.6)" }}>getreviewask.com</div>
  </div>, size);
}
