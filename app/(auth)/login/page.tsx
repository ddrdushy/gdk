"use client";

import { useState, Suspense } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Loader2, LogIn } from "lucide-react";
import { toast } from "sonner";
import { useAuth } from "@/lib/auth/auth-provider";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { GoogleButton } from "@/components/auth/google-button";
import { dashboardPathForRole } from "@/lib/schemas/user";
import { friendlyAuthError } from "@/lib/auth/firebase-errors";

function LoginInner() {
  const router = useRouter();
  const params = useSearchParams();
  const redirect = params.get("redirect");
  const { signInWithEmail, signInWithGoogle, refreshProfile } = useAuth();
  const [submitting, setSubmitting] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setSubmitting(true);
    const form = new FormData(e.currentTarget);
    const email = form.get("email") as string;
    const password = form.get("password") as string;
    try {
      await signInWithEmail(email, password);
      await refreshProfile();
      toast.success("Welcome back.");
      router.push(redirect ?? "/role");
    } catch (err: unknown) {
      toast.error(friendlyAuthError(err, "Sign-in failed"));
    } finally {
      setSubmitting(false);
    }
  }

  async function onGoogle() {
    setGoogleLoading(true);
    try {
      await signInWithGoogle();
      await refreshProfile();
      router.push(redirect ?? "/role");
    } catch (err: unknown) {
      toast.error(friendlyAuthError(err, "Google sign-in failed"));
    } finally {
      setGoogleLoading(false);
    }
  }

  return (
    <div className="rounded-2xl border border-navy-100 bg-white p-8 shadow-xl shadow-navy-900/5">
      <h1 className="text-2xl font-semibold tracking-tight text-navy-950">Welcome back</h1>
      <p className="mt-1 text-sm text-navy-600">Log in to access your passport.</p>

      <div className="mt-6 space-y-3">
        <GoogleButton onClick={onGoogle} loading={googleLoading} />
        <div className="flex items-center gap-3 text-[11px] uppercase tracking-wider text-navy-400">
          <div className="h-px flex-1 bg-navy-200" />
          or
          <div className="h-px flex-1 bg-navy-200" />
        </div>
      </div>

      <form className="mt-4 space-y-4" onSubmit={onSubmit}>
        <div className="space-y-1.5">
          <Label htmlFor="email">Email</Label>
          <Input id="email" name="email" type="email" required autoComplete="email" placeholder="you@org.com" />
        </div>
        <div className="space-y-1.5">
          <div className="flex items-center justify-between">
            <Label htmlFor="password">Password</Label>
            <Link href="/forgot-password" className="text-xs text-navy-600 hover:text-navy-900">
              Forgot password?
            </Link>
          </div>
          <Input id="password" name="password" type="password" required autoComplete="current-password" />
        </div>
        <Button type="submit" variant="primary" size="lg" disabled={submitting} className="w-full">
          {submitting ? (
            <><Loader2 className="h-4 w-4 animate-spin" /> Signing in…</>
          ) : (
            <><LogIn className="h-4 w-4" /> Log in</>
          )}
        </Button>
      </form>

      <p className="mt-6 text-center text-sm text-navy-600">
        New here?{" "}
        <Link href={`/signup${redirect ? `?redirect=${encodeURIComponent(redirect)}` : ""}`} className="font-medium text-navy-900 hover:text-cyan-deep">
          Create an account
        </Link>
      </p>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense>
      <LoginInner />
    </Suspense>
  );
}
