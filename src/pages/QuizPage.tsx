// ============================================================
// TOEIC Reading Practice App — Quiz Page
// Design: "Quiet Study" — Soft Minimalism
// Features: Part 5/6/7 question display, answer feedback, explanation
// ============================================================
import { useState, useEffect, useRef, useCallback } from "react";
import { useLocation } from "wouter";
import {
  X,
  ChevronRight,
  Bookmark,
  BookmarkCheck,
  ChevronDown,
  ChevronUp,
  CheckCircle2,
  XCircle,
} from "lucide-react";
import { useSession } from "@/contexts/SessionContext";
import { useStudyRecord } from "@/hooks/useStudyRecord";
import ProgressDots from "@/components/ProgressDots";
import { PartBadge, DifficultyBadge } from "@/components/PartBadge";
import Timer, { CountdownTimer } from "@/components/Timer";
import {
  getPart6PassageByQuestionId,
  getPart7PassageByQuestionId,
} from "@/data/index";
import type { Part5Question, Part6Question, Part7Question, Part } from "@/types/quiz";

type AnyQuestion = Part5Question | Part6Question | Part7Question;

export default function QuizPage() {
  const [, navigate] = useLocation();
  const {
    session,
    questions,
    currentIndex,
    currentQuestion,
    currentAnswer,
    isFinished,
    config,
    elapsedSeconds,
    submitAnswer,
    nextQuestion,
    finishSession,
  } = useSession();

  const { saveSession, toggleBookmark, isBookmarked } = useStudyRecord();

  const [selectedAnswer, setSelectedAnswer] = useState<"A" | "B" | "C" | "D" | null>(null);
  const [showExplanation, setShowExplanation] = useState(false);
  const [questionStartTime, setQuestionStartTime] = useState(Date.now());
  const [showPassage, setShowPassage] = useState(true);
  const [timeRemaining, setTimeRemaining] = useState<number | null>(null);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // セッションがない場合はホームへ
  useEffect(() => {
    if (!session && !isFinished) {
      navigate("/study");
    }
  }, [session, isFinished, navigate]);

  // タイムアタックタイマー
  useEffect(() => {
    if (config?.mode === "timeattack" && config.timeLimit) {
      setTimeRemaining(config.timeLimit);
      timerRef.current = setInterval(() => {
        setTimeRemaining((prev) => {
          if (prev === null || prev <= 1) {
            if (timerRef.current) clearInterval(timerRef.current);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [config]);

  // タイムアタック終了
  useEffect(() => {
    if (timeRemaining === 0) {
      handleFinish();
    }
  }, [timeRemaining]);

  // 問題切り替え時にリセット
  useEffect(() => {
    setSelectedAnswer(null);
    setShowExplanation(false);
    // Part 6/7 の場合はパッセージを展開したままにする
    const nextQ = questions[currentIndex];
    setShowPassage(nextQ?.part === "part6" || nextQ?.part === "part7");
    setQuestionStartTime(Date.now());
  }, [currentIndex, questions]);

  // Finish guard to prevent double-call of handleFinish
  const hasFinishedRef = useRef(false);

  // 終了時に結果画面へ
  useEffect(() => {
    if (isFinished && !hasFinishedRef.current) {
      handleFinish();
    }
  }, [isFinished]);

  const handleFinish = useCallback(() => {
    if (hasFinishedRef.current) return;
    hasFinishedRef.current = true;
    const finished = finishSession();
    if (finished) {
      saveSession(finished);
    }
    navigate("/result");
  }, [finishSession, saveSession, navigate]);

  if (!currentQuestion) return null;

  const q = currentQuestion as AnyQuestion;
  const isAnswered = currentAnswer !== null || selectedAnswer !== null;
  const answeredRecord = currentAnswer;

  // 正解を取得
  const getCorrectAnswer = (): "A" | "B" | "C" | "D" => {
    return q.correctAnswer;
  };

  // 選択肢を取得
  const getChoices = () => {
    return q.choices;
  };

  // Part 6/7のパッセージを取得
  const getPassage = () => {
    if (q.part === "part6") {
      return getPart6PassageByQuestionId(q.id);
    }
    if (q.part === "part7") {
      return getPart7PassageByQuestionId(q.id);
    }
    return null;
  };

  const handleSelectAnswer = (answer: "A" | "B" | "C" | "D") => {
    if (isAnswered) return;
    const timeSpent = Math.floor((Date.now() - questionStartTime) / 1000);
    setSelectedAnswer(answer);
    submitAnswer(q.id, answer, getCorrectAnswer(), q.part as Part, timeSpent);
  };

  const handleNext = () => {
    if (currentIndex >= questions.length - 1) {
      handleFinish();
    } else {
      nextQuestion();
    }
  };

  const passage = getPassage();
  const choices = getChoices();
  const correctAnswer = getCorrectAnswer();
  const displayAnswer = answeredRecord?.selectedAnswer ?? selectedAnswer;
  const isCorrect = displayAnswer === correctAnswer;

  return (
    <div className="min-h-screen bg-background">
      {/* ヘッダー */}
      <div className="sticky top-0 z-40 bg-background/95 backdrop-blur-sm border-b border-border">
        <div className="container max-w-lg lg:max-w-2xl mx-auto py-3 lg:py-4">
          <div className="flex items-center justify-between">
            <button
              onClick={() => {
                if (window.confirm("学習を中断しますか？")) {
                  handleFinish();
                }
              }}
              className="w-8 h-8 rounded-lg flex items-center justify-center hover:bg-secondary transition-colors"
            >
              <X size={18} className="text-muted-foreground" />
            </button>

            <div className="flex flex-col items-center gap-1">
              <ProgressDots
                total={questions.length}
                current={currentIndex}
                answers={session?.answers.map((a) => ({ isCorrect: a.isCorrect })) ?? []}
              />
              <span
                className="text-xs text-muted-foreground"
                style={{ fontFamily: "'DM Sans', sans-serif" }}
              >
                {currentIndex + 1} / {questions.length}
              </span>
            </div>

            {config?.mode === "timeattack" && timeRemaining !== null ? (
              <CountdownTimer
                totalSeconds={config.timeLimit!}
                remainingSeconds={timeRemaining}
                className="w-20"
              />
            ) : (
              <Timer seconds={elapsedSeconds} className="w-16 justify-end" />
            )}
          </div>
        </div>
      </div>

      <div className="container max-w-lg lg:max-w-2xl mx-auto pb-6 lg:pb-12">
        {/* Part バッジ + ブックマーク */}
        <div className="flex items-center justify-between pt-5 pb-3 fade-in">
          <div className="flex items-center gap-2">
            <PartBadge part={q.part as "part5" | "part6" | "part7"} />
            <DifficultyBadge difficulty={q.difficulty} />
            {q.part !== "part5" && (
              <span
                className="text-xs text-muted-foreground"
                style={{ fontFamily: "'DM Sans', sans-serif" }}
              >
                Q.{(q as Part6Question | Part7Question).questionNumber}
              </span>
            )}
          </div>
          <button
            onClick={() => toggleBookmark(q.id)}
            className="w-8 h-8 rounded-lg flex items-center justify-center hover:bg-secondary transition-colors"
          >
            {isBookmarked(q.id) ? (
              <BookmarkCheck size={18} className="text-primary" />
            ) : (
              <Bookmark size={18} className="text-muted-foreground" />
            )}
          </button>
        </div>

        {/* Part 6/7: パッセージ表示 */}
        {passage && (
          <div className="mb-4 slide-up">
            <button
              onClick={() => setShowPassage(!showPassage)}
              className="w-full flex items-center justify-between p-3 rounded-xl bg-secondary hover:bg-muted transition-colors mb-2"
            >
              <span
                className="text-sm font-medium text-foreground"
                style={{ fontFamily: "'Noto Sans JP', sans-serif" }}
              >
                {passage.part === "part6"
                  ? (passage as ReturnType<typeof getPart6PassageByQuestionId>)?.title
                  : (passage as ReturnType<typeof getPart7PassageByQuestionId>)?.title}
              </span>
              {showPassage ? (
                <ChevronUp size={16} className="text-muted-foreground" />
              ) : (
                <ChevronDown size={16} className="text-muted-foreground" />
              )}
            </button>

            {showPassage && (
              <div className="qs-card slide-up">
                {q.part === "part6" && passage && "paragraphs" in passage && (
                  <div className="space-y-3">
                    {passage.paragraphs.map((para) => (
                      <p
                        key={para.id}
                        className="passage-text text-sm text-foreground"
                        style={{ fontFamily: "'Noto Sans JP', sans-serif" }}
                      >
                        {para.text}
                      </p>
                    ))}
                  </div>
                )}
                {q.part === "part7" && passage && "texts" in passage && (
                  <div className="space-y-4">
                    {passage.texts.map((text) => (
                      <div key={text.id}>
                        {text.label && (
                          <p
                            className="text-xs font-semibold text-muted-foreground mb-2 uppercase tracking-wider"
                            style={{ fontFamily: "'DM Sans', sans-serif" }}
                          >
                            {text.label}
                          </p>
                        )}
                        <p
                          className="passage-text text-sm text-foreground"
                          style={{ fontFamily: "'Noto Sans JP', sans-serif" }}
                        >
                          {text.content}
                        </p>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {/* 問題文 */}
        <div className="qs-card mb-4 slide-up">
          {q.part === "part5" && (
            <p
              className="question-text text-base text-foreground leading-relaxed"
              style={{ fontFamily: "'Noto Sans JP', sans-serif" }}
            >
              {(q as Part5Question).sentence}
            </p>
          )}
          {q.part === "part6" && (
            <div>
              <p
                className="text-xs text-muted-foreground mb-2"
                style={{ fontFamily: "'Noto Sans JP', sans-serif" }}
              >
                空欄 {(q as Part6Question).questionNumber} に入る最も適切な語句を選んでください。
              </p>
              <p
                className="question-text text-sm text-muted-foreground"
                style={{ fontFamily: "'Noto Sans JP', sans-serif" }}
              >
                カテゴリ: {(q as Part6Question).category}
              </p>
            </div>
          )}
          {q.part === "part7" && (
            <p
              className="question-text text-base text-foreground leading-relaxed"
              style={{ fontFamily: "'Noto Sans JP', sans-serif" }}
            >
              {(q as Part7Question).questionText}
            </p>
          )}
        </div>

        {/* 選択肢 */}
        <div className="flex flex-col gap-2.5 mb-4">
          {choices.map((choice) => {
            const isSelected = displayAnswer === choice.id;
            const isCorrectChoice = choice.id === correctAnswer;
            const showResult = isAnswered;

            let choiceStyle = "bg-card border border-border";
            if (showResult) {
              if (isCorrectChoice) {
                choiceStyle = "answer-correct border";
              } else if (isSelected && !isCorrectChoice) {
                choiceStyle = "answer-incorrect border";
              } else {
                choiceStyle = "bg-secondary border border-transparent opacity-60";
              }
            } else if (isSelected) {
              choiceStyle = "bg-accent border border-primary";
            }

            return (
              <button
                key={choice.id}
                onClick={() => handleSelectAnswer(choice.id as "A" | "B" | "C" | "D")}
                disabled={isAnswered}
                className={`w-full flex items-center gap-3 p-4 rounded-2xl text-left transition-all duration-200 ${choiceStyle} ${
                  !isAnswered ? "hover:bg-accent active:scale-[0.99]" : ""
                } ${showResult && isCorrectChoice ? "correct-pulse" : ""}`}
              >
                <span
                  className={`w-7 h-7 rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0 transition-colors ${
                    showResult
                      ? isCorrectChoice
                        ? "bg-emerald-500 text-white"
                        : isSelected
                        ? "bg-rose-400 text-white"
                        : "bg-border text-muted-foreground"
                      : isSelected
                      ? "bg-primary text-primary-foreground"
                      : "bg-secondary text-muted-foreground"
                  }`}
                  style={{ fontFamily: "'DM Sans', sans-serif" }}
                >
                  {choice.id}
                </span>
                <span
                  className={`text-sm flex-1 ${
                    showResult
                      ? isCorrectChoice
                        ? "text-emerald-700 font-medium"
                        : isSelected
                        ? "text-rose-600"
                        : "text-muted-foreground"
                      : "text-foreground"
                  }`}
                  style={{ fontFamily: "'Noto Sans JP', sans-serif" }}
                >
                  {choice.text}
                </span>
                {showResult && isCorrectChoice && (
                  <CheckCircle2 size={18} className="text-emerald-500 flex-shrink-0" />
                )}
                {showResult && isSelected && !isCorrectChoice && (
                  <XCircle size={18} className="text-rose-400 flex-shrink-0" />
                )}
              </button>
            );
          })}
        </div>

        {/* 正誤フィードバック + 解説 */}
        {isAnswered && (
          <div className="slide-up">
            {/* 正誤表示 */}
            <div
              className={`flex items-center gap-3 p-4 rounded-2xl mb-3 ${
                isCorrect
                  ? "bg-emerald-50 border border-emerald-200"
                  : "bg-rose-50 border border-rose-200"
              }`}
            >
              {isCorrect ? (
                <>
                  <CheckCircle2 size={20} className="text-emerald-500 flex-shrink-0" />
                  <div>
                    <p
                      className="text-sm font-bold text-emerald-700"
                      style={{ fontFamily: "'Noto Sans JP', sans-serif" }}
                    >
                      正解！
                    </p>
                    <p
                      className="text-xs text-emerald-600 mt-0.5"
                      style={{ fontFamily: "'Noto Sans JP', sans-serif" }}
                    >
                      素晴らしい！その調子で続けましょう
                    </p>
                  </div>
                </>
              ) : (
                <>
                  <XCircle size={20} className="text-rose-400 flex-shrink-0" />
                  <div>
                    <p
                      className="text-sm font-bold text-rose-600"
                      style={{ fontFamily: "'Noto Sans JP', sans-serif" }}
                    >
                      不正解
                    </p>
                    <p
                      className="text-xs text-rose-500 mt-0.5"
                      style={{ fontFamily: "'Noto Sans JP', sans-serif" }}
                    >
                      正解は <strong>{correctAnswer}</strong> です
                    </p>
                  </div>
                </>
              )}
            </div>

            {/* 解説（折りたたみ） */}
            <div className="qs-card mb-4">
              <button
                onClick={() => setShowExplanation(!showExplanation)}
                className="w-full flex items-center justify-between"
              >
                <span
                  className="text-sm font-semibold text-foreground"
                  style={{ fontFamily: "'Noto Sans JP', sans-serif" }}
                >
                  解説を見る
                </span>
                {showExplanation ? (
                  <ChevronUp size={16} className="text-muted-foreground" />
                ) : (
                  <ChevronDown size={16} className="text-muted-foreground" />
                )}
              </button>

              {showExplanation && (
                <div className="mt-3 pt-3 border-t border-border slide-up">
                  <p
                    className="text-sm text-foreground leading-relaxed mb-3"
                    style={{ fontFamily: "'Noto Sans JP', sans-serif" }}
                  >
                    {q.explanationJa}
                  </p>
                  <div className="bg-secondary rounded-xl p-3">
                    <p
                      className="text-xs text-muted-foreground mb-1 font-medium"
                      style={{ fontFamily: "'DM Sans', sans-serif" }}
                    >
                      English Explanation
                    </p>
                    <p
                      className="text-xs text-foreground leading-relaxed"
                      style={{ fontFamily: "'Noto Sans JP', sans-serif" }}
                    >
                      {q.explanation}
                    </p>
                  </div>
                  {q.tags.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 mt-3">
                      {q.tags.map((tag) => (
                        <span
                          key={tag}
                          className="text-[10px] bg-muted text-muted-foreground px-2 py-0.5 rounded-full"
                          style={{ fontFamily: "'Noto Sans JP', sans-serif" }}
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* 次へボタン */}
            <button
              onClick={handleNext}
              className="qs-btn-primary w-full flex items-center justify-center gap-2"
            >
              {currentIndex >= questions.length - 1 ? (
                "結果を見る"
              ) : (
                <>
                  次の問題へ
                  <ChevronRight size={16} />
                </>
              )}
            </button>
          </div>
        )}

        <div className="h-8" />
      </div>
    </div>
  );
}
