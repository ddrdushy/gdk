"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { doc, serverTimestamp, setDoc } from "firebase/firestore";
import { Loader2, Save, Sparkles, AlertTriangle } from "lucide-react";
import { toast } from "sonner";
import { useAuth } from "@/lib/auth/auth-provider";
import { getDb } from "@/lib/firebase/client";
import { clearDraft, loadDraft, saveDraft, type DraftStartup } from "@/lib/passport-store";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { ConfidencePill } from "@/components/passport/confidence-pill";
import {
  SECTORS,
  STAGES,
  startupProfileSchema,
  type StartupAutofill,
} from "@/lib/schemas/passport";

type FormState = {
  startupName: string;
  sector: string;
  country: string;
  stage: string;
  founderName: string;
  productSummary: string;
  problemSolved: string;
  targetCustomers: string;
  businessModel: string;
  supportNeeded: string;
  traction: string;
  websiteUrl: string;
  teamSize: string;
  fundingStatus: string;
};

function autofillToForm(a: StartupAutofill | undefined): FormState {
  const v = (f: { value?: unknown } | undefined) =>
    f?.value == null ? "" : String(f.value);
  return {
    startupName: v(a?.startupName),
    sector: v(a?.sector),
    country: v(a?.country),
    stage: v(a?.stage),
    founderName: v(a?.founderName),
    productSummary: v(a?.productSummary),
    problemSolved: v(a?.problemSolved),
    targetCustomers: v(a?.targetCustomers),
    businessModel: v(a?.businessModel),
    supportNeeded: v(a?.supportNeeded),
    traction: v(a?.traction),
    websiteUrl: v(a?.websiteUrl),
    teamSize: v(a?.teamSize),
    fundingStatus: v(a?.fundingStatus),
  };
}

