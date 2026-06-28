"use client";

import { useEffect, useState } from "react";
import { fetchCurrencies } from "@/lib/currencyApi";
import { USER_MESSAGES } from "@/lib/userMessages";
import type { Currency } from "@/types/currency";

interface UseCurrenciesResult {
  currencies: Currency[];
  loading: boolean;
  error: string | null;
}

export function useCurrencies(): UseCurrenciesResult {
  const [currencies, setCurrencies] = useState<Currency[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    async function loadCurrencies() {
      try {
        const data = await fetchCurrencies();
        if (!cancelled) {
          setCurrencies(data);
          setError(null);
        }
      } catch (loadError) {
        if (!cancelled) {
          setError(
            loadError instanceof Error
              ? loadError.message
              : USER_MESSAGES.currenciesUnavailable,
          );
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    loadCurrencies();

    return () => {
      cancelled = true;
    };
  }, []);

  return { currencies, loading, error };
}
