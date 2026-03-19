// ============================================================
// TOEIC Part 7 — 読解問題データ (2パッセージ × 各3-4問)
// ============================================================
import type { Part7Passage } from "@/types/quiz";

export const part7Passages: Part7Passage[] = [
  {
    id: "p7-passage-001",
    part: "part7",
    title: "Job Advertisement",
    passageType: "single",
    documentType: "advertisement",
    texts: [
      {
        id: "p7-t001",
        content: `MARKETING COORDINATOR — FULL TIME
Nexus Digital Solutions | Tokyo, Japan

About the Role:
Nexus Digital Solutions is seeking a motivated Marketing Coordinator to join our growing team. The successful candidate will support our marketing department in executing campaigns across multiple channels.

Key Responsibilities:
• Assist in planning and executing digital marketing campaigns
• Manage social media accounts and create engaging content
• Analyze campaign performance and prepare monthly reports
• Coordinate with external vendors and creative agencies
• Support the organization of company events and trade shows

Requirements:
• Bachelor's degree in Marketing, Communications, or related field
• 2+ years of experience in marketing or related role
• Proficiency in Microsoft Office Suite and Google Analytics
• Strong written and verbal communication skills in English and Japanese
• Experience with social media management tools preferred

Compensation & Benefits:
• Competitive salary: ¥4,500,000 – ¥5,500,000 per year
• Full health and dental insurance
• 20 days paid vacation per year
• Professional development budget of ¥100,000 annually
• Flexible working hours with remote work options (up to 2 days/week)

How to Apply:
Please send your resume and cover letter to careers@nexusdigital.co.jp by April 30th. Only shortlisted candidates will be contacted for an interview.

Nexus Digital Solutions is an equal opportunity employer.`,
      },
    ],
    questions: [
      {
        id: "p7-q001",
        part: "part7",
        passageId: "p7-passage-001",
        questionNumber: 147,
        difficulty: "easy",
        questionText: "What is the primary purpose of this advertisement?",
        choices: [
          { id: "A", text: "To announce a company merger" },
          { id: "B", text: "To recruit a marketing professional" },
          { id: "C", text: "To promote a new product" },
          { id: "D", text: "To inform customers of a policy change" },
        ],
        correctAnswer: "B",
        explanation: "The advertisement is a job posting for a Marketing Coordinator position at Nexus Digital Solutions. Its primary purpose is to recruit a qualified marketing professional.",
        explanationJa: "この広告はNexus Digital Solutionsのマーケティングコーディネーターの求人広告です。主な目的はマーケティング専門家の採用です。",
        tags: ["主旨・目的", "読解", "求人広告"],
      },
      {
        id: "p7-q002",
        part: "part7",
        passageId: "p7-passage-001",
        questionNumber: 148,
        difficulty: "medium",
        questionText: "What is NOT listed as a requirement for the position?",
        choices: [
          { id: "A", text: "A university degree" },
          { id: "B", text: "Experience with Google Analytics" },
          { id: "C", text: "Fluency in French" },
          { id: "D", text: "At least two years of work experience" },
        ],
        correctAnswer: "C",
        explanation: "The requirements mention English and Japanese language skills, but French is not mentioned. All other options (university degree, Google Analytics, 2+ years experience) are explicitly listed.",
        explanationJa: "要件にはフランス語は記載されていません。英語と日本語のスキルは記載されています。他の選択肢（大学の学位、Googleアナリティクス、2年以上の経験）はすべて明記されています。",
        tags: ["詳細情報", "NOT問題", "求人広告"],
      },
      {
        id: "p7-q003",
        part: "part7",
        passageId: "p7-passage-001",
        questionNumber: 149,
        difficulty: "medium",
        questionText: "According to the advertisement, what benefit allows employees to work outside the office?",
        choices: [
          { id: "A", text: "The professional development budget" },
          { id: "B", text: "The flexible working hours policy" },
          { id: "C", text: "The remote work option" },
          { id: "D", text: "The paid vacation days" },
        ],
        correctAnswer: "C",
        explanation: "The advertisement mentions 'remote work options (up to 2 days/week)' under Compensation & Benefits, which allows employees to work outside the office.",
        explanationJa: "「Compensation & Benefits」の欄に「remote work options（up to 2 days/week）」と記載されており、週2日まで在宅勤務が可能です。",
        tags: ["詳細情報", "福利厚生", "求人広告"],
      },
      {
        id: "p7-q004",
        part: "part7",
        passageId: "p7-passage-001",
        questionNumber: 150,
        difficulty: "hard",
        questionText: "What can be inferred about the application process?",
        choices: [
          { id: "A", text: "All applicants will be contacted for an interview." },
          { id: "B", text: "Applications can be submitted in person." },
          { id: "C", text: "Not all applicants will receive a response." },
          { id: "D", text: "The deadline for applications is May 30th." },
        ],
        correctAnswer: "C",
        explanation: "The advertisement states 'Only shortlisted candidates will be contacted for an interview,' implying that not all applicants will receive a response.",
        explanationJa: "「Only shortlisted candidates will be contacted for an interview（選考通過者のみ面接のご連絡をします）」と記載されており、全応募者が返答を受けるわけではないことが推測できます。",
        tags: ["推測・推論", "応募プロセス", "求人広告"],
      },
    ],
  },
  {
    id: "p7-passage-002",
    part: "part7",
    title: "Customer Service Email Exchange",
    passageType: "double",
    documentType: "email",
    texts: [
      {
        id: "p7-t002-a",
        label: "Email 1",
        content: `From: Sarah Chen <s.chen@email.com>
To: Customer Service <support@shopnow.com>
Date: March 10
Subject: Order #45892 — Damaged Item

Dear Customer Service Team,

I am writing to report that I received a damaged item in my recent order. I ordered the Deluxe Coffee Maker (Model CM-500) on March 5th, and it was delivered on March 9th.

Upon opening the package, I noticed that the glass carafe was cracked. The outer packaging appeared intact, so the damage likely occurred during manufacturing or packaging.

I would like to request either a replacement unit or a full refund. I have attached photos of the damaged item for your reference.

Please let me know how you would like to proceed.

Best regards,
Sarah Chen
Order #45892`,
      },
      {
        id: "p7-t002-b",
        label: "Email 2",
        content: `From: Customer Service <support@shopnow.com>
To: Sarah Chen <s.chen@email.com>
Date: March 11
Subject: RE: Order #45892 — Damaged Item

Dear Ms. Chen,

Thank you for contacting us and for providing the photos. We sincerely apologize for the inconvenience caused by the damaged item.

After reviewing your case, we are happy to offer you the following options:

Option 1: We will send you a replacement Deluxe Coffee Maker (Model CM-500) at no additional charge. The new unit will be shipped within 2 business days and should arrive within 5-7 business days.

Option 2: We will issue a full refund of $89.99 to your original payment method. Please allow 3-5 business days for the refund to appear on your statement.

In either case, you do not need to return the damaged item.

Please reply to this email with your preferred option by March 15th, and we will process your request immediately.

Once again, we apologize for this experience and appreciate your patience.

Kind regards,
James Park
Customer Service Representative
ShopNow`,
      },
    ],
    questions: [
      {
        id: "p7-q005",
        part: "part7",
        passageId: "p7-passage-002",
        questionNumber: 153,
        difficulty: "easy",
        questionText: "Why did Ms. Chen contact the company?",
        choices: [
          { id: "A", text: "To cancel her order" },
          { id: "B", text: "To report a delivery delay" },
          { id: "C", text: "To complain about a defective product" },
          { id: "D", text: "To request a product catalog" },
        ],
        correctAnswer: "C",
        explanation: "Ms. Chen contacted customer service to report that she received a damaged item — specifically, a cracked glass carafe on her coffee maker.",
        explanationJa: "Chenさんはコーヒーメーカーのガラスカラフェが割れていたという不良品を報告するためにカスタマーサービスに連絡しました。",
        tags: ["主旨・目的", "読解", "メール"],
      },
      {
        id: "p7-q006",
        part: "part7",
        passageId: "p7-passage-002",
        questionNumber: 154,
        difficulty: "medium",
        questionText: "What does Mr. Park offer Ms. Chen?",
        choices: [
          { id: "A", text: "A discount on her next purchase" },
          { id: "B", text: "A replacement or a refund" },
          { id: "C", text: "A free gift with her next order" },
          { id: "D", text: "A store credit" },
        ],
        correctAnswer: "B",
        explanation: "Mr. Park offers two options: Option 1 is a replacement unit, and Option 2 is a full refund of $89.99.",
        explanationJa: "Parkさんは2つの選択肢を提示しています。オプション1は代替品の送付、オプション2は89.99ドルの全額返金です。",
        tags: ["詳細情報", "読解", "カスタマーサービス"],
      },
      {
        id: "p7-q007",
        part: "part7",
        passageId: "p7-passage-002",
        questionNumber: 155,
        difficulty: "hard",
        questionText: "What is indicated about the damaged item?",
        choices: [
          { id: "A", text: "It must be returned to receive a refund." },
          { id: "B", text: "It was damaged during shipping." },
          { id: "C", text: "Ms. Chen does not need to send it back." },
          { id: "D", text: "The outer packaging was also damaged." },
        ],
        correctAnswer: "C",
        explanation: "Mr. Park's email states 'In either case, you do not need to return the damaged item,' meaning Ms. Chen can keep the damaged product regardless of which option she chooses.",
        explanationJa: "Parkさんのメールに「In either case, you do not need to return the damaged item（どちらの場合も、破損した商品を返品する必要はありません）」と記載されています。",
        tags: ["詳細情報", "推測", "カスタマーサービス"],
      },
    ],
  },
];
