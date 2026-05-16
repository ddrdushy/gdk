import { cn } from "@/lib/utils";

export function ConfidencePill({ level }: { level?: "high" | "medium" | "low" }) {
  if (!level) return null;
  const styles = {
    high: "bg-emerald-50 text-emerald-700 ring-emerald-200",
    medium: "bg-amber-50 text-amber-700 ring-amber-200",
    low: "bg-rose-50 text-rose-700 ring-rose-200",
  }[level];
  const label = { high: "AI · High", medium: "AI · Medium", low: "AI · Low" }[level];
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider ring-1",
        styles
      )}
    >
      <span className="h-1.5 w-1.5 rounded-full bg-current" />
      {label}
    </span>
  );
}
