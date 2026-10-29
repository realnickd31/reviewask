/** Send-timing options shared by settings, Quick ask and spreadsheet sends. 0 = send immediately. */
export const DEFAULT_SEND_DELAY_HOURS = 2;
export const MAX_SEND_DELAY_HOURS = 168;
export const DELAY_OPTIONS = [0, 1, 2, 4, 24] as const;
export function clampDelay(v: unknown, fallback = DEFAULT_SEND_DELAY_HOURS): number {
  const n = Math.round(Number(v));
  return Number.isFinite(n) && v !== "" && v !== null && v !== undefined ? Math.min(Math.max(n, 0), MAX_SEND_DELAY_HOURS) : fallback;
}
export const delayLabel = (h: number) => h === 0 ? "Instantly" : h % 24 === 0 ? `${h / 24} day${h === 24 ? "" : "s"}` : `${h} hour${h === 1 ? "" : "s"}`;
export const delayShort = (h: number) => h === 0 ? "Now" : h % 24 === 0 ? `${h / 24}d` : `${h}h`;
