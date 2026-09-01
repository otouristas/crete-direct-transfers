/**
 * Abandonment recovery: the last quote a visitor started is kept in local
 * storage so a returning visitor can jump straight back to their price.
 */
const KEY = "ta.last-quote.v1";
const TTL_MS = 1000 * 60 * 60 * 24 * 14;

export type SavedQuote = {
  savedAt: number;
  label: string;
  search: Record<string, unknown>;
};

export function saveQuote(label: string, search: Record<string, unknown>): void {
  if (typeof window === "undefined") return;
  try {
    const clean = Object.fromEntries(Object.entries(search).filter(([, v]) => v !== undefined));
    window.localStorage.setItem(
      KEY,
      JSON.stringify({ savedAt: Date.now(), label, search: clean } satisfies SavedQuote),
    );
  } catch {
    /* storage unavailable (private mode) — recovery is best-effort */
  }
}

export function loadQuote(): SavedQuote | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = window.localStorage.getItem(KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as SavedQuote;
    if (!parsed?.search || Date.now() - parsed.savedAt > TTL_MS) return null;
    return parsed;
  } catch {
    return null;
  }
}

export function clearQuote(): void {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.removeItem(KEY);
  } catch {
    /* ignore */
  }
}
