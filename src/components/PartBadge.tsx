// ============================================================
// TOEIC Reading Practice App — Part Badge Component
// Design: "Quiet Study" — Soft Minimalism
// ============================================================
import type { Part, Difficulty } from "@/types/quiz";
import { getPartLabel, getPartDescription, getDifficultyLabel } from "@/data/index";

interface PartBadgeProps {
  part: Part;
  size?: "sm" | "md";
}

export function PartBadge({ part, size = "md" }: PartBadgeProps) {
  const badgeClass = {
    part5: "part5-badge",
    part6: "part6-badge",
    part7: "part7-badge",
  }[part];

  const sizeClass = size === "sm" ? "text-[10px] px-2 py-0.5" : "text-xs px-2.5 py-1";

  return (
    <span
      className={`inline-flex items-center gap-1 rounded-full font-medium ${badgeClass} ${sizeClass}`}
      style={{ fontFamily: "'DM Sans', sans-serif" }}
    >
      {getPartLabel(part)}
      {size === "md" && (
        <span className="opacity-70">· {getPartDescription(part)}</span>
      )}
    </span>
  );
}

interface DifficultyBadgeProps {
  difficulty: Difficulty;
  size?: "sm" | "md";
}

export function DifficultyBadge({ difficulty, size = "sm" }: DifficultyBadgeProps) {
  const config = {
    easy: { bg: "bg-emerald-50 text-emerald-700", label: "基礎" },
    medium: { bg: "bg-amber-50 text-amber-700", label: "標準" },
    hard: { bg: "bg-rose-50 text-rose-700", label: "応用" },
  }[difficulty];

  const sizeClass = size === "sm" ? "text-[10px] px-2 py-0.5" : "text-xs px-2.5 py-1";

  return (
    <span
      className={`inline-flex items-center rounded-full font-medium ${config.bg} ${sizeClass}`}
      style={{ fontFamily: "'DM Sans', sans-serif" }}
    >
      {config.label}
    </span>
  );
}
