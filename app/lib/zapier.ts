import { db } from "@/lib/db";
// Disconnect Zapier: clear connected state and block inbound Zapier hooks until the owner reconnects.
// NEVER touches api_token — only the owner regenerating/removing it in Settings changes the key.
export const disconnectZapier = (userId: number) =>
  db.prepare("UPDATE users SET zapier_connected_at=NULL, zapier_setup_at=NULL, zapier_disconnected_at=datetime('now'), auto_provider=CASE WHEN auto_provider='zapier' THEN NULL ELSE auto_provider END WHERE id=?").run(userId);

// First real inbound webhook with the account key: Zapier is now actually connected.
export const markZapierConnected = (userId: number) =>
  db.prepare("UPDATE users SET zapier_connected_at=datetime('now'), auto_enabled=1, auto_provider=COALESCE(NULLIF(auto_provider,''),'zapier') WHERE id=? AND zapier_connected_at IS NULL").run(userId);
