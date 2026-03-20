// ============================================================
// TOEIC Reading Practice App — Part Selection Page
// Part別演習の Part 選択専用ページ
// ============================================================
import { useLocation } from "wouter";
import { ArrowLeft, BookOpen, ChevronRight } from "lucide-react";
import { useStudyRecord } from "@/hooks/useStudyRecord";
import { useSession } from "@/contexts/SessionContext";
import type { Part } from "@/types/quiz";
import { getQuestionStats } from "@/data/index";

const questionStats = getQuestionStats();

export default function PartSelectPage() {
  const [, navigate] = useLocation();
  const { stats } = useStudyRecord();
  const { startSession } = useSession();

  const parts = [
    {
      part: "part5" as Part,
      label: "Part 5",
      sub: "短文穴埋め問題",
      description: "語彙・文法・品詞問題。1問ずつ独立した短文。",
      count: questionStats.part5,
      accuracy: stats.partAccuracy.part5,
      badgeClass: "part5-badge",
      color: "bg-emerald-50",
      textColor: "text-emerald-700",
    },
    {
      part: "part6" as Part,
      label: "Part 6",
      sub: "長文穴埋め問題",
      description: "文脈を読み取って空所に入る語句を選ぶ。",
      count: questionStats.part6,
      accuracy: stats.partAccuracy.part6,
      badgeClass: "part6-badge",
      color: "bg-sky-50",
      textColor: "text-sky-700",
    },
    {
      part: "part7" as Part,
      label: "Part 7",
      sub: "読解問題",
      description: "メール・広告・記事などの文書を読んで設問に答える。",
      count: questionStats.part7,
      accuracy: stats.partAccuracy.part7,
      badgeClass: "part7-badge",
      color: "bg-violet-50",
      textColor: "text-violet-700",
    },
  ];

  const handleStart = (part: Part, count: number) => {
    startSession({ mode: "part", part, questionCount: count });
    navigate("/quiz");
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="container max-w-lg lg:max-w-2xl mx-auto">
        {/* ヘッダー */}
        <div className="flex items-center gap-3 pt-12 pb-6 fade-in">
          <button
            onClick={() => navigate("/")}
            className="w-9 h-9 rounded-xl bg-secondary flex items-center justify-center hover:bg-muted transition-colors"
          >
            <ArrowLeft size={18} className="text-foreground" />
          </button>
          <div>
            <h1
              className="text-xl font-bold text-foreground"
              style={{ fontFamily: "'Noto Serif JP', serif" }}
            >
              Part別演習
            </h1>
            <p
              className="text-xs text-muted-foreground"
              style={{ fontFamily: "'Noto Sans JP', sans-serif" }}
            >
              集中的に練習したい Part を選んでください
            </p>
          </div>
        </div>

        {/* Part カード */}
        <div className="flex flex-col gap-4 pb-8">
          {parts.map(({ part, label, sub, description, count, accuracy, badgeClass, color, textColor }) => (
            <div key={part} className="qs-card fade-in">
              <div className="flex items-start gap-4 mb-4">
                <div className={`w-12 h-12 rounded-2xl ${color} flex items-center justify-center flex-shrink-0`}>
                  <BookOpen size={20} className={textColor} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className={`text-[11px] px-2.5 py-1 rounded-full font-medium ${badgeClass}`}>
                      {label}
                    </span>
                    <span
                      className="font-semibold text-sm text-foreground"
                      style={{ fontFamily: "'Noto Sans JP', sans-serif" }}
                    >
                      {sub}
                    </span>
                  </div>
                  <p
                    className="text-xs text-muted-foreground mb-2"
                    style={{ fontFamily: "'Noto Sans JP', sans-serif" }}
                  >
                    {description}
                  </p>
                  <div className="flex items-center gap-3 text-xs text-muted-foreground">
                    <span style={{ fontFamily: "'DM Sans', sans-serif" }}>
                      {count}問
                    </span>
                    {accuracy > 0 && (
                      <span className="text-primary font-semibold" style={{ fontFamily: "'DM Sans', sans-serif" }}>
                        正答率 {accuracy}%
                      </span>
                    )}
                  </div>
                </div>
              </div>

              {/* 出題数オプション */}
              <div className="flex gap-2">
                {[
                  { label: "5問", n: 5 },
                  { label: "10問", n: 10 },
                  { label: "20問", n: 20 },
                ].map(({ label: btnLabel, n }) => (
                  <button
                    key={n}
                    onClick={() => handleStart(part, Math.min(n, count))}
                    disabled={count === 0}
                    className={`flex-1 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 ${
                      count > 0
                        ? `${color} ${textColor} hover:opacity-80`
                        : "bg-secondary text-muted-foreground cursor-not-allowed"
                    }`}
                    style={{ fontFamily: "'DM Sans', sans-serif" }}
                  >
                    {btnLabel}
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
