"use client";

import { useState } from "react";
import Link from "next/link";
import { sendPasswordResetEmail } from "firebase/auth";
import { Loader2, Mail, CheckCircle2 } from "lucide-react";
import { toast } from "sonner";
import { getFirebaseAuth } from "@/lib/firebase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { friendlyAuthError } from "@/lib/auth/firebase-errors";

export default function ForgotPasswordPage() {
  const [submitting, setSubmitting] = useState(false);
  const [sent, setSent] = useState(false);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setSubmitting(true);
    const email = (new FormData(e.currentTarget).get("email") as string).trim();
    try {
      await sendPasswordResetEmail(getFirebaseAuth(), email);
      setSent(true);
    } catch (err: unknown) {
      toast.error(friendlyAuthError(err, "Could not send reset email"));
    } finally {
      setSubmitting(false);
    }
  }

  if (sent) {
    return (
      <div className="rounded-2xl border border-emerald-200 bg-emerald-50 p-8 text-center">
        <CheckCircle2 className="mx-auto h-10 w-10 text-emerald-600" />
        <h1 className="mt-4 text-xl font-semibold text-navy-950">Check your inbox.</h1>
        <p className="mt-2 text-sm text-navy-700">
          We sent a password reset link. It may take a minute to arrive.
        </p>
        <Button asChild variant="outline" size="sm" className="mt-6">
          <Link href="/login">Back to log in</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="rounded-2xl border border-navy-100 bg-white p-8 shadow-xl shadow-navy-900/5">
      <h1 className="text-2xl font-semibold tracking-tight text-navy-950">Reset your password</h1>
      <p className="mt-1 text-sm text-navy-600">
        Enter your account email and we&apos;ll send you a reset link.
      </p>
      <form className="mt-6 space-y-4" onSubmit={onSubmit}>
        <div className="space-y-1.5">
          <Label htmlFor="email">Email</Label>
          <Input id="email" name="email" type="email" required autoComplete="email" placeholder="you@org.com" />
        </div>
        <Button type="submit" variant="primary" size="lg" disabled={submitting} className="w-full">
          {submitting ? (
            <><Loader2 className="h-4 w-4 animate-spin" /> Sending…</>
          ) : (
            <><Mail className="h-4 w-4" /> Send reset link</>
          )}
        </Button>
      </form>
      <p className="mt-6 text-center text-sm text-navy-600">
        Remembered it?{" "}
        <Link href="/login" className="font-medium text-navy-900 hover:text-cyan-deep">
          Back to log in
        </Link>
      </p>
    </div>
  );
}
