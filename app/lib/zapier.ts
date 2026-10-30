import { db } from "@/lib/db";
// Disconnect Zapier: stop treating Zapier as the auto-ask provider.
// NEVER touches api_token — only the owner regenerating/removing it in Settings changes the key.
export const disconnectZapier = (userId: number) =>
  db.prepare("UPDATE users SET auto_provider=CASE WHEN auto_provider='zapier' THEN NULL ELSE auto_provider END WHERE id=?").run(userId);
