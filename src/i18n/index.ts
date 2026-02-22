'use client';

import { createContext, useContext, useState, useEffect, useCallback, ReactNode, createElement } from 'react';
import es, { type TranslationKey } from './es';
import en from './en';

export type Locale = 'es' | 'en';

const dictionaries: Record<Locale, Record<TranslationKey, string>> = { es, en };

const COP_TO_USD = 3750;
const STORAGE_KEY = 'ampolla-locale';

interface LanguageContextValue {
  locale: Locale;
  setLocale: (locale: Locale) => void;
  t: (key: TranslationKey, params?: Record<string, string | number>) => string;
  formatCurrency: (amountCOP: number) => string;
}

const LanguageContext = createContext<LanguageContextValue | null>(null);

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [locale, setLocaleState] = useState<Locale>('es');

  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY) as Locale | null;
    if (saved === 'en' || saved === 'es') {
      setLocaleState(saved);
    }
  }, []);

  const setLocale = useCallback((newLocale: Locale) => {
    setLocaleState(newLocale);
    localStorage.setItem(STORAGE_KEY, newLocale);
    document.documentElement.lang = newLocale;
  }, []);

  const t = useCallback(
    (key: TranslationKey, params?: Record<string, string | number>): string => {
      let text = dictionaries[locale][key] ?? dictionaries['es'][key] ?? key;
      if (params) {
        for (const [k, v] of Object.entries(params)) {
          text = text.replace(new RegExp(`\\{${k}\\}`, 'g'), String(v));
        }
      }
      return text;
    },
    [locale]
  );

  const formatCurrency = useCallback(
    (amountCOP: number): string => {
      if (locale === 'en') {
        const usd = Math.round(amountCOP / COP_TO_USD);
        return `$${usd.toLocaleString('en-US')} USD`;
      }
      return `$${amountCOP.toLocaleString('es-CO')} COP`;
    },
    [locale]
  );

  const value: LanguageContextValue = { locale, setLocale, t, formatCurrency };

  return createElement(LanguageContext.Provider, { value }, children);
}

export function useTranslation() {
  const ctx = useContext(LanguageContext);
  if (!ctx) {
    throw new Error('useTranslation must be used within a LanguageProvider');
  }
  return ctx;
}

export type { TranslationKey };
