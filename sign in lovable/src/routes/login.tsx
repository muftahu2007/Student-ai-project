import { createFileRoute, Link, useRouter } from "@tanstack/react-router";
import { useState } from "react";
import { Eye, EyeOff, Mail, Lock, ArrowRight } from "lucide-react";
import { AuthLayout } from "@/components/auth/AuthLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { login } from "@/lib/api";

export const Route = createFileRoute("/login")({
  head: () => ({
    meta: [
      { title: "Sign in · BUK Scholar AI" },
      { name: "description", content: "Sign in to BUK Scholar AI — your AI study companion for Bayero University Kano." },
    ],
  }),
  component: LoginPage,
});

function LoginPage() {
  const [show, setShow] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const data = await login({ username: email, password });
      localStorage.setItem("access_token", data.access);
      router.navigate({ to: "/dashboard" });
    } catch (err) {
      setError("Failed to sign in. Please check your credentials.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout
      title="Welcome back"
      subtitle="Sign in to continue your learning journey."
      footer={
        <>
          New to BUK Scholar AI?{" "}
          <Link to="/register" className="font-medium text-primary hover:text-primary/80 underline-offset-4 hover:underline">
            Create an account
          </Link>
        </>
      }
    >
      <form className="space-y-5" onSubmit={handleLogin}>
        <div className="space-y-2">
          <Label htmlFor="email">Student email (or username)</Label>
          <div className="relative">
            <Mail className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input id="email" type="text" placeholder="you@buk.edu.ng" className="h-11 pl-9" autoComplete="email" value={email} onChange={e => setEmail(e.target.value)} required />
          </div>
        </div>

        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Label htmlFor="password">Password</Label>
            <Link to="/forgot-password" className="text-xs font-medium text-primary hover:text-primary/80">
              Forgot password?
            </Link>
          </div>
          <div className="relative">
            <Lock className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              id="password"
              type={show ? "text" : "password"}
              placeholder="Enter your password"
              className="h-11 pl-9 pr-10"
              autoComplete="current-password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              required
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
        </div>

        {error && <div className="text-sm text-red-500">{error}</div>}

        <label className="flex items-center gap-2 text-sm text-muted-foreground">
          <Checkbox id="remember" />
          <span>Keep me signed in on this device</span>
        </label>

        <Button type="submit" className="w-full h-11 group" size="lg" disabled={loading}>
          {loading ? "Signing in..." : (
            <>
              Sign in
              <ArrowRight className="ml-1 h-4 w-4 transition-transform group-hover:translate-x-0.5" />
            </>
          )}
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
          <Link to="/register">Create a new account</Link>
        </Button>
      </form>
    </AuthLayout>
  );
}
