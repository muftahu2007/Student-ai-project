import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { toast } from "sonner";
import { register } from "@/lib/api";
import { Eye, EyeOff, Mail, Lock, User, ArrowRight, Check, Sparkles } from "lucide-react";
import { AuthLayout } from "@/components/auth/AuthLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";

export const Route = createFileRoute("/register")({
  head: () => ({
    meta: [
      { title: "Create your account · BUK Scholar AI" },
      { name: "description", content: "Join BUK Scholar AI — upload lecture notes, ask questions, and generate quizzes powered by AI." },
    ],
  }),
  component: RegisterPage,
});

function RegisterPage() {
  const [show, setShow] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const checks = [
    { label: "8+ characters", ok: password.length >= 8 },
    { label: "One number", ok: /\d/.test(password) },
    { label: "Upper & lower case", ok: /[a-z]/.test(password) && /[A-Z]/.test(password) },
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email || !password) {
      toast.error("Please fill in all fields");
      return;
    }
    
    setIsLoading(true);
    try {
      // Create a simple username from the name or email
      const username = name.replace(/\s+/g, '').toLowerCase() || email.split('@')[0];
      
      await register({ username, email, password });
      toast.success("Account created successfully! Please sign in.");
      navigate({ to: "/login" });
    } catch (error) {
      toast.error("Failed to create account. Email or username may already exist.");
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthLayout
      title="Create your account"
      subtitle="Start studying smarter in under a minute."
      footer={
        <>
          Already have an account?{" "}
          <Link to="/login" className="font-medium text-primary hover:text-primary/80 underline-offset-4 hover:underline">
            Sign in
          </Link>
        </>
      }
    >
      <div className="mb-5 flex items-center gap-2 rounded-lg border border-gold/30 bg-gold/5 px-3 py-2 text-xs text-foreground/80">
        <Sparkles className="h-3.5 w-3.5 text-gold" />
        Free for BUK students — no credit card required.
      </div>

      <form className="space-y-5" onSubmit={handleSubmit}>
        <div className="space-y-2">
          <Label htmlFor="name">Full name</Label>
          <div className="relative">
            <User className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input id="name" type="text" placeholder="Aisha Ibrahim" className="h-11 pl-9" autoComplete="name" value={name} onChange={(e) => setName(e.target.value)} />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="email">Student email</Label>
          <div className="relative">
            <Mail className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input id="email" type="email" placeholder="you@buk.edu.ng" className="h-11 pl-9" autoComplete="email" value={email} onChange={(e) => setEmail(e.target.value)} />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="password">Password</Label>
          <div className="relative">
            <Lock className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              id="password"
              type={show ? "text" : "password"}
              placeholder="Create a strong password"
              className="h-11 pl-9 pr-10"
              autoComplete="new-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <button
              type="button"
              onClick={() => setShow((s) => !s)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
              aria-label={show ? "Hide password" : "Show password"}
            >
              {show ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </button>
          </div>
          <ul className="mt-2 grid grid-cols-1 gap-1.5 sm:grid-cols-3">
            {checks.map((c) => (
              <li key={c.label} className="flex items-center gap-1.5 text-xs text-muted-foreground">
                <span
                  className={`flex h-4 w-4 items-center justify-center rounded-full border ${
                    c.ok ? "border-gold bg-gold/15 text-gold-foreground" : "border-border"
                  }`}
                >
                  {c.ok && <Check className="h-3 w-3 text-primary" />}
                </span>
                {c.label}
              </li>
            ))}
          </ul>
        </div>

        <label className="flex items-start gap-2 text-xs text-muted-foreground">
          <Checkbox id="terms" className="mt-0.5" defaultChecked />
          <span>
            I agree to the{" "}
            <a href="#" className="font-medium text-primary hover:underline">Terms</a> and{" "}
            <a href="#" className="font-medium text-primary hover:underline">Privacy Policy</a>.
          </span>
        </label>

        <Button type="submit" className="w-full h-11 group" size="lg" disabled={isLoading}>
          {isLoading ? "Creating..." : "Create account"}
          {!isLoading && <ArrowRight className="ml-1 h-4 w-4 transition-transform group-hover:translate-x-0.5" />}
        </Button>

        <div className="relative py-1">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-border" />
          </div>
          <div className="relative flex justify-center text-xs uppercase tracking-wider">
            <span className="bg-card px-3 text-muted-foreground">or</span>
          </div>
        </div>

        <Button type="button" variant="outline" className="w-full h-11" asChild>
          <Link to="/login">Sign in instead</Link>
        </Button>
      </form>
    </AuthLayout>
  );
}
