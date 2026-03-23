import type { Difficulty, Part7Passage } from "@/types/quiz";

type ChoiceId = "A" | "B" | "C" | "D";

type QuestionDraft = {
  difficulty: Difficulty;
  questionText: string;
  choices: { id: ChoiceId; text: string }[];
  correctAnswer: ChoiceId;
  explanation: string;
  explanationJa: string;
  tags: string[];
};

function optionSet(a: string, b: string, c: string, d: string) {
  return [
    { id: "A" as ChoiceId, text: a },
    { id: "B" as ChoiceId, text: b },
    { id: "C" as ChoiceId, text: c },
    { id: "D" as ChoiceId, text: d },
  ];
}

const companies = [
  "NorthPeak Solutions",
  "BlueHarbor Retail",
  "Summit Logic",
  "Metroline Foods",
  "Everfield Energy",
  "Creston Mobility",
  "Oakridge Systems",
  "Brightwave Media",
  "Silverline Travel",
  "Horizon Devices",
  "Greenport Logistics",
  "Valence Health",
];

const departments = [
  "procurement",
  "operations",
  "customer support",
  "marketing",
  "training",
  "compliance",
  "finance",
  "logistics",
  "sales",
  "IT",
  "facilities",
  "quality assurance",
];

const documentTopics = [
  "vendor onboarding",
  "service outage notification",
  "staff training session",
  "product launch briefing",
  "reimbursement procedure",
  "delivery schedule update",
  "system migration checklist",
  "client meeting arrangement",
  "subscription renewal notice",
  "office relocation guide",
  "inventory audit plan",
  "security policy reminder",
];

const roleTitles = [
  "operations coordinator",
  "procurement analyst",
  "regional manager",
  "training supervisor",
  "customer success lead",
  "finance specialist",
  "IT administrator",
  "project scheduler",
  "account representative",
  "facility planner",
];

function pick<T>(arr: T[], i: number): T {
  return arr[i % arr.length];
}

function diff5(i: number): [Difficulty, Difficulty, Difficulty, Difficulty, Difficulty] {
  const patterns: [Difficulty, Difficulty, Difficulty, Difficulty, Difficulty][] = [
    ["easy", "medium", "medium", "hard", "hard"],
    ["easy", "medium", "hard", "medium", "hard"],
    ["medium", "easy", "medium", "hard", "hard"],
    ["easy", "medium", "medium", "hard", "medium"],
  ];
  return patterns[i % patterns.length];
}

let questionGlobalIndex = 1;

function makeQuestions(passageId: string, drafts: QuestionDraft[]) {
  return drafts.map((d, idx) => {
    const q = {
      id: `p7-gen-q-${String(questionGlobalIndex).padStart(4, "0")}`,
      part: "part7" as const,
      passageId,
      questionNumber: idx + 1,
      difficulty: d.difficulty,
      questionText: d.questionText,
      choices: d.choices,
      correctAnswer: d.correctAnswer,
      explanation: d.explanation,
      explanationJa: d.explanationJa,
      tags: d.tags,
    };
    questionGlobalIndex += 1;
    return q;
  });
}

