import { buildReviewEmail } from "/workspace/reviewask/app/lib/email.ts";
import fs from "fs";
const m = buildReviewEmail("Bright Harbor Co.", "Sam Rivera", "https://g.page/r/example-review-link", "https://getreviewask.com/u/example");
const page = `<!doctype html><html><head><meta charset="utf-8"><style>
body{margin:0;background:#f1f5f9;font-family:system-ui,Arial,sans-serif;width:800px;height:500px;display:flex;align-items:center;justify-content:center}
.win{width:740px;background:#fff;border-radius:12px;box-shadow:0 1px 3px rgba(15,23,42,.08),0 12px 32px rgba(15,23,42,.08);overflow:hidden}
.hdr{padding:16px 24px;border-bottom:1px solid #e5e7eb;font-size:13px;color:#64748b;display:flex;gap:12px;align-items:center}
.av{width:32px;height:32px;border-radius:50%;background:#0b1631;color:#b6f13a;font-weight:700;display:flex;align-items:center;justify-content:center;font-size:13px}
.s{color:#0b1631;font-weight:600;font-size:15px}
.body>div{padding:8px 24px 16px!important;font-size:15px;line-height:1.55}
.body p[style*="margin:32px"]{margin:20px 0!important}
</style></head><body><div class="win"><div class="hdr"><div class="av">BH</div><div><div class="s">${m.subject}</div><div>Bright Harbor Co. · to Sam</div></div></div><div class="body">${m.html}</div></div></body></html>`;
fs.writeFileSync("/tmp/email.html", page);
