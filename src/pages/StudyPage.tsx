// ============================================================
// TOEIC Reading Practice App — Study Mode Selection Page
// Design: "Quiet Study" — Soft Minimalism
// ============================================================
import { useLocation } from "wouter";
import { ArrowLeft, Shuffle, BookOpen, RotateCcw, Zap, ChevronRight } from "lucide-react";
import { useStudyRecord } from "@/hooks/useStudyRecord";
import { useSession } from "@/contexts/SessionContext";
import type { SessionConfig, Part } from "@/types/quiz";
import { getQuestionStats } from "@/data/index";
import { toast } from "sonner";

export default function StudyPage() {
  const [location, navigate] = useLocation();
  const { record, stats } = useStudyRecord();
  const { startSession } = useSession();
  const questionStats = getQuestionStats();

  // URLパラメータからモードを取得
  const searchParams = new URLSearchParams(location.split("?")[1] || "");
  const initialMode = searchParams.get("mode") || "";

  const handleStart = (config: SessionConfig) => {
    if (config.mode === "review" && record.wrongQuestions.length === 0) {
      toast.info("復習リストが空です。まず問題を解いてみましょう！");
      return;
    }

    if (config.mode === "review") {
      startSession(config, record.wrongQuestions);
    } else {
      startSession(config);
    }
    navigate("/quiz");
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="container max-w-lg lg:max-w-3xl mx-auto">
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
              学習モードを選ぶ
            </h1>
            <p
              className="text-xs text-muted-foreground"
              style={{ fontFamily: "'Noto Sans JP', sans-serif" }}
            >
              今日はどのモードで学習しますか？
            </p>
          </div>
        </div>

        {/* ランダム10問 */}
        <div className="mb-4 fade-in">
          <div className="qs-card">
            <div className="flex items-start gap-4 mb-4">
              <div className="w-12 h-12 rounded-2xl bg-accent flex items-center justify-center flex-shrink-0">
                <Shuffle size={20} className="text-primary" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h2
                    className="font-bold text-foreground"
                    style={{ fontFamily: "'Noto Sans JP', sans-serif" }}
                  >
                    ランダム10問
                  </h2>
                  <span className="text-[10px] bg-primary/10 text-primary px-2 py-0.5 rounded-full font-medium">
                    おすすめ
                  </span>
                </div>
                <p
                  className="text-xs text-muted-foreground mt-0.5"
                  style={{ fontFamily: "'Noto Sans JP', sans-serif" }}
                >
                  全Partからランダムに10問出題。スキマ時間に最適。
                </p>
              </div>
            </div>
            <button
              onClick={() =>
                handleStart({ mode: "random10", part: "all", questionCount: 10 })
              }
              className="qs-btn-primary w-full text-center"
            >
              スタート
            </button>
          </div>
        </div>

        {/* Part別演習 */}
        <div className="mb-4 fade-in">
          <div className="qs-card">
            <div className="flex items-start gap-4 mb-4">
              <div className="w-12 h-12 rounded-2xl bg-blue-50 flex items-center justify-center flex-shrink-0">
                <BookOpen size={20} className="text-blue-600" />
              </div>
              <div>
                <h2
                  className="font-bold text-foreground"
                  style={{ fontFamily: "'Noto Sans JP', sans-serif" }}
                >
                  Part別演習
                </h2>
                <p
                  className="text-xs text-muted-foreground mt-0.5"
                  style={{ fontFamily: "'Noto Sans JP', sans-serif" }}
                >
                  苦手なPartを集中的に練習
                </p>
              </div>
            </div>
            <div className="flex flex-col gap-2">
              {[
                {
                  part: "part5" as Part,
                  label: "Part 5",
                  sub: "短文穴埋め",
                  count: questionStats.part5,
                  accuracy: stats.partAccuracy.part5,
                  badgeClass: "part5-badge",
                },
                {
                  part: "part6" as Part,
                  label: "Part 6",
                  sub: "長文穴埋め",
                  count: questionStats.part6,
                  passageCount: questionStats.part6Passages,
                  accuracy: stats.partAccuracy.part6,
                  badgeClass: "part6-badge",
                },
                {
                  part: "part7" as Part,
                  label: "Part 7",
                  sub: "読解問題",
                  count: questionStats.part7,
                  passageCount: questionStats.part7Passages,
                  accuracy: stats.partAccuracy.part7,
                  badgeClass: "part7-badge",
                },
              ].map(({ part, label, sub, count, passageCount, accuracy, badgeClass }) => (
                <button
                  key={part}
                  onClick={() =>
                    handleStart({
                      mode: "part",
                      part,
                      questionCount: Math.min(count, 10),
                    })
                  }
                  className="flex items-center gap-3 p-3 rounded-xl bg-secondary hover:bg-muted transition-colors text-left"
                >
                  <span
                    className={`text-[11px] px-2.5 py-1 rounded-full font-medium ${badgeClass} flex-shrink-0`}
                  >
                    {label}
                  </span>
                  <div className="flex-1 min-w-0">
                    <span
                      className="text-sm font-medium text-foreground"
                      style={{ fontFamily: "'Noto Sans JP', sans-serif" }}
                    >
                      {sub}
                    </span>
                    <span className="text-xs text-muted-foreground ml-2">
                      {count}問
                      {passageCount ? ` (${passageCount}セット)` : ""}
                    </span>
                  </div>
                  {accuracy > 0 && (
                    <span
                      className="text-xs font-semibold text-primary"
                      style={{ fontFamily: "'DM Sans', sans-serif" }}
                    >
                      {accuracy}%
                    </span>
                  )}
                  <ChevronRight size={14} className="text-muted-foreground flex-shrink-0" />
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* 苦手問題復習 */}
        <div className="mb-4 fade-in">
          <div className="qs-card">
            <div className="flex items-start gap-4 mb-4">
              <div className="w-12 h-12 rounded-2xl bg-violet-50 flex items-center justify-center flex-shrink-0">
                <RotateCcw size={20} className="text-violet-600" />
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <h2
                    className="font-bold text-foreground"
                    style={{ fontFamily: "'Noto Sans JP', sans-serif" }}
                  >
                    苦手問題復習
                  </h2>
                  <span
                    className="text-[10px] bg-violet-100 text-violet-700 px-2 py-0.5 rounded-full font-medium"
                    style={{ fontFamily: "'DM Sans', sans-serif" }}
                  >
                    {stats.wrongCount}問
                  </span>
                </div>
                <p
                  className="text-xs text-muted-foreground mt-0.5"
                  style={{ fontFamily: "'Noto Sans JP', sans-serif" }}
                >
                  間違えた問題を集中的に復習して定着させよう
                </p>
              </div>
            </div>
            <button
              onClick={() =>
                handleStart({
                  mode: "review",
                  part: "all",
                  questionCount: Math.min(stats.wrongCount, 10),
                })
              }
              disabled={stats.wrongCount === 0}
              className={`w-full py-3 rounded-full text-sm font-medium transition-all duration-200 ${
                stats.wrongCount > 0
                  ? "bg-violet-100 text-violet-700 hover:bg-violet-200"
                  : "bg-secondary text-muted-foreground cursor-not-allowed"
              }`}
            >
              {stats.wrongCount > 0 ? "復習スタート" : "復習リストが空です"}
            </button>
          </div>
        </div>

        {/* タイムアタック */}
        <div className="mb-6 fade-in">
          <div className="qs-card">
            <div className="flex items-start gap-4 mb-4">
              <div className="w-12 h-12 rounded-2xl bg-amber-50 flex items-center justify-center flex-shrink-0">
                <Zap size={20} className="text-amber-600" />
              </div>
              <div>
                <h2
                  className="font-bold text-foreground"
                  style={{ fontFamily: "'Noto Sans JP', sans-serif" }}
                >
                  タイムアタック
                </h2>
                <p
                  className="text-xs text-muted-foreground mt-0.5"
                  style={{ fontFamily: "'Noto Sans JP', sans-serif" }}
                >
                  10問を制限時間内に素早く解く
                </p>
              </div>
            </div>
            <div className="flex gap-2">
              {[
                { label: "5分", seconds: 300 },
                { label: "10分", seconds: 600 },
                { label: "15分", seconds: 900 },
              ].map(({ label, seconds }) => (
                <button
                  key={seconds}
                  onClick={() =>
                    handleStart({
                      mode: "timeattack",
                      part: "all",
                      questionCount: 10,
                      timeLimit: seconds,
                    })
                  }
                  className="flex-1 py-2.5 rounded-xl bg-amber-50 text-amber-700 text-sm font-medium hover:bg-amber-100 transition-colors"
                  style={{ fontFamily: "'DM Sans', sans-serif" }}
                >
                  {label}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="bottom-nav-spacer" />
      </div>
    </div>
  );
}
