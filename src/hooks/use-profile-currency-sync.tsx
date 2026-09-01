import { useEffect, useRef } from "react";
import { useCurrency } from "@/hooks/use-currency";
import { useProfile } from "@/queries/profile";
import { CURRENCY_CODES, hasStoredCurrency, type CurrencyCode } from "@/lib/currency";

function isCurrencyCode(value: string | null | undefined): value is CurrencyCode {
  return !!value && (CURRENCY_CODES as readonly string[]).includes(value);
}

/**
 * Applies the signed-in user's saved currency preference once per session,
 * unless they already picked one explicitly on this device.
 */
export function useProfileCurrencySync(): void {
  const profile = useProfile();
  const { setCurrency } = useCurrency();
  const applied = useRef(false);

  useEffect(() => {
    if (applied.current) return;
    const preferred = profile.data?.preferred_currency;
    if (!isCurrencyCode(preferred)) return;
    applied.current = true;
    if (hasStoredCurrency()) return;
    setCurrency(preferred);
  }, [profile.data?.preferred_currency, setCurrency]);
}
