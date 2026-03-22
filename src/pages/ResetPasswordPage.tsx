import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { Lock, Eye, EyeOff, Loader2 } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";

export default function ResetPasswordPage() {
  const [, navigate] = useLocation();
  const { resetPassword, isLoading } = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  
  const [userId, setUserId] = useState("");
  const [secret, setSecret] = useState("");

  const [formData, setFormData] = useState({
    password: "",
    confirmPassword: "",
  });

  useEffect(() => {
    // Extract userId and secret from URL search params
    const params = new URLSearchParams(window.location.search);
    const uid = params.get("userId");
    const sec = params.get("secret");
    
    if (uid && sec) {
      setUserId(uid);
      setSecret(sec);
    } else {
      toast.error("無効なリンクです");
      navigate("/");
    }
  }, [navigate]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.password || !formData.confirmPassword) {
      toast.error("パスワードを入力してください");
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
      await resetPassword(userId, secret, formData.password);
      toast.success("パスワードを再設定しました！ログインしてください");
      navigate("/auth");
    } catch (error: any) {
      toast.error(error?.message || "パスワードの再設定に失敗しました");
    }
  };

  if (!userId || !secret) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <Loader2 size={32} className="animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8 fade-in">
          <h1
            className="text-2xl font-bold text-foreground mb-2"
            style={{ fontFamily: "'Noto Serif JP', serif" }}
          >
            新しいパスワードを設定
          </h1>
          <p
            className="text-sm text-muted-foreground"
            style={{ fontFamily: "'Noto Sans JP', sans-serif" }}
          >
            ご希望のパスワードを入力してください
          </p>
        </div>

        <div className="qs-card fade-in">
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <div>
              <label
                className="block text-xs font-medium text-foreground mb-1.5"
                style={{ fontFamily: "'Noto Sans JP', sans-serif" }}
              >
                新しいパスワード
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

            <div>
              <label
                className="block text-xs font-medium text-foreground mb-1.5"
                style={{ fontFamily: "'Noto Sans JP', sans-serif" }}
              >
                新しいパスワード（確認）
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

            <button
              type="submit"
              disabled={isLoading}
              className="qs-btn-primary w-full flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed mt-2"
            >
              {isLoading && <Loader2 size={16} className="animate-spin" />}
              パスワードを変更する
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
