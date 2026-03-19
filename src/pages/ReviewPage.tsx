// ============================================================
// TOEIC Reading Practice App — Review Page
// Design: "Quiet Study" — Soft Minimalism
// Features: Wrong questions list, bookmarks, Part filter
// ============================================================
import { useState } from "react";
import { useLocation } from "wouter";
import {
  BookmarkCheck,
  XCircle,
  ChevronRight,
  Filter,
  RotateCcw,
  Trash2,
  BookOpen,
  ArrowLeft,
  Home,
} from "lucide-react";
import { useStudyRecord } from "@/hooks/useStudyRecord";
import { useSession } from "@/contexts/SessionContext";
import { PartBadge, DifficultyBadge } from "@/components/PartBadge";
import { getQuestionById } from "@/data/index";
import type { Part } from "@/types/quiz";

type FilterType = "all" | "wrong" | "bookmarks";
type PartFilter = "all" | Part;

export default function ReviewPage() {
  const [, navigate] = useLocation();
  const { record, toggleBookmark, removeFromWrong } = useStudyRecord();
  const { startSession } = useSession();
  const [filter, setFilter] = useState<FilterType>("wrong");
  const [partFilter, setPartFilter] = useState<PartFilter>("all");

  // 表示する問題IDリストを取得
  const getDisplayIds = (): string[] => {
    let ids: string[] = [];
    if (filter === "wrong" || filter === "all") {
      ids = [...ids, ...record.wrongQuestions];
    }
    if (filter === "bookmarks" || filter === "all") {
      const bookmarkIds = record.bookmarks.filter((id) => !ids.includes(id));
      ids = [...ids, ...bookmarkIds];
    }
    return ids;
  };

  const allIds = getDisplayIds();
  const displayQuestions = allIds
    .map((id) => getQuestionById(id))
    .filter(Boolean)
    .filter((q) => {
      if (!q) return false;
      if (partFilter === "all") return true;
      return q.part === partFilter;
    });

  const handleStartReview = () => {
    if (displayQuestions.length === 0) return;
    const ids = displayQuestions.map((q) => q!.id);
    startSession(
      { mode: "review", part: "all", questionCount: ids.length },
      ids
    );
    navigate("/quiz");
  };

  const filterTabs: { key: FilterType; label: string; count: number }[] = [
    { key: "wrong", label: "苦手問題", count: record.wrongQuestions.length },
    { key: "bookmarks", label: "ブックマーク", count: record.bookmarks.length },
    { key: "all", label: "すべて", count: record.wrongQuestions.length + record.bookmarks.filter(id => !record.wrongQuestions.includes(id)).length },
  ];

  const partTabs: { key: PartFilter; label: string }[] = [
    { key: "all", label: "全Part" },
    { key: "part5", label: "Part 5" },
    { key: "part6", label: "Part 6" },
    { key: "part7", label: "Part 7" },
  ];

  return (
    <div className="min-h-screen bg-background">
      <div className="container max-w-lg mx-auto">
        {/* ヘッダー */}
        <div className="pt-8 pb-4 fade-in flex items-center gap-3">
          <button
            onClick={() => navigate("/")}
            className="w-10 h-10 rounded-full flex items-center justify-center bg-secondary hover:bg-muted transition-colors text-muted-foreground"
          >
            <ArrowLeft size={20} />
          </button>
          <div>
            <h1
              className="text-2xl font-bold text-foreground"
              style={{ fontFamily: "'Noto Serif JP', serif" }}
            >
              復習リスト
            </h1>
            <p
              className="text-sm text-muted-foreground mt-1"
              style={{ fontFamily: "'Noto Sans JP', sans-serif" }}
            >
              間違えた問題やブックマークした問題を復習しよう
            </p>
          </div>
        </div>

        {/* フィルタータブ */}
        <div className="flex gap-2 mb-3 fade-in">
          {filterTabs.map(({ key, label, count }) => (
            <button
              key={key}
              onClick={() => setFilter(key)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium transition-all duration-200 ${
                filter === key
                  ? "bg-primary text-primary-foreground"
                  : "bg-secondary text-muted-foreground hover:bg-muted"
              }`}
              style={{ fontFamily: "'Noto Sans JP', sans-serif" }}
            >
              {label}
              <span
                className={`text-[10px] px-1.5 py-0.5 rounded-full ${
                  filter === key ? "bg-white/20" : "bg-muted"
                }`}
              >
                {count}
              </span>
            </button>
          ))}
        </div>

        {/* Part フィルター */}
        <div className="flex gap-1.5 mb-4 fade-in overflow-x-auto pb-1">
          {partTabs.map(({ key, label }) => (
            <button
              key={key}
              onClick={() => setPartFilter(key)}
              className={`flex-shrink-0 px-3 py-1 rounded-full text-xs font-medium transition-all duration-200 ${
                partFilter === key
                  ? key === "part5"
                    ? "part5-badge"
                    : key === "part6"
                    ? "part6-badge"
                    : key === "part7"
                    ? "part7-badge"
                    : "bg-foreground text-background"
                  : "bg-secondary text-muted-foreground hover:bg-muted"
              }`}
              style={{ fontFamily: "'DM Sans', sans-serif" }}
            >
              {label}
            </button>
          ))}
        </div>

        {/* 復習スタートボタン */}
        {displayQuestions.length > 0 && (
          <div className="mb-4 fade-in">
            <button
              onClick={handleStartReview}
              className="qs-btn-primary w-full flex items-center justify-center gap-2"
            >
              <RotateCcw size={16} />
              {displayQuestions.length}問を復習する
            </button>
          </div>
        )}

        {/* 問題リスト */}
        {displayQuestions.length === 0 ? (
          <div className="qs-card text-center py-12 fade-in">
            <BookOpen size={32} className="text-muted-foreground mx-auto mb-3 opacity-50" />
            <p
              className="text-sm font-medium text-muted-foreground"
              style={{ fontFamily: "'Noto Sans JP', sans-serif" }}
            >
              {filter === "wrong"
                ? "苦手問題はありません"
                : filter === "bookmarks"
                ? "ブックマークはありません"
                : "リストが空です"}
            </p>
            <p
              className="text-xs text-muted-foreground mt-1 mb-6"
              style={{ fontFamily: "'Noto Sans JP', sans-serif" }}
            >
              問題を解いて復習リストを作りましょう
            </p>
            <button
              onClick={() => navigate("/")}
              className="qs-btn-secondary mx-auto flex items-center justify-center gap-2"
            >
              <Home size={16} />
              ホームに戻る
            </button>
          </div>
        ) : (
          <div className="flex flex-col gap-2 fade-in">
            {displayQuestions.map((q) => {
              if (!q) return null;
              const isWrong = record.wrongQuestions.includes(q.id);
              const isBookmarked = record.bookmarks.includes(q.id);

              return (
                <div key={q.id} className="qs-card">
                  <div className="flex items-start gap-3">
                    <div className="flex flex-col gap-1 mt-0.5">
                      {isWrong && (
                        <XCircle size={14} className="text-rose-400" />
                      )}
                      {isBookmarked && (
                        <BookmarkCheck size={14} className="text-primary" />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1.5 flex-wrap">
                        <PartBadge part={q.part as "part5" | "part6" | "part7"} size="sm" />
                        <DifficultyBadge difficulty={q.difficulty} size="sm" />
                        <span
                          className="text-[10px] text-muted-foreground"
                          style={{ fontFamily: "'Noto Sans JP', sans-serif" }}
                        >
                          {'category' in q ? q.category : '読解問題'}
                        </span>
                      </div>
                      <p
                        className="text-sm text-foreground line-clamp-2 leading-relaxed"
                        style={{ fontFamily: "'Noto Sans JP', sans-serif" }}
                      >
                        {q.part === "part5"
                          ? (q as any).sentence
                          : q.part === "part7"
                          ? (q as any).questionText
                          : `Q.${(q as any).questionNumber} — ${(q as any).category}`}
                      </p>
                      {/* タグ */}
                      <div className="flex flex-wrap gap-1 mt-2">
                        {q.tags.slice(0, 3).map((tag) => (
                          <span
                            key={tag}
                            className="text-[10px] bg-secondary text-muted-foreground px-1.5 py-0.5 rounded-full"
                            style={{ fontFamily: "'Noto Sans JP', sans-serif" }}
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    </div>
                    <div className="flex flex-col gap-1.5 flex-shrink-0">
                      <button
                        onClick={() => toggleBookmark(q.id)}
                        className={`w-7 h-7 rounded-lg flex items-center justify-center transition-colors ${
                          isBookmarked ? "bg-accent" : "bg-secondary hover:bg-muted"
                        }`}
                      >
                        <BookmarkCheck
                          size={13}
                          className={isBookmarked ? "text-primary" : "text-muted-foreground"}
                        />
                      </button>
                      {isWrong && (
                        <button
                          onClick={() => removeFromWrong(q.id)}
                          className="w-7 h-7 rounded-lg bg-secondary flex items-center justify-center hover:bg-rose-50 transition-colors"
                        >
                          <Trash2 size={13} className="text-muted-foreground hover:text-rose-400" />
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        <div className="bottom-nav-spacer" />
      </div>
    </div>
  );
}
