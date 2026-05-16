import { cn } from "@/lib/utils";

const MIN = 200;
// Must match the slice() limit in lib/gemini/agents/passport-builder.ts
const SOFT_CAP = 18_000;

/**
 * Three-state counter shown under the evidence textarea:
 *   < 200       — caution (too thin for good extraction)
 *   200–18,000  — green (healthy range)
 *   > 18,000    — warn (will be truncated when sent to the AI)
 */
export function EvidenceCharCounter({ chars }: { chars: number }) {
  const pct = Math.min(100, Math.round((chars / SOFT_CAP) * 100));
  const tone =
    chars < MIN ? "amber"
    : chars > SOFT_CAP ? "rose"
    : "emerald";

  const message =
    chars === 0 ? "Aim for at least 200 characters for best results."
    : chars < MIN ? `Add ~${MIN - chars} more characters for better AI extraction.`
    : chars > SOFT_CAP ? `Will be truncated to ${SOFT_CAP.toLocaleString()} chars before sending to AI.`
    : "Healthy range — AI should extract cleanly.";

  return (
    <div className="space-y-1.5">
      <div className="flex items-center justify-between text-[11px]">
        <span className={cn(
          "font-mono tabular-nums",
          tone === "amber" ? "text-amber-700" :
          tone === "rose" ? "text-rose-700" :
          "text-emerald-700"
        )}>
          {chars.toLocaleString()} / {SOFT_CAP.toLocaleString()} chars
        </span>
        <span className="text-navy-500">{message}</span>
      </div>
      <div className="h-1 overflow-hidden rounded-full bg-navy-100">
        <div
          className={cn(
            "h-full rounded-full transition-all",
            tone === "amber" ? "bg-amber-500" :
            tone === "rose" ? "bg-rose-500" :
            "bg-emerald-500"
          )}
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  );
}
