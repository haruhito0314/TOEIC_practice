import type { Difficulty, Part6Passage } from "@/types/quiz";

type ChoiceId = "A" | "B" | "C" | "D";

type Scenario = {
  title: string;
  passageType: Part6Passage["passageType"];
  audience: string;
  objective: string;
  action: string;
  benefit: string;
  location: string;
};

const scenarios: Scenario[] = [
  {
    title: "Internal Email: Project Kickoff Logistics",
    passageType: "email",
    audience: "project members",
    objective: "align tasks before kickoff",
    action: "upload task estimates",
    benefit: "faster decision-making during the first review",
    location: "the collaboration portal",
  },
  {
    title: "Memo: Vendor Evaluation Update",
    passageType: "memo",
    audience: "procurement staff",
    objective: "standardize supplier screening",
    action: "submit comparison sheets",
    benefit: "more consistent contract terms across regions",
    location: "the procurement dashboard",
  },
  {
    title: "Notice: Office Renovation Schedule",
    passageType: "notice",
    audience: "all employees",
    objective: "minimize workflow disruption during renovation",
    action: "reserve alternative meeting rooms",
    benefit: "smoother communication across departments",
    location: "the facilities reservation page",
  },
  {
    title: "Article: Customer Service Improvement Plan",
    passageType: "article",
    audience: "service team leaders",
    objective: "reduce response delays",
    action: "review weekly call logs",
    benefit: "higher customer satisfaction scores",
    location: "the service analytics system",
  },
  {
    title: "Letter: Distribution Center Procedure",
    passageType: "letter",
    audience: "warehouse supervisors",
    objective: "improve outbound accuracy",
    action: "confirm packing checklists",
    benefit: "fewer shipping errors in peak season",
    location: "the dispatch control panel",
  },
  {
    title: "Advertisement: Staff Certification Program",
    passageType: "advertisement",
    audience: "team managers",
    objective: "expand role-specific skills",
    action: "nominate participants",
    benefit: "stronger project execution capability",
    location: "the training registration page",
  },
  {
    title: "Memo: Data Security Reminder",
    passageType: "memo",
    audience: "all account holders",
    objective: "strengthen access control",
    action: "reset authentication settings",
    benefit: "lower risk of unauthorized access",
    location: "the account settings page",
  },
  {
    title: "Email: Billing Workflow Change",
    passageType: "email",
    audience: "finance coordinators",
    objective: "shorten invoice approval time",
    action: "verify purchase order numbers",
    benefit: "more predictable monthly closing",
    location: "the finance workflow tool",
  },
  {
    title: "Notice: Visitor Badge Policy",
    passageType: "notice",
    audience: "reception staff",
    objective: "improve visitor tracking",
    action: "record check-in details",
    benefit: "clearer compliance audit trails",
    location: "the visitor management app",
  },
  {
    title: "Article: Sales Reporting Best Practices",
    passageType: "article",
    audience: "regional analysts",
    objective: "increase forecast reliability",
    action: "reconcile weekly performance data",
    benefit: "more accurate quarterly planning",
    location: "the reporting workspace",
  },
  {
    title: "Letter: Equipment Maintenance Process",
    passageType: "letter",
    audience: "site engineers",
    objective: "prevent unplanned downtime",
    action: "log maintenance completion",
    benefit: "safer operations and fewer interruptions",
    location: "the maintenance tracker",
  },
  {
    title: "Email: Recruitment Timeline",
    passageType: "email",
    audience: "hiring managers",
    objective: "keep interviews on schedule",
    action: "confirm candidate availability",
    benefit: "faster hiring decisions",
    location: "the interview calendar",
  },
  {
    title: "Memo: Compliance Training Cycle",
    passageType: "memo",
    audience: "department representatives",
    objective: "maintain policy awareness",
    action: "complete assigned modules",
    benefit: "fewer procedural violations",
    location: "the learning platform",
  },
  {
    title: "Notice: Network Maintenance Window",
    passageType: "notice",
    audience: "IT users",
    objective: "stabilize internal systems",
    action: "download essential files",
    benefit: "reduced interruptions to key tasks",
    location: "the internal portal",
  },
  {
    title: "Article: Vendor Communication Standards",
    passageType: "article",
    audience: "contract owners",
    objective: "improve negotiation clarity",
    action: "document meeting outcomes",
    benefit: "fewer misunderstandings during renewal",
    location: "the vendor records hub",
  },
];

