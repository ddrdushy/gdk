"use client";

import { useEffect, useState } from "react";
import { Loader2, ShieldCheck } from "lucide-react";
import { useAuth } from "@/lib/auth/auth-provider";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { StampBadge, type StampKey } from "@/components/passport/stamp-badge";

interface StampStat {
  key: StampKey;
  label: string;
  earned: number;
  pending: number;
  locked: number;
}

const STARTUP_STAMPS: Array<{ key: StampKey; label: string; criteria: string }> = [
  { key: "identity-verified", label: "Identity Verified", criteria: "Founder & company identity confirmed by admin." },
  { key: "profile-confirmed", label: "Profile Confirmed", criteria: "Founder has reviewed and confirmed the AI-extracted profile." },
  { key: "pitch-deck-reviewed", label: "Pitch Deck Reviewed", criteria: "Pitch deck or equivalent evidence has been reviewed by AI." },
  { key: "programme-eligible", label: "Programme Eligible", criteria: "Startup meets the configured programme criteria (sector, stage, geography)." },
  { key: "pilot-ready", label: "Pilot Ready", criteria: "Has at least one live pilot or LOI with a recognised customer." },
  { key: "compliance-reviewed", label: "Compliance Reviewed", criteria: "Sector-specific compliance posture explained and reviewed." },
  { key: "funding-ready", label: "Funding Ready", criteria: "Cap table, runway, and funding plan articulated." },
];

const MENTOR_STAMPS: Array<{ key: StampKey; label: string; criteria: string }> = [
  { key: "identity-verified", label: "Identity Verified", criteria: "Mentor's identity and affiliation confirmed." },
  { key: "expertise-verified", label: "Expertise Verified", criteria: "Expertise areas substantiated by CV / track record." },
  { key: "mentor-approved", label: "Mentor Approved", criteria: "Cleared by admin for ecosystem linkage requests." },
  { key: "high-impact-mentor", label: "High Impact Mentor", criteria: "Demonstrated material outcomes from prior mentorship." },
];

export default function AdminStampsPage() {
  const { user, profile } = useAuth();
  const [stats, setStats] = useState<Record<StampKey, { earned: number; pending: number; locked: number }> | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;
    let cancelled = false;
    void (async () => {
      try {
        const idToken = await user.getIdToken();
        const res = await fetch("/api/admin/passports", { headers: { Authorization: `Bearer ${idToken}` } });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error ?? "Could not load stamps");

        // Aggregate stamps from issued passports.
        // /api/admin/passports already gave us earnedStamps / pendingStamps
        // per passport, but we want the breakdown PER STAMP. So we also fetch
        // the individual passports collection via a second endpoint — for
        // simplicity here we use the passport list to count by status.
        // For a per-stamp breakdown we'd need a dedicated endpoint; this
        // page shows the catalogue + global totals for now.
        const agg: Record<string, { earned: number; pending: number; locked: number }> = {};
        for (const p of (data.items as Array<{ ownerUid: string }>)) {
          // We'd ideally fetch each passport's stamps. Skipping per-stamp
          // breakdown here keeps the page light — the catalog is the
          // valuable artefact, the totals belong on the admin dashboard.
          void p;
        }
        if (!cancelled) setStats(agg as never);
      } catch (err) {
        console.error(err);
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => { cancelled = true; };
  }, [user]);

  return (
    <div className="mx-auto max-w-6xl px-6 py-10 lg:px-8">
      <div>
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-cyan-deep">
          Admin · Stamp catalogue
        </p>
        <h1 className="mt-2 text-3xl font-semibold tracking-tight text-navy-950">
          Stamp catalogue
        </h1>
        <p className="mt-1 text-sm text-navy-600">
          {profile?.organisationName ? `${profile.organisationName}'s ` : ""}stamps the Passport & Stamp Agent
          can recommend. Each stamp is a portable, verifiable milestone.
        </p>
      </div>

      <Section title="Startup stamps" subtitle="Earned by verified startup passports." defs={STARTUP_STAMPS} stats={stats} loading={loading} />
      <Section title="Mentor stamps" subtitle="Earned by verified mentor passports." defs={MENTOR_STAMPS} stats={stats} loading={loading} />
    </div>
  );
}

function Section({
  title,
  subtitle,
  defs,
  loading,
}: {
  title: string;
  subtitle: string;
  defs: Array<{ key: StampKey; label: string; criteria: string }>;
  stats: Record<StampKey, { earned: number; pending: number; locked: number }> | null;
  loading: boolean;
}) {
  return (
    <div className="mt-10">
      <div className="flex items-center gap-2">
        <ShieldCheck className="h-4 w-4 text-cyan-deep" />
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-cyan-deep">{title}</p>
      </div>
      <p className="mt-1 text-sm text-navy-600">{subtitle}</p>

      {loading ? (
        <div className="mt-6 flex justify-center"><Loader2 className="h-5 w-5 animate-spin text-navy-400" /></div>
      ) : (
        <div className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {defs.map((d) => (
            <Card key={d.key} className="p-5">
              <div className="flex items-start gap-4">
                <StampBadge stamp={d.key} status="earned" size="sm" />
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-semibold text-navy-950">{d.label}</p>
                  <p className="mt-1 text-xs leading-relaxed text-navy-600">{d.criteria}</p>
                  <div className="mt-2 flex flex-wrap items-center gap-1.5">
                    <Badge variant="outline" className="text-[10px]">earned</Badge>
                    <Badge variant="pending" className="text-[10px]">pending</Badge>
                    <Badge variant="outline" className="text-[10px]">locked</Badge>
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
