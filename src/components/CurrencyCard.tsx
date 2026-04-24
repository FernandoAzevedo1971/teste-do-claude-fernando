import { ExchangeRate } from "../lib/api";

const FLAGS: Record<string, string> = {
  USD: "🇺🇸",
  EUR: "🇪🇺",
  GBP: "🇬🇧",
};

const ACCENT_COLORS: Record<string, { ring: string; badge: string; label: string }> = {
  USD: {
    ring: "group-hover:border-green-500/40",
    badge: "bg-green-500/10 text-green-400 border-green-500/20",
    label: "text-green-400",
  },
  EUR: {
    ring: "group-hover:border-blue-500/40",
    badge: "bg-blue-500/10 text-blue-400 border-blue-500/20",
    label: "text-blue-400",
  },
  GBP: {
    ring: "group-hover:border-violet-500/40",
    badge: "bg-violet-500/10 text-violet-400 border-violet-500/20",
    label: "text-violet-400",
  },
};

interface CurrencyCardProps {
  rate: ExchangeRate;
}

function fmt(value: number) {
  return value.toLocaleString("pt-BR", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
}

export function CurrencyCard({ rate }: CurrencyCardProps) {
  const isPositive = rate.pctChange >= 0;
  const colors = ACCENT_COLORS[rate.code];

  return (
    <div
      className={`group bg-slate-800 border border-slate-700 ${colors.ring} rounded-2xl p-5 transition-all duration-300 hover:shadow-lg hover:shadow-black/30 animate-slide-up`}
    >
      <div className="flex items-start justify-between">
        {/* Left: flag + name + code */}
        <div className="flex items-center gap-3">
          <span className="text-3xl leading-none">{FLAGS[rate.code]}</span>
          <div>
            <p className="text-xs text-slate-400 font-medium">{rate.name}</p>
            <span
              className={`inline-block mt-1 text-[10px] font-semibold tracking-widest px-2 py-0.5 rounded-full border ${colors.badge}`}
            >
              {rate.code} / BRL
            </span>
          </div>
        </div>

        {/* Right: change badge */}
        <div
          className={`flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold ${
            isPositive
              ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
              : "bg-red-500/10 text-red-400 border border-red-500/20"
          }`}
        >
          {isPositive ? (
            <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M5 15l7-7 7 7" />
            </svg>
          ) : (
            <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
            </svg>
          )}
          {Math.abs(rate.pctChange).toFixed(2)}%
        </div>
      </div>

      {/* Big rate */}
      <div className="mt-4 flex items-end gap-2">
        <span className="text-[11px] text-slate-500 font-medium mb-0.5">R$</span>
        <span className="text-4xl font-bold text-amber-400 tracking-tight leading-none">
          {fmt(rate.bid)}
        </span>
      </div>

      {/* Var + High/Low */}
      <div className="mt-3 flex items-center justify-between">
        <span
          className={`text-xs font-medium ${isPositive ? "text-emerald-400" : "text-red-400"}`}
        >
          {isPositive ? "+" : ""}
          {fmt(rate.varBid)} hoje
        </span>
        <div className="flex items-center gap-3 text-[11px] text-slate-500">
          <span>
            <span className="text-emerald-500/70">↑</span> {fmt(rate.high)}
          </span>
          <span>
            <span className="text-red-500/70">↓</span> {fmt(rate.low)}
          </span>
        </div>
      </div>
    </div>
  );
}
