// ============================================================
// TOEIC Reading Practice App — Time Attack Page
// タイムアタックの制限時間選択専用ページ
// ============================================================
import { useLocation } from "wouter";
import { ArrowLeft, Zap, Clock, Timer } from "lucide-react";
import { useSession } from "@/contexts/SessionContext";

export default function TimeAttackPage() {
  const [, navigate] = useLocation();
  const { startSession } = useSession();

  const options = [
    {
      label: "スプリント",
      time: "3分",
      seconds: 180,
      questions: 5,
      description: "5問を3分で解く。瞬発力の鍛錬に。",
      color: "bg-amber-50",
      textColor: "text-amber-700",
      borderColor: "border-amber-200",
    },
    {
      label: "スタンダード",
      time: "5分",
      seconds: 300,
      questions: 10,
      description: "10問を5分で。実践的なスピードを身に付ける。",
      color: "bg-orange-50",
      textColor: "text-orange-700",
      borderColor: "border-orange-200",
      recommended: true,
    },
    {
      label: "チャレンジ",
      time: "10分",
      seconds: 600,
      questions: 20,
      description: "20問を10分で。本番さながらのペースで挑戦。",
      color: "bg-red-50",
      textColor: "text-red-700",
      borderColor: "border-red-200",
    },
    {
      label: "マラソン",
      time: "15分",
      seconds: 900,
      questions: 30,
      description: "30問を15分で。集中力と持久力を試す。",
      color: "bg-rose-50",
      textColor: "text-rose-700",
      borderColor: "border-rose-200",
    },
  ];

  const handleStart = (seconds: number, questionCount: number) => {
    startSession({
      mode: "timeattack",
      part: "all",
      questionCount,
      timeLimit: seconds,
    });
    navigate("/quiz");
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="container max-w-lg lg:max-w-2xl mx-auto">
        {/* ヘッダー */}
        <div className="flex items-center gap-3 pt-12 pb-6 fade-in">
          <button
            onClick={() => navigate("/")}
            className="w-9 h-9 rounded-xl bg-secondary flex items-center justify-center hover:bg-muted transition-colors"
          >
            <ArrowLeft size={18} className="text-foreground" />
          </button>
          <div>
            <h1
              className="text-xl font-bold text-foreground"
              style={{ fontFamily: "'Noto Serif JP', serif" }}
            >
              タイムアタック
            </h1>
            <p
              className="text-xs text-muted-foreground"
              style={{ fontFamily: "'Noto Sans JP', sans-serif" }}
            >
              制限時間を選んで素早く解答しましょう
            </p>
          </div>
        </div>

        {/* オプションカード */}
        <div className="flex flex-col gap-4 pb-8">
          {options.map(({ label, time, seconds, questions, description, color, textColor, borderColor, recommended }) => (
            <button
              key={seconds}
              onClick={() => handleStart(seconds, questions)}
              className={`qs-card-hover w-full text-left fade-in ${recommended ? `border-2 ${borderColor}` : ""}`}
            >
              <div className="flex items-start gap-4">
                <div className={`w-12 h-12 rounded-2xl ${color} flex items-center justify-center flex-shrink-0`}>
                  <Zap size={20} className={textColor} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span
                      className="font-bold text-sm text-foreground"
                      style={{ fontFamily: "'Noto Sans JP', sans-serif" }}
                    >
                      {label}
                    </span>
                    {recommended && (
                      <span className="text-[10px] bg-primary/10 text-primary px-2 py-0.5 rounded-full font-medium">
                        おすすめ
                      </span>
                    )}
                  </div>
                  <p
                    className="text-xs text-muted-foreground mb-2"
                    style={{ fontFamily: "'Noto Sans JP', sans-serif" }}
                  >
                    {description}
                  </p>
                  <div className="flex items-center gap-3">
                    <span
                      className={`text-xs font-semibold ${textColor} flex items-center gap-1`}
                      style={{ fontFamily: "'DM Sans', sans-serif" }}
                    >
                      <Clock size={12} />
                      {time}
                    </span>
                    <span
                      className="text-xs text-muted-foreground"
                      style={{ fontFamily: "'DM Sans', sans-serif" }}
                    >
                      {questions}問
                    </span>
                  </div>
                </div>
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
