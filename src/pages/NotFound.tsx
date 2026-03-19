import { Home } from "lucide-react";
import { useLocation } from "wouter";

export default function NotFound() {
  const [, navigate] = useLocation();

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center px-4">
      <p
        className="text-6xl font-bold text-muted-foreground/30 mb-4"
        style={{ fontFamily: "'DM Sans', sans-serif" }}
      >
        404
      </p>
      <h1
        className="text-xl font-bold text-foreground mb-2"
        style={{ fontFamily: "'Noto Serif JP', serif" }}
      >
        ページが見つかりません
      </h1>
      <p
        className="text-sm text-muted-foreground mb-8"
        style={{ fontFamily: "'Noto Sans JP', sans-serif" }}
      >
        お探しのページは存在しないか、移動した可能性があります
      </p>
      <button
        onClick={() => navigate("/")}
        className="qs-btn-primary flex items-center gap-2"
      >
        <Home size={16} />
        ホームに戻る
      </button>
    </div>
  );
}
