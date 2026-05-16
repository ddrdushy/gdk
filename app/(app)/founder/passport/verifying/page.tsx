"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { doc, serverTimestamp, setDoc } from "firebase/firestore";
import { Sparkles, AlertTriangle, ArrowRight } from "lucide-react";
import { toast } from "sonner";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/lib/auth/auth-provider";
import { getDb } from "@/lib/firebase/client";
import { loadDraft } from "@/lib/passport-store";
import { AgentResultCard, agentSummaries } from "@/components/passport/agent-result-card";

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
            ? "Your profile has been reviewed by 5 AI agents."
            : error
              ? "We hit a snag. You can retry from the dashboard."
              : "Five AI agents are reviewing your profile. Usually 30–60 s; longer when we fall through to a slower provider."}
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
          <AgentResultCard
            key={step.id}
            index={i}
            label={step.label}
            body={step.body}
            state={step.state}
            result={step.result}
            summary={agentSummaries[step.id as keyof typeof agentSummaries]}
          />
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
