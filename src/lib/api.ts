export interface ExchangeRate {
  code: string;
  name: string;
  bid: number;
  ask: number;
  high: number;
  low: number;
  varBid: number;
  pctChange: number;
  timestamp: number;
}

export interface ExchangeRates {
  USD: ExchangeRate;
  EUR: ExchangeRate;
  GBP: ExchangeRate;
}

const CURRENCY_NAMES: Record<string, string> = {
  USD: "Dólar Americano",
  EUR: "Euro",
  GBP: "Libra Esterlina",
};

export async function fetchRates(): Promise<ExchangeRates> {
  const res = await fetch(
    "https://economia.awesomeapi.com.br/json/last/USD-BRL,EUR-BRL,GBP-BRL"
  );
  if (!res.ok) throw new Error("Falha ao buscar cotações");
  const data = await res.json();
  return {
    USD: parseRate(data.USDBRL, "USD"),
    EUR: parseRate(data.EURBRL, "EUR"),
    GBP: parseRate(data.GBPBRL, "GBP"),
  };
}

function parseRate(raw: Record<string, string>, code: string): ExchangeRate {
  return {
    code,
    name: CURRENCY_NAMES[code],
    bid: parseFloat(raw.bid),
    ask: parseFloat(raw.ask),
    high: parseFloat(raw.high),
    low: parseFloat(raw.low),
    varBid: parseFloat(raw.varBid),
    pctChange: parseFloat(raw.pctChange),
    timestamp: parseInt(raw.timestamp) * 1000,
  };
}

export interface HistoryRate {
  bid: number;
  high: number;
  low: number;
  pctChange: number;
  timestamp: number;
}

export async function fetchHistory(code: string, days: number): Promise<HistoryRate[]> {
  const res = await fetch(
    `https://economia.awesomeapi.com.br/json/daily/${code}-BRL/${days}`
  );
  if (!res.ok) throw new Error("Falha ao buscar histórico");
  const data: Record<string, string>[] = await res.json();
  return data
    .map((item) => ({
      bid: parseFloat(item.bid),
      high: parseFloat(item.high),
      low: parseFloat(item.low),
      pctChange: parseFloat(item.pctChange),
      timestamp: parseInt(item.timestamp) * 1000,
    }))
    .reverse();
}