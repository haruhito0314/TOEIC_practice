// ============================================================
// TOEIC Reading Practice App — Home Page
// Design: "Quiet Study" — Soft Minimalism × Japanese Wabi-Sabi
// Colors: Warm White base, Sage Green accent
// Layout: Mobile-first single column, card-based dashboard
// ============================================================
import { useLocation } from "wouter";
import {
  Shuffle,
  BookOpen,
  RotateCcw,
  Zap,
  ChevronRight,
  Flame,
  Target,
  Clock,
  TrendingUp,
  LogOut,
  UserPlus,
  Sparkles,
} from "lucide-react";
import { useStudyRecord } from "@/hooks/useStudyRecord";
import { useAuth } from "@/contexts/AuthContext";
import { getQuestionStats } from "@/data/index";

const questionStats = getQuestionStats();

interface ModeCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  color: string;
  onClick: () => void;
  badge?: string;
}

function ModeCard({ icon, title, description, color, onClick, badge }: ModeCardProps) {
  return (
    <button
      onClick={onClick}
      className="qs-card-hover w-full text-left flex items-center gap-4 active:scale-[0.98]"
    >
      <div
        className={`w-11 h-11 rounded-2xl flex items-center justify-center flex-shrink-0 ${color}`}
      >
        {icon}
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <span
            className="font-semibold text-sm text-foreground"
            style={{ fontFamily: "'Noto Sans JP', sans-serif" }}
          >
            {title}
          </span>
          {badge && (
            <span className="text-[10px] bg-primary/10 text-primary px-2 py-0.5 rounded-full font-medium">
              {badge}
            </span>
          )}
        </div>
        <p
          className="text-xs text-muted-foreground mt-0.5"
          style={{ fontFamily: "'Noto Sans JP', sans-serif" }}
        >
          {description}
        </p>
      </div>
      <ChevronRight size={16} className="text-muted-foreground flex-shrink-0" />
    </button>
  );
}

interface StatCardProps {
  icon: React.ReactNode;
  label: string;
  value: string | number;
  sub?: string;
  color: string;
}

