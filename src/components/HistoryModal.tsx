import { useState, useEffect } from "react";
import { fetchHistory, HistoryRate } from "../lib/api";

type Period = 3 | 7 | 15 | 30;

const FLAGS: Record<string, string> = {
  USD: "🇺🇸",
  EUR: "🇪🇺",
  GBP: "🇬🇧",
};

const CURRENCY_NAMES: Record<string, string> = {
  USD: "Dólar Americano",
  EUR: "Euro",
  GBP: "Libra Esterlina",
};

function fmt(v: number) {
  return v.toLocaleString("pt-BR", { minimumFractionDigits: 3, maximumFractionDigits: 3 });
}

function LineChart({ data }: { data: HistoryRate[] }) {
  if (data.length < 2) return null;

  const W = 340, H = 110, PX = 8, PY = 10;
  const bids = data.map((d) => d.bid);
  const min = Math.min(...bids);
  const max = Math.max(...bids);
  const range = max - min || 1;

  const px = (i: number) => PX + (i / (data.length - 1)) * (W - PX * 2);
  const py = (v: number) => H - PY - ((v - min) / range) * (H - PY * 2);

  const points = data.map((d, i) => `${px(i)},${py(d.bid)}`).join(" ");
  const fill = `${PX},${H - PY} ${points} ${W - PX},${H - PY}`;

  const lastX = px(data.length - 1);
  const lastY = py(data[data.length - 1].bid);

  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="w-full h-[110px]">
      <defs>
        <linearGradient id="hGrad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#6366f1" stopOpacity="0.3" />
          <stop offset="100%" stopColor="#6366f1" stopOpacity="0" />
        </linearGradient>
      </defs>
      <polygon points={fill} fill="url(#hGrad)" />
      <polyline points={points} fill="none" stroke="#818cf8" strokeWidth="2"
        strokeLinecap="round" strokeLinejoin="round" />
      <circle cx={lastX} cy={lastY} r="3.5" fill="#818cf8" />
      <text x={PX} y={PY + 4} fontSize="9" fill="rgba(255,255,255,0.3)" fontFamily="Inter,sans-serif">
        R$ {fmt(max)}
      </text>
      <text x={PX} y={H - PY - 2} fontSize="9" fill="rgba(255,255,255,0.3)" fontFamily="Inter,sans-serif">
        R$ {fmt(min)}
      </text>
    </svg>
  );
}

interface Props {
  code: string;
  onClose: () => void;
}

export function HistoryModal({ code, onClose }: Props) {
  const [period, setPeriod] = useState<Period>(7);
  const [data, setData] = useState<HistoryRate[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setLoading(true);
    setError(null);
    fetchHistory(code, period)
      .then(setData)
      .catch(() => setError("Não foi possível carregar o histórico."))
      .finally(() => setLoading(false));
  }, [code, period]);

  return (
    <div
      className="fixed inset-0 z-50 flex flex-col justify-end"
      style={{ background: "rgba(0,0,0,0.7)", backdropFilter: "blur(8px)" }}
      onClick={onClose}
    >
      <div
        className="border-t border-white/[0.08] rounded-t-3xl max-h-[88vh] flex flex-col animate-slide-up relative overflow-hidden"
        style={{ background: "linear-gradient(180deg, rgba(15,0,50,0.98) 0%, rgba(5,13,46,0.98) 100%)", backdropFilter: "blur(30px)" }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="absolute top-0 left-0 right-0 h-px"
          style={{ background: "linear-gradient(90deg, transparent, rgba(99,102,241,0.5), transparent)" }} />

        <div className="flex justify-center pt-3 pb-1 shrink-0">
          <div className="w-10 h-1 rounded-full bg-white/10" />
        </div>

        <div className="flex items-center justify-between px-5 py-3 shrink-0">
          <div className="flex items-center gap-2.5">
            <span className="text-2xl leading-none">{FLAGS[code]}</span>
            <div>
              <h2 className="text-sm font-bold text-white leading-none">{CURRENCY_NAMES[code]}</h2>
              <p className="text-[11px] text-white/40 mt-0.5">Histórico de cotação · BRL</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl border border-white/[0.08] text-white/40 hover:text-white transition-colors"
            style={{ background: "rgba(255,255,255,0.05)" }}
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="flex gap-2 px-5 mb-4 shrink-0">
          {([3, 7, 15, 30] as Period[]).map((p) => (
            <button
              key={p}
              onClick={() => setPeriod(p)}
              className={`flex-1 py-2 rounded-xl text-xs font-semibold transition-colors border ${
                period === p
                  ? "bg-indigo-500/20 text-indigo-300 border-indigo-500/30"
                  : "border-white/[0.08] text-white/40 hover:border-white/20"
              }`}
              style={{ background: period === p ? undefined : "rgba(255,255,255,0.04)" }}
            >
              {p} dias
            </button>
          ))}
        </div>

        <div className="px-5 mb-3 shrink-0">
          {loading ? (
            <div className="skeleton rounded-xl h-[110px]" />
          ) : error ? (
            <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-4 text-red-400 text-xs text-center">
              {error}
            </div>
          ) : (
            <div
              className="rounded-xl px-3 pt-2 pb-1 border border-white/[0.07]"
              style={{ background: "rgba(255,255,255,0.04)" }}
            >
              <LineChart data={data} />
            </div>
          )}
        </div>

        <div className="overflow-y-auto px-5 pb-8 flex-1">
          {loading ? (
            <div className="space-y-2">
              {Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="skeleton h-10 rounded-xl" />
              ))}
            </div>
          ) : (
            <div className="divide-y divide-white/[0.05]">
              {[...data].reverse().map((item, i) => {
                const date = new Date(item.timestamp);
                const label = date.toLocaleDateString("pt-BR", {
                  weekday: "short",
                  day: "2-digit",
                  month: "short",
                });
                const isLatest = i === 0;
                return (
                  <div key={item.timestamp}
                    className={`flex items-center justify-between py-3 ${isLatest ? "opacity-100" : "opacity-75"}`}
                  >
                    <div className="flex items-center gap-2">
                      {isLatest && (
                        <span className="inline-block w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse-slow" />
                      )}
                      <span className="text-xs text-white/40 capitalize">{label}</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className={`text-[10px] font-medium ${item.pctChange >= 0 ? "text-emerald-400" : "text-red-400"}`}>
                        {item.pctChange >= 0 ? "+" : ""}{item.pctChange.toFixed(2)}%
                      </span>
                      <span className="text-sm font-semibold text-white">
                        R$ {fmt(item.bid)}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}