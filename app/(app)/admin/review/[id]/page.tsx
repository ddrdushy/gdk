"use client";

import { use, useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Loader2, ArrowLeft, CheckCircle2, AlertTriangle, FileQuestion, XCircle } from "lucide-react";
import { toast } from "sonner";
import { useAuth } from "@/lib/auth/auth-provider";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card } from "@/components/ui/card";
import { PassportDetail } from "@/components/passport/passport-detail";
import { MentorPassportDetail } from "@/components/passport/mentor-passport-detail";
import { startupProfileSchema, type StartupProfile } from "@/lib/schemas/passport";
import { mentorProfileSchema, type MentorProfile } from "@/lib/schemas/mentor";
import {
  evidenceAgentSchema,
  eligibilityAgentSchema,
  readinessAgentSchema,
  stampAgentSchema,
  linkageAgentSchema,
  type EvidenceResult,
  type EligibilityResult,
  type ReadinessResult,
  type StampResult,
  type LinkageResult,
} from "@/lib/schemas/verification";
import {
  mentorEvidenceSchema,
  mentorEligibilitySchema,
  mentorReadinessSchema,
  mentorStampsSchema,
  mentorMatchesSchema,
  type MentorEvidenceResult,
  type MentorEligibilityResult,
  type MentorReadinessResult,
  type MentorStampsResult,
  type MentorMatchesResult,
} from "@/lib/schemas/mentor-verification";
import { formatPassportId } from "@/lib/utils";
import { ADMIN_DECISIONS, DECISION_LABEL, type AdminDecision } from "@/lib/schemas/admin";
import { cn } from "@/lib/utils";

const DECISION_META: Record<AdminDecision, { icon: typeof CheckCircle2; tone: string }> = {
  approve: { icon: CheckCircle2, tone: "border-emerald-300 text-emerald-700 bg-emerald-50 hover:bg-emerald-100" },
  "conditionally-approve": { icon: AlertTriangle, tone: "border-amber-300 text-amber-700 bg-amber-50 hover:bg-amber-100" },
  "request-evidence": { icon: FileQuestion, tone: "border-sky-300 text-sky-700 bg-sky-50 hover:bg-sky-100" },
  reject: { icon: XCircle, tone: "border-rose-300 text-rose-700 bg-rose-50 hover:bg-rose-100" },
};

