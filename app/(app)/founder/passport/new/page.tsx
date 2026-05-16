"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  FileUp,
  Globe2,
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
import { saveDraft } from "@/lib/passport-store";
import { EvidenceImporter } from "@/components/passport/evidence-importer";
import { EvidenceCharCounter } from "@/components/passport/evidence-char-counter";
import { cn } from "@/lib/utils";

type Source = "pitch-deck" | "website" | "description";

const SOURCES: Array<{ id: Source; icon: typeof FileUp; label: string; body: string }> = [
  {
    id: "pitch-deck",
    icon: FileUp,
    label: "Pitch deck",
    body: "Paste extracted text from your deck. We'll fill 14+ fields automatically.",
  },
  {
    id: "website",
    icon: Globe2,
    label: "Website",
    body: "Paste your website copy or about page. AI infers product, sector, and stage.",
  },
  {
    id: "description",
    icon: PenLine,
    label: "Write a description",
    body: "Describe your startup in plain language. AI structures it into a passport profile.",
  },
];

export default function NewPassportPage() {
  const router = useRouter();
  const [source, setSource] = useState<Source>("description");
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
        body: JSON.stringify({
          type: "startup",
          evidence,
          sourceLabel: sourceLabel || source,
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error ?? "AI extraction failed");
      }
      saveDraft({
        source,
        sourceLabel,
        evidence,
        autofill: data.autofill,
        createdAt: Date.now(),
      });
      router.push("/founder/passport/review");
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
          Let&apos;s build your passport.
        </h1>
        <p className="mt-1 text-sm text-navy-600">
          Skip the long form. Paste evidence, and TrustPass AI prepares your profile in seconds.
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
          validateAs="A startup profile, pitch deck, company website, or founder description — must mention what the startup does, the founder, sector / stage, and ideally traction, business model, or customers."
        />
        <div className="space-y-1.5">
          <Label htmlFor="source-label">Source label (optional)</Label>
          <Input
            id="source-label"
            value={sourceLabel}
            onChange={(e) => setSourceLabel(e.target.value)}
            placeholder={
              source === "pitch-deck"
                ? "e.g. MediNova Series A deck.pdf"
                : source === "website"
                  ? "e.g. medinova.ai/about"
                  : "e.g. founder narrative"
            }
          />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="evidence">{sourceMeta.label} content</Label>
          <Textarea
            id="evidence"
            value={evidence}
            onChange={(e) => setEvidence(e.target.value)}
            placeholder={
              source === "description"
                ? "We're MediNova AI — an AI triage assistant for hospital emergency rooms. Built by Dr. Aliya Khan and a team of 5 ex-Cerner engineers. Live pilot at Sunway Medical Centre in Malaysia. MVP launched Q4 2025…"
                : "Paste your text here. The richer it is, the better AI can extract."
            }
            rows={12}
            className="min-h-[260px]"
          />
          <EvidenceCharCounter chars={evidence.length} />
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

      <p className="mt-6 text-center text-xs text-navy-500">
        AI never publishes anything on its own. You confirm every field before your passport is created.
      </p>
    </div>
  );
}
