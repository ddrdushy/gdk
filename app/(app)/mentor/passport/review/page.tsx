"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { doc, serverTimestamp, setDoc } from "firebase/firestore";
import { Loader2, Save, Sparkles, AlertTriangle } from "lucide-react";
import { toast } from "sonner";
import { useAuth } from "@/lib/auth/auth-provider";
import { getDb } from "@/lib/firebase/client";
import { clearMentorDraft, loadMentorDraft, saveMentorDraft, type DraftMentor } from "@/lib/passport-store";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { ConfidencePill } from "@/components/passport/confidence-pill";
import { mentorProfileSchema } from "@/lib/schemas/mentor";
import type { MentorAutofill } from "@/lib/schemas/passport";

type FormState = {
  mentorName: string;
  expertiseAreas: string;
  sectorFocus: string;
  country: string;
  organisation: string;
  startupStageFit: string;
  availability: string;
  credentials: string;
  bio: string;
  linkedinUrl: string;
};

function arrayToString(v: unknown): string {
  if (Array.isArray(v)) return v.join(", ");
  return v == null ? "" : String(v);
}

function autofillToForm(a: MentorAutofill | undefined): FormState {
  return {
    mentorName: arrayToString(a?.mentorName?.value),
    expertiseAreas: arrayToString(a?.expertiseAreas?.value),
    sectorFocus: arrayToString(a?.sectorFocus?.value),
    country: arrayToString(a?.country?.value),
    organisation: arrayToString(a?.organisation?.value),
    startupStageFit: arrayToString(a?.startupStageFit?.value),
    availability: arrayToString(a?.availability?.value),
    credentials: arrayToString(a?.credentials?.value),
    bio: arrayToString(a?.bio?.value),
    linkedinUrl: arrayToString(a?.linkedinUrl?.value),
  };
}

