// ============================================================
// TOEIC Reading Practice App — Progress Dots
// Design: "Quiet Study" — Dot-style progress indicator
// ============================================================

interface ProgressDotsProps {
  total: number;
  current: number;
  answers?: Array<{ isCorrect: boolean } | null>;
  maxVisible?: number;
}

export default function ProgressDots({
  total,
  current,
  answers = [],
  maxVisible = 10,
}: ProgressDotsProps) {
  const displayTotal = Math.min(total, maxVisible);
  const dots = Array.from({ length: displayTotal }, (_, i) => {
    const answer = answers[i];
    if (i < current) {
      if (answer === null || answer === undefined) return "done";
      return answer.isCorrect ? "correct" : "incorrect";
    }
    if (i === current) return "active";
    return "pending";
  });

  return (
    <div className="flex items-center gap-1.5 flex-wrap">
      {dots.map((status, i) => (
        <div
          key={i}
          className={`rounded-full transition-all duration-300 ${
            status === "active"
              ? "w-4 h-2.5 bg-primary"
              : status === "correct"
              ? "w-2 h-2 bg-emerald-500"
              : status === "incorrect"
              ? "w-2 h-2 bg-rose-400"
              : status === "done"
              ? "w-2 h-2 bg-muted-foreground/40"
              : "w-2 h-2 bg-border"
          }`}
        />
      ))}
      {total > maxVisible && (
        <span className="text-[10px] text-muted-foreground ml-1">
          +{total - maxVisible}
        </span>
      )}
    </div>
  );
}
