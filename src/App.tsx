import { useExchangeRates } from "./hooks/useExchangeRates";
import { Header } from "./components/Header";
import { CurrencyCard } from "./components/CurrencyCard";
import { Converter } from "./components/Converter";
import { LastUpdated } from "./components/LastUpdated";

function SkeletonCard() {
  return <div className="skeleton rounded-2xl h-[130px]" />;
}

export default function App() {
  const { rates, loading, error, lastUpdated, refresh } = useExchangeRates();

  return (
    <div className="min-h-screen bg-slate-900 text-slate-50 flex flex-col">
      <Header onRefresh={refresh} loading={loading} />

      <main className="flex-1 px-4 py-5 max-w-lg mx-auto w-full space-y-3 pb-6">
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
            <CurrencyCard rate={rates.USD} />
            <CurrencyCard rate={rates.EUR} />
            <CurrencyCard rate={rates.GBP} />
            <Converter rates={rates} />
          </>
        ) : null}
      </main>

      <LastUpdated date={lastUpdated} />
    </div>
  );
}
