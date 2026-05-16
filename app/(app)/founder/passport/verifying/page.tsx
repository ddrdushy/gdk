"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { doc, serverTimestamp, setDoc } from "firebase/firestore";
import { Loader2, CheckCircle2, Sparkles, AlertTriangle, ArrowRight } from "lucide-react";
import { toast } from "sonner";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/lib/auth/auth-provider";
import { getDb } from "@/lib/firebase/client";
import { loadDraft } from "@/lib/passport-store";
import { cn } from "@/lib/utils";

interface AgentStep {
  id: string;
  label: string;
  body: string;
  state: "idle" | "running" | "done" | "error";
  result?: unknown;
}

const STEP_DEFS: Omit<AgentStep, "state">[] = [
  { id: "evidence", label: "Evidence Extraction Agent", body: "Reading documents and identifying claims, proof, and gaps." },
  { id: "eligibility", label: "Eligibility Agent", body: "Checking sector, stage, and programme alignment." },
  { id: "readiness", label: "Readiness & Risk Agent", body: "Scoring business, technical, market, funding, partnership, compliance." },
  { id: "stamps", label: "Passport & Stamp Agent", body: "Recommending earned, pending, and locked stamps + status." },
  { id: "linkage", label: "Linkage Recommendation Agent", body: "Sequencing the most relevant mentors, partners, and programmes." },
];

export default function VerifyingPage() {
  const router = useRouter();
  const { user } = useAuth();
  const [steps, setSteps] = useState<AgentStep[]>(() => STEP_DEFS.map((s) => ({ ...s, state: "idle" as const })));
  const [error, setError] = useState<string | null>(null);
  const [done, setDone] = useState(false);
  const started = useRef(false);

  useEffect(() => {
    if (started.current || !user) return;
    started.current = true;

    const draft = loadDraft();
    if (!draft?.confirmedProfile || !draft.evidence) {
      router.replace("/founder/passport/new");
      return;
    }

    void run(draft.confirmedProfile, draft.evidence);

    async function run(profile: Record<string, unknown>, evidence: string) {
      try {
        const res = await fetch("/api/agents/orchestrate", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ profile, evidence }),
        });
        if (!res.ok || !res.body) {
          const text = await res.text();
          throw new Error(`Orchestrator HTTP ${res.status}: ${text.slice(0, 200)}`);
        }

        const reader = res.body.getReader();
        const decoder = new TextDecoder();
        let buffer = "";
        const results: Record<string, unknown> = {};

        while (true) {
          const { done: doneReading, value } = await reader.read();
          if (doneReading) break;
          buffer += decoder.decode(value, { stream: true });
          const lines = buffer.split("\n\n");
          buffer = lines.pop() ?? "";
          for (const line of lines) {
            const m = line.match(/^data:\s*(.*)$/m);
            if (!m) continue;
            try {
              const evt = JSON.parse(m[1]);
              handleEvent(evt, results);
            } catch (e) {
              console.warn("parse SSE line failed", e);
            }
          }
        }

        if (user) {
          await setDoc(
            doc(getDb(), "verification_results", user.uid),
            {
              ownerUid: user.uid,
              type: "startup",
              status: "complete",
              ...results,
              startedAt: serverTimestamp(),
              completedAt: serverTimestamp(),
            },
            { merge: true }
          );
          await setDoc(
            doc(getDb(), "startups", user.uid),
            { status: "ai-verified", aiCompletedAt: serverTimestamp() },
            { merge: true }
          );
        }
        setDone(true);
      } catch (err) {
        const msg = err instanceof Error ? err.message : "Verification failed";
        setError(msg);
        toast.error(msg);
      }
    }

    function handleEvent(evt: { type: string; agent?: string; result?: unknown; error?: string }, results: Record<string, unknown>) {
      if (evt.type === "agent:start" && evt.agent) {
        setSteps((ss) =>
          ss.map((s) => (s.id === evt.agent ? { ...s, state: "running" } : s))
        );
      } else if (evt.type === "agent:complete" && evt.agent) {
        results[evt.agent] = evt.result;
        setSteps((ss) =>
          ss.map((s) => (s.id === evt.agent ? { ...s, state: "done", result: evt.result } : s))
        );
      } else if (evt.type === "agent:error") {
        setSteps((ss) =>
          ss.map((s) => (s.id === evt.agent ? { ...s, state: "error" } : s))
        );
        setError(evt.error ?? "Agent failed");
      } else if (evt.type === "run:error") {
        setError(evt.error ?? "Verification failed");
      }
    }
  }, [user, router]);

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
          {done ? "Verification complete." : error ? "Verification failed." : "Running AI verification."}
        </h1>
        <p className="mt-2 text-sm text-navy-600">
          {done
            ? "Your profile has been reviewed by 5 Gemini agents."
            : error
              ? "We hit a snag. You can retry from the dashboard."
              : "Five Gemini agents are reviewing your profile. This usually takes 30–60 seconds."}
        </p>
      </div>

      {error && (
        <div className="mt-6 rounded-xl border border-rose-200 bg-rose-50 p-4">
          <div className="flex items-start gap-2 text-rose-800">
            <AlertTriangle className="h-4 w-4 mt-0.5 flex-none" />
            <p className="text-sm">{error}</p>
          </div>
        </div>
      )}

      <Card className="mt-8 p-6 space-y-3">
        {steps.map((step, i) => (
          <div
            key={step.id}
            className={cn(
              "flex items-start gap-3 rounded-lg border p-3 transition-all",
              step.state === "done"
                ? "border-emerald-200 bg-emerald-50/60"
                : step.state === "running"
                  ? "border-cyan-deep bg-cyan-50/40"
                  : step.state === "error"
                    ? "border-rose-200 bg-rose-50/60"
                    : "border-navy-100 bg-white"
            )}
          >
            <div
              className={cn(
                "flex h-8 w-8 flex-none items-center justify-center rounded-lg",
                step.state === "done"
                  ? "bg-emerald-500 text-white"
                  : step.state === "running"
                    ? "bg-cyan-deep text-white"
                    : step.state === "error"
                      ? "bg-rose-500 text-white"
                      : "bg-navy-100 text-navy-400"
              )}
            >
              {step.state === "done" ? (
                <CheckCircle2 className="h-4 w-4" />
              ) : step.state === "running" ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : step.state === "error" ? (
                <AlertTriangle className="h-4 w-4" />
              ) : (
                <span className="text-xs">{i + 1}</span>
              )}
            </div>
            <div className="min-w-0 flex-1">
              <p className={cn("text-sm font-semibold", step.state !== "idle" ? "text-navy-950" : "text-navy-600")}>
                {step.label}
              </p>
              <p className="text-xs leading-relaxed text-navy-600">{step.body}</p>
              {step.state === "done" && step.result != null && (
                <p className="mt-1 text-[11px] text-emerald-700 font-mono">
                  ✓ result received ({(JSON.stringify(step.result).length / 1024).toFixed(1)}kB)
                </p>
              )}
            </div>
          </div>
        ))}
      </Card>

      <div className="mt-8 flex flex-col items-center gap-3">
        {done && (
          <Button asChild variant="primary" size="lg">
            <a href="/founder/passport">
              View your passport <ArrowRight className="h-4 w-4" />
            </a>
          </Button>
        )}
        {error && (
          <Button asChild variant="outline" size="lg">
            <a href="/founder">Back to dashboard</a>
          </Button>
        )}
      </div>
    </div>
  );
}
