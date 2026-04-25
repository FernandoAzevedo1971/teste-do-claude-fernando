import { useState } from "react";
import { useExchangeRates } from "./hooks/useExchangeRates";
import { Header } from "./components/Header";
import { CurrencyCard } from "./components/CurrencyCard";
import { Converter } from "./components/Converter";
import { LastUpdated } from "./components/LastUpdated";
import { HistoryModal } from "./components/HistoryModal";

function SkeletonCard() {
  return <div className="skeleton rounded-2xl h-[130px]" />;
}

export default function App() {
  const { rates, loading, error, lastUpdated, refresh } = useExchangeRates();
  const [historyCode, setHistoryCode] = useState<string | null>(null);

  return (
    <div className="min-h-screen text-slate-50 flex flex-col relative overflow-x-hidden"
      style={{ background: "linear-gradient(135deg, #0a001f 0%, #050d2e 40%, #001a3d 70%, #060022 100%)" }}>

      {/* Background orbs */}
      <div className="fixed -top-24 -left-24 w-96 h-96 rounded-full pointer-events-none"
        style={{ background: "radial-gradient(circle, rgba(99,102,241,0.22) 0%, transparent 70%)" }} />
      <div className="fixed bottom-10 -right-20 w-80 h-80 rounded-full pointer-events-none"
        style={{ background: "radial-gradient(circle, rgba(20,184,166,0.18) 0%, transparent 70%)" }} />
      <div className="fixed top-1/2 left-1/3 w-72 h-72 rounded-full pointer-events-none"
        style={{ background: "radial-gradient(circle, rgba(139,92,246,0.12) 0%, transparent 70%)" }} />

      <Header onRefresh={refresh} loading={loading} lastUpdated={lastUpdated} />

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