const adverbChoices = [
  ["efficiently", "efficiency", "efficient", "efficiented"],
  ["accurately", "accuracy", "accurate", "accurating"],
  ["consistently", "consistency", "consistent", "consisted"],
  ["carefully", "careful", "care", "caringly"],
  ["securely", "security", "secure", "secured"],
] as const;

const collocationChoices = [
  ["maintain", "preserve", "remain", "sustain"],
  ["submit", "admit", "permit", "emit"],
  ["review", "overview", "preview", "view"],
  ["coordinate", "decorate", "operate", "narrate"],
  ["monitor", "mentor", "motor", "measure"],
] as const;

const discourseSet = [
  {
    prompt: "_____ this update may require minor adjustments, the long-term benefits are expected to outweigh the temporary inconvenience.",
    choices: ["Although", "Because of", "Despite", "Unless"],
    answer: "A" as ChoiceId,
    explanation: "A full clause follows the blank, so 'Although' is grammatically correct.",
    explanationJa: "空欄の後ろが節なので Although が文法的に正しいです。",
  },
  {
    prompt: "The initial rollout will start next week. _____, we recommend testing critical workflows in advance.",
    choices: ["Therefore", "Meanwhile", "Otherwise", "Nevertheless"],
    answer: "A" as ChoiceId,
    explanation: "The second sentence gives a recommendation as a result of the first sentence.",
    explanationJa: "1文目を受けた結果の提案なので Therefore が最も自然です。",
  },
  {
    prompt: "The pilot team completed implementation ahead of schedule. _____, the full deployment date has been moved forward.",
    choices: ["As a result", "In contrast", "For example", "At least"],
    answer: "A" as ChoiceId,
    explanation: "The second sentence is a direct consequence of the first.",
    explanationJa: "2文目は1文目の結果を述べているため As a result が正解です。",
  },
] as const;

const insertionChoices = [
  "Please ensure all records are updated before the weekly review meeting.",
  "This adjustment is intended to reduce confusion and prevent duplicate work.",
  "Managers should inform their teams about the change as soon as possible.",
  "If you need support, the operations desk can provide additional guidance.",
] as const;

function choiceObjects(options: readonly string[]) {
  return [
    { id: "A" as ChoiceId, text: options[0] },
    { id: "B" as ChoiceId, text: options[1] },
    { id: "C" as ChoiceId, text: options[2] },
    { id: "D" as ChoiceId, text: options[3] },
  ];
}

function rotateChoices(
  choices: { id: ChoiceId; text: string }[],
  originalCorrect: ChoiceId,
  offset: number
): { choices: { id: ChoiceId; text: string }[]; correctAnswer: ChoiceId } {
  const labels: ChoiceId[] = ["A", "B", "C", "D"];
  const normalized = ((offset % 4) + 4) % 4;
  if (normalized === 0) return { choices, correctAnswer: originalCorrect };

  const rotatedTexts = choices.map((_, i) => choices[(i - normalized + 4) % 4].text);
  const newChoices = labels.map((id, i) => ({ id, text: rotatedTexts[i] }));
  const oldIndex = labels.indexOf(originalCorrect);
  const newIndex = (oldIndex + normalized) % 4;
  return { choices: newChoices, correctAnswer: labels[newIndex] };
}

function difficultyPattern(index: number): [Difficulty, Difficulty, Difficulty, Difficulty] {
  const patterns: [Difficulty, Difficulty, Difficulty, Difficulty][] = [
    ["easy", "medium", "medium", "hard"],
    ["easy", "medium", "hard", "medium"],
    ["medium", "easy", "medium", "hard"],
    ["easy", "hard", "medium", "medium"],
  ];
  return patterns[index % patterns.length];
}

const TOTAL_PART6_PASSAGES = 45;

