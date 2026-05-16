"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2, CheckCircle2, Sparkles } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const STEPS = [
  { id: "extraction", label: "Evidence Extraction Agent", body: "Reading documents and identifying claims, proof, and gaps." },
  { id: "eligibility", label: "Eligibility Agent", body: "Checking sector, stage, and programme alignment." },
  { id: "readiness", label: "Readiness & Risk Agent", body: "Scoring business, technical, market, funding, partnership, and compliance readiness." },
  { id: "stamps", label: "Passport & Stamp Agent", body: "Recommending earned, pending, and locked stamps." },
  { id: "linkage", label: "Linkage Recommendation Agent", body: "Sequencing the most relevant mentors and partners." },
];

export default function VerifyingPage() {
  const router = useRouter();
  const [activeStep, setActiveStep] = useState(0);

  // TODO: replace this animated stub with a real orchestrator call in Module 4.
  useEffect(() => {
    if (activeStep >= STEPS.length) {
      const t = setTimeout(() => router.push("/founder"), 800);
      return () => clearTimeout(t);
    }
    const t = setTimeout(() => setActiveStep((s) => s + 1), 1300);
    return () => clearTimeout(t);
  }, [activeStep, router]);

  return (
    <div className="mx-auto max-w-2xl px-6 py-16 lg:px-8">
      <div className="text-center">
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-navy-800 to-navy-950 text-cyan-glow shadow-lg">
          <Sparkles className="h-6 w-6" />
        </div>
        <p className="mt-5 text-xs font-semibold uppercase tracking-[0.18em] text-cyan-deep">
          Step 3 of 3
        </p>
        <h1 className="mt-2 text-3xl font-semibold tracking-tight text-navy-950">
          Running AI verification.
        </h1>
        <p className="mt-2 text-sm text-navy-600">
          Seven Gemini agents are reviewing your profile. This usually takes 20–40 seconds.
        </p>
      </div>

      <Card className="mt-10 p-6 space-y-3">
        {STEPS.map((step, i) => {
          const done = i < activeStep;
          const active = i === activeStep;
          return (
            <div
              key={step.id}
              className={cn(
                "flex items-start gap-3 rounded-lg border p-3 transition-all",
                done
                  ? "border-emerald-200 bg-emerald-50/60"
                  : active
                    ? "border-cyan-deep bg-cyan-50/40"
                    : "border-navy-100 bg-white"
              )}
            >
              <div
                className={cn(
                  "flex h-8 w-8 flex-none items-center justify-center rounded-lg",
                  done
                    ? "bg-emerald-500 text-white"
                    : active
                      ? "bg-cyan-deep text-white"
                      : "bg-navy-100 text-navy-400"
                )}
              >
                {done ? <CheckCircle2 className="h-4 w-4" /> : active ? <Loader2 className="h-4 w-4 animate-spin" /> : <span className="text-xs">{i + 1}</span>}
              </div>
              <div>
                <p className={cn("text-sm font-semibold", done || active ? "text-navy-950" : "text-navy-600")}>{step.label}</p>
                <p className="text-xs leading-relaxed text-navy-600">{step.body}</p>
              </div>
            </div>
          );
        })}
      </Card>

      <div className="mt-8 text-center">
        <Button asChild variant="outline">
          <a href="/founder">Back to dashboard</a>
        </Button>
        <p className="mt-3 text-xs text-navy-500">
          Heads up — Module 4 wires this up to real AI agents. For now, this is a preview of the flow.
        </p>
      </div>
    </div>
  );
}
