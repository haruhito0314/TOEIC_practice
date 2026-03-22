import type { Part5Question, Difficulty } from "@/types/quiz";

type ChoiceId = "A" | "B" | "C" | "D";

type BuiltQuestion = {
  sentence: string;
  choices: { id: ChoiceId; text: string }[];
  correctAnswer: ChoiceId;
  explanation: string;
  explanationJa: string;
};

type Template = {
  difficulty: Difficulty;
  category: string;
  tags: string[];
  build: (variant: number) => BuiltQuestion;
};

const nouns = [
  "proposal",
  "contract",
  "invoice",
  "shipment",
  "presentation",
  "report",
  "budget plan",
  "maintenance schedule",
  "policy update",
  "procurement request",
  "training outline",
  "quality checklist",
  "audit summary",
  "service agreement",
  "design draft",
  "market analysis",
  "expense statement",
  "project timeline",
  "purchase order",
  "launch memo",
  "client brief",
  "staff roster",
  "inspection report",
  "delivery note",
  "risk assessment",
  "meeting agenda",
  "renewal notice",
  "vendor profile",
  "safety guide",
  "annual forecast",
];

const teams = [
  "finance team",
  "legal team",
  "operations team",
  "sales division",
  "HR department",
  "procurement unit",
  "compliance office",
  "marketing group",
  "customer support team",
  "logistics department",
  "product planning team",
  "quality assurance unit",
  "regional office",
  "engineering team",
  "administration office",
  "training department",
  "data analytics group",
  "corporate strategy team",
  "facility management team",
  "business development unit",
  "supplier relations team",
  "internal audit office",
  "store operations team",
  "account management team",
  "brand communications team",
  "service improvement team",
  "planning division",
  "IT support team",
  "risk management team",
  "executive office",
];

const verbs = [
  "submit",
  "review",
  "finalize",
  "approve",
  "prepare",
  "update",
  "deliver",
  "confirm",
  "schedule",
  "publish",
  "process",
  "organize",
  "distribute",
  "monitor",
  "adjust",
  "analyze",
  "document",
  "archive",
  "coordinate",
  "verify",
  "reconcile",
  "negotiate",
  "compile",
  "renew",
  "dispatch",
  "assess",
  "streamline",
  "validate",
  "implement",
  "standardize",
];

const deadlines = [
  "by noon",
  "by 3:00 p.m.",
  "by the end of today",
  "before Friday",
  "before the weekly review",
  "by next Monday",
  "before the client call",
  "by close of business",
  "before month-end",
  "by tomorrow morning",
];

function pick<T>(arr: T[], i: number): T {
  return arr[i % arr.length];
}

function thirdPerson(verb: string): string {
  if (verb.endsWith("y") && !/[aeiou]y$/.test(verb)) {
    return `${verb.slice(0, -1)}ies`;
  }
  if (/(s|sh|ch|x|z|o)$/.test(verb)) {
    return `${verb}es`;
  }
  return `${verb}s`;
}

function pastParticiple(verb: string): string {
  const irregular: Record<string, string> = {
    submit: "submitted",
    ship: "shipped",
  };
  if (irregular[verb]) return irregular[verb];
  if (verb.endsWith("e")) return `${verb}d`;
  if (verb.endsWith("y") && !/[aeiou]y$/.test(verb)) {
    return `${verb.slice(0, -1)}ied`;
  }
  return `${verb}ed`;
}

function gerund(verb: string): string {
  if (verb.endsWith("e") && !verb.endsWith("ee")) {
    return `${verb.slice(0, -1)}ing`;
  }
  return `${verb}ing`;
}

