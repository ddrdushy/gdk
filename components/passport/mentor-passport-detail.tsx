"use client";

import Link from "next/link";
import { Sparkles, AlertTriangle, FileText, CheckCircle2, Users, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { PassportBooklet } from "@/components/passport/passport-booklet";
import { type StampKey } from "@/components/passport/stamp-badge";
import type { MentorProfile } from "@/lib/schemas/mentor";
import type {
  MentorEvidenceResult,
  MentorEligibilityResult,
  MentorReadinessResult,
  MentorStampsResult,
  MentorMatchesResult,
} from "@/lib/schemas/mentor-verification";
import { cn } from "@/lib/utils";

export interface MentorPassportDetailProps {
  profile: MentorProfile;
  passportId: string;
  evidence?: MentorEvidenceResult;
  eligibility?: MentorEligibilityResult;
  readiness?: MentorReadinessResult;
  stamps?: MentorStampsResult;
  matches?: MentorMatchesResult;
  publicView?: boolean;
}

function statusBadge(s: MentorStampsResult["recommendedStatus"] | undefined) {
  switch (s) {
    case "verified":
      return { label: "Verified Mentor", variant: "verified" as const };
    case "conditionally-verified":
      return { label: "Conditionally Verified", variant: "pending" as const };
    case "pending-evidence":
      return { label: "Pending Evidence", variant: "pending" as const };
    case "needs-review":
      return { label: "Needs Review", variant: "risk" as const };
    default:
      return { label: "Draft", variant: "outline" as const };
  }
}

export function MentorPassportDetail({
  profile,
  passportId,
  evidence,
  eligibility,
  readiness,
  stamps,
  matches,
  publicView,
}: MentorPassportDetailProps) {
  const status = statusBadge(stamps?.recommendedStatus);
  const booklet = mapStatusToBooklet(stamps?.recommendedStatus);

  return (
    <div className="mx-auto max-w-6xl px-6 py-10 lg:px-8">
      <div className="grid items-start gap-10 lg:grid-cols-[1fr_440px]">
        <div className="space-y-8">
          <div>
            <Badge variant={status.variant}>{status.label}</Badge>
            <h1 className="mt-3 text-4xl font-semibold tracking-tight text-navy-950">
              {profile.mentorName}
            </h1>
            <p className="mt-1 text-navy-600">
              {profile.expertiseAreas.slice(0, 3).join(" · ")} · {profile.country}
            </p>
            <p className="mt-2 font-mono text-xs tracking-wider text-navy-500">{passportId}</p>
          </div>

          <div className="grid gap-3 sm:grid-cols-3">
            <ScoreCard label="Eligibility" value={eligibility?.eligibilityScore} accent="indigo" />
            <ScoreCard label="Readiness" value={readiness?.readinessScore} accent="emerald" />
            <ScoreCard label="Evidence" value={evidence?.evidenceCompleteness} accent="sky" suffix="%" />
          </div>

          {readiness?.dimensions && (
            <Card className="p-6">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-cyan-deep">
                Mentor readiness
              </p>
              <div className="mt-4 space-y-3">
                {(["expertise", "sectorAlignment", "credentials", "availability", "trackRecord"] as const).map((d) => {
                  const v = readiness.dimensions[d];
                  return (
                    <div key={d}>
                      <div className="flex items-center justify-between">
                        <span className="text-sm capitalize text-navy-800">
                          {d.replace(/([A-Z])/g, " $1")}
                        </span>
                        <span className="font-mono text-xs text-navy-600">{v}</span>
                      </div>
                      <div className="mt-1 h-1.5 rounded-full bg-navy-100 overflow-hidden">
                        <div
                          className={cn("h-full rounded-full",
                            v >= 70 ? "bg-emerald-500" : v >= 50 ? "bg-amber-500" : "bg-rose-500"
                          )}
                          style={{ width: `${v}%` }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            </Card>
          )}

          {!publicView && readiness?.riskFlags && readiness.riskFlags.length > 0 && (
            <Card className="p-6">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-cyan-deep">
                Risk flags
              </p>
              <ul className="mt-4 space-y-3">
                {readiness.riskFlags.map((f, i) => (
                  <li key={i} className="flex items-start gap-2.5 rounded-lg border border-navy-100 bg-white p-3">
                    <div className={cn(
                      "mt-0.5 flex h-5 w-5 flex-none items-center justify-center rounded-md text-white",
                      f.severity === "high" ? "bg-rose-500" : f.severity === "medium" ? "bg-amber-500" : "bg-navy-300"
                    )}>
                      <AlertTriangle className="h-3 w-3" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-navy-900">{f.flag}</p>
                      <p className="text-xs text-navy-600">{f.reason}</p>
                    </div>
                  </li>
                ))}
              </ul>
            </Card>
          )}

          {!publicView && evidence && (
            <Card className="p-6">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-cyan-deep">Evidence</p>
              <p className="mt-2 text-sm text-navy-700">{evidence.notes}</p>
              {evidence.missingDocuments.length > 0 && (
                <div className="mt-4">
                  <p className="text-xs font-semibold uppercase tracking-wider text-navy-700">Missing</p>
                  <ul className="mt-2 space-y-1.5">
                    {evidence.missingDocuments.map((d, i) => (
                      <li key={i} className="flex items-start gap-2 text-sm text-navy-700">
                        <FileText className="mt-0.5 h-4 w-4 flex-none text-amber-600" />
                        {d}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </Card>
          )}

          {readiness?.summary && (
            <Card className="p-6 bg-cyan-50/40 border-cyan-100">
              <div className="flex items-start gap-3">
                <div className="flex h-9 w-9 flex-none items-center justify-center rounded-lg bg-cyan-deep text-white">
                  <Sparkles className="h-4 w-4" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-navy-900">AI summary</p>
                  <p className="mt-1 text-sm text-navy-700">{readiness.summary}</p>
                </div>
              </div>
            </Card>
          )}

          {matches && matches.startupArchetypes.length > 0 && (
            <Card className="p-6">
              <div className="flex items-center gap-2">
                <Users className="h-4 w-4 text-cyan-deep" />
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-cyan-deep">
                  Recommended startup matches
                </p>
              </div>
              <p className="mt-2 text-sm text-navy-700">{matches.reasoning}</p>
              <ol className="mt-4 space-y-3">
                {matches.startupArchetypes
                  .slice()
                  .sort((a, b) => a.sequence - b.sequence)
                  .map((r) => (
                    <li key={r.sequence} className="flex items-start gap-3 rounded-lg border border-navy-100 bg-white p-3">
                      <div className="flex h-7 w-7 flex-none items-center justify-center rounded-md bg-navy-900 text-cyan-glow font-mono text-xs">
                        {r.sequence}
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="flex flex-wrap items-center gap-2">
                          <p className="text-sm font-semibold text-navy-900">{r.title}</p>
                          <Badge variant="outline">{r.sector}</Badge>
                          <Badge variant="outline">{r.stage}</Badge>
                        </div>
                        <p className="mt-0.5 text-xs text-navy-600">{r.whyMatch}</p>
                      </div>
                    </li>
                  ))}
              </ol>
            </Card>
          )}
        </div>

        <div className="lg:sticky lg:top-24 space-y-5">
          <PassportBooklet
            type="mentor"
            holderName={profile.mentorName}
            subtitle={`${profile.expertiseAreas.slice(0, 2).join(" · ")} · ${profile.country}`}
            passportId={passportId}
            status={booklet}
            stamps={(stamps?.stamps ?? []).map((s) => ({
              key: s.key as StampKey,
              status: s.status,
            }))}
            animate={false}
          />

          {stamps?.nextAction && (
            <Card className="p-5 border-cyan-100 bg-cyan-50/30">
              <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-cyan-deep">
                Next action
              </p>
              <p className="mt-1.5 text-sm leading-relaxed text-navy-700">{stamps.nextAction}</p>
              {!publicView && (
                <Button asChild variant="primary" size="sm" className="mt-3 w-full">
                  <Link href="/mentor/passport/improve">
                    Add more evidence <ArrowRight className="h-3 w-3" />
                  </Link>
                </Button>
              )}
            </Card>
          )}

          {stamps?.stamps && stamps.stamps.length > 0 && (
            <Card className="p-5">
              <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-cyan-deep">All stamps</p>
              <ul className="mt-3 space-y-2">
                {stamps.stamps.map((s) => (
                  <li key={s.key} className="flex items-start gap-2.5 text-sm">
                    <span className={cn(
                      "mt-0.5 flex h-4 w-4 flex-none items-center justify-center rounded-full text-[10px] font-bold text-white",
                      s.status === "earned" ? "bg-emerald-500" : s.status === "pending" ? "bg-amber-500" : "bg-navy-300"
                    )}>
                      {s.status === "earned" ? <CheckCircle2 className="h-3 w-3" /> : "·"}
                    </span>
                    <div className="min-w-0 flex-1">
                      <p className="font-medium text-navy-900 capitalize">{s.key.replace(/-/g, " ")}</p>
                      <p className="text-xs text-navy-600">{s.reason}</p>
                    </div>
                  </li>
                ))}
              </ul>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}

function mapStatusToBooklet(s: MentorStampsResult["recommendedStatus"] | undefined): "Verified" | "Conditionally Verified" | "Pending Evidence" | "Verified Mentor" {
  if (s === "verified") return "Verified Mentor";
  if (s === "conditionally-verified") return "Conditionally Verified";
  return "Pending Evidence";
}

function ScoreCard({
  label,
  value,
  accent,
  suffix = "",
}: {
  label: string;
  value: number | undefined;
  accent: "indigo" | "emerald" | "sky";
  suffix?: string;
}) {
  const accentMap = {
    indigo: "from-indigo-500/10 to-violet-500/10 border-indigo-200 text-indigo-700",
    emerald: "from-emerald-500/10 to-teal-500/10 border-emerald-200 text-emerald-700",
    sky: "from-sky-500/10 to-cyan-500/10 border-sky-200 text-sky-700",
  }[accent];
  return (
    <Card className={cn("p-5 bg-gradient-to-br border", accentMap)}>
      <p className="text-[10px] font-semibold uppercase tracking-[0.18em]">{label}</p>
      <div className="mt-1 flex items-baseline gap-1">
        <p className="text-3xl font-semibold text-navy-950 tabular-nums">
          {value ?? "—"}
        </p>
        {value != null && <span className="text-sm text-navy-500">{suffix || "/100"}</span>}
      </div>
    </Card>
  );
}
