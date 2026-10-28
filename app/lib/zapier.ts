import { db } from "@/lib/db";
// Disconnect Zapier: clear the secret key so old Zaps stop working.
export const disconnectZapier = (userId: number) =>
  db.prepare("UPDATE users SET api_token=NULL, auto_provider=CASE WHEN auto_provider='zapier' THEN NULL ELSE auto_provider END WHERE id=?").run(userId);
