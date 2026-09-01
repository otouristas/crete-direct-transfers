import { createContext, useCallback, useContext, useEffect, useState, type ReactNode } from "react";
import {
  getPreferredCurrency,
  hydrateCurrencyFromStorage,
  setPreferredCurrency,
  subscribeCurrency,
  type CurrencyCode,
  formatMoney,
} from "@/lib/currency";

type CurrencyContextValue = {
  currency: CurrencyCode;
  setCurrency: (code: CurrencyCode) => void;
};

const CurrencyContext = createContext<CurrencyContextValue | null>(null);

export function CurrencyProvider({ children }: { children: ReactNode }) {
  const [currency, setCurrencyState] = useState<CurrencyCode>("EUR");

  useEffect(() => {
    setCurrencyState(hydrateCurrencyFromStorage());
    return subscribeCurrency(() => setCurrencyState(getPreferredCurrency()));
  }, []);

  const setCurrency = useCallback((code: CurrencyCode) => {
    setPreferredCurrency(code);
    setCurrencyState(code);
  }, []);

  return (
    <CurrencyContext.Provider value={{ currency, setCurrency }}>
      {children}
    </CurrencyContext.Provider>
  );
}

export function useCurrency(): CurrencyContextValue {
  const ctx = useContext(CurrencyContext);
  if (!ctx) {
    return {
      currency: getPreferredCurrency(),
      setCurrency: setPreferredCurrency,
    };
  }
  return ctx;
}

/** Formatter for customer-facing money: EUR amounts rendered in the visitor's currency. */
export function useMoney(): {
  format: (amountEur: number) => string;
  currency: CurrencyCode;
  isConverted: boolean;
} {
  const { currency } = useCurrency();
  return {
    format: (amountEur: number) => formatMoney(amountEur, currency),
    currency,
    isConverted: currency !== "EUR",
  };
}
