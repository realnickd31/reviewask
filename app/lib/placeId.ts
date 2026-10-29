// Turn a Google Maps / Business Profile link (or a raw Place ID) into a Place ID.
// Full Maps URLs carry a feature ID like "!1s0x89c259a9b3117469:0xd134e199a405a163".
// A Place ID ("ChIJ...") is just that pair of 64-bit numbers protobuf-encoded and base64url'd,
// so we can rebuild it with no API key.
function le64(hex: string): number[] {
  let n = BigInt(hex); const out: number[] = [];
  for (let i = 0; i < 8; i++) { out.push(Number(n & BigInt(255))); n >>= BigInt(8); }
  return out;
}
export function featureIdToPlaceId(a: string, b: string): string {
  const bytes = [10, 18, 9, ...le64(a), 17, ...le64(b)];
  const b64 = typeof btoa === "function" ? btoa(String.fromCharCode(...bytes)) : Buffer.from(bytes).toString("base64");
  return b64.replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}
export const SHORT_LINK = /^(https?:\/\/)?(maps\.app\.goo\.gl|goo\.gl\/maps|g\.page|g\.co\/kgs|share\.google)\b/i;
export function extractPlaceId(raw: string): string | null {
  let s = raw.trim();
  try { s = decodeURIComponent(s); } catch { /* keep raw */ }
  const direct = s.match(/(?:placeid|place_id)[=:]\s*([A-Za-z0-9_-]{20,})/i) || s.match(/\b(ChIJ[A-Za-z0-9_-]{20,})/);
  if (direct) return direct[1];
  const fid = s.match(/(0x[0-9a-f]{1,16}):(0x[0-9a-f]{1,16})/i);
  if (fid) return featureIdToPlaceId(fid[1], fid[2]);
  if (/^[A-Za-z0-9_-]{20,}$/.test(s) && !/^https?/i.test(s)) return s; // raw Place ID
  return null;
}
