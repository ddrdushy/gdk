"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  FileUp,
  Linkedin,
  PenLine,
  Sparkles,
  Loader2,
  ArrowRight,
} from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { saveMentorDraft } from "@/lib/passport-store";
import { EvidenceImporter } from "@/components/passport/evidence-importer";
import { cn } from "@/lib/utils";

type Source = "cv" | "linkedin" | "bio";

const SOURCES: Array<{ id: Source; icon: typeof FileUp; label: string; body: string }> = [
  {
    id: "cv",
    icon: FileUp,
    label: "Paste CV",
    body: "Paste extracted text from your CV. AI structures it into a mentor profile.",
  },
  {
    id: "linkedin",
    icon: Linkedin,
    label: "Paste LinkedIn",
    body: "Paste the about + experience sections from your LinkedIn profile.",
  },
  {
    id: "bio",
    icon: PenLine,
    label: "Write a bio",
    body: "Describe your expertise, sector focus, and availability in plain language.",
  },
];

export default function NewMentorPassportPage() {
  const router = useRouter();
  const [source, setSource] = useState<Source>("bio");
  const [evidence, setEvidence] = useState("");
  const [sourceLabel, setSourceLabel] = useState("");
  const [submitting, setSubmitting] = useState(false);

  async function onBuild() {
    if (evidence.trim().length < 60) {
      toast.error("Add a bit more context — at least a couple of sentences.");
      return;
    }
    setSubmitting(true);
    try {
      const res = await fetch("/api/agents/passport-builder", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ type: "mentor", evidence, sourceLabel: sourceLabel || source }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "AI extraction failed");
      saveMentorDraft({
        source,
        sourceLabel,
        evidence,
        autofill: data.autofill,
        createdAt: Date.now(),
      });
      router.push("/mentor/passport/review");
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : "AI extraction failed");
    } finally {
      setSubmitting(false);
    }
  }

  const sourceMeta = SOURCES.find((s) => s.id === source)!;

  return (
    <div className="mx-auto max-w-3xl px-6 py-10 lg:px-8">
      <div>
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-cyan-deep">
          Step 1 of 3
        </p>
        <h1 className="mt-2 text-3xl font-semibold tracking-tight text-navy-950">
          Build your Mentor Passport.
        </h1>
        <p className="mt-1 text-sm text-navy-600">
          Paste your CV, LinkedIn, or a bio — AI turns it into a verified mentor profile.
        </p>
      </div>

      <div className="mt-8 grid gap-3 md:grid-cols-3">
        {SOURCES.map((s) => (
          <button
            key={s.id}
            type="button"
            onClick={() => setSource(s.id)}
            className={cn(
              "rounded-xl border bg-white p-4 text-left transition-all",
              source === s.id
                ? "border-cyan-deep ring-2 ring-cyan-deep/30 shadow-md"
                : "border-navy-100 hover:border-navy-200"
            )}
          >
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-navy-900 text-cyan-glow">
              <s.icon className="h-4 w-4" />
            </div>
            <p className="mt-3 text-sm font-semibold text-navy-950">{s.label}</p>
            <p className="mt-1 text-xs leading-relaxed text-navy-600">{s.body}</p>
          </button>
        ))}
      </div>

      <Card className="mt-6 p-6 space-y-4">
        <EvidenceImporter
          onExtracted={(text, label) => {
            setEvidence(text);
            if (!sourceLabel) setSourceLabel(label);
          }}
          disabled={submitting}
        />
        <div className="space-y-1.5">
          <Label htmlFor="source-label">Source label (optional)</Label>
          <Input
            id="source-label"
            value={sourceLabel}
            onChange={(e) => setSourceLabel(e.target.value)}
            placeholder={
              source === "cv"
                ? "e.g. Dr. Sarah Lim CV 2026.pdf"
                : source === "linkedin"
                  ? "e.g. linkedin.com/in/sarahlim"
                  : "e.g. mentor bio"
            }
          />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="evidence">{sourceMeta.label} content</Label>
          <Textarea
            id="evidence"
            value={evidence}
            onChange={(e) => setEvidence(e.target.value)}
            placeholder="Dr. Sarah Lim is a HealthTech advisor with 15 years in hospital systems and medical-device regulation. Previously Head of Compliance at Sunway Medical Centre. Mentored 12+ startups across SEA. Focus: healthcare data privacy, hospital pilot pathways, regulatory readiness…"
            rows={12}
            className="min-h-[260px]"
          />
          <p className="text-[11px] text-navy-500">
            {evidence.length} characters · Aim for at least 200 characters for best results.
          </p>
        </div>

        <div className="flex justify-end">
          <Button
            type="button"
            variant="primary"
            size="lg"
            onClick={onBuild}
            disabled={submitting || evidence.trim().length < 60}
          >
            {submitting ? (
              <><Loader2 className="h-4 w-4 animate-spin" /> AI extracting…</>
            ) : (
              <><Sparkles className="h-4 w-4" /> Build my passport <ArrowRight className="h-4 w-4" /></>
            )}
          </Button>
        </div>
      </Card>
    </div>
  );
}
