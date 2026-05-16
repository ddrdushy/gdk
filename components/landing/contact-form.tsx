"use client";

import { useState } from "react";
import { Loader2, Send, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

const ORG_TYPES = [
  "Accelerator",
  "Government / Public Agency",
  "University Innovation Hub",
  "Corporate Innovation Team",
  "Ecosystem Platform",
  "Investor / VC",
  "Other",
];

export function ContactForm() {
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setSubmitting(true);
    // TODO: wire up to /api/contact (Firestore lead capture) once Firebase is configured
    await new Promise((r) => setTimeout(r, 700));
    setSubmitting(false);
    setSubmitted(true);
  }

  if (submitted) {
    return (
      <div className="rounded-2xl border border-emerald-200 bg-emerald-50 p-10 text-center">
        <CheckCircle2 className="mx-auto h-10 w-10 text-emerald-600" />
        <h3 className="mt-4 text-xl font-semibold text-navy-950">Thank you.</h3>
        <p className="mt-2 text-sm text-navy-700">
          We&apos;ll reach out within one working day.
        </p>
      </div>
    );
  }

  return (
    <form
      onSubmit={onSubmit}
      className="rounded-2xl border border-navy-100 bg-white p-7 shadow-sm space-y-5"
    >
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-1.5">
          <Label htmlFor="name">Name</Label>
          <Input id="name" name="name" required placeholder="Jane Founder" />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="email">Work email</Label>
          <Input id="email" name="email" type="email" required placeholder="jane@org.com" />
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-1.5">
          <Label htmlFor="organisation">Organisation</Label>
          <Input id="organisation" name="organisation" required placeholder="Your org" />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="role">Your role</Label>
          <Input id="role" name="role" required placeholder="Programme Director" />
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-1.5">
          <Label htmlFor="orgType">Organisation type</Label>
          <select
            id="orgType"
            name="orgType"
            required
            className="flex h-10 w-full rounded-lg border border-navy-200 bg-white px-3 py-2 text-sm text-navy-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-deep focus-visible:ring-offset-1"
            defaultValue=""
          >
            <option value="" disabled>Select one…</option>
            {ORG_TYPES.map((t) => (
              <option key={t} value={t}>{t}</option>
            ))}
          </select>
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="startups">Startups reviewed / year</Label>
          <Input id="startups" name="startups" type="number" min={0} placeholder="50" />
        </div>
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="message">Message</Label>
        <Textarea id="message" name="message" placeholder="Tell us what you're trying to verify, scale, or improve…" rows={5} />
      </div>

      <Button type="submit" variant="primary" size="lg" disabled={submitting} className="w-full">
        {submitting ? (
          <><Loader2 className="h-4 w-4 animate-spin" /> Sending…</>
        ) : (
          <><Send className="h-4 w-4" /> Request demo</>
        )}
      </Button>
      <p className="text-center text-[11px] text-navy-500">
        By submitting, you agree to be contacted about TrustPass AI. We never share your details.
      </p>
    </form>
  );
}
