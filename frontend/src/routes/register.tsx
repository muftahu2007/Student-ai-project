import { createFileRoute, Link, useRouter } from "@tanstack/react-router";
import { useState } from "react";
import { toast } from "sonner";
import { register, googleLogin as googleLoginApi } from "@/lib/api";
import { Eye, EyeOff, Mail, Lock, User, ArrowRight, Check, Sparkles } from "lucide-react";
import { useGoogleLogin } from "@react-oauth/google";
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
  const router = useRouter();

  const handleGoogleSuccess = async (tokenResponse: any) => {
    setIsLoading(true);
    try {
      const data = await googleLoginApi(tokenResponse.access_token);
      localStorage.setItem("access_token", data.access);
      localStorage.setItem("refresh_token", data.refresh);
      toast.success("Signed in with Google!");
      setTimeout(() => {
        if (data.is_new_user) {
          router.navigate({ to: "/onboarding" });
        } else {
          router.navigate({ to: "/dashboard" });
        }
      }, 500);
    } catch (err) {
      toast.error("Google Sign-In failed. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const googleLogin = useGoogleLogin({
    onSuccess: handleGoogleSuccess,
    onError: () => toast.error("Google Sign-In failed. Please try again."),
  });

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
      setTimeout(() => {
        router.navigate({ to: "/login" });
      }, 500);
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
            <Input id="name" type="text" placeholder="Mahab ahmad" className="h-11 pl-9" autoComplete="name" value={name} onChange={(e) => setName(e.target.value)} />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="email">Student email</Label>
          <div className="relative">
            <Mail className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input id="email" type="email" placeholder="you@gmail.com" className="h-11 pl-9" autoComplete="email" value={email} onChange={(e) => setEmail(e.target.value)} />
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
            <span className="bg-card px-3 text-muted-foreground">or continue with</span>
          </div>
        </div>

        <Button type="button" variant="outline" className="w-full h-11 font-medium bg-card hover:bg-muted/50" onClick={() => googleLogin()}>
          <svg className="mr-2 h-5 w-5" viewBox="0 0 24 24">
            <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
            <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
            <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
            <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
            <path d="M1 1h22v22H1z" fill="none" />
          </svg>
          Continue with Google
        </Button>

        <Button type="button" variant="ghost" className="w-full h-11 hover:bg-muted/50" asChild>
          <Link to="/login">Sign in instead</Link>
        </Button>
      </form>
    </AuthLayout>
  );
}
