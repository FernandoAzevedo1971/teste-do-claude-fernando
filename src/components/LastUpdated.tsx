interface LastUpdatedProps {
  date: Date | null;
}

export function LastUpdated({ date }: LastUpdatedProps) {
  if (!date) return null;

  const time = date.toLocaleTimeString("pt-BR", {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  });

  return (
    <footer className="safe-bottom text-center py-4 px-4 relative z-10">
      <p className="text-[11px] text-white/20 font-medium flex items-center justify-center gap-1.5">
        <span className="inline-block w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse-slow" />
        Atualizado às {time} · AwesomeAPI
      </p>
    </footer>
  );
}