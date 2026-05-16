"use client";

import { useState } from "react";
import { CheckCircle2, Loader2, AlertTriangle, ChevronDown, ChevronUp } from "lucide-react";
import { cn } from "@/lib/utils";

interface AgentResultCardProps {
  index: number;
  label: string;
  body: string;
  state: "idle" | "running" | "done" | "error";
  result?: unknown;
  /**
   * Optional renderer for the agent-specific summary block — shown when the
   * agent completes, before the user expands the raw JSON.
   */
  summary?: (result: unknown) => React.ReactNode;
}

export function AgentResultCard({ index, label, body, state, result, summary }: AgentResultCardProps) {
  const [expanded, setExpanded] = useState(false);

  return (
    <div
      className={cn(
        "rounded-lg border transition-all",
        state === "done"
          ? "border-emerald-200 bg-emerald-50/60"
          : state === "running"
            ? "border-cyan-deep bg-cyan-50/40"
            : state === "error"
              ? "border-rose-200 bg-rose-50/60"
              : "border-navy-100 bg-white"
      )}
    >
      <div className="flex items-start gap-3 p-3">
        <div
          className={cn(
            "flex h-8 w-8 flex-none items-center justify-center rounded-lg",
            state === "done" ? "bg-emerald-500 text-white" :
            state === "running" ? "bg-cyan-deep text-white" :
            state === "error" ? "bg-rose-500 text-white" :
            "bg-navy-100 text-navy-400"
          )}
        >
          {state === "done" ? <CheckCircle2 className="h-4 w-4" /> :
            state === "running" ? <Loader2 className="h-4 w-4 animate-spin" /> :
            state === "error" ? <AlertTriangle className="h-4 w-4" /> :
            <span className="text-xs">{index + 1}</span>}
        </div>
        <div className="min-w-0 flex-1">
          <p className={cn("text-sm font-semibold", state !== "idle" ? "text-navy-950" : "text-navy-600")}>
            {label}
          </p>
          <p className="text-xs leading-relaxed text-navy-600">{body}</p>
          {state === "done" && summary && result != null && (
            <div className="mt-2 space-y-1.5">{summary(result)}</div>
          )}
        </div>
        {state === "done" && result != null && (
          <button
            type="button"
            onClick={() => setExpanded((e) => !e)}
            className="flex-none text-[11px] font-medium text-navy-500 hover:text-navy-800 inline-flex items-center gap-0.5"
            aria-label={expanded ? "Hide raw response" : "Show raw response"}
          >
            {expanded ? "Hide JSON" : "Raw"}
            {expanded ? <ChevronUp className="h-3 w-3" /> : <ChevronDown className="h-3 w-3" />}
          </button>
        )}
      </div>
      {expanded && result != null && (
        <pre className="overflow-x-auto rounded-b-lg border-t border-emerald-200/60 bg-navy-950 p-3 text-[10.5px] leading-snug text-cyan-glow/90 font-mono max-h-[260px]">
          {JSON.stringify(result, null, 2)}
        </pre>
      )}
    </div>
  );
}

// ─── Per-agent summary renderers ─────────────────────────────────────────

interface ChipProps {
  tone?: "ok" | "warn" | "risk" | "muted";
  children: React.ReactNode;
}
function Chip({ tone = "muted", children }: ChipProps) {
  return (
    <span className={cn(
      "inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-semibold ring-1",
      tone === "ok" ? "bg-emerald-50 text-emerald-700 ring-emerald-200" :
      tone === "warn" ? "bg-amber-50 text-amber-700 ring-amber-200" :
      tone === "risk" ? "bg-rose-50 text-rose-700 ring-rose-200" :
      "bg-navy-50 text-navy-700 ring-navy-200"
    )}>
      {children}
    </span>
  );
}

