import { Link } from "@tanstack/react-router";
import type { ReactNode } from "react";
import logo from "@/assets/buk-scholar-logo.png";
import bgImage from "@/assets/images.jpg";

interface AuthLayoutProps {
  title: string;
  subtitle: string;
  children: ReactNode;
  footer: ReactNode;
}

export function AuthLayout({ title, subtitle, children, footer }: AuthLayoutProps) {
  return (
    <div className="min-h-screen w-full bg-background lg:grid lg:grid-cols-[1.05fr_1fr]">
      {/* Left brand panel */}
      <aside
        className="relative hidden lg:flex flex-col justify-between overflow-hidden p-12 text-primary-foreground"
        style={{ background: "var(--gradient-brand)" }}
      >
        {/* Background Image */}
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-15 mix-blend-luminosity"
          style={{ backgroundImage: `url(${bgImage})` }}
        />
        
        <div
          aria-hidden
          className="absolute inset-0 opacity-[0.07] z-0"
          style={{
            backgroundImage:
              "radial-gradient(circle at 1px 1px, var(--color-gold) 1px, transparent 0)",
            backgroundSize: "28px 28px",
          }}
        />
        
        <div className="relative z-10 flex flex-col h-full justify-between">
          <Link to="/" className="flex items-center gap-3 w-fit">
            <div className="h-11 w-11 rounded-xl bg-background/95 flex items-center justify-center shadow-lg ring-1 ring-gold/40">
              <img src={logo} alt="BUK Scholar AI" className="h-9 w-9" width={36} height={36} />
            </div>
            <div className="leading-tight">
              <div className="font-display text-lg font-semibold tracking-tight text-white">BUK Scholar AI</div>
              <div className="text-xs text-white/80">Bayero University Kano</div>
            </div>
          </Link>

          <div className="relative max-w-md mt-auto">
            <div className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.18em] text-gold mb-4">
              <span className="h-px w-6 bg-gold/60" />
              Study smarter
            </div>
            <h2 className="font-display text-3xl font-medium leading-tight">
              Your lectures, summarized. Your questions, answered.
            </h2>
            <p className="mt-3 text-sm text-primary-foreground/70 leading-relaxed">
              Upload notes, generate quizzes, and chat with an AI tutor trained for BUK coursework — all in one trusted academic workspace.
            </p>
            <div className="mt-8 flex items-center gap-6 text-xs text-primary-foreground/55">
              <span>SOC-grade privacy</span>
              <span className="h-1 w-1 rounded-full bg-primary-foreground/30" />
              <span>Built for students</span>
              <span className="h-1 w-1 rounded-full bg-primary-foreground/30" />
              <span>Always free to try</span>
            </div>
          </div>
        </div>
      </aside>

      {/* Right form panel */}
      <main className="flex min-h-screen flex-col px-6 py-8 sm:px-10 lg:px-14">
        {/* Mobile header */}
        <div className="flex items-center justify-between lg:hidden">
          <Link to="/" className="flex items-center gap-2.5">
            <div className="h-10 w-10 rounded-lg bg-primary flex items-center justify-center">
              <img src={logo} alt="BUK Scholar AI" className="h-8 w-8" width={32} height={32} />
            </div>
            <span className="font-display text-base font-semibold">BUK Scholar AI</span>
          </Link>
        </div>

        <div className="flex flex-1 items-center justify-center">
          <div className="w-full max-w-md py-10">
            <div className="mb-8">
              <h1 className="font-display text-3xl sm:text-4xl font-medium tracking-tight text-foreground">
                {title}
              </h1>
              <p className="mt-2 text-sm text-muted-foreground">{subtitle}</p>
            </div>

            <div
              className="rounded-2xl border border-border bg-card p-6 sm:p-8"
              style={{ boxShadow: "var(--shadow-card)" }}
            >
              {children}
            </div>

            <div className="mt-6 text-center text-sm text-muted-foreground">{footer}</div>

            <p className="mt-10 text-center text-xs text-muted-foreground/80">
              By continuing, you agree to our{" "}
              <a className="underline underline-offset-2 hover:text-foreground" href="#">Terms</a>{" "}
              and{" "}
              <a className="underline underline-offset-2 hover:text-foreground" href="#">Privacy Policy</a>.
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}
