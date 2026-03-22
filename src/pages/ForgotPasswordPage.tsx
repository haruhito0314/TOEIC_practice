import { useState } from "react";
import { useLocation } from "wouter";
import { Mail, ArrowLeft, Loader2 } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";

export default function ForgotPasswordPage() {
  const [, navigate] = useLocation();
  const { sendPasswordRecoveryEmail, isLoading } = useAuth();
  const [email, setEmail] = useState("");
  const [isSent, setIsSent] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email) {
      toast.error("メールアドレスを入力してください");
      return;
    }

    try {
      const resetUrl = window.location.origin + "/reset-password";
      await sendPasswordRecoveryEmail(email, resetUrl);
      setIsSent(true);
      toast.success("パスワード再設定メールを送信しました");
    } catch (error: any) {
      toast.error(error?.message || "メールの送信に失敗しました");
    }
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="w-full max-w-sm">
        {/* 戻るボタン */}
        <div className="mb-6 fade-in">
          <button
            onClick={() => navigate("/auth")}
            className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors"
            style={{ fontFamily: "'Noto Sans JP', sans-serif" }}
          >
            <ArrowLeft size={16} />
            ログイン画面に戻る
          </button>
        </div>

        {/* タイトル */}
        <div className="text-center mb-8 fade-in">
          <h1
            className="text-2xl font-bold text-foreground mb-2"
            style={{ fontFamily: "'Noto Serif JP', serif" }}
          >
            パスワードの再設定
          </h1>
          <p
            className="text-sm text-muted-foreground"
            style={{ fontFamily: "'Noto Sans JP', sans-serif" }}
          >
            登録したメールアドレスを入力してください
          </p>
        </div>

        {/* フォーム */}
        <div className="qs-card fade-in">
          {isSent ? (
            <div className="text-center py-6">
              <Mail size={48} className="mx-auto text-primary opacity-50 mb-4" />
              <p
                className="text-sm text-foreground mb-2 font-medium"
                style={{ fontFamily: "'Noto Sans JP', sans-serif" }}
              >
                メールを確認してください
              </p>
              <p
                className="text-xs text-muted-foreground"
                style={{ fontFamily: "'Noto Sans JP', sans-serif" }}
              >
                パスワード再設定用のリンクを記載したメールを送信しました。リンクをクリックして新しいパスワードを設定してください。
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
              <div>
                <label
                  className="block text-xs font-medium text-foreground mb-1.5"
                  style={{ fontFamily: "'Noto Sans JP', sans-serif" }}
                >
                  メールアドレス
                </label>
                <div className="relative">
                  <Mail
                    size={16}
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
                  />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="user@example.com"
                    className="w-full pl-10 pr-4 py-2.5 bg-secondary border border-border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
                    style={{ fontFamily: "'Noto Sans JP', sans-serif" }}
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="qs-btn-primary w-full flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed mt-2"
              >
                {isLoading && <Loader2 size={16} className="animate-spin" />}
                送信する
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
