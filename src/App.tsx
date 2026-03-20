// ============================================================
// TOEIC Reading Practice App — App Router
// Design: "Quiet Study" — Soft Minimalism × Japanese Wabi-Sabi
// ============================================================
import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Route, Switch } from "wouter";
import ErrorBoundary from "./components/ErrorBoundary";
import { ThemeProvider } from "./contexts/ThemeContext";
import { SessionProvider } from "./contexts/SessionContext";
import { AuthProvider } from "./contexts/AuthContext";
import BottomNav from "./components/BottomNav";
import Home from "./pages/Home";
import StudyPage from "./pages/StudyPage";
import PartSelectPage from "./pages/PartSelectPage";
import TimeAttackPage from "./pages/TimeAttackPage";
import QuizPage from "./pages/QuizPage";
import ResultPage from "./pages/ResultPage";
import ReviewPage from "./pages/ReviewPage";
import StatsPage from "./pages/StatsPage";
import AuthPage from "./pages/AuthPage";
import NotFound from "./pages/NotFound";

function Router() {
  return (
    <div className="min-h-screen bg-background">
      <Switch>
        <Route path="/" component={Home} />
        <Route path="/study" component={StudyPage} />
        <Route path="/part-select" component={PartSelectPage} />
        <Route path="/timeattack" component={TimeAttackPage} />
        <Route path="/quiz" component={QuizPage} />
        <Route path="/result" component={ResultPage} />
        <Route path="/review" component={ReviewPage} />
        <Route path="/stats" component={StatsPage} />
        <Route path="/auth" component={AuthPage} />
        <Route component={NotFound} />
      </Switch>
      <BottomNav />
    </div>
  );
}

function App() {
  return (
    <ErrorBoundary>
      <ThemeProvider defaultTheme="light">
        <TooltipProvider>
          <AuthProvider>
            <SessionProvider>
              <Toaster position="top-center" />
              <Router />
            </SessionProvider>
          </AuthProvider>
        </TooltipProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}

export default App;