export const agentSummaries = {
  builder: (r: unknown) => {
    const a = r as { overallConfidence?: string; missingFields?: string[]; summary?: string };
    return (
      <>
        <div className="flex flex-wrap items-center gap-1.5">
          <Chip tone={a.overallConfidence === "high" ? "ok" : a.overallConfidence === "low" ? "warn" : "muted"}>
            confidence: {a.overallConfidence ?? "—"}
          </Chip>
          {a.missingFields && a.missingFields.length > 0 && (
            <Chip tone="warn">missing: {a.missingFields.length}</Chip>
          )}
        </div>
        {a.summary && <p className="text-[11.5px] text-navy-700">{a.summary}</p>}
      </>
    );
  },
  evidence: (r: unknown) => {
    const e = r as { evidenceCompleteness?: number; claims?: unknown[]; missingDocuments?: string[]; inconsistencies?: string[]; };
    return (
      <div className="flex flex-wrap items-center gap-1.5">
        <Chip tone={(e.evidenceCompleteness ?? 0) >= 70 ? "ok" : (e.evidenceCompleteness ?? 0) >= 40 ? "warn" : "risk"}>
          completeness: {e.evidenceCompleteness ?? 0}%
        </Chip>
        <Chip>{e.claims?.length ?? 0} claims</Chip>
        {(e.missingDocuments?.length ?? 0) > 0 && <Chip tone="warn">{e.missingDocuments!.length} missing docs</Chip>}
        {(e.inconsistencies?.length ?? 0) > 0 && <Chip tone="risk">{e.inconsistencies!.length} inconsistencies</Chip>}
      </div>
    );
  },
  eligibility: (r: unknown) => {
    const e = r as { eligibilityScore?: number; decision?: string; reason?: string };
    return (
      <>
        <div className="flex flex-wrap items-center gap-1.5">
          <Chip tone={(e.eligibilityScore ?? 0) >= 80 ? "ok" : (e.eligibilityScore ?? 0) >= 50 ? "warn" : "risk"}>
            score: {e.eligibilityScore ?? "—"}
          </Chip>
          <Chip tone={e.decision === "eligible" ? "ok" : e.decision === "conditionally-eligible" ? "warn" : "risk"}>
            {e.decision ?? "—"}
          </Chip>
        </div>
        {e.reason && <p className="text-[11.5px] text-navy-700 line-clamp-2">{e.reason}</p>}
      </>
    );
  },
  readiness: (r: unknown) => {
    const x = r as {
      readinessScore?: number;
      riskLevel?: string;
      riskFlags?: unknown[];
      dimensions?: Record<string, number>;
      summary?: string;
    };
    return (
      <>
        <div className="flex flex-wrap items-center gap-1.5">
          <Chip tone={(x.readinessScore ?? 0) >= 70 ? "ok" : (x.readinessScore ?? 0) >= 50 ? "warn" : "risk"}>
            readiness: {x.readinessScore ?? "—"}
          </Chip>
          {x.riskLevel && (
            <Chip tone={x.riskLevel === "low" ? "ok" : x.riskLevel === "medium" ? "warn" : "risk"}>
              {x.riskLevel} risk
            </Chip>
          )}
          {x.riskFlags && <Chip>{x.riskFlags.length} flags</Chip>}
        </div>
        {x.summary && <p className="text-[11.5px] text-navy-700 line-clamp-2">{x.summary}</p>}
      </>
    );
  },
  stamps: (r: unknown) => {
    const s = r as {
      recommendedStatus?: string;
      stamps?: Array<{ key: string; status: string }>;
      nextAction?: string;
    };
    const earned = s.stamps?.filter((x) => x.status === "earned").length ?? 0;
    const pending = s.stamps?.filter((x) => x.status === "pending").length ?? 0;
    return (
      <>
        <div className="flex flex-wrap items-center gap-1.5">
          <Chip tone={s.recommendedStatus === "verified" ? "ok" : s.recommendedStatus === "conditionally-verified" ? "warn" : "risk"}>
            {s.recommendedStatus ?? "—"}
          </Chip>
          <Chip tone="ok">{earned} earned</Chip>
          {pending > 0 && <Chip tone="warn">{pending} pending</Chip>}
        </div>
        {s.nextAction && <p className="text-[11.5px] text-navy-700 line-clamp-2">↳ {s.nextAction}</p>}
      </>
    );
  },
  linkage: (r: unknown) => {
    const x = r as { recommendations?: Array<{ title: string; type: string }> };
    const recs = x.recommendations ?? [];
    return (
      <div className="space-y-1">
        <div className="flex items-center gap-1.5">
          <Chip tone="ok">{recs.length} linkages</Chip>
        </div>
        {recs.slice(0, 3).map((r, i) => (
          <p key={i} className="text-[11.5px] text-navy-700">
            <span className="font-mono text-navy-500">#{i + 1}</span> {r.title}
          </p>
        ))}
      </div>
    );
  },
  matches: (r: unknown) => {
    const x = r as { startupArchetypes?: Array<{ title: string; sector: string }> };
    const recs = x.startupArchetypes ?? [];
    return (
      <div className="space-y-1">
        <div className="flex items-center gap-1.5">
          <Chip tone="ok">{recs.length} matches</Chip>
        </div>
        {recs.slice(0, 3).map((r, i) => (
          <p key={i} className="text-[11.5px] text-navy-700">
            <span className="font-mono text-navy-500">#{i + 1}</span> {r.title} <span className="text-navy-500">· {r.sector}</span>
          </p>
        ))}
      </div>
    );
  },
};