function buildSingle(index: number): Part7Passage {
  const company = pick(companies, index);
  const dept = pick(departments, index + 3);
  const topic = pick(documentTopics, index + 5);
  const role = pick(roleTitles, index + 2);
  const date = `${(index % 12) + 1}/${(index % 27) + 1}`;
  const docType: Part7Passage["documentType"] =
    (index % 5 === 0 ? "email" : index % 5 === 1 ? "notice" : index % 5 === 2 ? "article" : index % 5 === 3 ? "memo" : "advertisement");

  const pId = `p7-gen-single-${String(index + 1).padStart(3, "0")}`;
  const insertionSentence =
    "For urgent cases, managers may request same-day support through the internal hotline.";
  const hasInsertion = index % 3 === 0;

  const content = `${company} ${docType === "email" ? "Email" : docType === "notice" ? "Notice" : docType === "article" ? "Update" : docType === "memo" ? "Memo" : "Announcement"}\n\nDate: ${date}\nFrom: ${role}\nDepartment: ${dept}\nSubject: ${topic}\n\n[1] This notice summarizes the latest ${topic} process and clarifies how each team should respond. [2] Employees are asked to review the updated instructions before the next weekly meeting. [3] The change was introduced after several teams reported delays caused by inconsistent handoffs. [4] Implementation progress will be monitored through the shared dashboard.\n\nTo complete the process, staff should submit required records by 3:00 p.m. each Friday and confirm updates in the system. Teams that follow this workflow are expected to reduce follow-up requests and improve response time.`;

  const [d1, d2, d3, d4, d5] = diff5(index);
  const q4 = hasInsertion
    ? {
        difficulty: d4,
        questionText:
          "In which position [1], [2], [3], or [4] should the following sentence be inserted?\n\"For urgent cases, managers may request same-day support through the internal hotline.\"",
        choices: optionSet("[1]", "[2]", "[3]", "[4]"),
        correctAnswer: "D" as ChoiceId,
        explanation:
          "The sentence naturally follows the process explanation and adds an exception before final monitoring details.",
        explanationJa:
          "手順説明の後に例外対応を補足する位置が最も自然なので [4] が正解です。",
        tags: ["一文挿入", "段落構成", "Part7"],
      }
    : {
        difficulty: d4,
        questionText: "Which of the following is NOT mentioned in the document?",
        choices: optionSet(
          "A weekly submission deadline",
          "A shared dashboard for tracking",
          "A required in-person training exam",
          "A reason for introducing the change"
        ),
        correctAnswer: "C" as ChoiceId,
        explanation: "The document mentions deadlines, tracking, and background, but not a required exam.",
        explanationJa: "締切・追跡方法・導入理由は書かれていますが、必須試験は記載されていません。",
        tags: ["NOT問題", "情報検索", "Part7"],
      };

  return {
    id: pId,
    part: "part7",
    title: `${topic} Update (${company})`,
    passageType: "single",
    documentType: docType,
    texts: [{ id: `${pId}-text1`, label: "Document", content }],
    questions: makeQuestions(pId, [
      {
        difficulty: d1,
        questionText: "What is the main purpose of this document?",
        choices: optionSet(
          "To announce a company merger",
          `To explain an updated procedure related to ${topic}`,
          "To recruit external contractors",
          "To provide quarterly sales rankings"
        ),
        correctAnswer: "B",
        explanation: "The first paragraph states the document explains a revised process.",
        explanationJa: "本文冒頭で、更新された手順の説明が目的だと示されています。",
        tags: ["主旨", "Part7"],
      },
      {
        difficulty: d2,
        questionText: "According to the document, when should records be submitted?",
        choices: optionSet("By noon each Monday", "By 3:00 p.m. each Friday", "Within 24 hours", "At month-end only"),
        correctAnswer: "B",
        explanation: "The final paragraph gives the specific Friday 3:00 p.m. deadline.",
        explanationJa: "最終段落に金曜3:00 p.m.までと明記されています。",
        tags: ["詳細", "期限", "Part7"],
      },
      {
        difficulty: d3,
        questionText: "In the document, the word \"clarifies\" is closest in meaning to:",
        choices: optionSet("simplifies", "explains", "modifies", "delays"),
        correctAnswer: "B",
        explanation: "In context, 'clarifies' means to make something clear or explain it.",
        explanationJa: "文脈上 clarifies は『明確に説明する』の意味なので explains が最も近いです。",
        tags: ["語彙問題", "文脈語彙", "Part7"],
      },
      q4,
      {
        difficulty: d5,
        questionText: "What is most likely to happen next if teams follow the new workflow?",
        choices: optionSet(
          "More repeated follow-up requests",
          "Slower overall response times",
          "Fewer delays and smoother handoffs",
          "Immediate removal of all monitoring"
        ),
        correctAnswer: "C",
        explanation: "The document predicts better response time and reduced follow-up issues.",
        explanationJa: "新フローにより遅延減少と対応速度向上が見込まれるため C が正解です。",
        tags: ["推論", "次の展開", "Part7"],
      },
    ]),
  };
}