function StatCard({ icon, label, value, sub, color }: StatCardProps) {
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

export default function Home() {
  const [, navigate] = useLocation();
  const { stats } = useStudyRecord();
  const { user, isGuest, guestName, logout } = useAuth();

  const today = new Date();
  const dateStr = today.toLocaleDateString("ja-JP", {
    month: "long",
    day: "numeric",
    weekday: "short",
  });

  const greeting = (() => {
    const h = today.getHours();
    if (h < 12) return "おはようございます";
    if (h < 18) return "こんにちは";
    return "こんばんは";
  })();

  const displayName = isGuest ? guestName : user?.name;
  const sessionCount = stats.totalSessions;
  const showSignupPrompt = isGuest && sessionCount >= 5;

  return (
    <div className="min-h-screen bg-background">
      <div className="container max-w-lg lg:max-w-6xl mx-auto">
        {/* ヘッダー */}
        <div className="flex items-center justify-between pt-6 pb-4 fade-in">
          <div>
            <p
              className="text-xs text-muted-foreground"
              style={{ fontFamily: "'Noto Sans JP', sans-serif" }}
            >
              {isGuest ? "ゲストとして利用中" : "ログイン中"}
            </p>
            <p
              className="text-sm font-medium text-foreground"
              style={{ fontFamily: "'Noto Sans JP', sans-serif" }}
            >
              {displayName}
            </p>
          </div>
          {isGuest ? (
            <button
              onClick={() => navigate("/auth")}
              className="flex items-center gap-1.5 px-4 py-2 rounded-full bg-primary/10 text-primary text-xs font-medium hover:bg-primary/20 transition-colors"
              style={{ fontFamily: "'Noto Sans JP', sans-serif" }}
            >
              <UserPlus size={14} />
              サインアップ
            </button>
          ) : (
            <button
              onClick={() => {
                logout();
                navigate("/");
              }}
              className="w-9 h-9 rounded-xl bg-secondary flex items-center justify-center hover:bg-muted transition-colors"
              title="ログアウト"
            >
              <LogOut size={18} className="text-muted-foreground" />
            </button>
          )}
        </div>

        {/* 登録促進バナー（5セッション以上のゲスト向け） */}
        {showSignupPrompt && (
          <div className="mb-4 fade-in">
            <div
              className="qs-card bg-gradient-to-br from-primary/10 to-accent/40"
              style={{ cursor: "pointer" }}
              onClick={() => navigate("/auth")}
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-primary/15 flex items-center justify-center flex-shrink-0">
                  <Sparkles size={18} className="text-primary" />
                </div>
                <div className="flex-1 min-w-0">
                  <p
                    className="text-sm font-semibold text-foreground"
                    style={{ fontFamily: "'Noto Sans JP', sans-serif" }}
                  >
                    🎉 {sessionCount}セッション達成！
                  </p>
                  <p
                    className="text-xs text-muted-foreground mt-0.5"
                    style={{ fontFamily: "'Noto Sans JP', sans-serif" }}
                  >
                    アカウントを作成して学習記録をクラウドに保存しませんか？
                  </p>
                </div>
                <ChevronRight size={16} className="text-primary flex-shrink-0" />
              </div>
            </div>
          </div>
        )}

        {/* ヒーローセクション */}
        <div className="pt-4 pb-4 fade-in lg:pt-8 lg:pb-6">
          {/* イラスト */}
          <div className="relative w-full h-44 lg:h-56 mb-4 rounded-3xl overflow-hidden bg-[#F5F0E8]">
            <img
              src="https://d2xsxph8kpxj0f.cloudfront.net/310519663444816967/HqWgeBKWNqDZEVdjSvBA4w/toeic-hero-nJ2kaR4yrFt7cfGDx4fvMZ.webp"
              alt="TOEIC学習イラスト"
              className="w-full h-full object-cover object-center"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#F5F0E8]/60 to-transparent" />
            <div className="absolute bottom-4 left-4">
              <p
                className="text-xs text-[#5C5247]/70 mb-0.5"
                style={{ fontFamily: "'Noto Sans JP', sans-serif" }}
              >
                {dateStr}
              </p>
              <h1
                className="text-xl font-bold text-[#2C2416]"
                style={{ fontFamily: "'Noto Serif JP', serif" }}
              >
                {greeting}
              </h1>
            </div>
          </div>
          <p
            className="text-sm text-muted-foreground"
            style={{ fontFamily: "'Noto Sans JP', sans-serif" }}
          >
            今日もTOEIC対策、一緒に頑張りましょう
          </p>
        </div>

        {/* 今日の学習状況 */}
        {stats.totalQuestions > 0 && (
          <div className="mb-6 fade-in">
            <div className="qs-card bg-gradient-to-br from-accent/60 to-accent/30">
              <div className="flex items-center justify-between mb-3">
                <h2
                  className="text-sm font-semibold text-accent-foreground"
                  style={{ fontFamily: "'Noto Sans JP', sans-serif" }}
                >
                  学習サマリー
                </h2>
                <span
                  className="text-xs text-accent-foreground/70"
                  style={{ fontFamily: "'Noto Sans JP', sans-serif" }}
                >
                  累計
                </span>
              </div>
              <div className="flex items-end gap-4">
                <div>
                  <p
                    className="text-3xl font-bold text-accent-foreground"
                    style={{ fontFamily: "'DM Sans', sans-serif" }}
                  >
                    {stats.overallAccuracy}
                    <span className="text-lg font-medium">%</span>
                  </p>
                  <p
                    className="text-xs text-accent-foreground/70 mt-0.5"
                    style={{ fontFamily: "'Noto Sans JP', sans-serif" }}
                  >
                    正答率
                  </p>
                </div>
                <div className="flex-1">
                  <div className="h-2 bg-white/40 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-primary rounded-full transition-all duration-500"
                      style={{ width: `${stats.overallAccuracy}%` }}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* 統計カード */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 lg:gap-4 mb-6 fade-in">
          <StatCard
            icon={<Flame size={16} className="text-orange-600" />}
            label="連続学習"
            value={stats.streakDays}
            sub="日継続中"
            color="bg-orange-50"
          />
          <StatCard
            icon={<Target size={16} className="text-primary" />}
            label="解いた問題"
            value={stats.totalQuestions}
            sub={`正解 ${stats.totalCorrect}問`}
            color="bg-accent"
          />
          <StatCard
            icon={<Clock size={16} className="text-blue-600" />}
            label="学習時間"
            value={stats.totalStudyMinutes}
            sub="分"
            color="bg-blue-50"
          />
          <StatCard
            icon={<TrendingUp size={16} className="text-violet-600" />}
            label="復習リスト"
            value={stats.wrongCount}
            sub="問"
            color="bg-violet-50"
          />
        </div>

        {/* 学習モード */}
        <div className="mb-6 fade-in">
          <h2
            className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3"
            style={{ fontFamily: "'DM Sans', sans-serif" }}
          >
            学習モード
          </h2>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 lg:gap-4">
            <ModeCard
              icon={<Shuffle size={18} className="text-primary" />}
              title="ランダム10問"
              description="全Partからランダムに10問出題"
              color="bg-accent"
              badge="おすすめ"
              onClick={() => navigate("/study?mode=random10")}
            />
            <ModeCard
              icon={<BookOpen size={18} className="text-blue-600" />}
              title="Part別演習"
              description="Part 5 / 6 / 7 を選んで集中練習"
              color="bg-blue-50"
              onClick={() => navigate("/study?mode=part")}
            />
            <ModeCard
              icon={<RotateCcw size={18} className="text-violet-600" />}
              title="苦手問題復習"
              description={`間違えた問題を集中的に復習 (${stats.wrongCount}問)`}
              color="bg-violet-50"
              onClick={() => navigate("/study?mode=review")}
            />
            <ModeCard
              icon={<Zap size={18} className="text-amber-600" />}
              title="タイムアタック"
              description="制限時間内に素早く解く"
              color="bg-amber-50"
              onClick={() => navigate("/study?mode=timeattack")}
            />
          </div>
        </div>

        {/* 問題数情報 */}
        <div className="mb-6 fade-in lg:mb-8">
          <div className="qs-card">
            <h3
              className="text-xs font-semibold text-muted-foreground mb-3 lg:mb-4"
              style={{ fontFamily: "'DM Sans', sans-serif" }}
            >
              問題データベース
            </h3>
            <div className="flex gap-4 lg:gap-8">
              {[
                { label: "Part 5", count: questionStats.part5, color: "part5-badge" },
                { label: "Part 6", count: questionStats.part6, color: "part6-badge" },
                { label: "Part 7", count: questionStats.part7, color: "part7-badge" },
              ].map(({ label, count, color }) => (
                <div key={label} className="flex-1 text-center">
                  <span className={`inline-block text-[10px] px-2 py-0.5 rounded-full font-medium ${color} mb-1`}>
                    {label}
                  </span>
                  <p
                    className="text-lg font-bold text-foreground"
                    style={{ fontFamily: "'DM Sans', sans-serif" }}
                  >
                    {count}
                  </p>
                  <p
                    className="text-[10px] text-muted-foreground"
                    style={{ fontFamily: "'Noto Sans JP', sans-serif" }}
                  >
                    問
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="bottom-nav-spacer" />
      </div>
    </div>
  );
}
