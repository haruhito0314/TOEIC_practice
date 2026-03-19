// ============================================================
// TOEIC Reading Practice App — Type Definitions
// Design: "Quiet Study" — Soft Minimalism × Japanese Wabi-Sabi
// Colors: Warm White (#FAFAF8) base, Sage Green (#6B9E7A) accent
// ============================================================

export type Part = "part5" | "part6" | "part7";

export type Difficulty = "easy" | "medium" | "hard";

export interface Choice {
  id: "A" | "B" | "C" | "D";
  text: string;
}

// Part 5: 短文穴埋め
export interface Part5Question {
  id: string;
  part: "part5";
  difficulty: Difficulty;
  category: string; // 品詞問題, 語彙問題, 文法問題 etc.
  sentence: string; // 穴埋め文 (_____ で穴を表す)
  choices: Choice[];
  correctAnswer: "A" | "B" | "C" | "D";
  explanation: string;
  explanationJa: string;
  tags: string[];
}

// Part 6: 長文穴埋め (1パッセージに複数問)
export interface Part6Passage {
  id: string;
  part: "part6";
  title: string;
  passageType: "email" | "letter" | "notice" | "article" | "memo" | "advertisement";
  paragraphs: Part6Paragraph[];
  questions: Part6Question[];
}

export interface Part6Paragraph {
  id: string;
  text: string; // _____ で穴を表す (問題番号付き)
  questionRef?: string; // 対応する問題ID
}

export interface Part6Question {
  id: string;
  part: "part6";
  passageId: string;
  questionNumber: number;
  difficulty: Difficulty;
  category: string;
  choices: Choice[];
  correctAnswer: "A" | "B" | "C" | "D";
  explanation: string;
  explanationJa: string;
  tags: string[];
}

// Part 7: 読解問題
export interface Part7Passage {
  id: string;
  part: "part7";
  title: string;
  passageType: "single" | "double" | "triple";
  documentType: "email" | "advertisement" | "article" | "notice" | "form" | "schedule" | "memo";
  texts: Part7Text[];
  questions: Part7Question[];
}

export interface Part7Text {
  id: string;
  label?: string; // "Email 1", "Article" etc.
  content: string;
}

export interface Part7Question {
  id: string;
  part: "part7";
  passageId: string;
  questionNumber: number;
  difficulty: Difficulty;
  questionText: string;
  choices: Choice[];
  correctAnswer: "A" | "B" | "C" | "D";
  explanation: string;
  explanationJa: string;
  tags: string[];
}

// 統合型 (出題用)
export type Question = Part5Question | Part6Question | Part7Question;
export type Passage = Part6Passage | Part7Passage;

// セッション中の回答記録
export interface AnswerRecord {
  questionId: string;
  part: Part;
  selectedAnswer: "A" | "B" | "C" | "D" | null;
  correctAnswer: "A" | "B" | "C" | "D";
  isCorrect: boolean;
  timeSpentSeconds: number;
  timestamp: number;
}

// 学習セッション
export interface StudySession {
  id: string;
  mode: StudyMode;
  part: Part | "all";
  startTime: number;
  endTime?: number;
  answers: AnswerRecord[];
  totalQuestions: number;
}

export type StudyMode = "random10" | "part" | "review" | "timeattack";

// 学習記録 (LocalStorage保存)
export interface StudyRecord {
  sessions: StudySession[];
  bookmarks: string[]; // question IDs
  wrongQuestions: string[]; // question IDs
  streakDays: number;
  lastStudyDate: string; // YYYY-MM-DD
  totalStudySeconds: number;
}

// 問題の統計
export interface QuestionStats {
  questionId: string;
  attemptCount: number;
  correctCount: number;
  lastAttempted: number;
}

// 学習モードの設定
export interface SessionConfig {
  mode: StudyMode;
  part: Part | "all";
  questionCount: number;
  timeLimit?: number; // 秒 (タイムアタック用)
}
