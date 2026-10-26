"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { DEFAULT_SITE_SETTINGS, formatPrice, type SiteSettings } from "@/lib/portal";

const STORAGE_KEY = "motive.currency";

type SiteContextValue = {
  settings: SiteSettings;
  currencies: string[];
  currency: string;
  setCurrency: (currency: string) => void;
  price: (amount: number, compact?: boolean) => string;
};

const SiteContext = createContext<SiteContextValue | null>(null);

export function SiteProvider({ settings, children }: { settings: SiteSettings; children: React.ReactNode }) {
  const currencies = useMemo(() => [settings.currency, ...Object.keys(settings.rates).filter((code) => code !== settings.currency && settings.rates[code] > 0)], [settings]);
  const [currency, setCurrencyState] = useState(settings.currency);

  useEffect(() => {
    const saved = window.localStorage.getItem(STORAGE_KEY);
    if (saved && currencies.includes(saved)) setCurrencyState(saved);
  }, [currencies]);

  const setCurrency = useCallback((next: string) => {
    setCurrencyState(next);
    window.localStorage.setItem(STORAGE_KEY, next);
  }, []);

  const value = useMemo<SiteContextValue>(() => ({
    settings,
    currencies,
    currency,
    setCurrency,
    price: (amount, compact) => formatPrice(amount, settings, currency, compact),
  }), [settings, currencies, currency, setCurrency]);

  return <SiteContext.Provider value={value}>{children}</SiteContext.Provider>;
}

export function useSite() {
  return useContext(SiteContext) ?? {
    settings: DEFAULT_SITE_SETTINGS,
    currencies: [DEFAULT_SITE_SETTINGS.currency],
    currency: DEFAULT_SITE_SETTINGS.currency,
    setCurrency: () => undefined,
    price: (amount: number, compact?: boolean) => formatPrice(amount, DEFAULT_SITE_SETTINGS, undefined, compact),
  };
}

export function Price({ amount, compact }: { amount: number; compact?: boolean }) {
  const { price } = useSite();
  return <span suppressHydrationWarning>{price(amount, compact)}</span>;
}

export function CurrencySwitcher({ className = "" }: { className?: string }) {
  const { currencies, currency, setCurrency } = useSite();
  if (currencies.length < 2) return null;
  return (
    <label className={`inline-flex items-center gap-1.5 ${className}`}>
      <span className="sr-only">Display prices in</span>
      <select value={currency} onChange={(event) => setCurrency(event.target.value)} className="cursor-pointer bg-transparent text-[10px] font-semibold uppercase tracking-[0.14em] outline-none" suppressHydrationWarning>
        {currencies.map((code) => <option key={code} value={code}>{code}</option>)}
      </select>
    </label>
  );
}
