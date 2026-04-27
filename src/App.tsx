import { useState, useRef, useCallback } from "react";
import { useExchangeRates } from "./hooks/useExchangeRates";
import { Header } from "./components/Header";
import { CurrencyCard } from "./components/CurrencyCard";
import { Converter } from "./components/Converter";
import { LastUpdated } from "./components/LastUpdated";
import { HistoryModal } from "./components/HistoryModal";

const PULL_THRESHOLD = 72;

function SkeletonCard() {
  return <div className="skeleton rounded-2xl h-[130px]" />;
}

export default function App() {
  const { rates, loading, error, lastUpdated, refresh } = useExchangeRates();
  const [historyCode, setHistoryCode] = useState<string | null>(null);
  const [pullProgress, setPullProgress] = useState(0);
  const touchStartY = useRef(-1);

  const onTouchStart = useCallback((e: React.TouchEvent) => {
    if (window.scrollY === 0) {
      touchStartY.current = e.touches[0].clientY;
    }
  }, []);

  const onTouchMove = useCallback((e: React.TouchEvent) => {
    if (touchStartY.current < 0 || loading) return;
    const delta = e.touches[0].clientY - touchStartY.current;
    if (delta > 0) {
      setPullProgress(Math.min(delta / PULL_THRESHOLD, 1));
    }
  }, [loading]);

  const onTouchEnd = useCallback(() => {
    if (pullProgress >= 1 && !loading) {
      refresh();
    }
    setPullProgress(0);
    touchStartY.current = -1;
  }, [pullProgress, loading, refresh]);

  const pulling = pullProgress >= 1;

  return (
    <div
      className="min-h-screen text-slate-50 flex flex-col relative overflow-x-hidden"
      style={{ background: "linear-gradient(135deg, #0a001f 0%, #050d2e 40%, #001a3d 70%, #060022 100%)" }}
      onTouchStart={onTouchStart}
      onTouchMove={onTouchMove}
      onTouchEnd={onTouchEnd}
    >
      {/* Background orbs */}
      <div className="fixed -top-24 -left-24 w-96 h-96 rounded-full pointer-events-none"
        style={{ background: "radial-gradient(circle, rgba(99,102,241,0.22) 0%, transparent 70%)" }} />
      <div className="fixed bottom-10 -right-20 w-80 h-80 rounded-full pointer-events-none"
        style={{ background: "radial-gradient(circle, rgba(20,184,166,0.18) 0%, transparent 70%)" }} />
      <div className="fixed top-1/2 left-1/3 w-72 h-72 rounded-full pointer-events-none"
        style={{ background: "radial-gradient(circle, rgba(139,92,246,0.12) 0%, transparent 70%)" }} />

      {/* Pull-to-refresh indicator */}
      {pullProgress > 0 && (
        <div
          className="fixed top-20 left-1/2 z-30 pointer-events-none"
          style={{
            transform: `translateX(-50%) translateY(${(pullProgress - 1) * 24}px)`,
            opacity: pullProgress,
            transition: "opacity 0.1s",
          }}
        >
          <div
            className="w-9 h-9 rounded-full flex items-center justify-center border border-white/20"
            style={{ background: "rgba(255,255,255,0.08)", backdropFilter: "blur(12px)" }}
          >
            <svg
              className={`w-4 h-4 text-teal-400 ${pulling ? "animate-spin" : ""}`}
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2.5}
              style={{ transform: `rotate(${pullProgress * 300}deg)` }}
            >
              <path strokeLinecap="round" strokeLinejoin="round"
                d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
          </div>
        </div>
      )}

      <Header onRefresh={refresh} loading={loading} lastUpdated={lastUpdated} pulling={pulling} />

      <main className="flex-1 px-4 py-5 max-w-lg mx-auto w-full space-y-3 pb-6 relative z-10">
        {error && (
          <div className="flex items-center gap-2 bg-red-500/10 border border-red-500/20 rounded-xl p-3 text-red-400 text-xs">
            <svg className="w-4 h-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
            {error} — exibindo última cotação salva
          </div>
        )}

        {loading && !rates ? (
          <>
            <SkeletonCard />
            <SkeletonCard />
            <SkeletonCard />
            <div className="skeleton rounded-2xl h-[220px]" />
          </>
        ) : rates ? (
          <>
            <CurrencyCard rate={rates.USD} onHistory={() => setHistoryCode("USD")} />
            <CurrencyCard rate={rates.EUR} onHistory={() => setHistoryCode("EUR")} />
            <CurrencyCard rate={rates.GBP} onHistory={() => setHistoryCode("GBP")} />
            <Converter rates={rates} />
          </>
        ) : null}
      </main>

      <LastUpdated date={lastUpdated} />

      {historyCode && (
        <HistoryModal code={historyCode} onClose={() => setHistoryCode(null)} />
      )}
    </div>
  );
}