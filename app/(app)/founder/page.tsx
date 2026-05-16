"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Rocket, FileUp, BadgeCheck, ArrowRight, Eye, Loader2, Sparkles, AlertTriangle, CheckCircle2 } from "lucide-react";
import { useAuth } from "@/lib/auth/auth-provider";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

interface UserStats {
  kind: "startup" | "mentor" | null;
  passportId?: string;
  status?: string;
  displayName?: string | null;
  stamps?: { earned: number; pending: number; locked: number; recommendedStatus: string | null };
  scores?: { eligibility: number | null; readiness: number | null; evidence: number | null };
  viewCount?: number;
  adminNote?: string | null;
  adminDecision?: string | null;
}

const STATUS_META: Record<string, { label: string; variant: "verified" | "pending" | "risk" | "outline" | "accent"; tone: string; icon: typeof CheckCircle2 }> = {
  draft: { label: "Draft", variant: "outline", tone: "text-navy-600", icon: FileUp },
  submitted: { label: "Submitted — awaiting AI", variant: "accent", tone: "text-sky-700", icon: Loader2 },
  "ai-verified": { label: "AI verified — admin review pending", variant: "pending", tone: "text-amber-700", icon: Sparkles },
  verified: { label: "Verified", variant: "verified", tone: "text-emerald-700", icon: CheckCircle2 },
  "conditionally-verified": { label: "Conditionally Verified", variant: "pending", tone: "text-amber-700", icon: CheckCircle2 },
  "pending-evidence": { label: "Pending Evidence", variant: "pending", tone: "text-amber-700", icon: AlertTriangle },
  "needs-review": { label: "Needs Review", variant: "risk", tone: "text-rose-700", icon: AlertTriangle },
  rejected: { label: "Rejected", variant: "risk", tone: "text-rose-700", icon: AlertTriangle },
};

