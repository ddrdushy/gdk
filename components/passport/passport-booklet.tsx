"use client";

import { motion } from "framer-motion";
import { QRCodeSVG } from "qrcode.react";
import { ShieldCheck, Sparkles } from "lucide-react";
import { StampBadge, type StampKey, type StampStatus } from "./stamp-badge";
import { cn } from "@/lib/utils";

export type PassportType = "startup" | "mentor";

export interface PassportBookletProps {
  type: PassportType;
  holderName: string;
  subtitle: string;
  passportId: string;
  status: "Verified" | "Conditionally Verified" | "Pending Evidence" | "Verified Mentor";
  stamps: Array<{ key: StampKey; status: StampStatus }>;
  /** URL the QR code resolves to. Defaults to the demo passport. */
  verificationUrl?: string;
  className?: string;
  variant?: "spread" | "cover";
  animate?: boolean;
}

export function PassportBooklet({
  type,
  holderName,
  subtitle,
  passportId,
  status,
  stamps,
  verificationUrl,
  className,
  variant = "spread",
  animate = true,
}: PassportBookletProps) {
  const isStartup = type === "startup";
  // Fall back to the marketing root for demo passports so the QR always
  // resolves to something real for the demo deck.
  const qrTarget =
    verificationUrl ??
    (typeof window !== "undefined"
      ? `${window.location.origin}/passport/${passportId}`
      : `https://trustpass.ai/passport/${passportId}`);

  if (variant === "cover") {
    return <PassportCover type={type} holderName={holderName} className={className} animate={animate} />;
  }

  return (
    <motion.div
      initial={animate ? { opacity: 0, y: 24, rotateX: 8 } : false}
      whileInView={animate ? { opacity: 1, y: 0, rotateX: 0 } : undefined}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
      className={cn(
        "relative overflow-hidden rounded-2xl",
        "bg-gradient-to-br from-navy-900 via-navy-800 to-navy-950",
        "shadow-2xl shadow-navy-900/40",
        "ring-1 ring-white/10",
        className
      )}
      style={{
        backgroundImage: `
          radial-gradient(at 80% 0%, rgba(56,189,248,0.18) 0px, transparent 50%),
          radial-gradient(at 0% 100%, rgba(99,102,241,0.15) 0px, transparent 50%),
          linear-gradient(135deg, #0e1b34 0%, #182947 50%, #060e1f 100%)
        `,
      }}
    >
      {/* foil shimmer overlay */}
      <div className="passport-foil pointer-events-none absolute inset-0 opacity-50 mix-blend-overlay" />
      {/* subtle grain */}
      <div className="passport-grain pointer-events-none absolute inset-0 opacity-40" />

      <div className="relative z-10 p-7">
        {/* header row */}
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-white/10 ring-1 ring-white/20 backdrop-blur">
              <ShieldCheck className="h-5 w-5 text-cyan-glow" />
            </div>
            <div>
              <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-cyan-glow/90">
                {isStartup ? "Startup Passport" : "Mentor Passport"}
              </p>
              <p className="text-[10px] text-navy-300">Issued by TrustPass AI</p>
            </div>
          </div>

          <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-white p-1.5 shadow-md ring-1 ring-black/5">
            <QRCodeSVG
              value={qrTarget}
              size={36}
              bgColor="#ffffff"
              fgColor="#0e1b34"
              level="M"
              marginSize={0}
            />
          </div>
        </div>

        {/* identity */}
        <div className="mt-7">
          <h3 className="text-2xl font-semibold tracking-tight text-white leading-tight">
            {holderName}
          </h3>
          <p className="mt-1 text-sm text-navy-200">{subtitle}</p>
        </div>

        {/* status + ID */}
        <div className="mt-5 flex items-center gap-3">
          <div
            className={cn(
              "inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[11px] font-semibold backdrop-blur",
              status === "Verified" || status === "Verified Mentor"
                ? "bg-emerald-500/20 text-emerald-200 ring-1 ring-emerald-400/40"
                : status === "Conditionally Verified"
                  ? "bg-amber-500/20 text-amber-100 ring-1 ring-amber-400/40"
                  : "bg-sky-500/20 text-sky-100 ring-1 ring-sky-400/40"
            )}
          >
            <Sparkles className="h-3 w-3" />
            {status}
          </div>
          <div className="font-mono text-[11px] tracking-wider text-navy-300">
            {passportId}
          </div>
        </div>

        {/* divider */}
        <div className="mt-6 h-px bg-gradient-to-r from-transparent via-white/15 to-transparent" />

        {/* stamps */}
        <div className="mt-6">
          <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-navy-300">
            Stamps · {stamps.filter((s) => s.status === "earned").length} of {stamps.length}
          </p>
          <div className="mt-4 flex flex-wrap items-start gap-x-4 gap-y-5">
            {stamps.map((s) => (
              <StampBadge
                key={s.key}
                stamp={s.key}
                status={s.status}
                size="sm"
              />
            ))}
          </div>
        </div>

        {/* footer micro-text */}
        <div className="mt-7 flex items-end justify-between border-t border-white/10 pt-4">
          <p className="text-[9px] font-medium uppercase tracking-[0.18em] text-navy-400">
            Issued · {new Date().toLocaleDateString("en-US", { month: "short", year: "numeric" })}
          </p>
          <p className="text-[9px] font-medium uppercase tracking-[0.18em] text-cyan-glow/80">
            trustpass.ai/verify
          </p>
        </div>
      </div>
    </motion.div>
  );
}

