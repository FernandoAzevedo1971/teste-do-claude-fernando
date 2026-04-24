import { useState } from "react";
import { ExchangeRates } from "../lib/api";

type CurrencyCode = "USD" | "EUR" | "GBP";
type Direction = "to_brl" | "from_brl";

const CURRENCY_LABELS: Record<CurrencyCode, string> = {
  USD: "Dólar 🇺🇸",
  EUR: "Euro 🇪🇺",
  GBP: "Libra 🇬🇧",
};

interface ConverterProps {
  rates: ExchangeRates;
}

function fmt(value: number) {
  return value.toLocaleString("pt-BR", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
}

export function Converter({ rates }: ConverterProps) {
  const [amount, setAmount] = useState("100");
  const [currency, setCurrency] = useState<CurrencyCode>("USD");
  const [direction, setDirection] = useState<Direction>("to_brl");

  const rate = rates[currency].bid;
  const numAmount = parseFloat(amount.replace(",", ".")) || 0;
  const result = direction === "to_brl" ? numAmount * rate : numAmount / rate;

  const fromLabel = direction === "to_brl" ? CURRENCY_LABELS[currency] : "Real 🇧🇷";
  const toLabel = direction === "to_brl" ? "Real 🇧🇷" : CURRENCY_LABELS[currency];
  const fromSymbol = direction === "to_brl" ? currency : "R$";
  const toSymbol = direction === "to_brl" ? "R$" : currency;

  return (
    <div className="bg-slate-800 border border-slate-700 rounded-2xl p-5 animate-slide-up">
      <div className="flex items-center gap-2 mb-4">
        <div className="w-7 h-7 rounded-lg bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-sm">
          🔄
        </div>
        <h2 className="text-sm font-semibold text-slate-200 tracking-tight">Conversor</h2>
      </div>

      {/* Direction toggle */}
      <div className="flex items-center gap-2 mb-4 text-xs font-medium">
        <span className={`px-3 py-1.5 rounded-lg transition-colors ${direction === "to_brl" ? "bg-amber-500/20 text-amber-400 border border-amber-500/30" : "text-slate-400"}`}>
          {fromLabel}
        </span>
        <button
          onClick={() => setDirection(d => d === "to_brl" ? "from_brl" : "to_brl")}
          className="p-1.5 rounded-lg bg-slate-700 hover:bg-slate-600 text-slate-300 transition-all active:scale-90"
          title="Inverter direção"
        >
          <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
          </svg>
        </button>
        <span className={`px-3 py-1.5 rounded-lg transition-colors ${direction === "from_brl" ? "bg-amber-500/20 text-amber-400 border border-amber-500/30" : "text-slate-400"}`}>
          {toLabel}
        </span>
      </div>

      {/* Input + Currency select */}
      <div className="flex gap-2 mb-4">
        <div className="flex-1 relative">
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs text-slate-500 font-medium pointer-events-none">
            {fromSymbol}
          </span>
          <input
            type="number"
            inputMode="decimal"
            value={amount}
            onChange={e => setAmount(e.target.value)}
            className="w-full bg-slate-700 border border-slate-600 rounded-xl pl-10 pr-3 py-3 text-slate-50 text-sm font-semibold focus:outline-none focus:border-amber-500/50 transition-colors"
            placeholder="0,00"
            min="0"
          />
        </div>

        <select
          value={currency}
          onChange={e => setCurrency(e.target.value as CurrencyCode)}
          className="bg-slate-700 border border-slate-600 rounded-xl px-3 py-3 text-slate-50 text-sm font-semibold focus:outline-none focus:border-amber-500/50 transition-colors cursor-pointer"
        >
          <option value="USD">USD</option>
          <option value="EUR">EUR</option>
          <option value="GBP">GBP</option>
        </select>
      </div>

      {/* Result */}
      <div className="bg-slate-900/60 rounded-xl p-4 border border-slate-700/50">
        <p className="text-[11px] text-slate-500 mb-1 font-medium uppercase tracking-wider">Resultado</p>
        <div className="flex items-end gap-1.5">
          <span className="text-sm text-slate-400 font-medium mb-0.5">{toSymbol}</span>
          <span className="text-3xl font-bold text-amber-400 tracking-tight leading-none">
            {fmt(result)}
          </span>
        </div>
        <p className="text-[11px] text-slate-500 mt-2">
          1 {currency} = R$ {fmt(rate)} · cotação de compra
        </p>
      </div>
    </div>
  );
}
