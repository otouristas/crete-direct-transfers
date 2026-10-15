export async function hashCheckoutToken(token: string) {
  const digest = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(token));
  return Array.from(new Uint8Array(digest), (b) => b.toString(16).padStart(2, "0")).join("");
}
export function isPaidCheckout(session: {
  payment_status?: string;
  metadata?: Record<string, string> | null;
  amount_total?: number | null;
  currency?: string | null;
}) {
  return (
    session.payment_status === "paid" &&
    !!session.metadata?.booking_id &&
    Number.isInteger(session.amount_total) &&
    (session.amount_total ?? 0) > 0 &&
    !!session.currency
  );
}
export function safeCheckoutPath(path: string | undefined, fallback: string) {
  return path && path.startsWith("/") && !path.startsWith("//") && !/[\\\r\n]/.test(path)
    ? path
    : fallback;
}
