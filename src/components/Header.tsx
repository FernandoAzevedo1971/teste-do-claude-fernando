interface HeaderProps {
  onRefresh: () => void;
  loading: boolean;
  lastUpdated: Date | null;
}

export function Header({ onRefresh, loading, lastUpdated }: HeaderProps) {
  const today = new Date().toLocaleDateString("pt-BR", {
    weekday: "long",
    day: "2-digit",
    month: "long",
    year: "numeric",
  });

  const todayFormatted = today.charAt(0).toUpperCase() + today.slice(1);

  const time = lastUpdated
    ? lastUpdated.toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" })
    : null;

  return (
    <header
      className="safe-top sticky top-0 z-20 border-b border-white/[0.06]"
      style={{ background: "rgba(255,255,255,0.03)", backdropFilter: "blur(20px)" }}
    >
      <div className="max-w-lg mx-auto px-4 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div
            className="w-9 h-9 rounded-xl border border-white/10 flex items-center justify-center text-lg"
            style={{ background: "linear-gradient(135deg, rgba(99,102,241,0.3), rgba(20,184,166,0.3))" }}
          >
            💱
          </div>
          <div>
            <h1 className="text-base font-bold text-white tracking-tight leading-none">
              Câmbio Hoje
            </h1>
            <p className="text-[11px] text-white/40 mt-0.5">{todayFormatted}</p>
            {time && (
              <p className="text-[10px] text-white/30 italic mt-0.5">
                Última atualização às {time} h
              </p>
            )}
          </div>
        </div>

        <button
          onClick={onRefresh}
          disabled={loading}
          className="p-2.5 rounded-xl border border-white/[0.08] text-white/40 hover:text-teal-400 hover:border-teal-500/30 transition-all active:scale-95 disabled:opacity-50"
          style={{ background: "rgba(255,255,255,0.05)" }}
          title="Atualizar cotações"
        >
          <svg
            className={`w-4 h-4 ${loading ? "animate-spin" : ""}`}
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2.5}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
            />
          </svg>
        </button>
      </div>
    </header>
  );
}