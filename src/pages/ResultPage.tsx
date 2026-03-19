// ============================================================
// TOEIC Reading Practice App — Result Page
// Design: "Quiet Study" — Soft Minimalism
// Features: Score display, wrong answers list, analysis
// ============================================================
import { useEffect, useState } from "react";
import { useLocation } from "wouter";
import {
  RotateCcw,
  Home,
  BookOpen,
  CheckCircle2,
  XCircle,
  ChevronDown,
  ChevronUp,
  TrendingUp,
  Clock,
} from "lucide-react";
import { useSession } from "@/contexts/SessionContext";
import { useStudyRecord } from "@/hooks/useStudyRecord";
import { PartBadge } from "@/components/PartBadge";
import { getQuestionById } from "@/data/index";
import type { Part } from "@/types/quiz";

function ScoreCircle({ score, total }: { score: number; total: number }) {
  const percentage = total > 0 ? Math.round((score / total) * 100) : 0;
  const circumference = 2 * Math.PI * 45;
  const strokeDashoffset = circumference - (percentage / 100) * circumference;

  const color =
    percentage >= 80
      ? "oklch(0.58 0.13 155)"
      : percentage >= 60
      ? "oklch(0.65 0.12 75)"
      : "oklch(0.60 0.14 25)";

  return (
    <div className="relative w-32 h-32 mx-auto">
      <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
        <circle
          cx="50"
          cy="50"
          r="45"
          fill="none"
          stroke="oklch(0.90 0.008 75)"
          strokeWidth="8"
        />
        <circle
          cx="50"
          cy="50"
          r="45"
          fill="none"
          stroke={color}
          strokeWidth="8"
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          className="transition-all duration-1000 ease-out"
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span
          className="text-3xl font-bold text-foreground"
          style={{ fontFamily: "'DM Sans', sans-serif" }}
        >
          {percentage}
        </span>
        <span
          className="text-xs text-muted-foreground"
          style={{ fontFamily: "'Noto Sans JP', sans-serif" }}
        >
          %
        </span>
      </div>
    </div>
  );
}

