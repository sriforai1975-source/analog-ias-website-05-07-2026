import { useEffect, useState, type FormEvent } from "react";
import { createFileRoute, useRouter, Link } from "@tanstack/react-router";
import { GraduationCap, Loader2, CheckCircle2 } from "lucide-react";

import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/set-password")({
  ssr: false,
  head: () => ({
    meta: [
      { title: "Set Your Password — ANALOG IAS ACADEMY" },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: SetPasswordPage,
});

function SetPasswordPage() {
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [ready, setReady] = useState(false);
  const [done, setDone] = useState(false);

  useEffect(() => {
    // Invite / recovery links establish a session from the URL hash.
    const { data: sub } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session) setReady(true);
    });
    supabase.auth.getSession().then(({ data }) => {
      if (data.session) setReady(true);
    });
    return () => sub.subscription.unsubscribe();
  }, []);

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    if (password.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }
    if (password !== confirm) {
      setError("Passwords do not match.");
      return;
    }
    setLoading(true);
    try {
      const { error } = await supabase.auth.updateUser({ password });
      if (error) throw error;
      setDone(true);
      setTimeout(() => router.navigate({ to: "/admin" }), 1200);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not set password");
    } finally {
      setLoading(false);
    }
  }

  return (
    <section className="grid min-h-[calc(100vh-4rem)] place-items-center bg-muted/40 px-4 py-12">
      <div className="w-full max-w-md rounded-2xl border border-border bg-card p-8 shadow-card">
        <div className="flex flex-col items-center text-center">
          <span className="grid h-12 w-12 place-items-center rounded-xl bg-primary text-primary-foreground">
            <GraduationCap className="h-6 w-6" />
          </span>
          <h1 className="mt-4 text-2xl font-bold text-foreground">Set your password</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Create a password to activate your ANALOG IAS ACADEMY account.
          </p>
        </div>

        {done ? (
          <div className="mt-6 flex items-center gap-2 rounded-lg bg-accent px-4 py-3 text-sm font-medium text-primary">
            <CheckCircle2 className="h-5 w-5 text-gold" /> Password set! Redirecting…
          </div>
        ) : !ready ? (
          <div className="mt-8 flex flex-col items-center gap-3 text-center text-sm text-muted-foreground">
            <Loader2 className="h-5 w-5 animate-spin text-primary" />
            Waiting for your invitation link to load. If this doesn't continue, open the link from
            your email again.
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="mt-6 space-y-4">
            <div>
              <label htmlFor="password" className="mb-1.5 block text-sm font-medium text-foreground">
                New password
              </label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                minLength={6}
                autoComplete="new-password"
                className="w-full rounded-lg border border-input bg-background px-4 py-2.5 text-sm outline-none transition-colors focus:border-ring focus:ring-2 focus:ring-ring/30"
              />
            </div>
            <div>
              <label htmlFor="confirm" className="mb-1.5 block text-sm font-medium text-foreground">
                Confirm password
              </label>
              <input
                id="confirm"
                type="password"
                value={confirm}
                onChange={(e) => setConfirm(e.target.value)}
                required
                minLength={6}
                autoComplete="new-password"
                className="w-full rounded-lg border border-input bg-background px-4 py-2.5 text-sm outline-none transition-colors focus:border-ring focus:ring-2 focus:ring-ring/30"
              />
            </div>

            {error && (
              <p className="rounded-lg bg-destructive/10 px-3 py-2 text-sm text-destructive">{error}</p>
            )}

            <button
              type="submit"
              disabled={loading}
              className="inline-flex w-full items-center justify-center gap-2 rounded-lg bg-secondary px-6 py-3 text-sm font-semibold text-secondary-foreground shadow-gold transition-transform hover:-translate-y-0.5 disabled:opacity-60"
            >
              {loading && <Loader2 className="h-4 w-4 animate-spin" />}
              Set password
            </button>
          </form>
        )}

        <p className="mt-6 text-center text-xs text-muted-foreground">
          <Link to="/auth" className="hover:text-primary">
            Go to sign in
          </Link>
        </p>
      </div>
    </section>
  );
}