function buildDouble(index: number): Part7Passage {
  const company = pick(companies, index + 2);
  const topic = pick(documentTopics, index + 4);
  const role = pick(roleTitles, index + 6);
  const dept = pick(departments, index + 1);
  const pId = `p7-gen-double-${String(index + 1).padStart(3, "0")}`;
  const [d1, d2, d3, d4, d5] = diff5(index + 10);

  const text1 = `Email Inquiry\nFrom: ${role}\nTo: vendor.support@partnerhub.com\n\nHello,\n\nOur ${dept} team is preparing for ${topic} next month. We need confirmation on lead time, documentation format, and whether partial delivery is available.\n\nPlease also let us know if expedited handling can be arranged when requests are submitted after 2:00 p.m.\n\nThank you.`;

  const text2 = `${company} Reply\n\nThank you for your message. Standard processing requires two business days after complete documentation is received. Partial delivery is available for orders above 50 units.\n\nRequests submitted after 2:00 p.m. are reviewed the next business day. Expedited handling is possible for urgent cases, but an additional service fee applies.\n\nA detailed checklist is attached for your review.`;

  return {
    id: pId,
    part: "part7",
    title: `Double Passage: ${topic} Coordination`,
    passageType: "double",
    documentType: "email",
    texts: [
      { id: `${pId}-text1`, label: "Email 1", content: text1 },
      { id: `${pId}-text2`, label: "Email 2", content: text2 },
    ],
    questions: makeQuestions(pId, [
      {
        difficulty: d1,
        questionText: "What information does the sender request in the first email?",
        choices: optionSet(
          "Salary ranges and interview slots",
          "Lead time, documentation format, and delivery options",
          "Office relocation dates",
          "Marketing campaign budget"
        ),
        correctAnswer: "B",
        explanation: "The first email asks about lead time, docs, and partial delivery.",
        explanationJa: "1通目では納期・書類形式・分納可否を確認しています。",
        tags: ["詳細", "Part7", "double"],
      },
      {
        difficulty: d2,
        questionText: "According to the reply, when do requests submitted after 2:00 p.m. get reviewed?",
        choices: optionSet("The same day", "Within one hour", "The next business day", "After one week"),
        correctAnswer: "C",
        explanation: "The reply explicitly states next business day review.",
        explanationJa: "2:00 p.m.以降の依頼は翌営業日レビューと明記されています。",
        tags: ["詳細", "時間", "Part7"],
      },
      {
        difficulty: d3,
        questionText: "Which condition is required for partial delivery?",
        choices: optionSet("Orders above 50 units", "Payment by cash", "Domestic destinations only", "Submission before noon"),
        correctAnswer: "A",
        explanation: "The reply says partial delivery is available for orders above 50 units.",
        explanationJa: "分納は50ユニット超の注文が条件とされています。",
        tags: ["照合", "条件", "Part7"],
      },
      {
        difficulty: d4,
        questionText: "What is suggested about expedited handling?",
        choices: optionSet(
          "It is never available.",
          "It is free for all requests.",
          "It is available but may involve extra cost.",
          "It is only for partial delivery orders."
        ),
        correctAnswer: "C",
        explanation: "The reply mentions expedited handling and an additional fee.",
        explanationJa: "迅速対応は可能だが追加料金があると示されているため C が正解です。",
        tags: ["推論", "費用", "Part7"],
      },
      {
        difficulty: d5,
        questionText: "Who most likely wrote the first email?",
        choices: optionSet("A supplier's legal advisor", "A team member coordinating an upcoming operational request", "A customer requesting a refund", "A journalist preparing an article"),
        correctAnswer: "B",
        explanation: "The sender is coordinating logistics and requirements for an upcoming process.",
        explanationJa: "業務準備に必要な条件確認をしているため、調整担当者と考えるのが自然です。",
        tags: ["人物推定", "推論", "Part7"],
      },
    ]),
  };
}

