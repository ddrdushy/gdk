"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { doc, getDoc, serverTimestamp, setDoc } from "firebase/firestore";
import { ArrowLeft, ArrowRight, Loader2, Sparkles, AlertTriangle, FileText } from "lucide-react";
import { toast } from "sonner";
import { useAuth } from "@/lib/auth/auth-provider";
import { getDb } from "@/lib/firebase/client";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { EvidenceImporter } from "@/components/passport/evidence-importer";
import { EvidenceCharCounter } from "@/components/passport/evidence-char-counter";
import { MissingDocItem, type DocResponse } from "@/components/passport/missing-doc-item";
import { startupProfileSchema, type StartupProfile } from "@/lib/schemas/passport";
import {
  evidenceAgentSchema,
  stampAgentSchema,
  type StampResult,
} from "@/lib/schemas/verification";

/**
 * Build a context-aware placeholder for the new-evidence textarea.
 *
 * Priority:
 *   1. Concrete list of missing documents (from the Evidence Extraction
 *      agent) — most actionable, lists exact items the user needs to
 *      provide.
 *   2. The agent's nextAction text.
 *   3. Per-pending-stamp reasons.
 *   4. Generic suggestion if nothing else.
 */
function buildPlaceholder(
  missingDocs: string[],
  nextAction: string | undefined,
  pendingStamps: Array<{ key: string; reason: string }>
): string {
  if (missingDocs.length > 0) {
    return (
      "Address each missing document below. You can paste text OR upload supporting files — both get combined:\n\n" +
      missingDocs.map((d) => `• ${d}`).join("\n")
    );
  }
  if (nextAction && nextAction.length > 10) {
    return `Address the items above. For example:\n\n${nextAction}`;
  }
  if (pendingStamps.length > 0) {
    return (
      "Address the pending stamps above. For example:\n\n" +
      pendingStamps.map((s) => `• ${s.key.replace(/-/g, " ")}: ${s.reason}`).join("\n")
    );
  }
  return "Paste any new evidence here — pilot report, funding letter, regulatory approval, additional traction metrics, customer testimonials, etc.";
}

function hasAnyResponse(
  responses: Record<number, DocResponse>,
  freeForm: string
): boolean {
  if (freeForm.trim().length >= 30) return true;
  return Object.values(responses).some((r) => r.text.trim().length >= 10);
}