export default function AdminReviewDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const router = useRouter();
  const { user } = useAuth();

  const [type, setType] = useState<"startup" | "mentor" | null>(null);
  const [profile, setProfile] = useState<StartupProfile | MentorProfile | null>(null);
  // Startup verification result fields
  const [evidence, setEvidence] = useState<EvidenceResult | undefined>();
  const [eligibility, setEligibility] = useState<EligibilityResult | undefined>();
  const [readiness, setReadiness] = useState<ReadinessResult | undefined>();
  const [stamps, setStamps] = useState<StampResult | undefined>();
  const [linkage, setLinkage] = useState<LinkageResult | undefined>();
  // Mentor verification result fields
  const [mEvidence, setMEvidence] = useState<MentorEvidenceResult | undefined>();
  const [mEligibility, setMEligibility] = useState<MentorEligibilityResult | undefined>();
  const [mReadiness, setMReadiness] = useState<MentorReadinessResult | undefined>();
  const [mStamps, setMStamps] = useState<MentorStampsResult | undefined>();
  const [mMatches, setMMatches] = useState<MentorMatchesResult | undefined>();
  const [loading, setLoading] = useState(true);

  const [decision, setDecision] = useState<AdminDecision | null>(null);
  const [note, setNote] = useState("");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (!user) return;
    let cancelled = false;
    void (async () => {
      try {
        const idToken = await user.getIdToken();
        const res = await fetch(`/api/admin/review/${id}`, {
          headers: { Authorization: `Bearer ${idToken}` },
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error ?? `HTTP ${res.status}`);
        if (cancelled) return;
        const t = (data.type as "startup" | "mentor") ?? "startup";
        setType(t);
        if (t === "mentor") {
          const parsed = data.profile ? mentorProfileSchema.safeParse(data.profile) : null;
          setProfile(parsed?.success ? parsed.data : null);
          const run = data.run as Record<string, unknown> | null;
          if (run) {
            setMEvidence(run.evidence ? mentorEvidenceSchema.safeParse(run.evidence).data : undefined);
            setMEligibility(run.eligibility ? mentorEligibilitySchema.safeParse(run.eligibility).data : undefined);
            setMReadiness(run.readiness ? mentorReadinessSchema.safeParse(run.readiness).data : undefined);
            setMStamps(run.stamps ? mentorStampsSchema.safeParse(run.stamps).data : undefined);
            setMMatches(run.matches ? mentorMatchesSchema.safeParse(run.matches).data : undefined);
          }
        } else {
          const parsed = data.profile ? startupProfileSchema.safeParse(data.profile) : null;
          setProfile(parsed?.success ? parsed.data : null);
          const run = data.run as Record<string, unknown> | null;
          if (run) {
            setEvidence(run.evidence ? evidenceAgentSchema.safeParse(run.evidence).data : undefined);
            setEligibility(run.eligibility ? eligibilityAgentSchema.safeParse(run.eligibility).data : undefined);
            setReadiness(run.readiness ? readinessAgentSchema.safeParse(run.readiness).data : undefined);
            setStamps(run.stamps ? stampAgentSchema.safeParse(run.stamps).data : undefined);
            setLinkage(run.linkage ? linkageAgentSchema.safeParse(run.linkage).data : undefined);
          }
        }
      } catch (err) {
        console.error(err);
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [id, user]);

  async function onSubmitDecision() {
    if (!decision || !user) return;
    setSubmitting(true);
    try {
      const idToken = await user.getIdToken();
      const res = await fetch("/api/admin/decisions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${idToken}`,
        },
        body: JSON.stringify({
          ownerUid: id,
          decision,
          note: note || undefined,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Decision failed");
      toast.success(`Decision recorded: ${DECISION_LABEL[decision]}`);
      router.push("/admin/review-queue");
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : "Decision failed");
    } finally {
      setSubmitting(false);
    }
  }

  if (loading) {
    return (
      <div className="flex h-[50vh] items-center justify-center">
        <Loader2 className="h-5 w-5 animate-spin text-navy-400" />
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="mx-auto max-w-2xl px-6 py-20 text-center">
        <h1 className="text-2xl font-semibold text-navy-950">Application not found.</h1>
        <Button asChild variant="outline" className="mt-6">
          <Link href="/admin/review-queue"><ArrowLeft className="h-4 w-4" /> Back to queue</Link>
        </Button>
      </div>
    );
  }

  const isMentor = type === "mentor";
  const passportId = formatPassportId(isMentor ? "MN" : "ST", new Date().getFullYear(), 1);
  const displayName = isMentor
    ? (profile as MentorProfile).mentorName
    : (profile as StartupProfile).startupName;
  const recommendedStatus = isMentor ? mStamps?.recommendedStatus : stamps?.recommendedStatus;

  return (
    <>
      <div className="border-b border-navy-100 bg-white">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4 lg:px-8">
          <Button asChild variant="ghost" size="sm">
            <Link href="/admin/review-queue">
              <ArrowLeft className="h-4 w-4" /> Back to queue
            </Link>
          </Button>
          <p className="text-xs text-navy-500">
            Admin review · {isMentor ? "Mentor" : "Startup"} · {displayName}
          </p>
        </div>
      </div>

      {isMentor ? (
        <MentorPassportDetail
          profile={profile as MentorProfile}
          passportId={passportId}
          evidence={mEvidence}
          eligibility={mEligibility}
          readiness={mReadiness}
          stamps={mStamps}
          matches={mMatches}
        />
      ) : (
        <PassportDetail
          profile={profile as StartupProfile}
          passportId={passportId}
          evidence={evidence}
          eligibility={eligibility}
          readiness={readiness}
          stamps={stamps}
          linkage={linkage}
        />
      )}

      {/* Decision panel — sticky bottom */}
      <div className="sticky bottom-0 z-30 border-t border-navy-100 bg-white/95 backdrop-blur-xl">
        <div className="mx-auto max-w-6xl px-6 py-5 lg:px-8 space-y-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-cyan-deep">
              Your decision
            </p>
            <p className="mt-1 text-sm text-navy-700">
              AI recommended <strong className="text-navy-950">{recommendedStatus ?? "—"}</strong>. Confirm or override.
            </p>
          </div>

          <div className="grid gap-2 sm:grid-cols-4">
            {ADMIN_DECISIONS.map((d) => {
              const meta = DECISION_META[d];
              const active = decision === d;
              return (
                <button
                  key={d}
                  type="button"
                  onClick={() => setDecision(d)}
                  className={cn(
                    "flex items-center gap-2 rounded-lg border px-3 py-2.5 text-sm font-medium transition-all",
                    meta.tone,
                    active ? "ring-2 ring-offset-1 ring-current" : ""
                  )}
                >
                  <meta.icon className="h-4 w-4" />
                  {DECISION_LABEL[d]}
                </button>
              );
            })}
          </div>

          {decision && (
            <Card className="p-4">
              <label className="text-xs font-semibold uppercase tracking-wider text-navy-700">
                Note to founder (optional)
              </label>
              <Textarea
                value={note}
                onChange={(e) => setNote(e.target.value)}
                rows={3}
                placeholder="Explain the decision, list any evidence required, or recommend next steps."
                className="mt-2"
              />
              <div className="mt-3 flex justify-end gap-2">
                <Button variant="outline" onClick={() => setDecision(null)}>Cancel</Button>
                <Button variant="primary" onClick={onSubmitDecision} disabled={submitting}>
                  {submitting ? <><Loader2 className="h-4 w-4 animate-spin" /> Recording…</> : `Confirm: ${DECISION_LABEL[decision]}`}
                </Button>
              </div>
            </Card>
          )}
        </div>
      </div>
    </>
  );
}
