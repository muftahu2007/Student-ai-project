import { createFileRoute, Link } from "@tanstack/react-router";
import { 
  ArrowRight, GraduationCap, Sparkles, BookOpen, ShieldCheck, Zap, 
  Flame, FileText, HelpCircle, CheckCircle2, Clock, Brain, Layers 
} from "lucide-react";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "BUK Scholar AI" },
      { name: "description", content: "Your AI-powered study companion for BUK lecture notes." },
    ],
  }),
  component: Index,
});

function Index() {
  return (
    <div className="flex min-h-dvh flex-col items-center justify-center bg-background px-4 py-12 relative overflow-hidden">
      {/* Decorative ambient background glows */}
      <div className="absolute -top-32 -left-32 h-[500px] w-[500px] rounded-full bg-primary/10 blur-3xl pointer-events-none" />
      <div className="absolute -bottom-32 -right-32 h-[500px] w-[500px] rounded-full bg-gold/15 blur-3xl pointer-events-none" />

      <div className="w-full max-w-4xl relative z-10 space-y-8">
        
        {/* Main Hero Card */}
        <div className="glass-panel p-8 sm:p-12 rounded-3xl shadow-[var(--shadow-card)] text-center relative overflow-hidden">
          
          {/* Top Bar: Active Status + Streak Badge */}
          <div className="flex flex-wrap items-center justify-center gap-3">
            <div className="inline-flex items-center gap-2 rounded-full glass-panel-gold px-3.5 py-1.5 text-[11px] font-bold uppercase tracking-[0.18em]">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-gold opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-gold"></span>
              </span>
              <span className="text-primary">BUK Scholar AI v2.0</span>
            </div>

            <div className="inline-flex items-center gap-1.5 rounded-full border border-orange-500/30 bg-orange-500/10 px-3.5 py-1.5 text-[11px] font-bold text-orange-600 dark:text-orange-400">
              <Flame className="h-4 w-4 text-orange-500 fill-orange-500 animate-pulse" />
              <span>5 Day Study Streak</span>
            </div>
          </div>

          {/* Hero Logo Icon */}
          <div className="mt-6 mx-auto grid h-16 w-16 place-items-center rounded-2xl bg-primary text-primary-foreground shadow-lg shadow-primary/25 transition-transform hover:scale-105">
            <GraduationCap className="h-8 w-8 text-gold" />
          </div>

          {/* Main Heading */}
          <h1 className="mt-6 font-display text-4xl font-bold sm:text-5xl tracking-tight leading-tight">
            Study Smarter, <span className="italic font-normal text-primary">Not Harder.</span>
          </h1>

          <p className="mt-4 text-base text-muted-foreground leading-relaxed max-w-xl mx-auto">
            Your personal AI study companion trained on Bayero University Kano lecture notes. 
            Instant summaries, multi-document quizzes, and verifiable citations.
          </p>

          {/* Action Button */}
          <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              to="/study"
              className="w-full sm:w-auto emerald-gradient-btn inline-flex items-center justify-center gap-2.5 rounded-xl px-8 py-4 text-sm font-semibold text-primary-foreground"
            >
              <Sparkles className="h-4.5 w-4.5 text-gold animate-pulse" />
              Open Study Assistant
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>

        {/* Quick Action AI Cards Grid (Item #3 Feature) */}
        <div>
          <h2 className="text-xs font-bold uppercase tracking-[0.16em] text-gold mb-3 px-1">
            Quick AI Actions
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            
            <Link
              to="/study"
              className="group glass-panel p-5 rounded-2xl transition-all duration-300 hover:-translate-y-1 hover:border-primary/40 hover:shadow-md"
            >
              <div className="grid h-10 w-10 place-items-center rounded-xl bg-primary-soft text-primary group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                <Zap className="h-5 w-5" />
              </div>
              <h3 className="mt-4 font-semibold text-sm text-foreground group-hover:text-primary transition-colors">
                Multi-Doc Quiz
              </h3>
              <p className="mt-1 text-xs text-muted-foreground leading-snug">
                Generate practice exams across multiple lecture notes.
              </p>
            </Link>

            <Link
              to="/study"
              className="group glass-panel p-5 rounded-2xl transition-all duration-300 hover:-translate-y-1 hover:border-primary/40 hover:shadow-md"
            >
              <div className="grid h-10 w-10 place-items-center rounded-xl bg-primary-soft text-primary group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                <FileText className="h-5 w-5" />
              </div>
              <h3 className="mt-4 font-semibold text-sm text-foreground group-hover:text-primary transition-colors">
                Summarize Notes
              </h3>
              <p className="mt-1 text-xs text-muted-foreground leading-snug">
                Condense 30-page PDF slides into 10 key bullet points.
              </p>
            </Link>

            <Link
              to="/study"
              className="group glass-panel p-5 rounded-2xl transition-all duration-300 hover:-translate-y-1 hover:border-primary/40 hover:shadow-md"
            >
              <div className="grid h-10 w-10 place-items-center rounded-xl bg-primary-soft text-primary group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                <Brain className="h-5 w-5" />
              </div>
              <h3 className="mt-4 font-semibold text-sm text-foreground group-hover:text-primary transition-colors">
                AI Performance Analysis
              </h3>
              <p className="mt-1 text-xs text-muted-foreground leading-snug">
                Identify knowledge gaps before test day.
              </p>
            </Link>

            <Link
              to="/study"
              className="group glass-panel p-5 rounded-2xl transition-all duration-300 hover:-translate-y-1 hover:border-primary/40 hover:shadow-md"
            >
              <div className="grid h-10 w-10 place-items-center rounded-xl bg-primary-soft text-primary group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                <HelpCircle className="h-5 w-5" />
              </div>
              <h3 className="mt-4 font-semibold text-sm text-foreground group-hover:text-primary transition-colors">
                Ask Scholar AI
              </h3>
              <p className="mt-1 text-xs text-muted-foreground leading-snug">
                Get grounded answers with exact page citations.
              </p>
            </Link>

          </div>
        </div>

        {/* AI Workspace Cards Showcase (Item #3 Feature) */}
        <div className="glass-panel p-6 rounded-3xl">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="font-display text-lg font-bold">Active Lecture Workspaces</h3>
              <p className="text-xs text-muted-foreground">Ready for revision and quiz generation</p>
            </div>
            <span className="text-xs font-semibold text-gold glass-panel-gold px-3 py-1 rounded-full">
              5 Courses Loaded
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            
            <div className="flex items-center justify-between p-3.5 rounded-xl border border-border/60 bg-background/50 hover:bg-primary-soft/30 transition-colors">
              <div className="flex items-center gap-3">
                <div className="grid h-9 w-9 place-items-center rounded-lg bg-primary text-primary-foreground text-xs font-bold">
                  CHM
                </div>
                <div>
                  <h4 className="text-sm font-semibold leading-none">CHM 2201 — Alkenes</h4>
                  <p className="mt-1 text-[11px] text-muted-foreground">18 pages · Updated 2h ago</p>
                </div>
              </div>
              <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 px-2.5 py-1 rounded-md">
                <CheckCircle2 className="h-3 w-3" /> Ready
              </span>
            </div>

            <div className="flex items-center justify-between p-3.5 rounded-xl border border-border/60 bg-background/50 hover:bg-primary-soft/30 transition-colors">
              <div className="flex items-center gap-3">
                <div className="grid h-9 w-9 place-items-center rounded-lg bg-primary text-primary-foreground text-xs font-bold">
                  CSC
                </div>
                <div>
                  <h4 className="text-sm font-semibold leading-none">CSC 2304 — Data Structures</h4>
                  <p className="mt-1 text-[11px] text-muted-foreground">27 pages · Updated Mar 2</p>
                </div>
              </div>
              <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 px-2.5 py-1 rounded-md">
                <CheckCircle2 className="h-3 w-3" /> Ready
              </span>
            </div>

          </div>
        </div>

      </div>
    </div>
  );
}


