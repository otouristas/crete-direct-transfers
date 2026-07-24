/** Structured cancel/wait/refund facts for the assistant. Never invent prices from this. */
export const BOOKING_POLICY = {
  freeCancelHours: 24,
  lateCancelFeePercent: 50,
  travelerNoShowChargePercent: 100,
  waitMinutesAirportPort: 60,
  waitMinutesHotelAddress: 30,
  driverFaultMakeGoodPercent: 100,
  goodwillCreditEur: 25,
  changeFreeHours: 4,
  currency: "EUR",
  summary:
    "Free cancel 24h or more before pickup (cash refund or 100% credit if prepaid). Inside 24h: 50% fee. Traveler no-show after free waiting: full charge. Confirmed driver fault: full make-good plus 25 EUR goodwill credit. Waiting: 60 min airports/ports with flight tracking, 30 min hotels/addresses. Changes free up to 4h before pickup subject to availability.",
} as const;

export function explainPolicy(): typeof BOOKING_POLICY {
  return BOOKING_POLICY;
}