export default function ImprovePassportPage() {
  const router = useRouter();
  const { user } = useAuth();

  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState<StartupProfile | null>(null);
  const [existingEvidence, setExistingEvidence] = useState<string>("");
  const [stamps, setStamps] = useState<StampResult | null>(null);
  const [missingDocs, setMissingDocs] = useState<string[]>([]);
  const [inconsistencies, setInconsistencies] = useState<string[]>([]);
  const [adminNote, setAdminNote] = useState<string | null>(null);
  const [newEvidence, setNewEvidence] = useState<string>("");
  const [importedLabel, setImportedLabel] = useState<string>("");
  const [docResponses, setDocResponses] = useState<Record<number, DocResponse>>({});
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (!user) return;
    let cancelled = false;
    void (async () => {
      try {
        const db = getDb();
        const [profileSnap, runSnap] = await Promise.all([
          getDoc(doc(db, "startups", user.uid)),
          getDoc(doc(db, "verification_results", user.uid)),
        ]);
        if (!profileSnap.exists()) {
          router.replace("/founder/passport/new");
          return;
        }
        const data = profileSnap.data();
        const parsed = startupProfileSchema.safeParse(data);
        if (!parsed.success) {
          router.replace("/founder/passport/new");
          return;
        }
        if (!cancelled) {
          setProfile(parsed.data);
          setExistingEvidence((data.evidence as string) ?? "");
          setAdminNote((data.adminNote as string) ?? null);
          if (runSnap.exists()) {
            const run = runSnap.data();
            const parsedStamps = run.stamps ? stampAgentSchema.safeParse(run.stamps) : null;
            if (parsedStamps?.success) setStamps(parsedStamps.data);
            const parsedEvidence = run.evidence ? evidenceAgentSchema.safeParse(run.evidence) : null;
            if (parsedEvidence?.success) {
              setMissingDocs(parsedEvidence.data.missingDocuments ?? []);
              setInconsistencies(parsedEvidence.data.inconsistencies ?? []);
            }
          }
        }
      } catch (err) {
        console.error(err);
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => { cancelled = true; };
  }, [user, router]);

  async function onSubmit() {
    if (!user || !profile) return;

    // Combine per-missing-doc tagged responses with the free-form extras.
    const today = new Date().toISOString().slice(0, 10);
    const taggedSections: string[] = [];
    for (let i = 0; i < missingDocs.length; i++) {
      const resp = docResponses[i];
      if (resp && resp.text.trim()) {
        taggedSections.push(
          `--- [${today}] ${missingDocs[i]}${resp.filename ? ` (file: ${resp.filename})` : ""} ---\n${resp.text.trim()}`
        );
      }
    }
    if (newEvidence.trim()) {
      taggedSections.push(
        `--- [${today}] Additional notes${importedLabel ? ` (${importedLabel})` : ""} ---\n${newEvidence.trim()}`
      );
    }

    if (taggedSections.length === 0) {
      toast.error("Address at least one missing item — upload a file or type a response.");
      return;
    }

    const additionalEvidence = taggedSections.join("\n\n");
    const combined = [existingEvidence, "\n\n", additionalEvidence].filter(Boolean).join("");

    setSubmitting(true);
    try {
      const db = getDb();
      await setDoc(
        doc(db, "startups", user.uid),
        {
          evidence: combined,
          status: "submitted",
          updatedAt: serverTimestamp(),
        },
        { merge: true }
      );
      // The verifying page reads draft from localStorage. Re-seed it so the
      // page can submit to the orchestrator without a roundtrip.
      window.localStorage.setItem(
        "trustpass:draft:startup",
        JSON.stringify({
          source: "manual",
          sourceLabel: "improved evidence",
          evidence: combined,
          confirmedProfile: profile,
          createdAt: Date.now(),
        })
      );
      toast.success("Re-running AI verification with the new evidence…");
      router.push("/founder/passport/verifying");
    } catch (err) {
      console.error(err);
      toast.error(err instanceof Error ? err.message : "Could not save evidence");
    } finally {
      setSubmitting(false);
    }
  }

  if (loading) {
    return (
      <div className="flex h-[50vh] items-center justify-center">
        <Loader2 className="h-6 w-6 animate-spin text-navy-400" />
      </div>
    );
  }

  if (!profile) return null;

  const pendingStamps = stamps?.stamps?.filter((s) => s.status === "pending") ?? [];
  const nextAction = stamps?.nextAction;

  return (
    <div className="mx-auto max-w-3xl px-6 py-10 lg:px-8">
      <Button asChild variant="ghost" size="sm" className="-ml-2">
        <Link href="/founder/passport">
          <ArrowLeft className="h-4 w-4" /> Back to passport
        </Link>
      </Button>

      <div className="mt-4">
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-cyan-deep">
          Add more evidence
        </p>
        <h1 className="mt-2 text-3xl font-semibold tracking-tight text-navy-950">
          Submit only what the AI is missing.
        </h1>
        <p className="mt-1 text-sm text-navy-600">
          You don&apos;t need to re-upload everything. Just provide the items below — we&apos;ll merge them with your existing evidence and re-run all 5 agents.
        </p>
      </div>

      {/* PRIMARY: per-item upload for each missing document */}
      {missingDocs.length > 0 && (
        <Card className="mt-6 p-5 border-amber-300 bg-amber-50/40">
          <div className="flex items-start gap-3">
            <div className="flex h-9 w-9 flex-none items-center justify-center rounded-lg bg-amber-500 text-white">
              <AlertTriangle className="h-4 w-4" />
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-amber-800">
                Missing documents — upload or paste per item
              </p>
              <p className="mt-1 text-[12px] text-navy-700">
                Each upload is tagged so the AI knows exactly which gap you&apos;re closing.
              </p>
              <div className="mt-4 space-y-2">
                {missingDocs.map((doc, i) => (
                  <MissingDocItem
                    key={i}
                    index={i}
                    label={doc}
                    response={docResponses[i] ?? { text: "" }}
                    onChange={(next) => setDocResponses((m) => ({ ...m, [i]: next }))}
                    disabled={submitting}
                  />
                ))}
              </div>
              {inconsistencies.length > 0 && (
                <div className="mt-4 rounded-lg border border-rose-200 bg-rose-50 p-3">
                  <p className="text-[11px] font-semibold uppercase tracking-wider text-rose-800">Also clarify these inconsistencies</p>
                  <ul className="mt-2 space-y-1">
                    {inconsistencies.map((line, i) => (
                      <li key={i} className="text-[12.5px] text-rose-800">• {line}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </div>
        </Card>
      )}

      {/* Secondary context: only when there's no missing-docs list to act on */}
      {missingDocs.length === 0 && (nextAction || adminNote || pendingStamps.length > 0) && (
        <Card className="mt-6 p-5 border-amber-200 bg-amber-50/40">
          <div className="flex items-start gap-3">
            <div className="flex h-9 w-9 flex-none items-center justify-center rounded-lg bg-amber-500 text-white">
              <AlertTriangle className="h-4 w-4" />
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-sm font-semibold text-navy-950">What the AI is asking for</p>
              {nextAction && (
                <p className="mt-1.5 text-sm text-navy-700">{nextAction}</p>
              )}
              {adminNote && (
                <p className="mt-2 text-sm text-navy-700">
                  <span className="font-medium">Admin note:</span> {adminNote}
                </p>
              )}
              {pendingStamps.length > 0 && (
                <ul className="mt-3 space-y-2">
                  {pendingStamps.map((s) => (
                    <li key={s.key} className="rounded-lg border border-amber-200/70 bg-white p-3">
                      <div className="flex items-center gap-2">
                        <span className="flex h-1.5 w-1.5 rounded-full bg-amber-500" />
                        <p className="text-[13px] font-semibold capitalize text-navy-900">
                          {s.key.replace(/-/g, " ")}
                          <span className="ml-1.5 font-normal text-navy-500">— pending</span>
                        </p>
                      </div>
                      <p className="mt-1 text-[12.5px] leading-relaxed text-navy-700">{s.reason}</p>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>
        </Card>
      )}

      {/* Already submitted (collapsed) */}
      {existingEvidence && (
        <details className="mt-6 rounded-xl border border-navy-100 bg-white p-4 text-sm">
          <summary className="cursor-pointer font-medium text-navy-700">
            <span className="inline-flex items-center gap-2">
              <FileText className="h-4 w-4 text-navy-400" />
              Already on file — {existingEvidence.length.toLocaleString()} chars
            </span>
          </summary>
          <pre className="mt-3 max-h-[200px] overflow-auto rounded-md bg-navy-50/60 p-3 text-[12px] leading-relaxed text-navy-700 whitespace-pre-wrap font-sans">
            {existingEvidence.slice(0, 4000)}
            {existingEvidence.length > 4000 ? "\n\n… (truncated)" : ""}
          </pre>
        </details>
      )}

      {/* New evidence input */}
      <Card className="mt-6 p-6 space-y-4">
        <EvidenceImporter
          onExtracted={(text, label) => {
            setNewEvidence((prev) => (prev ? prev + "\n\n" : "") + text);
            setImportedLabel(label);
          }}
          disabled={submitting}
        />

        <div className="space-y-1.5">
          <label className="text-sm font-medium text-navy-800" htmlFor="new-evidence">
            {missingDocs.length > 0 ? "Additional notes (optional)" : "New evidence"}
          </label>
          <Textarea
            id="new-evidence"
            value={newEvidence}
            onChange={(e) => setNewEvidence(e.target.value)}
            placeholder={
              missingDocs.length > 0
                ? "Anything else not on the list above — context, dates, updates, etc."
                : buildPlaceholder(missingDocs, nextAction, pendingStamps)
            }
            rows={missingDocs.length > 0 ? 5 : 10}
            className={missingDocs.length > 0 ? "min-h-[100px]" : "min-h-[220px]"}
          />
          <EvidenceCharCounter chars={newEvidence.length} />
        </div>

        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-end">
          <Button asChild variant="outline" size="lg">
            <Link href="/founder/passport">Cancel</Link>
          </Button>
          <Button
            type="button"
            variant="primary"
            size="lg"
            onClick={onSubmit}
            disabled={submitting || !hasAnyResponse(docResponses, newEvidence)}
          >
            {submitting ? (
              <><Loader2 className="h-4 w-4 animate-spin" /> Submitting…</>
            ) : (
              <><Sparkles className="h-4 w-4" /> Re-run AI verification <ArrowRight className="h-4 w-4" /></>
            )}
          </Button>
        </div>
      </Card>
    </div>
  );
}
