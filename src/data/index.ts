// ============================================================
// TOEIC Reading Practice App — Data Index & Utilities
// ============================================================

import { part5Questions } from "./part5/questions";
import { part6Passages } from "./part6/passages";
import { part7Passages } from "./part7/passages";

import type {
  Part5Question,
  Part6Question,
  Part7Question,
  Part,
  Difficulty,
} from "@/types/quiz";

export const part6Questions: Part6Question[] = part6Passages.flatMap(
  (passage) => passage.questions
);

export const part7Questions: Part7Question[] = part7Passages.flatMap(
  (passage) => passage.questions
);

export const allQuestions = [
  ...part5Questions,
  ...part6Questions,
  ...part7Questions,
];

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

export function getQuestionById(id: string) {
  return allQuestions.find((q) => q.id === id) ?? null;
}

export function getPart6PassageById(passageId: string) {
  return part6Passages.find((p) => p.id === passageId) ?? null;
}

export function getPart7PassageById(passageId: string) {
  return part7Passages.find((p) => p.id === passageId) ?? null;
}

export function getPart6PassageByQuestionId(questionId: string) {
  return part6Passages.find((p) => p.questions.some((q) => q.id === questionId)) ?? null;
}

export function getPart7PassageByQuestionId(questionId: string) {
  return part7Passages.find((p) => p.questions.some((q) => q.id === questionId)) ?? null;
}

export function shuffleArray<T>(array: T[]): T[] {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

export function getRandomQuestions(count: number, part?: Part) {
  const pool = part ? getQuestionsByPart(part) : allQuestions;
  return shuffleArray(pool).slice(0, Math.min(count, pool.length));
}

export function getRandomQuestionsGrouped(count: number, part?: Part) {
  if (part === "part5") {
    return shuffleArray(part5Questions).slice(0, Math.min(count, part5Questions.length));
  }
  if (part === "part6") {
    const passages = shuffleArray(part6Passages);
    const result: Part6Question[] = [];
    for (const p of passages) {
      if (result.length >= count) break;
      result.push(...p.questions);
    }
    return result.slice(0, count);
  }
  if (part === "part7") {
    const passages = shuffleArray(part7Passages);
    const result: Part7Question[] = [];
    for (const p of passages) {
      if (result.length >= count) break;
      result.push(...p.questions);
    }
    return result.slice(0, count);
  }

  const p6shuffled = shuffleArray(part6Passages);
  const p7shuffled = shuffleArray(part7Passages);

  type QuestionBlock = { questions: (Part5Question | Part6Question | Part7Question)[] };
  const blocks: QuestionBlock[] = [];

  for (const p of p6shuffled) blocks.push({ questions: [...p.questions] });
  for (const p of p7shuffled) blocks.push({ questions: [...p.questions] });

  const p5shuffled = shuffleArray(part5Questions);
  for (const q of p5shuffled) blocks.push({ questions: [q] });

  const shuffledBlocks = shuffleArray(blocks);
  const result: (Part5Question | Part6Question | Part7Question)[] = [];
  for (const block of shuffledBlocks) {
    if (result.length >= count) break;
    result.push(...block.questions);
  }
  return result.slice(0, count);
}

export function getQuestionStats() {
  return {
    total: allQuestions.length,
    part5: part5Questions.length,
    part6: part6Questions.length,
    part7: part7Questions.length,
    part6Passages: part6Passages.length,
    part7Passages: part7Passages.length,
  };
}

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
