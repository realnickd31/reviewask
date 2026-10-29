import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { currentUser } from "@/lib/session";
import { sendEmail } from "@/lib/email";

const SUPPORT = process.env.CONNECTOR_REQUEST_TO || "support@getreviewask.com";
const clip = (v: unknown, n: number) => String(v ?? "").trim().slice(0, n);
const esc = (s: string) => s.replace(/[&<>"]/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]!));

export async function POST(req: NextRequest) {
  let b: Record<string, unknown> = {};
  try { b = await req.json(); } catch { return NextResponse.json({ error: "Bad request" }, { status: 400 }); }
  // Honeypot: bots fill hidden "company" field; pretend success.
  if (clip(b.company, 200)) return NextResponse.json({ ok: true });
  const tool = clip(b.tool, 100), website = clip(b.website, 300), notes = clip(b.notes, 2000);
  if (!tool) return NextResponse.json({ error: "Tell us which tool you use." }, { status: 400 });
  const u = await currentUser().catch(() => undefined);
  const email = u?.email || clip(b.email, 200);
  if (!u && email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return NextResponse.json({ error: "That email doesn't look right." }, { status: 400 });
  const ip = (req.headers.get("x-forwarded-for") || "").split(",")[0].trim() || "unknown";
  // Light rate limit: max 5 per IP (or user) per hour.
  const recent = db.prepare("SELECT COUNT(*) c FROM connector_requests WHERE (ip = ? OR (user_id IS NOT NULL AND user_id = ?)) AND created_at > datetime('now','-1 hour')").get(ip, u?.id ?? -1) as { c: number };
  if (recent.c >= 5) return NextResponse.json({ error: "Thanks — we've got your requests. Try again later." }, { status: 429 });
  const at = new Date().toISOString();
  const info = db.prepare("INSERT INTO connector_requests (tool, website, notes, email, user_id, ip) VALUES (?,?,?,?,?,?)").run(tool, website || null, notes || null, email || null, u?.id ?? null, ip);
  console.log(`[connector-request] #${info.lastInsertRowid} tool="${tool}" user=${u?.id ?? "anon"} email=${email || "-"}`);
  const lines = [
    `Tool: ${tool}`, `Website: ${website || "-"}`, `Notes: ${notes || "-"}`,
    `Requester email: ${email || "-"}`, `Account: ${u ? `user #${u.id} (${u.email}) — ${u.business_name || "no business name"}` : "not signed in"}`,
    `Submitted: ${at}`, `Request ID: ${info.lastInsertRowid}`,
  ];
  try {
    await sendEmail(SUPPORT, { subject: `Connector request: ${tool}`, text: lines.join("\n"), html: `<pre style="font-family:inherit">${esc(lines.join("\n"))}</pre>` });
    db.prepare("UPDATE connector_requests SET emailed = 1 WHERE id = ?").run(info.lastInsertRowid);
  } catch (e) { console.error("[connector-request] email failed", e); /* row is saved; still thank the user */ }
  return NextResponse.json({ ok: true });
}
