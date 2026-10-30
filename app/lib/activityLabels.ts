// Shared Recent Activity labels — used by the dashboard table AND the CSV export so wording matches 1:1.
type Row = { channel?: string | null; source?: string | null; status?: string | null; reminded_at?: string | null; fail_reason?: string | null };
export const channelLabel = (r: Row) => { const c = r.channel || ""; return ({ email: "Email", sms: "Text", "email+sms": "Email + text" } as Record<string, string>)[c] || c.replace("+", " + "); };
export const sourceLabel = (r: Row) => ({ manual: "Typed in", bulk: "Spreadsheet", webhook: "Automatic", test: "Test" } as Record<string, string>)[r.source || "manual"] || "Typed in";
export function statusLabel(r: Row) {
  if (r.status === "failed") return r.fail_reason ? `Failed · ${r.fail_reason}` : "Failed · Couldn’t deliver";
  if (r.status === "cancelled") return "Not asked";
  if (r.status === "sending") return "Sending";
  if (r.status === "suppressed") return "Unsubscribed";
  if (r.status === "queued") return "Queued";
  if (r.status === "scheduled") return "Scheduled";
  if (r.reminded_at) return "Reminded";
  return "Sent";
}