export default function ReviewPassportPage() {
  const router = useRouter();
  const { user } = useAuth();
  const [draft, setDraft] = useState<DraftStartup | null>(null);
  const [form, setForm] = useState<FormState | null>(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const d = loadDraft();
    if (!d || !d.autofill) {
      router.replace("/founder/passport/new");
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
  const filledCount = Object.values(form).filter((v) => v.trim()).length;
  const totalCount = Object.keys(form).length;

  function set<K extends keyof FormState>(key: K, value: string) {
    setForm((f) => (f ? { ...f, [key]: value } : f));
  }

  async function onSubmit() {
    if (!user || !form) return;
    const parsed = startupProfileSchema.safeParse({
      ...form,
      teamSize: form.teamSize ? Number(form.teamSize) : undefined,
    });
    if (!parsed.success) {
      const first = parsed.error.issues[0];
      toast.error(`${first.path.join(".")}: ${first.message}`);
      return;
    }
    setSaving(true);
    try {
      const db = getDb();
      const ref = doc(db, "startups", user.uid);
      await setDoc(
        ref,
        {
          ...parsed.data,
          ownerUid: user.uid,
          status: "submitted",
          autofill: draft?.autofill,
          source: draft?.source,
          // Persist raw evidence text so the founder can append more later
          // (improve flow) without losing the original context.
          evidence: draft?.evidence ?? "",
          createdAt: serverTimestamp(),
          updatedAt: serverTimestamp(),
        },
        { merge: true }
      );
      saveDraft({ ...draft!, confirmedProfile: parsed.data });
      toast.success("Profile confirmed. Running AI verification…");
      router.push("/founder/passport/verifying");
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
          Review your passport profile.
        </h1>
        <p className="mt-1 text-sm text-navy-600">
          AI extracted <strong>{filledCount}</strong> of {totalCount} fields. Confirm what looks right and complete the rest.
        </p>
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
            <div className="text-sm">
              <p className="font-medium">AI flagged {a.missingFields.length} missing field{a.missingFields.length === 1 ? "" : "s"}:</p>
              <p className="mt-1 text-amber-700">{a.missingFields.join(" · ")}</p>
            </div>
          </div>
        </div>
      )}

      <Card className="mt-6 p-6 space-y-5">
        <div className="grid gap-4 md:grid-cols-2">
          <Field label="Startup name" required aiField={a.startupName}>
            <Input value={form.startupName} onChange={(e) => set("startupName", e.target.value)} />
          </Field>
          <Field label="Founder name" required aiField={a.founderName}>
            <Input value={form.founderName} onChange={(e) => set("founderName", e.target.value)} />
          </Field>
          <Field label="Sector" required aiField={a.sector}>
            <select
              value={form.sector}
              onChange={(e) => set("sector", e.target.value)}
              className="flex h-10 w-full rounded-lg border border-navy-200 bg-white px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-deep"
            >
              <option value="" disabled>Select sector</option>
              {SECTORS.map((s) => <option key={s} value={s}>{s}</option>)}
              {form.sector && !SECTORS.includes(form.sector as typeof SECTORS[number]) && (
                <option value={form.sector}>{form.sector}</option>
              )}
            </select>
          </Field>
          <Field label="Stage" required aiField={a.stage}>
            <select
              value={form.stage}
              onChange={(e) => set("stage", e.target.value)}
              className="flex h-10 w-full rounded-lg border border-navy-200 bg-white px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-deep"
            >
              <option value="" disabled>Select stage</option>
              {STAGES.map((s) => <option key={s} value={s}>{s}</option>)}
              {form.stage && !STAGES.includes(form.stage as typeof STAGES[number]) && (
                <option value={form.stage}>{form.stage}</option>
              )}
            </select>
          </Field>
          <Field label="Country" required aiField={a.country}>
            <Input value={form.country} onChange={(e) => set("country", e.target.value)} />
          </Field>
          <Field label="Team size" aiField={a.teamSize}>
            <Input type="number" min={0} value={form.teamSize} onChange={(e) => set("teamSize", e.target.value)} />
          </Field>
          <Field label="Website" aiField={a.websiteUrl}>
            <Input value={form.websiteUrl} onChange={(e) => set("websiteUrl", e.target.value)} placeholder="https://" />
          </Field>
          <Field label="Funding status" aiField={a.fundingStatus}>
            <Input value={form.fundingStatus} onChange={(e) => set("fundingStatus", e.target.value)} placeholder="Bootstrapped / Seed / Series A" />
          </Field>
        </div>

        <Field label="Product summary" required aiField={a.productSummary}>
          <Textarea rows={3} value={form.productSummary} onChange={(e) => set("productSummary", e.target.value)} />
        </Field>
        <Field label="Problem solved" aiField={a.problemSolved}>
          <Textarea rows={2} value={form.problemSolved} onChange={(e) => set("problemSolved", e.target.value)} />
        </Field>
        <div className="grid gap-4 md:grid-cols-2">
          <Field label="Target customers" aiField={a.targetCustomers}>
            <Textarea rows={2} value={form.targetCustomers} onChange={(e) => set("targetCustomers", e.target.value)} />
          </Field>
          <Field label="Business model" aiField={a.businessModel}>
            <Textarea rows={2} value={form.businessModel} onChange={(e) => set("businessModel", e.target.value)} />
          </Field>
          <Field label="Traction" aiField={a.traction}>
            <Textarea rows={2} value={form.traction} onChange={(e) => set("traction", e.target.value)} />
          </Field>
          <Field label="Support needed" aiField={a.supportNeeded}>
            <Textarea rows={2} value={form.supportNeeded} onChange={(e) => set("supportNeeded", e.target.value)} />
          </Field>
        </div>
      </Card>

      <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <Button
          type="button"
          variant="outline"
          size="lg"
          onClick={() => {
            clearDraft();
            router.push("/founder/passport/new");
          }}
        >
          Start over
        </Button>
        <Button type="button" variant="primary" size="lg" onClick={onSubmit} disabled={saving}>
          {saving ? (
            <><Loader2 className="h-4 w-4 animate-spin" /> Saving…</>
          ) : (
            <><Save className="h-4 w-4" /> Confirm & run verification</>
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