const templates: Template[] = [
  {
    difficulty: "easy",
    category: "品詞問題",
    tags: ["代名詞", "所有格", "基本"],
    build: (v) => {
      const noun = pick(nouns, v);
      return {
        sentence: `All applicants must upload _____ ${noun} before the screening deadline.`,
        choices: [
          { id: "A", text: "they" },
          { id: "B", text: "their" },
          { id: "C", text: "them" },
          { id: "D", text: "theirs" },
        ],
        correctAnswer: "B",
        explanation: "A possessive determiner is required before a noun.",
        explanationJa: "名詞の前には所有限定詞が必要なので their が正解です。",
      };
    },
  },
  {
    difficulty: "medium",
    category: "時制",
    tags: ["現在形", "従属節", "実務"],
    build: (v) => {
      const team = pick(teams, v);
      const verb = pick(verbs, v + 2);
      const verb3 = thirdPerson(verb);
      const verbEd = pastParticiple(verb);
      const verbIng = gerund(verb);
      return {
        sentence: `The director will make the final decision once the ${team} _____ the supporting data.`,
        choices: [
          { id: "A", text: verb },
          { id: "B", text: verb3 },
          { id: "C", text: verbEd },
          { id: "D", text: `is ${verbIng}` },
        ],
        correctAnswer: "B",
        explanation: "In time clauses with 'once', present simple is used for future reference.",
        explanationJa: "once 節では未来内容でも現在形を使うため、三単現の形が正解です。",
      };
    },
  },
  {
    difficulty: "hard",
    category: "語法問題",
    tags: ["倒置", "上級", "文構造"],
    build: (v) => {
      const noun = pick(nouns, v + 3);
      return {
        sentence: `Rarely _____ such a detailed ${noun} submitted before the deadline.`,
        choices: [
          { id: "A", text: "we have" },
          { id: "B", text: "have we" },
          { id: "C", text: "we do" },
          { id: "D", text: "did we have" },
        ],
        correctAnswer: "B",
        explanation: "Negative adverbials at the beginning require inversion.",
        explanationJa: "Rarely などの否定的副詞句が文頭に来ると倒置が必要で have we が正解です。",
      };
    },
  },
  {
    difficulty: "medium",
    category: "前置詞",
    tags: ["コロケーション", "語法", "頻出"],
    build: (v) => {
      const noun = pick(nouns, v + 5);
      return {
        sentence: `Please complete the ${noun} _____ accordance with the updated guidelines.`,
        choices: [
          { id: "A", text: "in" },
          { id: "B", text: "at" },
          { id: "C", text: "on" },
          { id: "D", text: "to" },
        ],
        correctAnswer: "A",
        explanation: "The fixed expression is 'in accordance with'.",
        explanationJa: "定型句 in accordance with が正解です。",
      };
    },
  },
  {
    difficulty: "easy",
    category: "不定詞",
    tags: ["動詞構文", "基本", "TOEIC頻出"],
    build: (v) => {
      const verb = pick(verbs, v + 7);
      const verbIng = gerund(verb);
      const verbEd = pastParticiple(verb);
      return {
        sentence: `The committee decided _____ the process this quarter.`,
        choices: [
          { id: "A", text: verb },
          { id: "B", text: `to ${verb}` },
          { id: "C", text: verbIng },
          { id: "D", text: verbEd },
        ],
        correctAnswer: "B",
        explanation: "'Decide' is followed by a to-infinitive.",
        explanationJa: "decide は to 不定詞を取るため to + 動詞原形が正解です。",
      };
    },
  },
  {
    difficulty: "medium",
    category: "比較",
    tags: ["比較級", "数値", "分析"],
    build: (v) => {
      const noun = pick(["higher", "lower", "stronger", "faster", "better"], v);
      return {
        sentence: `This quarter's retention rate is significantly _____ than last quarter's.`,
        choices: [
          { id: "A", text: "high" },
          { id: "B", text: noun },
          { id: "C", text: "highest" },
          { id: "D", text: "highly" },
        ],
        correctAnswer: "B",
        explanation: "Comparative form is required before 'than'.",
        explanationJa: "than があるため比較級が必要です。",
      };
    },
  },
  {
    difficulty: "hard",
    category: "仮定法",
    tags: ["仮定法過去完了", "上級", "論理"],
    build: (v) => {
      const verb = pick(["arrive", "ship", "approve", "complete", "submit"], v);
      const verbEd = pastParticiple(verb);
      return {
        sentence: `If the documents _____ earlier, we would already have finalized the agreement.`,
        choices: [
          { id: "A", text: verb },
          { id: "B", text: verbEd },
          { id: "C", text: `had ${verbEd}` },
          { id: "D", text: `have ${verbEd}` },
        ],
        correctAnswer: "C",
        explanation: "Past unreal condition requires 'if + had + past participle'.",
        explanationJa: "過去の反実仮想は if + had + 過去分詞 を使うため C が正解です。",
      };
    },
  },
  {
    difficulty: "medium",
    category: "関係代名詞",
    tags: ["whose", "修飾", "文構造"],
    build: (v) => {
      const noun = pick(nouns, v + 11);
      return {
        sentence: `The consultant, _____ ${noun} was praised by the client, has joined our project team.`,
        choices: [
          { id: "A", text: "who" },
          { id: "B", text: "whom" },
          { id: "C", text: "whose" },
          { id: "D", text: "which" },
        ],
        correctAnswer: "C",
        explanation: "A possessive relative pronoun is needed before the noun.",
        explanationJa: "後ろの名詞を所有でつなぐ関係代名詞 whose が必要です。",
      };
    },
  },
  {
    difficulty: "easy",
    category: "受動態",
    tags: ["受動態", "承認", "基本"],
    build: (v) => {
      const noun = pick(nouns, v + 13);
      return {
        sentence: `All ${noun}s must be _____ by a supervisor before submission.`,
        choices: [
          { id: "A", text: "approve" },
          { id: "B", text: "approving" },
          { id: "C", text: "approved" },
          { id: "D", text: "approval" },
        ],
        correctAnswer: "C",
        explanation: "After 'must be', past participle is required for passive voice.",
        explanationJa: "must be の後は受動態になるため過去分詞 approved が正解です。",
      };
    },
  },
  {
    difficulty: "medium",
    category: "前置詞",
    tags: ["締切", "by", "頻出"],
    build: (v) => {
      const deadline = pick(deadlines, v);
      return {
        sentence: `Please send the signed file _____ ${deadline.replace(/^by\s*/, "")}.`,
        choices: [
          { id: "A", text: "by" },
          { id: "B", text: "until" },
          { id: "C", text: "during" },
          { id: "D", text: "among" },
        ],
        correctAnswer: "A",
        explanation: "'By' expresses a deadline (not later than).",
        explanationJa: "締切時刻を示すときは by が正解です。",
      };
    },
  },
  {
    difficulty: "hard",
    category: "主語動詞一致",
    tags: ["neither nor", "一致", "上級"],
    build: (v) => {
      const teamA = pick(teams, v);
      const pluralNoun = pick(["assistants", "analysts", "managers", "engineers", "auditors"], v + 1);
      return {
        sentence: `Neither the ${teamA} leader nor the junior ${pluralNoun} _____ available this afternoon.`,
        choices: [
          { id: "A", text: "is" },
          { id: "B", text: "are" },
          { id: "C", text: "was" },
          { id: "D", text: "be" },
        ],
        correctAnswer: "B",
        explanation: "With 'neither ... nor', the verb agrees with the nearest subject (plural).",
        explanationJa: "neither ... nor は近接一致なので直後の複数主語に合わせて are が正解です。",
      };
    },
  },
  {
    difficulty: "medium",
    category: "動名詞",
    tags: ["look forward to", "定型表現", "頻出"],
    build: (v) => {
      const verb = pick(["work", "collaborate", "assist", "support", "partner"], v);
      const verbIng = gerund(verb);
      const verbEd = pastParticiple(verb);
      return {
        sentence: `We look forward to _____ with your team on the upcoming project.`,
        choices: [
          { id: "A", text: verb },
          { id: "B", text: `to ${verb}` },
          { id: "C", text: verbIng },
          { id: "D", text: verbEd },
        ],
        correctAnswer: "C",
        explanation: "The expression is 'look forward to + gerund'.",
        explanationJa: "look forward to の後は動名詞なので -ing 形が正解です。",
      };
    },
  },
  {
    difficulty: "easy",
    category: "語彙問題",
    tags: ["コロケーション", "notify", "基本"],
    build: (v) => {
      const noun = pick(["schedule", "change", "result", "decision", "delay"], v);
      return {
        sentence: `Please _____ all attendees of the ${noun} by email.`,
        choices: [
          { id: "A", text: "notify" },
          { id: "B", text: "note" },
          { id: "C", text: "notice" },
          { id: "D", text: "announce" },
        ],
        correctAnswer: "A",
        explanation: "The pattern is 'notify someone of something'.",
        explanationJa: "notify A of B の語法に合うのは notify です。",
      };
    },
  },
  {
    difficulty: "medium",
    category: "接続詞・前置詞",
    tags: ["despite", "文構造", "頻出"],
    build: (v) => {
      const noun = pick(["the limited budget", "the short timeline", "the heavy workload", "the weather conditions", "the staffing shortage"], v);
      return {
        sentence: `_____ ${noun}, the team delivered the project on time.`,
        choices: [
          { id: "A", text: "Although" },
          { id: "B", text: "Because" },
          { id: "C", text: "Despite" },
          { id: "D", text: "Unless" },
        ],
        correctAnswer: "C",
        explanation: "A noun phrase follows 'despite'.",
        explanationJa: "後ろが名詞句なので despite が正解です。",
      };
    },
  },
  {
    difficulty: "hard",
    category: "that節",
    tags: ["語法", "保証", "上級"],
    build: (v) => {
      const noun = pick(["products", "materials", "components", "documents", "records"], v);
      return {
        sentence: `The supplier guaranteed _____ all ${noun} would meet the updated standards.`,
        choices: [
          { id: "A", text: "that" },
          { id: "B", text: "what" },
          { id: "C", text: "which" },
          { id: "D", text: "whose" },
        ],
        correctAnswer: "A",
        explanation: "'Guarantee that + clause' is the correct structure.",
        explanationJa: "guarantee that 節の形が正しいため that が正解です。",
      };
    },
  },
  {
    difficulty: "medium",
    category: "未来完了",
    tags: ["by the time", "時制", "上級"],
    build: (v) => {
      const verb = pick(["prepare", "compile", "review", "organize", "complete"], v);
      const verbEd = pastParticiple(verb);
      return {
        sentence: `By the time the inspection begins, the team _____ all required documents.`,
        choices: [
          { id: "A", text: verb },
          { id: "B", text: verbEd },
          { id: "C", text: `will ${verb}` },
          { id: "D", text: `will have ${verbEd}` },
        ],
        correctAnswer: "D",
        explanation: "Future perfect expresses completion before a future reference point.",
        explanationJa: "未来の時点までの完了を表すため未来完了が正解です。",
      };
    },
  },
  {
    difficulty: "easy",
    category: "品詞問題",
    tags: ["名詞", "並列", "基本"],
    build: (v) => {
      const second = pick(["efficiency", "accuracy", "consistency", "productivity", "transparency"], v);
      return {
        sentence: `The new policy aims to improve workplace safety and _____.`,
        choices: [
          { id: "A", text: "efficient" },
          { id: "B", text: `${second}ly` },
          { id: "C", text: second },
          { id: "D", text: "efficiently" },
        ],
        correctAnswer: "C",
        explanation: "A noun parallel to 'safety' is needed.",
        explanationJa: "safety と並列になる名詞が必要なので C が正解です。",
      };
    },
  },
  {
    difficulty: "medium",
    category: "語彙問題",
    tags: ["副詞", "文脈", "中級"],
    build: (v) => {
      return {
        sentence: `The process was adjusted _____ to reflect client feedback from the pilot phase.`,
        choices: [
          { id: "A", text: "accord" },
          { id: "B", text: "according" },
          { id: "C", text: "accordingly" },
          { id: "D", text: "accorded" },
        ],
        correctAnswer: "C",
        explanation: "'Accordingly' is an adverb meaning in a corresponding way.",
        explanationJa: "文全体を修飾する副詞 accordingly が正解です。",
      };
    },
  },
  {
    difficulty: "hard",
    category: "関係詞",
    tags: ["whom", "前置詞目的語", "上級"],
    build: (v) => {
      const noun = pick(["proposal", "draft", "estimate", "contract", "report"], v);
      return {
        sentence: `The clients to _____ the revised ${noun} was sent have already responded.`,
        choices: [
          { id: "A", text: "who" },
          { id: "B", text: "whom" },
          { id: "C", text: "whose" },
          { id: "D", text: "which" },
        ],
        correctAnswer: "B",
        explanation: "After a preposition referring to people, 'whom' is used in formal writing.",
        explanationJa: "前置詞 to の目的語で人を指すため whom が正解です。",
      };
    },
  },
  {
    difficulty: "medium",
    category: "接続詞",
    tags: ["not until", "時制", "中上級"],
    build: (v) => {
      return {
        sentence: `The product will not be released _____ it has passed all required safety tests.`,
        choices: [
          { id: "A", text: "until" },
          { id: "B", text: "while" },
          { id: "C", text: "since" },
          { id: "D", text: "during" },
        ],
        correctAnswer: "A",
        explanation: "'Not ... until' expresses a condition that must be met before an action happens.",
        explanationJa: "not ... until（〜するまで...しない）の形なので until が正解です。",
      };
    },
  },
];

const TOTAL_PART5_QUESTIONS = 600;

export const part5Questions: Part5Question[] = Array.from(
  { length: TOTAL_PART5_QUESTIONS },
  (_, index): Part5Question => {
    const template = templates[index % templates.length];
    const variant = Math.floor(index / templates.length);
    const built = template.build(variant);
    return {
      id: `p5-gen-${String(index + 1).padStart(3, "0")}`,
      part: "part5",
      difficulty: template.difficulty,
      category: template.category,
      sentence: built.sentence,
      choices: built.choices,
      correctAnswer: built.correctAnswer,
      explanation: built.explanation,
      explanationJa: built.explanationJa,
      tags: template.tags,
    };
  }
);
