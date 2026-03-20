// ============================================================
// TOEIC Reading Practice App — Stats Page
// Design: "Quiet Study" — Soft Minimalism
// Features: Study history, accuracy charts, streak, totals
// ============================================================
import { useState } from "react";
import {
  Flame,
  Target,
  Clock,
  TrendingUp,
  BookOpen,
  BarChart2,
  Trash2,
  Calendar,
} from "lucide-react";
import { useStudyRecord } from "@/hooks/useStudyRecord";
import { PartBadge } from "@/components/PartBadge";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  Radar,
} from "recharts";
import type { Part } from "@/types/quiz";

function toLocalDateKey(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function StatCard({
  icon,
  label,
  value,
  sub,
  color,
}: {
  icon: React.ReactNode;
  label: string;
  value: string | number;
  sub?: string;
  color: string;
}) {
  return (
    <div className="qs-card flex flex-col gap-2">
      <div className={`w-8 h-8 rounded-xl flex items-center justify-center ${color}`}>
        {icon}
      </div>
      <div>
        <p
          className="text-xs text-muted-foreground"
          style={{ fontFamily: "'Noto Sans JP', sans-serif" }}
        >
          {label}
        </p>
        <p
          className="text-2xl font-bold text-foreground mt-0.5"
          style={{ fontFamily: "'DM Sans', sans-serif" }}
        >
          {value}
        </p>
        {sub && (
          <p
            className="text-[11px] text-muted-foreground mt-0.5"
            style={{ fontFamily: "'Noto Sans JP', sans-serif" }}
          >
            {sub}
          </p>
        )}
      </div>
    </div>
  );
}

export default function StatsPage() {
  const { record, stats, resetRecord } = useStudyRecord();
  const [showResetConfirm, setShowResetConfirm] = useState(false);

  // 直近7セッションのデータ
  const recentSessions = record.sessions.slice(-7).map((s, i) => {
    const correct = s.answers.filter((a) => a.isCorrect).length;
    const total = s.answers.length;
    const accuracy = total > 0 ? Math.round((correct / total) * 100) : 0;
    const date = new Date(s.startTime);
    return {
      name: `${date.getMonth() + 1}/${date.getDate()}`,
      正答率: accuracy,
      問題数: total,
    };
  });

  // Part別正答率データ（レーダーチャート用）
  const partData = [
    {
      subject: "Part 5\n短文穴埋め",
      正答率: stats.partAccuracy.part5 || 0,
      fullMark: 100,
    },
    {
      subject: "Part 6\n長文穴埋め",
      正答率: stats.partAccuracy.part6 || 0,
      fullMark: 100,
    },
    {
      subject: "Part 7\n読解問題",
      正答率: stats.partAccuracy.part7 || 0,
      fullMark: 100,
    },
  ];

  // 日別学習履歴（過去14日）
  const last14Days = Array.from({ length: 14 }, (_, i) => {
    const date = new Date();
    date.setDate(date.getDate() - (13 - i));
    const dateStr = toLocalDateKey(date);
    const daySessions = record.sessions.filter((s) => {
      const sDate = toLocalDateKey(new Date(s.startTime));
      return sDate === dateStr;
    });
    const total = daySessions.reduce((sum, s) => sum + s.answers.length, 0);
    return {
      date: `${date.getMonth() + 1}/${date.getDate()}`,
      問題数: total,
    };
  });

  const hasData = record.sessions.length > 0;

  return (
    <div className="min-h-screen bg-background">
      <div className="container max-w-lg mx-auto">
        {/* ヘッダー */}
        <div className="pt-12 pb-6 fade-in">
          <h1
            className="text-2xl font-bold text-foreground"
            style={{ fontFamily: "'Noto Serif JP', serif" }}
          >
            学習記録
          </h1>
          <p
            className="text-sm text-muted-foreground mt-1"
            style={{ fontFamily: "'Noto Sans JP', sans-serif" }}
          >
            あなたの学習の積み重ねを確認しよう
          </p>
        </div>

        {/* 統計カード */}
        <div className="grid grid-cols-2 gap-3 mb-6 fade-in">
          <StatCard
            icon={<Flame size={16} className="text-orange-600" />}
            label="連続学習日数"
            value={stats.streakDays}
            sub="日継続中"
            color="bg-orange-50"
          />
          <StatCard
            icon={<Target size={16} className="text-primary" />}
            label="累計問題数"
            value={stats.totalQuestions}
            sub={`正解 ${stats.totalCorrect}問`}
            color="bg-accent"
          />
          <StatCard
            icon={<Clock size={16} className="text-blue-600" />}
            label="総学習時間"
            value={stats.totalStudyMinutes}
            sub="分"
            color="bg-blue-50"
          />
          <StatCard
            icon={<TrendingUp size={16} className="text-violet-600" />}
            label="総合正答率"
            value={`${stats.overallAccuracy}%`}
            sub={`${stats.totalSessions}セッション`}
            color="bg-violet-50"
          />
        </div>

        {!hasData ? (
          <div className="qs-card text-center py-16 mb-6 fade-in">
            <BarChart2 size={40} className="text-muted-foreground mx-auto mb-4 opacity-40" />
            <p
              className="text-sm font-medium text-muted-foreground"
              style={{ fontFamily: "'Noto Sans JP', sans-serif" }}
            >
              まだ学習記録がありません
            </p>
            <p
              className="text-xs text-muted-foreground mt-1"
              style={{ fontFamily: "'Noto Sans JP', sans-serif" }}
            >
              問題を解くと記録が表示されます
            </p>
          </div>
        ) : (
          <>
            {/* Part別正答率 */}
            <div className="qs-card mb-4 fade-in">
              <h2
                className="text-sm font-semibold text-foreground mb-4"
                style={{ fontFamily: "'Noto Sans JP', sans-serif" }}
              >
                Part別正答率
              </h2>
              <div className="flex flex-col gap-3">
                {(["part5", "part6", "part7"] as Part[]).map((part) => {
                  const acc = stats.partAccuracy[part];
                  const partAnswers = record.sessions
                    .flatMap((s) => s.answers)
                    .filter((a) => a.part === part);
                  const correct = partAnswers.filter((a) => a.isCorrect).length;

                  return (
                    <div key={part}>
                      <div className="flex items-center justify-between mb-1.5">
                        <PartBadge part={part} size="sm" />
                        <div className="flex items-center gap-2">
                          <span
                            className="text-xs text-muted-foreground"
                            style={{ fontFamily: "'Noto Sans JP', sans-serif" }}
                          >
                            {correct}/{partAnswers.length}問
                          </span>
                          <span
                            className="text-sm font-bold text-foreground"
                            style={{ fontFamily: "'DM Sans', sans-serif" }}
                          >
                            {acc}%
                          </span>
                        </div>
                      </div>
                      <div className="h-2 bg-secondary rounded-full overflow-hidden">
                        <div
                          className="h-full rounded-full transition-all duration-700"
                          style={{
                            width: `${acc}%`,
                            backgroundColor:
                              acc >= 80
                                ? "oklch(0.58 0.13 155)"
                                : acc >= 60
                                ? "oklch(0.65 0.12 75)"
                                : "oklch(0.60 0.14 25)",
                          }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* 日別学習グラフ */}
            <div className="qs-card mb-4 fade-in">
              <h2
                className="text-sm font-semibold text-foreground mb-4"
                style={{ fontFamily: "'Noto Sans JP', sans-serif" }}
              >
                <div className="flex items-center gap-2">
                  <Calendar size={14} className="text-muted-foreground" />
                  過去14日間の学習量
                </div>
              </h2>
              <ResponsiveContainer width="100%" height={140}>
                <BarChart data={last14Days} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="oklch(0.90 0.008 75)" vertical={false} />
                  <XAxis
                    dataKey="date"
                    tick={{ fontSize: 10, fill: "oklch(0.55 0.01 75)", fontFamily: "'DM Sans'" }}
                    tickLine={false}
                    axisLine={false}
                    interval={2}
                  />
                  <YAxis
                    tick={{ fontSize: 10, fill: "oklch(0.55 0.01 75)", fontFamily: "'DM Sans'" }}
                    tickLine={false}
                    axisLine={false}
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "oklch(0.99 0.004 80)",
                      border: "1px solid oklch(0.90 0.008 75)",
                      borderRadius: "12px",
                      fontSize: "12px",
                      fontFamily: "'Noto Sans JP'",
                    }}
                    cursor={{ fill: "oklch(0.95 0.008 75)" }}
                  />
                  <Bar
                    dataKey="問題数"
                    fill="oklch(0.60 0.09 155)"
                    radius={[4, 4, 0, 0]}
                    maxBarSize={24}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>

            {/* 正答率推移 */}
            {recentSessions.length > 1 && (
              <div className="qs-card mb-4 fade-in">
                <h2
                  className="text-sm font-semibold text-foreground mb-4"
                  style={{ fontFamily: "'Noto Sans JP', sans-serif" }}
                >
                  <div className="flex items-center gap-2">
                    <TrendingUp size={14} className="text-muted-foreground" />
                    直近セッションの正答率
                  </div>
                </h2>
                <ResponsiveContainer width="100%" height={140}>
                  <BarChart data={recentSessions} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="oklch(0.90 0.008 75)" vertical={false} />
                    <XAxis
                      dataKey="name"
                      tick={{ fontSize: 10, fill: "oklch(0.55 0.01 75)", fontFamily: "'DM Sans'" }}
                      tickLine={false}
                      axisLine={false}
                    />
                    <YAxis
                      domain={[0, 100]}
                      tick={{ fontSize: 10, fill: "oklch(0.55 0.01 75)", fontFamily: "'DM Sans'" }}
                      tickLine={false}
                      axisLine={false}
                      tickFormatter={(v) => `${v}%`}
                    />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "oklch(0.99 0.004 80)",
                        border: "1px solid oklch(0.90 0.008 75)",
                        borderRadius: "12px",
                        fontSize: "12px",
                        fontFamily: "'Noto Sans JP'",
                      }}
                      cursor={{ fill: "oklch(0.95 0.008 75)" }}
                      formatter={(value: number) => [`${value}%`, "正答率"]}
                    />
                    <Bar
                      dataKey="正答率"
                      fill="oklch(0.58 0.12 220)"
                      radius={[4, 4, 0, 0]}
                      maxBarSize={24}
                    />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            )}

            {/* 最近のセッション */}
            <div className="mb-4 fade-in">
              <h2
                className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3"
                style={{ fontFamily: "'DM Sans', sans-serif" }}
              >
                最近のセッション
              </h2>
              <div className="flex flex-col gap-2">
                {record.sessions
                  .slice(-5)
                  .reverse()
                  .map((s) => {
                    const correct = s.answers.filter((a) => a.isCorrect).length;
                    const total = s.answers.length;
                    const accuracy = total > 0 ? Math.round((correct / total) * 100) : 0;
                    const date = new Date(s.startTime);
                    const modeLabel = {
                      random10: "ランダム",
                      part: "Part別",
                      review: "復習",
                      timeattack: "タイムアタック",
                    }[s.mode];
                    const duration = s.endTime
                      ? Math.floor((s.endTime - s.startTime) / 1000)
                      : 0;

                    return (
                      <div key={s.id} className="qs-card">
                        <div className="flex items-center justify-between">
                          <div>
                            <div className="flex items-center gap-2 mb-1">
                              <span
                                className="text-xs bg-secondary text-muted-foreground px-2 py-0.5 rounded-full font-medium"
                                style={{ fontFamily: "'Noto Sans JP', sans-serif" }}
                              >
                                {modeLabel}
                              </span>
                              <span
                                className="text-xs text-muted-foreground"
                                style={{ fontFamily: "'DM Sans', sans-serif" }}
                              >
                                {date.toLocaleDateString("ja-JP", {
                                  month: "short",
                                  day: "numeric",
                                  hour: "2-digit",
                                  minute: "2-digit",
                                })}
                              </span>
                            </div>
                            <p
                              className="text-sm text-muted-foreground"
                              style={{ fontFamily: "'Noto Sans JP', sans-serif" }}
                            >
                              {correct}/{total}問正解
                              {duration > 0 && (
                                <span className="ml-2">
                                  · {Math.floor(duration / 60)}:{String(duration % 60).padStart(2, "0")}
                                </span>
                              )}
                            </p>
                          </div>
                          <div className="text-right">
                            <p
                              className="text-2xl font-bold"
                              style={{
                                fontFamily: "'DM Sans', sans-serif",
                                color:
                                  accuracy >= 80
                                    ? "oklch(0.58 0.13 155)"
                                    : accuracy >= 60
                                    ? "oklch(0.55 0.10 75)"
                                    : "oklch(0.60 0.14 25)",
                              }}
                            >
                              {accuracy}%
                            </p>
                          </div>
                        </div>
                      </div>
                    );
                  })}
              </div>
            </div>
          </>
        )}

        {/* リセットボタン */}
        <div className="mb-6 fade-in">
          {!showResetConfirm ? (
            <button
              onClick={() => setShowResetConfirm(true)}
              className="flex items-center gap-2 text-xs text-muted-foreground hover:text-rose-400 transition-colors mx-auto"
              style={{ fontFamily: "'Noto Sans JP', sans-serif" }}
            >
              <Trash2 size={12} />
              学習記録をリセット
            </button>
          ) : (
            <div className="qs-card border border-rose-200 bg-rose-50">
              <p
                className="text-sm text-rose-700 font-medium mb-3 text-center"
                style={{ fontFamily: "'Noto Sans JP', sans-serif" }}
              >
                学習記録をすべて削除しますか？
              </p>
              <div className="flex gap-2">
                <button
                  onClick={() => setShowResetConfirm(false)}
                  className="flex-1 py-2 rounded-xl bg-white text-sm text-muted-foreground font-medium hover:bg-secondary transition-colors"
                  style={{ fontFamily: "'Noto Sans JP', sans-serif" }}
                >
                  キャンセル
                </button>
                <button
                  onClick={() => {
                    resetRecord();
                    setShowResetConfirm(false);
                  }}
                  className="flex-1 py-2 rounded-xl bg-rose-500 text-white text-sm font-medium hover:bg-rose-600 transition-colors"
                  style={{ fontFamily: "'Noto Sans JP', sans-serif" }}
                >
                  削除する
                </button>
              </div>
            </div>
          )}
        </div>

        <div className="bottom-nav-spacer" />
      </div>
    </div>
  );
}