export default function ReviewMentorPage() {
  const router = useRouter();
  const { user } = useAuth();
  const [draft, setDraft] = useState<DraftMentor | null>(null);
  const [form, setForm] = useState<FormState | null>(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const d = loadMentorDraft();
    if (!d || !d.autofill) {
      router.replace("/mentor/passport/new");
      return;
    }
    setDraft(d);
    setForm(autofillToForm(d.autofill));
  }, [router]);

  if (!draft || !form) {
    return (
      <div className="flex h-[60vh] items-center justify-center">
        <Loader2 className="h-6 w-6 animate-spin text-navy-400" />
      </div>
    );
  }

  const a = draft.autofill!;
  function set<K extends keyof FormState>(key: K, value: string) {
    setForm((f) => (f ? { ...f, [key]: value } : f));
  }

  async function onSubmit() {
    if (!user || !form) return;
    const splitList = (s: string) =>
      s.split(/,|\n|;/).map((x) => x.trim()).filter(Boolean);

    const parsed = mentorProfileSchema.safeParse({
      mentorName: form.mentorName,
      expertiseAreas: splitList(form.expertiseAreas),
      sectorFocus: splitList(form.sectorFocus),
      country: form.country,
      organisation: form.organisation || undefined,
      startupStageFit: form.startupStageFit ? splitList(form.startupStageFit) : undefined,
      availability: form.availability || undefined,
      credentials: form.credentials || undefined,
      bio: form.bio,
      linkedinUrl: form.linkedinUrl || undefined,
    });
    if (!parsed.success) {
      const first = parsed.error.issues[0];
      toast.error(`${first.path.join(".")}: ${first.message}`);
      return;
    }
    setSaving(true);
    try {
      const db = getDb();
      const ref = doc(db, "mentors", user.uid);
      await setDoc(
        ref,
        {
          ...parsed.data,
          ownerUid: user.uid,
          status: "submitted",
          autofill: draft?.autofill,
          source: draft?.source,
          createdAt: serverTimestamp(),
          updatedAt: serverTimestamp(),
        },
        { merge: true }
      );
      saveMentorDraft({ ...draft!, confirmedProfile: parsed.data });
      toast.success("Profile confirmed. Running AI verification…");
      router.push("/mentor/passport/verifying");
    } catch (err: unknown) {
      console.error(err);
      toast.error(err instanceof Error ? err.message : "Could not save profile");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="mx-auto max-w-4xl px-6 py-10 lg:px-8">
      <div>
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-cyan-deep">
          Step 2 of 3
        </p>
        <h1 className="mt-2 text-3xl font-semibold tracking-tight text-navy-950">
          Review your Mentor Passport profile.
        </h1>
      </div>

      <Card className="mt-6 border-cyan-100 bg-cyan-50/40 p-5">
        <div className="flex items-start gap-3">
          <div className="flex h-9 w-9 flex-none items-center justify-center rounded-lg bg-cyan-deep text-white">
            <Sparkles className="h-4 w-4" />
          </div>
          <div>
            <p className="text-sm font-semibold text-navy-900">
              AI summary <ConfidencePill level={a.overallConfidence} />
            </p>
            <p className="mt-1 text-sm text-navy-700">{a.summary}</p>
          </div>
        </div>
      </Card>

      {a.missingFields?.length > 0 && (
        <div className="mt-4 rounded-xl border border-amber-200 bg-amber-50 p-4">
          <div className="flex items-start gap-2 text-amber-800">
            <AlertTriangle className="h-4 w-4 mt-0.5 flex-none" />
            <p className="text-sm">
              <span className="font-medium">Missing: </span>
              {a.missingFields.join(" · ")}
            </p>
          </div>
        </div>
      )}

      <Card className="mt-6 p-6 space-y-5">
        <div className="grid gap-4 md:grid-cols-2">
          <Field label="Name" required aiField={a.mentorName}>
            <Input value={form.mentorName} onChange={(e) => set("mentorName", e.target.value)} />
          </Field>
          <Field label="Country" required aiField={a.country}>
            <Input value={form.country} onChange={(e) => set("country", e.target.value)} />
          </Field>
          <Field label="Organisation" aiField={a.organisation}>
            <Input value={form.organisation} onChange={(e) => set("organisation", e.target.value)} />
          </Field>
          <Field label="Availability" aiField={a.availability}>
            <Input value={form.availability} onChange={(e) => set("availability", e.target.value)} placeholder="e.g. 2 hrs/week" />
          </Field>
        </div>

        <Field label="Expertise areas (comma-separated)" required aiField={a.expertiseAreas}>
          <Input
            value={form.expertiseAreas}
            onChange={(e) => set("expertiseAreas", e.target.value)}
            placeholder="e.g. Healthcare compliance, hospital pilots, regulatory affairs"
          />
        </Field>
        <Field label="Sector focus (comma-separated)" required aiField={a.sectorFocus}>
          <Input
            value={form.sectorFocus}
            onChange={(e) => set("sectorFocus", e.target.value)}
            placeholder="e.g. HealthTech, AI, MedTech"
          />
        </Field>
        <Field label="Startup stage fit (comma-separated)" aiField={a.startupStageFit}>
          <Input
            value={form.startupStageFit}
            onChange={(e) => set("startupStageFit", e.target.value)}
            placeholder="e.g. MVP, Early Revenue"
          />
        </Field>

        <Field label="Bio" required aiField={a.bio}>
          <Textarea rows={4} value={form.bio} onChange={(e) => set("bio", e.target.value)} />
        </Field>
        <Field label="Credentials" aiField={a.credentials}>
          <Textarea rows={3} value={form.credentials} onChange={(e) => set("credentials", e.target.value)} />
        </Field>
        <Field label="LinkedIn URL" aiField={a.linkedinUrl}>
          <Input value={form.linkedinUrl} onChange={(e) => set("linkedinUrl", e.target.value)} placeholder="https://linkedin.com/in/…" />
        </Field>
      </Card>

      <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <Button
          type="button"
          variant="outline"
          size="lg"
          onClick={() => {
            clearMentorDraft();
            router.push("/mentor/passport/new");
          }}
        >
          Start over
        </Button>
        <Button type="button" variant="primary" size="lg" onClick={onSubmit} disabled={saving}>
          {saving ? (
            <><Loader2 className="h-4 w-4 animate-spin" /> Saving…</>
          ) : (
            <><Save className="h-4 w-4" /> Confirm profile</>
          )}
        </Button>
      </div>
    </div>
  );
}

function Field({
  label,
  required,
  aiField,
  children,
}: {
  label: string;
  required?: boolean;
  aiField?: { value?: unknown; confidence?: "high" | "medium" | "low" | null; source?: string | null };
  children: React.ReactNode;
}) {
  return (
    <div className="space-y-1.5">
      <div className="flex items-center justify-between">
        <Label>
          {label}
          {required && <span className="ml-1 text-rose-500">*</span>}
        </Label>
        <ConfidencePill level={aiField?.confidence ?? undefined} />
      </div>
      {children}
      {aiField?.source && (
        <p className="text-[10px] italic text-navy-500 line-clamp-1">↳ {aiField.source}</p>
      )}
    </div>
  );
}
