// ============================================================
// TOEIC Reading Practice App — Session Context
// 学習セッションの状態管理
// ============================================================
import React, { createContext, useContext, useState, useCallback, useRef } from "react";
import { nanoid } from "nanoid";
import type {
  SessionConfig,
  StudySession,
  AnswerRecord,
  Part5Question,
  Part6Question,
  Part7Question,
  Part,
} from "@/types/quiz";
import {
  getRandomQuestions,
  getRandomQuestionsGrouped,
  getQuestionsByPart,
  shuffleArray,
  allQuestions,
} from "@/data/index";

type AnyQuestion = Part5Question | Part6Question | Part7Question;

interface SessionState {
  session: StudySession | null;
  questions: AnyQuestion[];
  currentIndex: number;
  isActive: boolean;
  isFinished: boolean;
  config: SessionConfig | null;
  elapsedSeconds: number;
}

interface SessionContextValue extends SessionState {
  startSession: (config: SessionConfig, questionIds?: string[]) => void;
  submitAnswer: (
    questionId: string,
    selectedAnswer: "A" | "B" | "C" | "D",
    correctAnswer: "A" | "B" | "C" | "D",
    part: Part,
    timeSpent: number
  ) => void;
  nextQuestion: () => void;
  finishSession: () => StudySession | null;
  resetSession: () => void;
  currentQuestion: AnyQuestion | null;
  currentAnswer: AnswerRecord | null;
  progress: number;
}

const SessionContext = createContext<SessionContextValue | null>(null);

export function SessionProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<SessionState>({
    session: null,
    questions: [],
    currentIndex: 0,
    isActive: false,
    isFinished: false,
    config: null,
    elapsedSeconds: 0,
  });

  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const sessionRef = useRef<StudySession | null>(null);

  // Keep sessionRef in sync with state
  sessionRef.current = state.session;

  const startTimer = useCallback(() => {
    if (timerRef.current) clearInterval(timerRef.current);
    timerRef.current = setInterval(() => {
      setState((prev) => ({ ...prev, elapsedSeconds: prev.elapsedSeconds + 1 }));
    }, 1000);
  }, []);

  const stopTimer = useCallback(() => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
  }, []);

  const startSession = useCallback(
    (config: SessionConfig, questionIds?: string[]) => {
      let questions: AnyQuestion[];

      if (questionIds && questionIds.length > 0) {
        // 指定IDの問題を取得（復習モード）
        questions = questionIds
          .map((id: string) => allQuestions.find((q: AnyQuestion) => q.id === id))
          .filter(Boolean) as AnyQuestion[];
        questions = shuffleArray(questions);
      } else if (config.mode === "random10") {
        // ランダム10問（パッセージグループ化あり）
        questions = getRandomQuestionsGrouped(10) as AnyQuestion[];
      } else if (config.mode === "part") {
        // Part別演習（パッセージグループ化あり）
        questions = getRandomQuestionsGrouped(config.questionCount, config.part as Part) as AnyQuestion[];
      } else if (config.mode === "timeattack") {
        // タイムアタック（パッセージグループ化あり）
        questions = getRandomQuestionsGrouped(config.questionCount) as AnyQuestion[];
      } else {
        questions = getRandomQuestionsGrouped(config.questionCount) as AnyQuestion[];
      }

      const session: StudySession = {
        id: nanoid(),
        mode: config.mode,
        part: config.part,
        startTime: Date.now(),
        answers: [],
        totalQuestions: questions.length,
      };

      setState({
        session,
        questions,
        currentIndex: 0,
        isActive: true,
        isFinished: false,
        config,
        elapsedSeconds: 0,
      });

      startTimer();
    },
    [startTimer]
  );

  const submitAnswer = useCallback(
    (
      questionId: string,
      selectedAnswer: "A" | "B" | "C" | "D",
      correctAnswer: "A" | "B" | "C" | "D",
      part: Part,
      timeSpent: number
    ) => {
      const answerRecord: AnswerRecord = {
        questionId,
        part,
        selectedAnswer,
        correctAnswer,
        isCorrect: selectedAnswer === correctAnswer,
        timeSpentSeconds: timeSpent,
        timestamp: Date.now(),
      };

      setState((prev) => {
        if (!prev.session) return prev;
        return {
          ...prev,
          session: {
            ...prev.session,
            answers: [...prev.session.answers, answerRecord],
          },
        };
      });
    },
    []
  );

  const nextQuestion = useCallback(() => {
    setState((prev) => {
      const nextIndex = prev.currentIndex + 1;
      if (nextIndex >= prev.questions.length) {
        return { ...prev, isFinished: true };
      }
      return { ...prev, currentIndex: nextIndex };
    });
  }, []);

  const finishSession = useCallback((): StudySession | null => {
    stopTimer();
    const currentSession = sessionRef.current;
    if (!currentSession) return null;

    const finishedSession: StudySession = {
      ...currentSession,
      endTime: Date.now(),
    };

    setState((prev) => ({
      ...prev,
      session: finishedSession,
      isActive: false,
      isFinished: true,
    }));

    return finishedSession;
  }, [stopTimer]);

  const resetSession = useCallback(() => {
    stopTimer();
    setState({
      session: null,
      questions: [],
      currentIndex: 0,
      isActive: false,
      isFinished: false,
      config: null,
      elapsedSeconds: 0,
    });
  }, [stopTimer]);

  const currentQuestion = state.questions[state.currentIndex] ?? null;
  const currentAnswer =
    state.session?.answers.find(
      (a) => a.questionId === currentQuestion?.id
    ) ?? null;
  const progress =
    state.questions.length > 0
      ? Math.round((state.currentIndex / state.questions.length) * 100)
      : 0;

  return (
    <SessionContext.Provider
      value={{
        ...state,
        startSession,
        submitAnswer,
        nextQuestion,
        finishSession,
        resetSession,
        currentQuestion,
        currentAnswer,
        progress,
      }}
    >
      {children}
    </SessionContext.Provider>
  );
}

export function useSession() {
  const ctx = useContext(SessionContext);
  if (!ctx) throw new Error("useSession must be used within SessionProvider");
  return ctx;
}
