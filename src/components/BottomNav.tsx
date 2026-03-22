// ============================================================
// TOEIC Reading Practice App — Bottom Navigation
// Design: "Quiet Study" — Soft Minimalism
// Mobile-first bottom tab navigation
// ============================================================
import { Link, useLocation } from "wouter";
import { Home, BookOpen, RotateCcw, BarChart2 } from "lucide-react";

const navItems = [
  { path: "/", label: "ホーム", icon: Home },
  { path: "/study", label: "学習", icon: BookOpen },
  { path: "/review", label: "復習", icon: RotateCcw },
  { path: "/stats", label: "記録", icon: BarChart2 },
];

export default function BottomNav() {
  const [location] = useLocation();

  // QuizPageでは非表示
  if (location === "/quiz") {
    return null;
  }

  return (
    <>
      <nav className="fixed bottom-0 left-0 right-0 z-50 bg-background/95 backdrop-blur-sm border-t border-border lg:hidden">
        <div className="flex items-center justify-around max-w-lg mx-auto px-2 py-1">
          {navItems.map(({ path, label, icon: Icon }) => {
            const isActive = path === "/" ? location === "/" : location.startsWith(path);
            return (
              <Link
                key={path}
                href={path}
                className={`flex flex-col items-center gap-0.5 px-4 py-2 rounded-xl transition-all duration-200 min-w-[60px] ${
                  isActive
                    ? "text-primary"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                <div
                  className={`p-1.5 rounded-xl transition-all duration-200 ${
                    isActive ? "bg-accent" : ""
                  }`}
                >
                  <Icon
                    size={20}
                    strokeWidth={isActive ? 2.5 : 1.8}
                    className="transition-all duration-200"
                  />
                </div>
                <span
                  className={`text-[10px] font-medium transition-all duration-200 ${
                    isActive ? "text-primary" : "text-muted-foreground"
                  }`}
                  style={{ fontFamily: "'Noto Sans JP', sans-serif" }}
                >
                  {label}
                </span>
              </Link>
            );
          })}
        </div>
      </nav>

      <nav className="hidden lg:block fixed top-4 right-4 z-50">
        <div className="flex items-center gap-1 p-1 rounded-2xl bg-background/90 backdrop-blur-sm border border-border shadow-sm">
          {navItems.map(({ path, label, icon: Icon }) => {
            const isActive = path === "/" ? location === "/" : location.startsWith(path);
            return (
              <Link
                key={`desktop-${path}`}
                href={path}
                className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs transition-colors ${
                  isActive
                    ? "bg-accent text-primary font-semibold"
                    : "text-muted-foreground hover:text-foreground hover:bg-secondary"
                }`}
                style={{ fontFamily: "'Noto Sans JP', sans-serif" }}
              >
                <Icon size={14} />
                {label}
              </Link>
            );
          })}
        </div>
      </nav>
    </>
  );
}
