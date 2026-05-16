import {
  CheckCircle2,
  Clock,
  Lock,
  Award,
  FileCheck2,
  Building2,
  Sparkles,
  ShieldCheck,
  HeartHandshake,
  Rocket,
  TrendingUp,
  GraduationCap,
} from "lucide-react";
import { cn } from "@/lib/utils";

export type StampStatus = "earned" | "pending" | "locked";

export type StampKey =
  | "identity-verified"
  | "pitch-deck-reviewed"
  | "programme-eligible"
  | "pilot-ready"
  | "compliance-reviewed"
  | "funding-ready"
  | "expertise-verified"
  | "mentor-approved"
  | "high-impact-mentor"
  | "profile-confirmed";

const STAMP_DEFS: Record<
  StampKey,
  { label: string; icon: typeof Award; tint: string }
> = {
  "identity-verified": {
    label: "Identity Verified",
    icon: ShieldCheck,
    tint: "from-emerald-500 to-emerald-600",
  },
  "pitch-deck-reviewed": {
    label: "Pitch Deck Reviewed",
    icon: FileCheck2,
    tint: "from-sky-500 to-sky-600",
  },
  "programme-eligible": {
    label: "Programme Eligible",
    icon: Building2,
    tint: "from-indigo-500 to-indigo-600",
  },
  "pilot-ready": {
    label: "Pilot Ready",
    icon: Rocket,
    tint: "from-amber-500 to-orange-500",
  },
  "compliance-reviewed": {
    label: "Compliance Reviewed",
    icon: CheckCircle2,
    tint: "from-teal-500 to-teal-600",
  },
  "funding-ready": {
    label: "Funding Ready",
    icon: TrendingUp,
    tint: "from-violet-500 to-violet-600",
  },
  "expertise-verified": {
    label: "Expertise Verified",
    icon: GraduationCap,
    tint: "from-emerald-500 to-emerald-600",
  },
  "mentor-approved": {
    label: "Mentor Approved",
    icon: HeartHandshake,
    tint: "from-sky-500 to-sky-600",
  },
  "high-impact-mentor": {
    label: "High Impact Mentor",
    icon: Sparkles,
    tint: "from-fuchsia-500 to-pink-500",
  },
  "profile-confirmed": {
    label: "Profile Confirmed",
    icon: Award,
    tint: "from-cyan-500 to-cyan-600",
  },
};

export interface StampBadgeProps {
  stamp: StampKey;
  status?: StampStatus;
  size?: "sm" | "md" | "lg";
  className?: string;
}

export function StampBadge({
  stamp,
  status = "earned",
  size = "md",
  className,
}: StampBadgeProps) {
  const def = STAMP_DEFS[stamp];
  const Icon = def.icon;

  const dims = {
    sm: "h-14 w-14 text-[8.5px]",
    md: "h-20 w-20 text-[10px]",
    lg: "h-24 w-24 text-[11px]",
  }[size];

  const iconDims = {
    sm: "h-4 w-4",
    md: "h-5 w-5",
    lg: "h-6 w-6",
  }[size];

  if (status === "locked") {
    return (
      <div className={cn("flex flex-col items-center gap-1.5", className)}>
        <div
          className={cn(
            "relative flex items-center justify-center rounded-full border-2 border-dashed border-navy-300 bg-navy-50 text-navy-400",
            dims
          )}
          aria-label={`${def.label} (locked)`}
        >
          <Lock className={iconDims} />
        </div>
        <p className="text-center text-[10px] font-medium uppercase tracking-wide leading-tight text-navy-400 max-w-[90px]">
          {def.label}
        </p>
      </div>
    );
  }

  if (status === "pending") {
    return (
      <div className={cn("flex flex-col items-center gap-1.5", className)}>
        <div
          className={cn(
            "relative flex items-center justify-center rounded-full border-2 border-dashed border-amber-400 bg-amber-50 text-amber-700 shadow-sm",
            dims
          )}
          aria-label={`${def.label} (pending)`}
        >
          <div className="flex flex-col items-center gap-0.5">
            <Clock className={iconDims} />
            <span className="font-bold uppercase tracking-wider">Pending</span>
          </div>
        </div>
        <p className="text-center text-[10px] font-medium uppercase tracking-wide leading-tight text-amber-700 max-w-[90px]">
          {def.label}
        </p>
      </div>
    );
  }

  // Earned — premium stamp look
  return (
    <div className={cn("flex flex-col items-center gap-1.5", className)}>
      <div
        className={cn(
          "relative flex items-center justify-center rounded-full text-white shadow-lg ring-4 ring-white",
          "bg-gradient-to-br",
          def.tint,
          dims
        )}
        style={{
          animation: "stamp 0.6s ease-out both",
          transformOrigin: "center",
        }}
        aria-label={`${def.label} (verified)`}
      >
        {/* outer ring inscription */}
        <span className="absolute inset-0.5 rounded-full border border-white/30" />
        {/* inner content */}
        <div className="relative flex flex-col items-center gap-0.5">
          <Icon className={iconDims} strokeWidth={2.4} />
          <span className="font-extrabold uppercase tracking-wider leading-none">
            Verified
          </span>
        </div>
      </div>
      <p className="text-center text-[10px] font-semibold uppercase tracking-wide leading-tight text-navy-700 max-w-[90px]">
        {def.label}
      </p>
    </div>
  );
}