export default function FounderDashboard() {
  const { user, profile } = useAuth();
  const [stats, setStats] = useState<UserStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;
    let cancelled = false;
    void (async () => {
      try {
        const idToken = await user.getIdToken();
        const res = await fetch("/api/user/stats", { headers: { Authorization: `Bearer ${idToken}` } });
        const data = await res.json();
        if (!cancelled) setStats(data);
      } catch (err) {
        console.error(err);
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => { cancelled = true; };
  }, [user]);

  const hasPassport = stats?.kind === "startup";
  const meta = hasPassport && stats?.status ? STATUS_META[stats.status] ?? STATUS_META.draft : null;

  return (
    <div className="mx-auto max-w-6xl px-6 py-10 lg:px-8">
      <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-cyan-deep">
            Founder dashboard
          </p>
          <h1 className="mt-2 text-3xl font-semibold tracking-tight text-navy-950">
            Welcome{profile?.displayName ? `, ${profile.displayName.split(" ")[0]}` : ""}.
          </h1>
          <p className="mt-1 text-sm text-navy-600">
            {hasPassport
              ? "Your Startup Passport is live. Share it across programmes, mentors, and partners."
              : "Build your Startup Passport. Once verified, you can share it across every programme."}
          </p>
        </div>
        <Button asChild variant="primary" size="lg" className="mt-4 sm:mt-0">
          <Link href={hasPassport ? "/founder/passport" : "/founder/passport/new"}>
            {hasPassport ? <><BadgeCheck className="h-4 w-4" /> View passport</> : <><Rocket className="h-4 w-4" /> Create Startup Passport</>}
          </Link>
        </Button>
      </div>

      {loading ? (
        <div className="mt-12 flex justify-center"><Loader2 className="h-5 w-5 animate-spin text-navy-400" /></div>
      ) : !hasPassport ? (
        <NoPassportState />
      ) : (
        <>
          {/* Status banner */}
          {meta && (
            <Card className={cn("mt-8 border p-5", borderForStatus(stats?.status))}>
              <div className="flex items-start gap-3">
                <div className={cn("flex h-9 w-9 flex-none items-center justify-center rounded-lg", bgForStatus(stats?.status))}>
                  <meta.icon className={cn("h-4 w-4", stats?.status === "submitted" ? "animate-spin" : "")} />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <p className="text-sm font-semibold text-navy-950">{meta.label}</p>
                    <Badge variant="outline" className="font-mono text-[10px]">{stats?.passportId}</Badge>
                  </div>
                  {stats?.adminNote && (
                    <p className="mt-1.5 text-sm text-navy-700">
                      <span className="font-medium">Admin note:</span> {stats.adminNote}
                    </p>
                  )}
                </div>
              </div>
            </Card>
          )}

          {/* Stat tiles — real numbers */}
          <div className="mt-8 grid gap-4 md:grid-cols-4">
            <StatTile
              label="Eligibility"
              value={stats?.scores?.eligibility ?? null}
              suffix="/100"
              tone={scoreTone(stats?.scores?.eligibility)}
            />
            <StatTile
              label="Readiness"
              value={stats?.scores?.readiness ?? null}
              suffix="/100"
              tone={scoreTone(stats?.scores?.readiness)}
            />
            <StatTile
              label="Stamps earned"
              value={stats?.stamps?.earned ?? 0}
              extra={stats?.stamps?.pending ? `+ ${stats.stamps.pending} pending` : undefined}
              tone="emerald"
            />
            <StatTile
              label="Public views"
              value={stats?.viewCount ?? 0}
              icon={Eye}
              tone="sky"
            />
          </div>

          {/* Action card */}
          <Card className="mt-8 p-6">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-cyan-deep">Next steps</p>
                <p className="mt-2 text-sm leading-relaxed text-navy-700">
                  {nextStepCopy(stats?.status, stats?.stamps?.pending ?? 0)}
                </p>
              </div>
              <Button asChild variant="outline" size="sm" className="flex-none">
                <Link href="/founder/passport">View full passport <ArrowRight className="h-3 w-3" /></Link>
              </Button>
            </div>
          </Card>
        </>
      )}
    </div>
  );
}

function NoPassportState() {
  return (
    <div className="mt-8 rounded-2xl border border-dashed border-navy-200 bg-white p-10 text-center">
      <BadgeCheck className="mx-auto h-10 w-10 text-navy-300" />
      <h2 className="mt-3 text-lg font-semibold text-navy-900">
        Your passport will appear here after verification.
      </h2>
      <p className="mx-auto mt-2 max-w-md text-sm text-navy-600">
        Create your profile, upload evidence, and let TrustPass AI prepare a verification report.
        A human admin will issue your final passport.
      </p>
      <Button asChild variant="outline" className="mt-5">
        <Link href="/founder/passport/new">
          <FileUp className="h-4 w-4" /> Start verification
        </Link>
      </Button>
    </div>
  );
}

function StatTile({
  label,
  value,
  suffix,
  extra,
  icon: Icon,
  tone,
}: {
  label: string;
  value: number | null;
  suffix?: string;
  extra?: string;
  icon?: typeof Eye;
  tone?: "emerald" | "amber" | "rose" | "sky" | "navy";
}) {
  const toneCls = {
    emerald: "text-emerald-700",
    amber: "text-amber-700",
    rose: "text-rose-700",
    sky: "text-sky-700",
    navy: "text-navy-800",
  }[tone ?? "navy"];
  return (
    <Card>
      <CardContent className="p-5">
        <div className="flex items-start justify-between">
          <Badge variant="outline">{label}</Badge>
          {Icon && <Icon className="h-4 w-4 text-navy-400" />}
        </div>
        <div className="mt-3 flex items-baseline gap-1">
          <p className={cn("text-2xl font-semibold tabular-nums", toneCls)}>
            {value == null ? "—" : value}
          </p>
          {value != null && suffix && <span className="text-xs text-navy-500">{suffix}</span>}
        </div>
        {extra && <p className="mt-1 text-[11px] text-navy-500">{extra}</p>}
      </CardContent>
    </Card>
  );
}

function scoreTone(score: number | null | undefined): "emerald" | "amber" | "rose" | "navy" {
  if (score == null) return "navy";
  if (score >= 70) return "emerald";
  if (score >= 50) return "amber";
  return "rose";
}

function borderForStatus(status?: string) {
  if (!status) return "border-navy-100";
  if (status === "verified") return "border-emerald-200 bg-emerald-50/40";
  if (status === "conditionally-verified" || status === "pending-evidence" || status === "ai-verified") return "border-amber-200 bg-amber-50/40";
  if (status === "needs-review" || status === "rejected") return "border-rose-200 bg-rose-50/40";
  return "border-navy-100";
}
function bgForStatus(status?: string) {
  if (status === "verified") return "bg-emerald-500 text-white";
  if (status === "conditionally-verified" || status === "pending-evidence" || status === "ai-verified") return "bg-amber-500 text-white";
  if (status === "needs-review" || status === "rejected") return "bg-rose-500 text-white";
  return "bg-navy-100 text-navy-600";
}
function nextStepCopy(status?: string, pending = 0): string {
  switch (status) {
    case "verified":
      return "Your passport is fully verified. Share the public link and start collecting linkage requests.";
    case "conditionally-verified":
      return pending
        ? `Your passport is live with ${pending} pending stamp${pending === 1 ? "" : "s"}. Submit the missing evidence to upgrade to fully Verified.`
        : "Your passport is conditionally verified. Watch for admin notes on what to address next.";
    case "pending-evidence":
      return "An admin requested additional evidence. Check the public passport for the specific gaps.";
    case "ai-verified":
      return "AI verification is complete and the admin is reviewing your application. You'll see an update here once they decide.";
    case "needs-review":
      return "Your application is in manual review. An admin will reach out if anything is unclear.";
    case "rejected":
      return "This application was not approved. Re-submit with updated evidence to try again.";
    case "submitted":
      return "Your profile is in the AI verification queue. This usually takes 30–60 seconds.";
    default:
      return "Open your passport to see the latest agent output, stamps, and admin actions.";
  }
}