export default function ResultPage() {
  const [, navigate] = useLocation();
  const { session, resetSession, config } = useSession();
  const { record } = useStudyRecord();
  const [expandedWrong, setExpandedWrong] = useState<string | null>(null);
  const [animateScore, setAnimateScore] = useState(false);

  useEffect(() => {
    setTimeout(() => setAnimateScore(true), 100);
  }, []);

  // セッションがない場合はホームへ
  useEffect(() => {
    if (!session) {
      navigate("/");
    }
  }, [session, navigate]);

  if (!session) return null;

  const correctCount = session.answers.filter((a) => a.isCorrect).length;
  const totalCount = session.answers.length;
  const percentage = totalCount > 0 ? Math.round((correctCount / totalCount) * 100) : 0;
  const totalTime = session.endTime
    ? Math.floor((session.endTime - session.startTime) / 1000)
    : 0;
  const avgTime =
    totalCount > 0 ? Math.floor(totalTime / totalCount) : 0;

  // Part別集計
  const partStats = (["part5", "part6", "part7"] as Part[]).reduce(
    (acc, part) => {
      const partAnswers = session.answers.filter((a) => a.part === part);
      if (partAnswers.length > 0) {
        acc[part] = {
          total: partAnswers.length,
          correct: partAnswers.filter((a) => a.isCorrect).length,
        };
      }
      return acc;
    },
    {} as Record<Part, { total: number; correct: number }>
  );

  // 間違えた問題
  const wrongAnswers = session.answers.filter((a) => !a.isCorrect);

  const getMessage = () => {
    if (percentage >= 90) return { text: "完璧です！", sub: "素晴らしいスコアです" };
    if (percentage >= 80) return { text: "よくできました！", sub: "あと少しで満点" };
    if (percentage >= 60) return { text: "いい調子です！", sub: "苦手問題を復習しましょう" };
    return { text: "頑張りましょう！", sub: "復習して弱点を克服しよう" };
  };

  const message = getMessage();

  const modeLabel = {
    random10: "ランダム10問",
    part: "Part別演習",
    review: "苦手問題復習",
    timeattack: "タイムアタック",
  }[config?.mode ?? "random10"];

  return (
    <div className="min-h-screen bg-background">
      <div className="container max-w-lg mx-auto">
        {/* ヘッダー */}
        <div className="pt-12 pb-6 text-center fade-in">
          <p
            className="text-xs text-muted-foreground mb-1"
            style={{ fontFamily: "'DM Sans', sans-serif" }}
          >
            {modeLabel} — 完了
          </p>
          <h1
            className="text-2xl font-bold text-foreground"
            style={{ fontFamily: "'Noto Serif JP', serif" }}
          >
            {message.text}
          </h1>
          <p
            className="text-sm text-muted-foreground mt-1"
            style={{ fontFamily: "'Noto Sans JP', sans-serif" }}
          >
            {message.sub}
          </p>
        </div>

        {/* スコアカード */}
        <div className="qs-card mb-4 fade-in">
          <div className="flex items-center gap-6">
            {animateScore && (
              <ScoreCircle score={correctCount} total={totalCount} />
            )}
            <div className="flex-1">
              <div className="flex flex-col gap-3">
                <div>
                  <p
                    className="text-xs text-muted-foreground"
                    style={{ fontFamily: "'Noto Sans JP', sans-serif" }}
                  >
                    正解数
                  </p>
                  <p
                    className="text-2xl font-bold text-foreground"
                    style={{ fontFamily: "'DM Sans', sans-serif" }}
                  >
                    {correctCount}
                    <span className="text-base font-normal text-muted-foreground">
                      {" "}/ {totalCount}問
                    </span>
                  </p>
                </div>
                <div className="flex gap-4">
                  <div>
                    <p
                      className="text-xs text-muted-foreground"
                      style={{ fontFamily: "'Noto Sans JP', sans-serif" }}
                    >
                      所要時間
                    </p>
                    <div className="flex items-center gap-1 mt-0.5">
                      <Clock size={12} className="text-muted-foreground" />
                      <p
                        className="text-sm font-semibold text-foreground"
                        style={{ fontFamily: "'DM Sans', sans-serif" }}
                      >
                        {Math.floor(totalTime / 60)}:{String(totalTime % 60).padStart(2, "0")}
                      </p>
                    </div>
                  </div>
                  <div>
                    <p
                      className="text-xs text-muted-foreground"
                      style={{ fontFamily: "'Noto Sans JP', sans-serif" }}
                    >
                      平均時間
                    </p>
                    <p
                      className="text-sm font-semibold text-foreground mt-0.5"
                      style={{ fontFamily: "'DM Sans', sans-serif" }}
                    >
                      {avgTime}秒/問
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Part別成績 */}
        {Object.keys(partStats).length > 0 && (
          <div className="qs-card mb-4 fade-in">
            <h2
              className="text-sm font-semibold text-foreground mb-3"
              style={{ fontFamily: "'Noto Sans JP', sans-serif" }}
            >
              Part別成績
            </h2>
            <div className="flex flex-col gap-2">
              {(Object.entries(partStats) as [Part, { total: number; correct: number }][]).map(
                ([part, stat]) => {
                  const pct = Math.round((stat.correct / stat.total) * 100);
                  return (
                    <div key={part} className="flex items-center gap-3">
                      <PartBadge part={part} size="sm" />
                      <div className="flex-1">
                        <div className="h-2 bg-secondary rounded-full overflow-hidden">
                          <div
                            className="h-full rounded-full transition-all duration-700"
                            style={{
                              width: `${pct}%`,
                              backgroundColor:
                                pct >= 80
                                  ? "oklch(0.58 0.13 155)"
                                  : pct >= 60
                                  ? "oklch(0.65 0.12 75)"
                                  : "oklch(0.60 0.14 25)",
                            }}
                          />
                        </div>
                      </div>
                      <span
                        className="text-sm font-semibold text-foreground w-12 text-right"
                        style={{ fontFamily: "'DM Sans', sans-serif" }}
                      >
                        {stat.correct}/{stat.total}
                      </span>
                    </div>
                  );
                }
              )}
            </div>
          </div>
        )}

        {/* 間違えた問題 */}
        {wrongAnswers.length > 0 && (
          <div className="mb-4 fade-in">
            <h2
              className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3"
              style={{ fontFamily: "'DM Sans', sans-serif" }}
            >
              間違えた問題 ({wrongAnswers.length}問)
            </h2>
            <div className="flex flex-col gap-2">
              {wrongAnswers.map((answer) => {
                const q = getQuestionById(answer.questionId);
                if (!q) return null;
                const isExpanded = expandedWrong === answer.questionId;

                return (
                  <div key={answer.questionId} className="qs-card">
                    <button
                      onClick={() =>
                        setExpandedWrong(isExpanded ? null : answer.questionId)
                      }
                      className="w-full flex items-start gap-3 text-left"
                    >
                      <XCircle size={16} className="text-rose-400 mt-0.5 flex-shrink-0" />
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <PartBadge part={q.part as "part5" | "part6" | "part7"} size="sm" />
                          <span
                            className="text-xs text-muted-foreground"
                            style={{ fontFamily: "'Noto Sans JP', sans-serif" }}
                          >
                            {'category' in q ? q.category : '読解問題'}
                          </span>
                        </div>
                        <p
                          className="text-sm text-foreground line-clamp-2"
                          style={{ fontFamily: "'Noto Sans JP', sans-serif" }}
                        >
                          {q.part === "part5"
                            ? (q as any).sentence
                            : q.part === "part7"
                            ? (q as any).questionText
                            : `Q.${(q as any).questionNumber} — ${q.category}`}
                        </p>
                      </div>
                      {isExpanded ? (
                        <ChevronUp size={14} className="text-muted-foreground flex-shrink-0 mt-1" />
                      ) : (
                        <ChevronDown size={14} className="text-muted-foreground flex-shrink-0 mt-1" />
                      )}
                    </button>

                    {isExpanded && (
                      <div className="mt-3 pt-3 border-t border-border slide-up">
                        <div className="flex items-center gap-2 mb-2">
                          <span
                            className="text-xs text-muted-foreground"
                            style={{ fontFamily: "'Noto Sans JP', sans-serif" }}
                          >
                            あなたの回答:
                          </span>
                          <span className="text-xs font-semibold text-rose-500">
                            {answer.selectedAnswer}
                          </span>
                          <span className="text-xs text-muted-foreground mx-1">→</span>
                          <span
                            className="text-xs text-muted-foreground"
                            style={{ fontFamily: "'Noto Sans JP', sans-serif" }}
                          >
                            正解:
                          </span>
                          <span className="text-xs font-semibold text-emerald-600">
                            {answer.correctAnswer}
                          </span>
                        </div>
                        <p
                          className="text-xs text-foreground leading-relaxed"
                          style={{ fontFamily: "'Noto Sans JP', sans-serif" }}
                        >
                          {q.explanationJa}
                        </p>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* アクションボタン */}
        <div className="flex flex-col gap-3 mb-6 fade-in">
          <button
            onClick={() => {
              resetSession();
              navigate("/study");
            }}
            className="qs-btn-primary w-full flex items-center justify-center gap-2"
          >
            <RotateCcw size={16} />
            もう一度解く
          </button>
          <button
            onClick={() => {
              resetSession();
              navigate("/review");
            }}
            className="qs-btn-secondary w-full flex items-center justify-center gap-2"
          >
            <BookOpen size={16} />
            復習リストを見る
          </button>
          <button
            onClick={() => {
              resetSession();
              navigate("/");
            }}
            className="flex items-center justify-center gap-2 py-3 text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            <Home size={16} />
            ホームに戻る
          </button>
        </div>

        <div className="bottom-nav-spacer" />
      </div>
    </div>
  );
}
