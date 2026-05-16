"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Loader2, BadgeCheck, ExternalLink } from "lucide-react";
import { useAuth } from "@/lib/auth/auth-provider";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface PassportRow {
  ownerUid: string;
  type: "startup" | "mentor";
  holderName: string;
  sector: string;
  stage: string;
  country: string;
  status: string;
  issuedAt: number | null;
  reviewDate: string | null;
  earnedStamps: number;
  pendingStamps: number;
}

const STATUS_VARIANT: Record<string, "verified" | "pending" | "risk" | "outline"> = {
  verified: "verified",
  "conditionally-verified": "pending",
  "pending-evidence": "pending",
  "needs-review": "risk",
  rejected: "risk",
};

export default function AdminPassportsPage() {
  const { user, profile } = useAuth();
  const [items, setItems] = useState<PassportRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!user) return;
    let cancelled = false;
    void (async () => {
      try {
        const idToken = await user.getIdToken();
        const res = await fetch("/api/admin/passports", { headers: { Authorization: `Bearer ${idToken}` } });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error ?? `HTTP ${res.status}`);
        if (!cancelled) setItems(data.items ?? []);
      } catch (err) {
        if (!cancelled) setError(err instanceof Error ? err.message : "Could not load passports");
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => { cancelled = true; };
  }, [user]);

  return (
    <div className="mx-auto max-w-6xl px-6 py-10 lg:px-8">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-cyan-deep">
            Admin · Issued passports
          </p>
          <h1 className="mt-2 text-3xl font-semibold tracking-tight text-navy-950">
            {profile?.organisationName ? `${profile.organisationName} passports` : "Issued passports"}
          </h1>
          <p className="mt-1 text-sm text-navy-600">
            Every passport this admin workspace has issued. Click any row to view the public passport.
          </p>
        </div>
        <Badge variant="outline">{items.length} issued</Badge>
      </div>

      {loading ? (
        <div className="mt-12 flex justify-center"><Loader2 className="h-5 w-5 animate-spin text-navy-400" /></div>
      ) : error ? (
        <Card className="mt-8 p-6 border-rose-200 bg-rose-50">
          <p className="text-sm text-rose-800">{error}</p>
        </Card>
      ) : items.length === 0 ? (
        <Card className="mt-8 p-12 text-center border-dashed">
          <BadgeCheck className="mx-auto h-10 w-10 text-navy-300" />
          <p className="mt-3 text-base font-medium text-navy-900">No issued passports yet.</p>
          <p className="mt-1 text-sm text-navy-600">Approve an application in the review queue to issue your first passport.</p>
        </Card>
      ) : (
        <div className="mt-8 space-y-3">
          {items.map((p) => {
            const issuedAgo = p.issuedAt ? formatRelative(p.issuedAt) : "—";
            return (
              <Link
                key={p.ownerUid}
                href={`/passport/${p.ownerUid}`}
                target="_blank"
                className="group flex items-start justify-between gap-4 rounded-xl border border-navy-100 bg-white p-5 transition-all hover:border-navy-200 hover:shadow-md"
              >
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <p className="text-base font-semibold text-navy-950">{p.holderName}</p>
                    <Badge variant={p.type === "mentor" ? "accent" : "outline"}>
                      {p.type === "mentor" ? "Mentor" : "Startup"}
                    </Badge>
                    <Badge variant={STATUS_VARIANT[p.status] ?? "outline"}>{p.status}</Badge>
                  </div>
                  <p className="mt-1 text-xs text-navy-600">
                    {p.sector} · {p.stage} · {p.country}
                  </p>
                  <p className="mt-1 text-[11px] text-navy-500">
                    Issued {issuedAgo} · {p.earnedStamps} earned stamp{p.earnedStamps === 1 ? "" : "s"}
                    {p.pendingStamps ? ` · ${p.pendingStamps} pending` : ""}
                    {p.reviewDate ? ` · review by ${new Date(p.reviewDate).toLocaleDateString()}` : ""}
                  </p>
                </div>
                <ExternalLink className="h-4 w-4 flex-none text-navy-400 group-hover:text-navy-700" />
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}

function formatRelative(millis: number): string {
  const diff = Date.now() - millis;
  const mins = Math.floor(diff / 60_000);
  if (mins < 1) return "just now";
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  const days = Math.floor(hrs / 24);
  if (days < 30) return `${days}d ago`;
  return new Date(millis).toLocaleDateString();
}
