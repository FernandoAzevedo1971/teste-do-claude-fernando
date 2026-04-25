import { ExchangeRate } from "../lib/api";

const FLAGS: Record<string, string> = {
  USD: "🇺🇸",
  EUR: "🇪🇺",
  GBP: "🇬🇧",
};

const ACCENTS: Record<string, { border: string; badge: string; glow: string }> = {
  USD: {
    border: "border-teal-500/20 hover:border-teal-500/40",
    badge: "bg-teal-500/10 text-teal-300 border-teal-500/20",
    glow: "rgba(20,184,166,0.15)",
  },
  EUR: {
    border: "border-indigo-500/20 hover:border-indigo-500/40",
    badge: "bg-indigo-500/10 text-indigo-300 border-indigo-500/20",
    glow: "rgba(99,102,241,0.15)",
  },
  GBP: {
    border: "border-violet-500/20 hover:border-violet-500/40",
    badge: "bg-violet-500/10 text-violet-300 border-violet-500/20",
    glow: "rgba(168,85,247,0.15)",
  },
};

interface CurrencyCardProps {
  rate: ExchangeRate;
  onHistory: () => void;
}

function fmt(value: number) {
  return value.toLocaleString("pt-BR", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

export function CurrencyCard({ rate, onHistory }: CurrencyCardProps) {
  const isPositive = rate.pctChange >= 0;
  const accent = ACCENTS[rate.code];

  return (
    <div
      className={`relative overflow-hidden border ${accent.border} rounded-2xl p-5 transition-all duration-300 animate-slide-up`}
      style={{ background: "rgba(255,255,255,0.05)", backdropFilter: "blur(20px)" }}
    >
      {/* Top reflection line */}
      <div className="absolute top-0 left-0 right-0 h-px"
        style={{ background: "linear-gradient(90deg, transparent, rgba(255,255,255,0.15), transparent)" }} />

      {/* Corner glow */}
      <div className="absolute -top-10 -right-10 w-32 h-32 rounded-full pointer-events-none"
        style={{ background: `radial-gradient(circle, ${accent.glow}, transparent 70%)` }} />

      <div className="flex items-start justify-between relative">
        <div className="flex items-center gap-3">
          <span className="text-3xl leading-none">{FLAGS[rate.code]}</span>
          <div>
            <p className="text-xs text-white/50 font-medium">{rate.name}</p>
            <span className={`inline-block mt-1 text-[10px] font-semibold tracking-widest px-2 py-0.5 rounded-full border ${accent.badge}`}>
              {rate.code} / BRL
            </span>
          </div>
        </div>

        <div className={`flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold border ${
          isPositive
            ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20"
            : "bg-red-500/10 text-red-400 border-red-500/20"
        }`}>
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

      <div className="mt-4 flex items-end gap-2 relative">
        <span className="text-[11px] text-white/30 font-medium mb-0.5">R$</span>
        <span className="text-4xl font-bold text-white tracking-tight leading-none">
          {fmt(rate.bid)}
        </span>
      </div>

      <div className="mt-3 flex items-center justify-between relative">
        <span className={`text-xs font-medium ${isPositive ? "text-emerald-400" : "text-red-400"}`}>
          {isPositive ? "+" : ""}{fmt(rate.varBid)} hoje
        </span>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-3 text-[11px] text-white/30">
            <span><span className="text-emerald-500/70">↑</span> {fmt(rate.high)}</span>
            <span><span className="text-red-500/70">↓</span> {fmt(rate.low)}</span>
          </div>
          <button
            onClick={onHistory}
            className="flex items-center gap-1 px-2 py-1 rounded-lg border border-white/[0.08] text-white/30 hover:text-teal-400 hover:border-teal-500/30 transition-all active:scale-95 text-[10px] font-medium"
            style={{ background: "rgba(255,255,255,0.05)" }}
            title="Ver histórico"
          >
            <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            Histórico
          </button>
        </div>
      </div>
    </div>
  );
}