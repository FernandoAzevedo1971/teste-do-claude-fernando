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
  return value.toLocaleString("pt-BR", { minimumFractionDigits: 3, maximumFractionDigits: 3 });
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
    <div
      className="relative overflow-hidden border border-white/[0.07] rounded-2xl p-5 animate-slide-up"
      style={{ background: "rgba(255,255,255,0.04)", backdropFilter: "blur(20px)" }}
    >
      <div className="absolute top-0 left-0 right-0 h-px"
        style={{ background: "linear-gradient(90deg, transparent, rgba(255,255,255,0.1), transparent)" }} />

      <div className="flex items-center gap-2 mb-4">
        <div
          className="w-7 h-7 rounded-lg border border-indigo-500/20 flex items-center justify-center text-sm"
          style={{ background: "rgba(99,102,241,0.15)" }}
        >
          🔄
        </div>
        <h2 className="text-sm font-semibold text-white/80 tracking-tight">Conversor</h2>
      </div>

      <div className="flex items-center gap-2 mb-4 text-xs font-medium">
        <span className={`px-3 py-1.5 rounded-lg transition-colors border ${
          direction === "to_brl"
            ? "bg-indigo-500/20 text-indigo-300 border-indigo-500/30"
            : "text-white/30 border-transparent"
        }`}>
          {fromLabel}
        </span>
        <button
          onClick={() => setDirection(d => d === "to_brl" ? "from_brl" : "to_brl")}
          className="p-1.5 rounded-lg border border-white/[0.08] text-white/40 hover:text-teal-400 transition-all active:scale-90"
          style={{ background: "rgba(255,255,255,0.06)" }}
          title="Inverter direção"
        >
          <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
          </svg>
        </button>
        <span className={`px-3 py-1.5 rounded-lg transition-colors border ${
          direction === "from_brl"
            ? "bg-indigo-500/20 text-indigo-300 border-indigo-500/30"
            : "text-white/30 border-transparent"
        }`}>
          {toLabel}
        </span>
      </div>

      <div className="flex gap-2 mb-4">
        <div className="flex-1 relative">
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs text-white/30 font-medium pointer-events-none">
            {fromSymbol}
          </span>
          <input
            type="number"
            inputMode="decimal"
            value={amount}
            onChange={e => setAmount(e.target.value)}
            className="w-full border border-white/[0.08] rounded-xl pl-10 pr-3 py-3 text-white text-sm font-semibold focus:outline-none focus:border-indigo-500/50 transition-colors"
            style={{ background: "rgba(255,255,255,0.06)" }}
            placeholder="0,00"
            min="0"
          />
        </div>
        <select
          value={currency}
          onChange={e => setCurrency(e.target.value as CurrencyCode)}
          className="border border-white/[0.08] rounded-xl px-3 py-3 text-white text-sm font-semibold focus:outline-none focus:border-indigo-500/50 transition-colors cursor-pointer"
          style={{ background: "rgba(255,255,255,0.06)" }}
        >
          <option value="USD">USD</option>
          <option value="EUR">EUR</option>
          <option value="GBP">GBP</option>
        </select>
      </div>

      <div className="rounded-xl p-4 border border-white/[0.06]" style={{ background: "rgba(0,0,0,0.25)" }}>
        <p className="text-[11px] text-white/30 mb-1 font-medium uppercase tracking-wider">Resultado</p>
        <div className="flex items-end gap-1.5">
          <span className="text-sm text-white/40 font-medium mb-0.5">{toSymbol}</span>
          <span className="text-3xl font-bold text-cyan-300 tracking-tight leading-none">
            {fmt(result)}
          </span>
        </div>
        <p className="text-[11px] text-white/25 mt-2">
          1 {currency} = R$ {fmt(rate)} · cotação de compra
        </p>
      </div>
    </div>
  );
}