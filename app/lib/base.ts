import { headers } from "next/headers";
export const baseUrl = () => { const h = headers(); return (process.env.APP_URL || `${h.get("x-forwarded-proto") || "http"}://${h.get("host")}`).replace(/\/$/, ""); };
