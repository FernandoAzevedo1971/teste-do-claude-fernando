import { useState, useEffect, useCallback } from "react";
import { fetchRates, ExchangeRates } from "../lib/api";

const POLL_INTERVAL = 5 * 60 * 1000;

export function useExchangeRates() {
  const [rates, setRates] = useState<ExchangeRates | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);

  const load = useCallback(async (silent = false) => {
    if (!silent) setLoading(true);
    setError(null);
    try {
      const data = await fetchRates();
      setRates(data);
      setLastUpdated(new Date());
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Erro ao buscar cotações";
      setError(msg);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
    const interval = setInterval(() => load(true), POLL_INTERVAL);
    return () => clearInterval(interval);
  }, [load]);

  return { rates, loading, error, lastUpdated, refresh: () => load() };
}
