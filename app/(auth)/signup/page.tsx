"use client";

import { useState, Suspense } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Loader2, UserPlus } from "lucide-react";
import { toast } from "sonner";
import { useAuth } from "@/lib/auth/auth-provider";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { GoogleButton } from "@/components/auth/google-button";
import { USER_ROLES, USER_ROLE_LABELS, type UserRole } from "@/lib/schemas/user";
import { friendlyAuthError } from "@/lib/auth/firebase-errors";

function SignupInner() {
  const router = useRouter();
  const params = useSearchParams();
  const presetRole = params.get("role") as UserRole | null;
  const { signUpWithEmail, signInWithGoogle, setRole: setUserRole } = useAuth();
  const [submitting, setSubmitting] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [role, setRole] = useState<UserRole | "">(
    presetRole && USER_ROLES.includes(presetRole) ? presetRole : ""
  );

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!role) {
      toast.error("Pick a role first");
      return;
    }
    setSubmitting(true);
    const form = new FormData(e.currentTarget);
    const email = form.get("email") as string;
    const password = form.get("password") as string;
    const displayName = form.get("displayName") as string;
    try {
      await signUpWithEmail({ email, password, displayName });
      await setUserRole(role);
      toast.success("Account created.");
      router.push("/role");
    } catch (err: unknown) {
      const code = err && typeof err === "object" && "code" in err ? String((err as { code: unknown }).code) : "";
      if (code === "auth/email-already-in-use") {
        toast.error("An account with that email already exists.", {
          action: {
            label: "Log in",
            onClick: () => router.push(`/login?email=${encodeURIComponent(email)}`),
          },
          duration: 8000,
        });
      } else {
        toast.error(friendlyAuthError(err, "Sign-up failed"));
      }
    } finally {
      setSubmitting(false);
    }
  }

  async function onGoogle() {
    setGoogleLoading(true);
    try {
      await signInWithGoogle();
      if (role) await setUserRole(role);
      router.push("/role");
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Google sign-in failed";
      toast.error(msg.replace("Firebase: ", ""));
    } finally {
      setGoogleLoading(false);
    }
  }

  return (
    <div className="rounded-2xl border border-navy-100 bg-white p-8 shadow-xl shadow-navy-900/5">
      <h1 className="text-2xl font-semibold tracking-tight text-navy-950">Create your account</h1>
      <p className="mt-1 text-sm text-navy-600">Start building your passport.</p>

      <div className="mt-6">
        <GoogleButton onClick={onGoogle} loading={googleLoading} label="Sign up with Google" />
        <div className="my-4 flex items-center gap-3 text-[11px] uppercase tracking-wider text-navy-400">
          <div className="h-px flex-1 bg-navy-200" />
          or
          <div className="h-px flex-1 bg-navy-200" />
        </div>
      </div>

      <form className="space-y-4" onSubmit={onSubmit}>
        <div className="space-y-1.5">
          <Label htmlFor="displayName">Full name</Label>
          <Input id="displayName" name="displayName" required autoComplete="name" placeholder="Jane Founder" />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="email">Email</Label>
          <Input id="email" name="email" type="email" required autoComplete="email" placeholder="you@org.com" />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="password">Password</Label>
          <Input id="password" name="password" type="password" required minLength={8} autoComplete="new-password" />
          <p className="text-[11px] text-navy-500">At least 8 characters.</p>
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="role">I am a…</Label>
          <select
            id="role"
            required
            value={role}
            onChange={(e) => setRole(e.target.value as UserRole)}
            className="flex h-10 w-full rounded-lg border border-navy-200 bg-white px-3 py-2 text-sm text-navy-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-deep"
          >
            <option value="" disabled>Select your role</option>
            {USER_ROLES.filter((r) => r !== "ecosystem-owner").map((r) => (
              <option key={r} value={r}>{USER_ROLE_LABELS[r]}</option>
            ))}
          </select>
        </div>

        <Button type="submit" variant="primary" size="lg" disabled={submitting} className="w-full">
          {submitting ? (
            <><Loader2 className="h-4 w-4 animate-spin" /> Creating account…</>
          ) : (
            <><UserPlus className="h-4 w-4" /> Create account</>
          )}
        </Button>
      </form>

      <p className="mt-6 text-center text-sm text-navy-600">
        Already have an account?{" "}
        <Link href="/login" className="font-medium text-navy-900 hover:text-cyan-deep">
          Log in
        </Link>
      </p>
    </div>
  );
}

export default function SignupPage() {
  return (
    <Suspense>
      <SignupInner />
    </Suspense>
  );
}