function PassportCover({
  type,
  holderName,
  className,
  animate,
}: {
  type: PassportType;
  holderName: string;
  className?: string;
  animate?: boolean;
}) {
  const isStartup = type === "startup";
  return (
    <motion.div
      initial={animate ? { opacity: 0, y: 24 } : false}
      whileInView={animate ? { opacity: 1, y: 0 } : undefined}
      viewport={{ once: true }}
      transition={{ duration: 0.6 }}
      className={cn(
        "relative aspect-[3/4] overflow-hidden rounded-2xl bg-gradient-to-br from-navy-900 via-navy-800 to-navy-950 shadow-2xl shadow-navy-900/40 ring-1 ring-white/10",
        className
      )}
    >
      <div className="passport-foil pointer-events-none absolute inset-0 opacity-40 mix-blend-overlay" />
      <div className="passport-grain pointer-events-none absolute inset-0 opacity-40" />
      <div className="relative z-10 flex h-full flex-col items-center justify-between p-8 text-center text-white">
        <div className="flex flex-col items-center gap-2">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-white/10 ring-1 ring-white/20">
            <ShieldCheck className="h-7 w-7 text-cyan-glow" strokeWidth={2.2} />
          </div>
          <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-cyan-glow/90">
            TrustPass · AI
          </p>
        </div>

        <div className="flex flex-col items-center gap-4">
          <div className="relative flex h-32 w-32 items-center justify-center rounded-full ring-2 ring-cyan-glow/40">
            <div className="absolute inset-2 rounded-full bg-gradient-to-br from-cyan-deep to-navy-700 shadow-inner" />
            <ShieldCheck className="relative h-14 w-14 text-white" strokeWidth={2} />
            <div className="absolute inset-0 rounded-full border border-white/10" />
          </div>
          <p className="font-mono text-[11px] tracking-[0.32em] text-navy-300 uppercase">
            {isStartup ? "Startup Passport" : "Mentor Passport"}
          </p>
          <p className="text-base font-semibold tracking-tight text-white">{holderName}</p>
        </div>

        <p className="text-[9px] font-medium uppercase tracking-[0.22em] text-navy-400">
          Issued by TrustPass AI
        </p>
      </div>
    </motion.div>
  );
}
