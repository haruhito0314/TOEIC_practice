// ============================================================
// TOEIC Reading Practice App — Auth Page
// Google ログイン + Email/Password + ゲストモード対応
// ============================================================
import { useState } from "react";
import { useLocation } from "wouter";
import { Mail, Lock, User, Eye, EyeOff, Loader2, ArrowLeft } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";

export default function AuthPage() {
  const [, navigate] = useLocation();
  const { loginWithGoogle, loginWithEmail, signupWithEmail, isLoading, isLoggedIn } =
    useAuth();
  const [isSignup, setIsSignup] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  // Already logged in — redirect home
  if (isLoggedIn) {
    navigate("/");
    return null;
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.email || !formData.password) {
      toast.error("メールアドレスとパスワードを入力してください");
      return;
    }

    if (isSignup) {
      if (!formData.name) {
        toast.error("名前を入力してください");
        return;
      }
      if (formData.password !== formData.confirmPassword) {
        toast.error("パスワードが一致しません");
        return;
      }
      if (formData.password.length < 8) {
        toast.error("パスワードは8文字以上で設定してください");
        return;
      }

      try {
        await signupWithEmail(formData.email, formData.password, formData.name);
        toast.success("アカウントを作成しました！");
        navigate("/");
      } catch (error: any) {
        const msg = error?.message || "";
        if (msg.includes("already exists")) {
          toast.error("このメールアドレスは既に登録されています");
        } else {
          toast.error("サインアップに失敗しました");
        }
      }
    } else {
      try {
        await loginWithEmail(formData.email, formData.password);
        toast.success("ログインしました！");
        navigate("/");
      } catch (error: any) {
        const msg = error?.message || "";
        if (msg.includes("Invalid credentials")) {
          toast.error("メールアドレスまたはパスワードが正しくありません");
        } else {
          toast.error("ログインに失敗しました");
        }
      }
    }
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="w-full max-w-sm">
        {/* 戻るボタン */}
        <div className="mb-6 fade-in">
          <button
            onClick={() => navigate("/")}
            className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors"
            style={{ fontFamily: "'Noto Sans JP', sans-serif" }}
          >
            <ArrowLeft size={16} />
            ホームに戻る
          </button>
        </div>

        {/* ロゴ・タイトル */}
        <div className="text-center mb-8 fade-in">
          <h1
            className="text-3xl font-bold text-foreground mb-2"
            style={{ fontFamily: "'Noto Serif JP', serif" }}
          >
            TOEIC Reading
          </h1>
          <p
            className="text-sm text-muted-foreground"
            style={{ fontFamily: "'Noto Sans JP', sans-serif" }}
          >
            {isSignup ? "アカウントを作成" : "アカウントにログイン"}
          </p>
        </div>

        {/* ログインカード */}
        <div className="qs-card fade-in">
          {isLoading ? (
            <div className="flex flex-col items-center justify-center py-8 gap-3">
              <Loader2 size={24} className="animate-spin text-primary" />
              <p
                className="text-sm text-muted-foreground"
                style={{ fontFamily: "'Noto Sans JP', sans-serif" }}
              >
                処理中...
              </p>
            </div>
          ) : (
            <div className="flex flex-col gap-4">
              {/* Google ログインボタン */}
              <button
                onClick={loginWithGoogle}
                className="w-full flex items-center justify-center gap-3 py-3 px-4 bg-white border border-border rounded-xl text-sm font-medium text-foreground hover:bg-gray-50 transition-all duration-200 shadow-sm"
                style={{ fontFamily: "'Noto Sans JP', sans-serif" }}
              >
                <svg width="20" height="20" viewBox="0 0 24 24">
                  <path
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z"
                    fill="#4285F4"
                  />
                  <path
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                    fill="#34A853"
                  />
                  <path
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                    fill="#FBBC05"
                  />
                  <path
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                    fill="#EA4335"
                  />
                </svg>
                Google で続ける
              </button>

              {/* セパレーター */}
              <div className="flex items-center gap-3">
                <div className="flex-1 h-px bg-border" />
                <span
                  className="text-xs text-muted-foreground"
                  style={{ fontFamily: "'Noto Sans JP', sans-serif" }}
                >
                  または
                </span>
                <div className="flex-1 h-px bg-border" />
              </div>

              {/* Email/Password フォーム */}
              <form onSubmit={handleSubmit} className="flex flex-col gap-3">
                {/* 名前フィールド（サインアップのみ） */}
                {isSignup && (
                  <div>
                    <label
                      className="block text-xs font-medium text-foreground mb-1.5"
                      style={{ fontFamily: "'Noto Sans JP', sans-serif" }}
                    >
                      名前
                    </label>
                    <div className="relative">
                      <User
                        size={16}
                        className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
                      />
                      <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        placeholder="山田太郎"
                        className="w-full pl-10 pr-4 py-2.5 bg-secondary border border-border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
                        style={{ fontFamily: "'Noto Sans JP', sans-serif" }}
                      />
                    </div>
                  </div>
                )}

                {/* メールフィールド */}
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
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      placeholder="user@example.com"
                      className="w-full pl-10 pr-4 py-2.5 bg-secondary border border-border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
                      style={{ fontFamily: "'Noto Sans JP', sans-serif" }}
                    />
                  </div>
                </div>

                {/* パスワードフィールド */}
                <div>
                  <label
                    className="block text-xs font-medium text-foreground mb-1.5"
                    style={{ fontFamily: "'Noto Sans JP', sans-serif" }}
                  >
                    パスワード
                  </label>
                  <div className="relative">
                    <Lock
                      size={16}
                      className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
                    />
                    <input
                      type={showPassword ? "text" : "password"}
                      name="password"
                      value={formData.password}
                      onChange={handleChange}
                      placeholder="••••••••"
                      className="w-full pl-10 pr-10 py-2.5 bg-secondary border border-border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
                      style={{ fontFamily: "'Noto Sans JP', sans-serif" }}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                    >
                      {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                  </div>
                </div>

                {/* パスワード確認（サインアップのみ） */}
                {isSignup && (
                  <div>
                    <label
                      className="block text-xs font-medium text-foreground mb-1.5"
                      style={{ fontFamily: "'Noto Sans JP', sans-serif" }}
                    >
                      パスワード（確認）
                    </label>
                    <div className="relative">
                      <Lock
                        size={16}
                        className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
                      />
                      <input
                        type={showPassword ? "text" : "password"}
                        name="confirmPassword"
                        value={formData.confirmPassword}
                        onChange={handleChange}
                        placeholder="••••••••"
                        className="w-full pl-10 pr-10 py-2.5 bg-secondary border border-border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
                        style={{ fontFamily: "'Noto Sans JP', sans-serif" }}
                      />
                    </div>
                  </div>
                )}

                {/* サブミットボタン */}
                <button
                  type="submit"
                  disabled={isLoading}
                  className="qs-btn-primary w-full flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed mt-1"
                >
                  {isLoading && <Loader2 size={16} className="animate-spin" />}
                  {isSignup ? "アカウント作成" : "メールでログイン"}
                </button>
              </form>

              {/* トグルリンク */}
              <div className="text-center">
                <p
                  className="text-xs text-muted-foreground"
                  style={{ fontFamily: "'Noto Sans JP', sans-serif" }}
                >
                  {isSignup
                    ? "既にアカウントをお持ちですか？"
                    : "アカウントをお持ちでないですか？"}
                  <button
                    type="button"
                    onClick={() => {
                      setIsSignup(!isSignup);
                      setFormData({
                        name: "",
                        email: "",
                        password: "",
                        confirmPassword: "",
                      });
                    }}
                    className="ml-1 text-primary font-medium hover:underline transition-colors"
                  >
                    {isSignup ? "ログイン" : "サインアップ"}
                  </button>
                </p>
              </div>
            </div>
          )}
        </div>

        {/* ゲストとして続ける */}
        <div className="mt-6 text-center fade-in">
          <button
            onClick={() => navigate("/")}
            className="text-sm text-muted-foreground hover:text-foreground transition-colors"
            style={{ fontFamily: "'Noto Sans JP', sans-serif" }}
          >
            ログインせずにゲストとして続ける →
          </button>
        </div>

        {/* ゲストモード説明 */}
        <div className="mt-4 p-4 bg-secondary rounded-xl fade-in">
          <p
            className="text-xs text-muted-foreground mb-2 font-medium"
            style={{ fontFamily: "'Noto Sans JP', sans-serif" }}
          >
            📝 ゲストモードについて
          </p>
          <p
            className="text-xs text-muted-foreground leading-relaxed"
            style={{ fontFamily: "'Noto Sans JP', sans-serif" }}
          >
            アカウントなしでもすべての機能が利用できます。学習記録はこのブラウザに保存されます。
            ログインすると、データがクラウドに保存され、他のデバイスでも学習の続きができるようになります。
          </p>
        </div>
      </div>
    </div>
  );
}