function buildTriple(index: number): Part7Passage {
  const company = pick(companies, index + 7);
  const topic = pick(documentTopics, index + 8);
  const dept = pick(departments, index + 2);
  const pId = `p7-gen-triple-${String(index + 1).padStart(3, "0")}`;
  const [d1, d2, d3, d4, d5] = diff5(index + 20);

  const text1 = `${company} Public Notice\n\nA process change related to ${topic} will take effect next month. Teams should review the updated checklist and stop using the previous template immediately.`;
  const text2 = `Internal Store Memo\n\nTo: ${dept} Supervisors\nPlease remove old forms from shared folders today. New forms must be used for all submissions created after the 15th.`;
  const text3 = `Support Portal Guide\n\nSteps:\n1) Select the updated template version.\n2) Enter request ID and completion date.\n3) Upload required evidence file.\nRequests submitted by the 20th receive priority review within three business days.`;

  return {
    id: pId,
    part: "part7",
    title: `Triple Passage: ${topic} Transition`,
    passageType: "triple",
    documentType: "notice",
    texts: [
      { id: `${pId}-text1`, label: "Notice", content: text1 },
      { id: `${pId}-text2`, label: "Memo", content: text2 },
      { id: `${pId}-text3`, label: "Portal Guide", content: text3 },
    ],
    questions: makeQuestions(pId, [
      {
        difficulty: d1,
        questionText: "What is announced in the public notice?",
        choices: optionSet(
          "A hiring freeze",
          "A process change taking effect next month",
          "A product discontinuation",
          "A regional office closure"
        ),
        correctAnswer: "B",
        explanation: "The first passage clearly announces an upcoming process change.",
        explanationJa: "1文書目に翌月からの手順変更が告知されています。",
        tags: ["主旨", "Part7", "triple"],
      },
      {
        difficulty: d2,
        questionText: "According to the memo, what should supervisors do today?",
        choices: optionSet(
          "Archive all new requests",
          "Remove old forms from shared folders",
          "Pause all submissions",
          "Send reports to customers"
        ),
        correctAnswer: "B",
        explanation: "The memo explicitly instructs supervisors to remove old forms.",
        explanationJa: "共有フォルダから旧フォームを当日中に削除するよう指示されています。",
        tags: ["詳細", "実務", "Part7"],
      },
      {
        difficulty: d3,
        questionText: "Which step is required in the support portal?",
        choices: optionSet("Provide request ID and completion date", "Call the support center first", "Attach manager approval letter", "Choose the old template version"),
        correctAnswer: "A",
        explanation: "The guide lists request ID and completion date as required step information.",
        explanationJa: "手順2で request ID と完了日入力が必須です。",
        tags: ["詳細", "手順", "Part7"],
      },
      {
        difficulty: d4,
        questionText: "What can be inferred about requests submitted by the 20th?",
        choices: optionSet(
          "They are automatically rejected.",
          "They may receive faster review treatment.",
          "They do not need evidence files.",
          "They are transferred to external vendors."
        ),
        correctAnswer: "B",
        explanation: "The portal guide states priority review within three business days.",
        explanationJa: "20日までの申請は優先審査（3営業日以内）とあるため B が正解です。",
        tags: ["推論", "期限", "Part7"],
      },
      {
        difficulty: d5,
        questionText: "Which statement is true across all three documents?",
        choices: optionSet(
          "The previous template remains valid indefinitely.",
          "No deadlines are mentioned.",
          "The updated template should now be used.",
          "Priority review requires a service fee."
        ),
        correctAnswer: "C",
        explanation: "All three documents consistently direct users to adopt the updated template.",
        explanationJa: "3文書すべてで新テンプレートへの移行が示されているため C が正解です。",
        tags: ["文書間照合", "統合理解", "Part7"],
      },
    ]),
  };
}

const TOTAL_SINGLE = 92;
const TOTAL_DOUBLE = 57;
const TOTAL_TRIPLE = 21;

const singlePassages = Array.from({ length: TOTAL_SINGLE }, (_, i) => buildSingle(i));
const doublePassages = Array.from({ length: TOTAL_DOUBLE }, (_, i) => buildDouble(i));
const triplePassages = Array.from({ length: TOTAL_TRIPLE }, (_, i) => buildTriple(i));

export const part7Passages: Part7Passage[] = [
  ...singlePassages,
  ...doublePassages,
  ...triplePassages,
];
