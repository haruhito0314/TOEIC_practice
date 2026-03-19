// ============================================================
// TOEIC Reading Practice App — Timer Component
// Design: "Quiet Study" — Minimal timer display
// ============================================================
import { Clock } from "lucide-react";

interface TimerProps {
  seconds: number;
  limit?: number; // タイムアタック用の制限時間
  showIcon?: boolean;
  className?: string;
}

export default function Timer({ seconds, limit, showIcon = true, className = "" }: TimerProps) {
  const minutes = Math.floor(seconds / 60);
  const secs = seconds % 60;
  const display = `${String(minutes).padStart(2, "0")}:${String(secs).padStart(2, "0")}`;

  const isWarning = limit ? seconds > limit * 0.7 : false;
  const isDanger = limit ? seconds > limit * 0.9 : false;

  return (
    <div
      className={`flex items-center gap-1.5 font-mono text-sm font-medium ${
        isDanger
          ? "text-rose-500"
          : isWarning
          ? "text-amber-500"
          : "text-muted-foreground"
      } ${className}`}
      style={{ fontFamily: "'DM Sans', monospace" }}
    >
      {showIcon && <Clock size={14} strokeWidth={2} />}
      <span>{display}</span>
    </div>
  );
}

// 残り時間表示（タイムアタック用）
interface CountdownTimerProps {
  totalSeconds: number;
  remainingSeconds: number;
  className?: string;
}

export function CountdownTimer({ totalSeconds, remainingSeconds, className = "" }: CountdownTimerProps) {
  const minutes = Math.floor(remainingSeconds / 60);
  const secs = remainingSeconds % 60;
  const display = `${String(minutes).padStart(2, "0")}:${String(secs).padStart(2, "0")}`;
  const progress = (remainingSeconds / totalSeconds) * 100;

  const isWarning = remainingSeconds < totalSeconds * 0.3;
  const isDanger = remainingSeconds < totalSeconds * 0.1;

  return (
    <div className={`flex flex-col gap-1 ${className}`}>
      <div className="flex items-center justify-between">
        <div
          className={`flex items-center gap-1.5 font-mono text-sm font-semibold ${
            isDanger ? "text-rose-500" : isWarning ? "text-amber-500" : "text-foreground"
          }`}
          style={{ fontFamily: "'DM Sans', monospace" }}
        >
          <Clock size={14} strokeWidth={2} />
          <span>{display}</span>
        </div>
      </div>
      <div className="h-1 bg-border rounded-full overflow-hidden">
        <div
          className={`h-full rounded-full transition-all duration-1000 ${
            isDanger ? "bg-rose-500" : isWarning ? "bg-amber-500" : "bg-primary"
          }`}
          style={{ width: `${progress}%` }}
        />
      </div>
    </div>
  );
}
