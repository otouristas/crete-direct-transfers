/** Display currencies — booking/settlement stays EUR; these convert for UI only. */

export const CURRENCY_CODES = [
  "EUR",
  "GBP",
  "USD",
  "AUD",
  "AED",
  "CZK",
  "DKK",
  "BGN",
  "CAD",
  "CHF",
  "HKD",
  "CNY",
  "HRK",
  "INR",
  "RUB",
  "JPY",
  "SEK",
  "MXN",
  "TRY",
  "NOK",
  "NZD",
  "PLN",
  "BRL",
  "KRW",
  "ZAR",
  "HUF",
  "RON",
  "ILS",
  "THB",
] as const;

export type CurrencyCode = (typeof CURRENCY_CODES)[number];

export type CurrencyMeta = {
  code: CurrencyCode;
  /** Native / local display name */
  name: string;
  /** Approx units per 1 EUR (display FX; not for settlement). */
  rateFromEur: number;
  decimals: number;
};

export const CURRENCIES: CurrencyMeta[] = [
  { code: "EUR", name: "Euro", rateFromEur: 1, decimals: 0 },
  { code: "GBP", name: "Pound Sterling", rateFromEur: 0.86, decimals: 0 },
  { code: "USD", name: "US Dollar", rateFromEur: 1.08, decimals: 0 },
  { code: "AUD", name: "Australian Dollar", rateFromEur: 1.65, decimals: 0 },
  { code: "AED", name: "درهم إماراتي", rateFromEur: 3.97, decimals: 0 },
  { code: "CZK", name: "Česká koruna", rateFromEur: 25.2, decimals: 0 },
  { code: "DKK", name: "Dansk krone", rateFromEur: 7.46, decimals: 0 },
  { code: "BGN", name: "Български лев", rateFromEur: 1.96, decimals: 0 },
  { code: "CAD", name: "Canadian Dollar", rateFromEur: 1.48, decimals: 0 },
  { code: "CHF", name: "Schweizer Franken", rateFromEur: 0.94, decimals: 0 },
  { code: "HKD", name: "香港元", rateFromEur: 8.45, decimals: 0 },
  { code: "CNY", name: "人民币", rateFromEur: 7.85, decimals: 0 },
  { code: "HRK", name: "Hrvatska kuna", rateFromEur: 7.53, decimals: 0 },
  { code: "INR", name: "भारतीय रुपया", rateFromEur: 90, decimals: 0 },
  { code: "RUB", name: "Российский рубль", rateFromEur: 100, decimals: 0 },
  { code: "JPY", name: "日本円", rateFromEur: 163, decimals: 0 },
  { code: "SEK", name: "Svensk krona", rateFromEur: 11.5, decimals: 0 },
  { code: "MXN", name: "Peso Mexicano", rateFromEur: 21.5, decimals: 0 },
  { code: "TRY", name: "Türk Lirası", rateFromEur: 38, decimals: 0 },
  { code: "NOK", name: "Norsk krone", rateFromEur: 11.6, decimals: 0 },
  { code: "NZD", name: "New Zealand Dollar", rateFromEur: 1.78, decimals: 0 },
  { code: "PLN", name: "Polski złoty", rateFromEur: 4.3, decimals: 0 },
  { code: "BRL", name: "Real Brasileiro", rateFromEur: 6.1, decimals: 0 },
  { code: "KRW", name: "대한민국 원", rateFromEur: 1500, decimals: 0 },
  { code: "ZAR", name: "South African Rand", rateFromEur: 19.5, decimals: 0 },
  { code: "HUF", name: "Magyar forint", rateFromEur: 400, decimals: 0 },
  { code: "RON", name: "Leu românesc", rateFromEur: 5.0, decimals: 0 },
  { code: "ILS", name: "שקל חדש", rateFromEur: 4.0, decimals: 0 },
  { code: "THB", name: "บาทไทย", rateFromEur: 37, decimals: 0 },
];

const STORAGE_KEY = "ta-display-currency";

let preferred: CurrencyCode = "EUR";
const listeners = new Set<() => void>();

function isCurrencyCode(value: string): value is CurrencyCode {
  return (CURRENCY_CODES as readonly string[]).includes(value);
}

export function getCurrencyMeta(code: CurrencyCode): CurrencyMeta {
  return CURRENCIES.find((c) => c.code === code) ?? CURRENCIES[0]!;
}

/** Read preferred currency (sync; hydrated from localStorage on first client call). */
export function getPreferredCurrency(): CurrencyCode {
  return preferred;
}

export function hydrateCurrencyFromStorage(): CurrencyCode {
  if (typeof window === "undefined") return preferred;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw && isCurrencyCode(raw)) {
      preferred = raw;
    }
  } catch {
    // ignore
  }
  return preferred;
}

export function setPreferredCurrency(code: CurrencyCode): void {
  preferred = code;
  try {
    localStorage.setItem(STORAGE_KEY, code);
  } catch {
    // ignore
  }
  listeners.forEach((l) => l());
}

export function subscribeCurrency(listener: () => void): () => void {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

/** Format an EUR amount in the visitor's display currency. */
export function formatMoney(amountEur: number, currency: CurrencyCode = preferred): string {
  const meta = getCurrencyMeta(currency);
  const converted = amountEur * meta.rateFromEur;
  const sign = converted < 0 ? "−" : "";
  const abs = Math.abs(converted);

  if (currency === "EUR") {
    return `${sign}€${abs.toLocaleString("en-IE", {
      minimumFractionDigits: meta.decimals,
      maximumFractionDigits: meta.decimals,
    })}`;
  }

  const formatted = abs.toLocaleString("en-IE", {
    style: "currency",
    currency,
    minimumFractionDigits: meta.decimals,
    maximumFractionDigits: meta.decimals,
  });
  return sign ? formatted.replace(/^-?/, sign) : formatted;
}