export const part6Passages: Part6Passage[] = Array.from({ length: TOTAL_PART6_PASSAGES }, (_, i) => {
  const scenario = scenarios[i % scenarios.length];
  const pId = `p6-gen-pass-${String(i + 1).padStart(3, "0")}`;
  const [d1, d2, d3, d4] = difficultyPattern(i);
  const adverb = adverbChoices[i % adverbChoices.length];
  const colloc = collocationChoices[(i + 1) % collocationChoices.length];
  const discourse = discourseSet[i % discourseSet.length];
  const rotate1 = (i * 3 + 0) % 4;
  const rotate2 = (i * 3 + 1) % 4;
  const rotate3 = (i * 3 + 2) % 4;
  const rotate4 = (i * 3 + 3) % 4;

  const q1Id = `p6-gen-q-${String(i * 4 + 1).padStart(3, "0")}`;
  const q2Id = `p6-gen-q-${String(i * 4 + 2).padStart(3, "0")}`;
  const q3Id = `p6-gen-q-${String(i * 4 + 3).padStart(3, "0")}`;
  const q4Id = `p6-gen-q-${String(i * 4 + 4).padStart(3, "0")}`;

  const insertCorrectIndex = i % 4;
  const insertionOptionSet = [...insertionChoices];
  const correctSentence = insertionOptionSet[insertCorrectIndex];
  const q1Shuffled = rotateChoices(choiceObjects(adverb), "A", rotate1);
  const q2Shuffled = rotateChoices(choiceObjects(colloc), "A", rotate2);
  const q3Shuffled = rotateChoices(choiceObjects(discourse.choices), discourse.answer, rotate3);
  const q4Choices = choiceObjects([correctSentence, ...insertionOptionSet.filter((s) => s !== correctSentence)]);
  const q4Shuffled = rotateChoices(q4Choices, "A", rotate4);

  return {
    id: pId,
    part: "part6",
    title: scenario.title,
    passageType: scenario.passageType,
    paragraphs: [
      {
        id: `${pId}-para1`,
        questionRef: q1Id,
        text: `To support ${scenario.objective}, ${scenario.audience} are expected to ${scenario.action} and store related updates in ${scenario.location}. Teams should complete this process _____ so that weekly coordination stays on track.`,
      },
      {
        id: `${pId}-para2`,
        questionRef: q2Id,
        text: `In previous cycles, inconsistent handoffs delayed follow-up tasks. Beginning this month, coordinators will use a shared template to _____ key items before each status review.`,
      },
      {
        id: `${pId}-para3`,
        questionRef: q3Id,
        text: discourse.prompt,
      },
      {
        id: `${pId}-para4`,
        questionRef: q4Id,
        text: `_____ Overall, this process is expected to deliver ${scenario.benefit}.`,
      },
    ],
    questions: [
      {
        id: q1Id,
        part: "part6",
        passageId: pId,
        questionNumber: 131 + ((i * 4) % 24),
        difficulty: d1,
        category: "品詞問題",
        choices: q1Shuffled.choices,
        correctAnswer: q1Shuffled.correctAnswer,
        explanation: "An adverb is required to modify the process verb in context.",
        explanationJa: "文脈上、動作を修飾する副詞が必要なので A が正解です。",
        tags: ["副詞", "文法", "Part6"],
      },
      {
        id: q2Id,
        part: "part6",
        passageId: pId,
        questionNumber: 132 + ((i * 4) % 24),
        difficulty: d2,
        category: "語彙・コロケーション",
        choices: q2Shuffled.choices,
        correctAnswer: q2Shuffled.correctAnswer,
        explanation: "The business collocation in this context is 'maintain/submit/review/coordinate/monitor key items'.",
        explanationJa: "文脈に自然なビジネスコロケーションを選ぶ問題で、A が最適です。",
        tags: ["語彙", "コロケーション", "Part6"],
      },
      {
        id: q3Id,
        part: "part6",
        passageId: pId,
        questionNumber: 133 + ((i * 4) % 24),
        difficulty: d3,
        category: "接続表現",
        choices: q3Shuffled.choices,
        correctAnswer: q3Shuffled.correctAnswer,
        explanation: discourse.explanation,
        explanationJa: discourse.explanationJa,
        tags: ["談話標識", "文脈", "Part6"],
      },
      {
        id: q4Id,
        part: "part6",
        passageId: pId,
        questionNumber: 134 + ((i * 4) % 24),
        difficulty: d4,
        category: "一文挿入",
        choices: q4Shuffled.choices,
        correctAnswer: q4Shuffled.correctAnswer,
        explanation: "The inserted sentence must bridge the process description and the concluding benefit statement.",
        explanationJa: "前段の手順説明と後段の効果説明を自然につなぐ一文は A です。",
        tags: ["一文挿入", "段落構成", "Part6"],
      },
    ],
  };
});
