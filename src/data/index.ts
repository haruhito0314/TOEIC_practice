// ============================================================
// TOEIC Reading Practice App — Data Index & Utilities
// ============================================================

// Part 5 imports (300 questions)
import { part5_001_050 } from "./part5/part5_001_050";
import { part5_051_100 } from "./part5/part5_051_100";
import { part5_101_150 } from "./part5/part5_101_150";
import { part5_151_200 } from "./part5/part5_151_200";
import { part5_201_250 } from "./part5/part5_201_250";
import { part5_251_300 } from "./part5/part5_251_300";

// Part 6 imports (20 passages / 80 questions)
import { part6_001_005 } from "./part6/part6_001_005";
import { part6_006_010 } from "./part6/part6_006_010";
import { part6_011_015 } from "./part6/part6_011_015";
import { part6_016_020 } from "./part6/part6_016_020";

// Part 7 imports (10 passages / 50 questions)
import { part7_001_005 } from "./part7/part7_001_005";
import { part7_006_010 } from "./part7/part7_006_010";

import type { Part5Question, Part6Question, Part7Question, Part, Difficulty } from "@/types/quiz";

// === Combine all data ===
export const part5Questions: Part5Question[] = [
  ...part5_001_050,
  ...part5_051_100,
  ...part5_101_150,
  ...part5_151_200,
  ...part5_201_250,
  ...part5_251_300,
];

export const part6Passages = [
  ...part6_001_005,
  ...part6_006_010,
  ...part6_011_015,
  ...part6_016_020,
];

export const part7Passages = [
  ...part7_001_005,
  ...part7_006_010,
];

// Part 6の全問題をフラット化
export const part6Questions: Part6Question[] = part6Passages.flatMap(
  (passage) => passage.questions
);

// Part 7の全問題をフラット化
export const part7Questions: Part7Question[] = part7Passages.flatMap(
  (passage) => passage.questions
);

// 全問題（Part 5 + Part 6 + Part 7）
export const allQuestions = [
  ...part5Questions,
  ...part6Questions,
  ...part7Questions,
];

// Part別の問題取得
export function getQuestionsByPart(part: Part) {
  switch (part) {
    case "part5":
      return part5Questions;
    case "part6":
      return part6Questions;
    case "part7":
      return part7Questions;
    default:
      return [];
  }
}

// IDで問題を取得
export function getQuestionById(id: string) {
  return allQuestions.find((q) => q.id === id) ?? null;
}

// Part 6: パッセージIDから問題を取得
export function getPart6PassageById(passageId: string) {
  return part6Passages.find((p) => p.id === passageId) ?? null;
}

// Part 7: パッセージIDから問題を取得
export function getPart7PassageById(passageId: string) {
  return part7Passages.find((p) => p.id === passageId) ?? null;
}

// Part 6: 問題IDからパッセージを取得
export function getPart6PassageByQuestionId(questionId: string) {
  return part6Passages.find((p) => p.questions.some((q) => q.id === questionId)) ?? null;
}

// Part 7: 問題IDからパッセージを取得
export function getPart7PassageByQuestionId(questionId: string) {
  return part7Passages.find((p) => p.questions.some((q) => q.id === questionId)) ?? null;
}

// ランダムシャッフル
export function shuffleArray<T>(array: T[]): T[] {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

// ランダムN問取得
export function getRandomQuestions(count: number, part?: Part) {
  const pool = part ? getQuestionsByPart(part) : allQuestions;
  return shuffleArray(pool).slice(0, Math.min(count, pool.length));
}

// 問題統計
export function getQuestionStats() {
  return {
    total: allQuestions.length,
    part5: part5Questions.length,
    part6: part6Questions.length,
    part7: part7Questions.length,
  };
}

// 難易度ラベル
export function getDifficultyLabel(difficulty: Difficulty): string {
  switch (difficulty) {
    case "easy":
      return "基礎";
    case "medium":
      return "標準";
    case "hard":
      return "応用";
  }
}

// Part ラベル
export function getPartLabel(part: Part): string {
  switch (part) {
    case "part5":
      return "Part 5";
    case "part6":
      return "Part 6";
    case "part7":
      return "Part 7";
  }
}

// Part 説明
export function getPartDescription(part: Part): string {
  switch (part) {
    case "part5":
      return "短文穴埋め";
    case "part6":
      return "長文穴埋め";
    case "part7":
      return "読解問題";
  }
}
