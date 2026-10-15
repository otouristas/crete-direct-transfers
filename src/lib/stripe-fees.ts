/** Platform keeps this share; carrier receives the rest via Stripe Connect transfer. */
export const PLATFORM_FEE_PERCENT = 15;

export function splitFareCents(priceCents: number): {
  platformFeeCents: number;
  carrierPayoutCents: number;
} {
  const platformFeeCents = Math.round((priceCents * PLATFORM_FEE_PERCENT) / 100);
  return {
    platformFeeCents,
    carrierPayoutCents: Math.max(0, priceCents - platformFeeCents),
  };
}
