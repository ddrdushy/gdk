"use client";

import { Sparkles, ShieldCheck, AlertTriangle, FileText, CheckCircle2, Network } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { PassportBooklet } from "@/components/passport/passport-booklet";
import { StampBadge, type StampKey } from "@/components/passport/stamp-badge";
import type { StartupProfile } from "@/lib/schemas/passport";
import type {
  EvidenceResult,
  EligibilityResult,
  ReadinessResult,
  StampResult,
  LinkageResult,
} from "@/lib/schemas/verification";
import { cn } from "@/lib/utils";

export interface PassportDetailProps {
  profile: StartupProfile;
  passportId: string;
  evidence?: EvidenceResult;
  eligibility?: EligibilityResult;
  readiness?: ReadinessResult;
  stamps?: StampResult;
  linkage?: LinkageResult;
  publicView?: boolean;
}

function statusBadgeFor(s: StampResult["recommendedStatus"] | undefined) {
  switch (s) {
    case "verified":
      return { label: "Verified", variant: "verified" as const };
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

function passportStatusLabel(s: StampResult["recommendedStatus"] | undefined): "Verified" | "Conditionally Verified" | "Pending Evidence" {
  if (s === "verified") return "Verified";
  if (s === "conditionally-verified") return "Conditionally Verified";
  return "Pending Evidence";
}

export function PassportDetail({
  profile,
  passportId,
  evidence,
  eligibility,
  readiness,
  stamps,
  linkage,
  publicView,
}: PassportDetailProps) {
  const status = statusBadgeFor(stamps?.recommendedStatus);
  const stampList = stamps?.stamps ?? [];
  const filteredStamps = stampList.filter((s) =>
    [
      "identity-verified",
      "profile-confirmed",
      "pitch-deck-reviewed",
      "programme-eligible",
      "pilot-ready",
      "compliance-reviewed",
      "funding-ready",
    ].includes(s.key)
  );

  return (
    <div className="mx-auto max-w-6xl px-6 py-10 lg:px-8">
      <div className="grid items-start gap-10 lg:grid-cols-[1fr_440px]">
        {/* left column — summary */}
        <div className="space-y-8">
          <div>
            <Badge variant={status.variant}>{status.label}</Badge>
            <h1 className="mt-3 text-4xl font-semibold tracking-tight text-navy-950">
              {profile.startupName}
            </h1>
            <p className="mt-1 text-navy-600">
              {profile.sector} · {profile.stage} · {profile.country}
            </p>
            <p className="mt-2 font-mono text-xs tracking-wider text-navy-500">
              {passportId}
            </p>
          </div>

          {/* AI scores */}
          <div className="grid gap-3 sm:grid-cols-3">
            <ScoreCard
              label="Eligibility"
              value={eligibility?.eligibilityScore}
              accent="indigo"
            />
            <ScoreCard
              label="Readiness"
              value={readiness?.readinessScore}
              accent="emerald"
            />
            <ScoreCard
              label="Evidence"
              value={evidence?.evidenceCompleteness}
              accent="sky"
              suffix="%"
            />
          </div>

          {/* Readiness dimensions */}
          {readiness?.dimensions && (
            <Card className="p-6">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-cyan-deep">
                Readiness dimensions
              </p>
              <div className="mt-4 space-y-3">
                {(["business", "technical", "market", "funding", "partnership", "compliance"] as const).map((d) => {
                  const v = readiness.dimensions[d];
                  return (
                    <div key={d}>
                      <div className="flex items-center justify-between">
                        <span className="text-sm capitalize text-navy-800">{d}</span>
                        <span className="font-mono text-xs text-navy-600">{v}</span>
                      </div>
                      <div className="mt-1 h-1.5 rounded-full bg-navy-100 overflow-hidden">
                        <div
                          className={cn(
                            "h-full rounded-full",
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

          {/* Risk flags */}
          {!publicView && readiness?.riskFlags && readiness.riskFlags.length > 0 && (
            <Card className="p-6">
              <div className="flex items-center justify-between">
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-cyan-deep">
                  Risk flags
                </p>
                <Badge
                  variant={
                    readiness.riskLevel === "low"
                      ? "verified"
                      : readiness.riskLevel === "medium"
                        ? "pending"
                        : "risk"
                  }
                >
                  {readiness.riskLevel} risk
                </Badge>
              </div>
              <ul className="mt-4 space-y-3">
                {readiness.riskFlags.map((f, i) => (
                  <li key={i} className="flex items-start gap-2.5 rounded-lg border border-navy-100 bg-white p-3">
                    <div
                      className={cn(
                        "mt-0.5 flex h-5 w-5 flex-none items-center justify-center rounded-md text-white",
                        f.severity === "high" ? "bg-rose-500" : f.severity === "medium" ? "bg-amber-500" : "bg-navy-300"
                      )}
                    >
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

          {/* Evidence claims */}
          {!publicView && evidence && (
            <Card className="p-6">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-cyan-deep">
                Evidence
              </p>
              <p className="mt-2 text-sm text-navy-700">{evidence.notes}</p>

              {evidence.missingDocuments.length > 0 && (
                <div className="mt-4">
                  <p className="text-xs font-semibold uppercase tracking-wider text-navy-700">Missing documents</p>
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

              {evidence.inconsistencies.length > 0 && (
                <div className="mt-4">
                  <p className="text-xs font-semibold uppercase tracking-wider text-navy-700">Inconsistencies</p>
                  <ul className="mt-2 space-y-1.5">
                    {evidence.inconsistencies.map((d, i) => (
                      <li key={i} className="flex items-start gap-2 text-sm text-navy-700">
                        <AlertTriangle className="mt-0.5 h-4 w-4 flex-none text-rose-500" />
                        {d}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </Card>
          )}

          {/* AI summary */}
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

          {/* Linkage recommendations */}
          {linkage && linkage.recommendations.length > 0 && (
            <Card className="p-6">
              <div className="flex items-center gap-2">
                <Network className="h-4 w-4 text-cyan-deep" />
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-cyan-deep">
                  Recommended linkages
                </p>
              </div>
              <p className="mt-2 text-sm text-navy-700">{linkage.reasoning}</p>
              <ol className="mt-4 space-y-3">
                {linkage.recommendations
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
                          <Badge variant="outline" className="capitalize">{r.type.replace("-", " ")}</Badge>
                        </div>
                        <p className="mt-0.5 text-xs text-navy-600">{r.whyNow}</p>
                        {r.expertiseOrSector && (
                          <p className="mt-1 text-[11px] uppercase tracking-wider text-navy-500">
                            {r.expertiseOrSector}
                          </p>
                        )}
                      </div>
                    </li>
                  ))}
              </ol>
            </Card>
          )}
        </div>

        {/* right column — passport */}
        <div className="lg:sticky lg:top-24 space-y-5">
          <PassportBooklet
            type="startup"
            holderName={profile.startupName}
            subtitle={`${profile.sector} · ${profile.stage} · ${profile.country}`}
            passportId={passportId}
            status={passportStatusLabel(stamps?.recommendedStatus)}
            stamps={filteredStamps.map((s) => ({
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
              <p className="mt-1.5 text-sm leading-relaxed text-navy-700">
                {stamps.nextAction}
              </p>
            </Card>
          )}

          {stamps?.stamps && (
            <Card className="p-5">
              <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-cyan-deep">
                All stamps
              </p>
              <ul className="mt-3 space-y-2">
                {stamps.stamps.map((s) => (
                  <li key={s.key} className="flex items-start gap-2.5 text-sm">
                    <span
                      className={cn(
                        "mt-0.5 flex h-4 w-4 flex-none items-center justify-center rounded-full text-[10px] font-bold text-white",
                        s.status === "earned"
                          ? "bg-emerald-500"
                          : s.status === "pending"
                            ? "bg-amber-500"
                            : "bg-navy-300"
                      )}
                    >
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
