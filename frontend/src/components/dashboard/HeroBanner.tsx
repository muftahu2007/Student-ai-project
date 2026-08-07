import { motion } from "framer-motion";
import { Sparkles } from "lucide-react";
import { AnimatedCounter } from "@/components/dashboard/Shared";

interface HeroBannerProps {
  user: any;
  documents: any[];
}

export function HeroBanner({ user, documents }: HeroBannerProps) {
  const greeting = (() => {
    const h = new Date().getHours();
    return h < 12 ? "Good morning" : h < 17 ? "Good afternoon" : "Good evening";
  })();

  const firstName = user?.profile?.full_name?.split(" ")[0] || user?.username;

  const stats = [
    { val: user?.stats?.study_streak || 0, label: "Day Streak", suffix: "🔥" },
    { val: documents.length, label: "Documents", suffix: "" },
    { val: user?.stats?.quizzes_completed || 0, label: "Quizzes", suffix: "" },
  ];

  return (
    <motion.header
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
      className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-zinc-900 via-zinc-900 to-zinc-950 p-5 sm:p-8 text-white shadow-2xl ring-1 ring-white/10"
    >
      <div className="pointer-events-none absolute -top-16 -right-16 h-56 w-56 rounded-full bg-primary/30 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-10 left-8 h-36 w-36 rounded-full bg-amber-500/15 blur-3xl" />
      <div className="pointer-events-none absolute top-4 right-1/3 h-20 w-20 rounded-full bg-emerald-500/10 blur-2xl" />

      <div className="relative z-10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
        <div>
          <div className="inline-flex items-center gap-2 rounded-full bg-white/10 backdrop-blur-sm px-3 py-1.5 text-[11px] font-bold tracking-wide text-amber-300 ring-1 ring-white/10 mb-4">
            <Sparkles className="h-3 w-3" /> BUK SCHOLAR AI
          </div>
          <h1 className="font-display text-3xl sm:text-4xl font-bold tracking-tight">
            {greeting}, {firstName} 👋
          </h1>
          <p className="mt-2 text-zinc-400 text-sm">
            {user?.profile
              ? `${user.profile.department} · ${user.profile.faculty} · Level ${user.profile.level}`
              : "Ready to crush your goals today?"}
          </p>
        </div>

        <div className="flex flex-wrap gap-3 shrink-0">
          {stats.map((s) => (
            <div
              key={s.label}
              className="flex flex-col items-center justify-center rounded-2xl bg-white/10 backdrop-blur-sm px-5 py-3 ring-1 ring-white/10 min-w-[76px]"
            >
              <div className="font-display text-2xl font-bold">
                <AnimatedCounter value={s.val} suffix={s.suffix} />
              </div>
              <div className="text-[10px] text-zinc-400 mt-0.5 font-semibold uppercase tracking-wider">{s.label}</div>
            </div>
          ))}
        </div>
      </div>
    </motion.header>
  );
}
