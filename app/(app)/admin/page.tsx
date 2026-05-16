"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ShieldCheck, Inbox, BadgeCheck, Network, Loader2 } from "lucide-react";
import { useAuth } from "@/lib/auth/auth-provider";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

interface AdminStats {
  pendingReview: number;
  verifiedThisMonth: number;
  activeLinkages: number;
  stampsIssued: number;
}

const TILES: Array<{
  key: keyof AdminStats;
  label: string;
  icon: typeof Inbox;
  href: string;
}> = [
  { key: "pendingReview", label: "Pending review", icon: Inbox, href: "/admin/review-queue" },
  { key: "verifiedThisMonth", label: "Verified this month", icon: BadgeCheck, href: "/admin/passports" },
  { key: "activeLinkages", label: "Active linkages", icon: Network, href: "/admin/linkages" },
  { key: "stampsIssued", label: "Stamps issued", icon: ShieldCheck, href: "/admin/stamps" },
];

export default function AdminDashboard() {
  const { user, profile } = useAuth();
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;
    let cancelled = false;
    void (async () => {
      try {
        const idToken = await user.getIdToken();
        const res = await fetch("/api/admin/stats", { headers: { Authorization: `Bearer ${idToken}` } });
        const data = await res.json();
        if (!cancelled && res.ok) setStats(data);
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
          Admin workspace
        </p>
        <h1 className="mt-2 text-3xl font-semibold tracking-tight text-navy-950">
          {profile?.organisationName ?? "Programme Admin"}
        </h1>
        <p className="mt-1 text-sm text-navy-600">
          Review applications, run AI verification, issue passports, and activate linkages.
        </p>
      </div>

      <div className="mt-8 grid gap-4 md:grid-cols-4">
        {TILES.map((t) => (
          <Card key={t.key}>
            <CardContent className="p-5">
              <div className="flex items-start justify-between">
                <Badge variant="outline">{t.label}</Badge>
                <t.icon className="h-4 w-4 text-navy-400" />
              </div>
              <p className="mt-3 text-2xl font-semibold text-navy-950 tabular-nums">
                {loading ? <Loader2 className="h-5 w-5 animate-spin text-navy-400" /> : (stats?.[t.key] ?? 0).toLocaleString()}
              </p>
              <Button asChild variant="link" className="mt-1 px-0 text-xs">
                <Link href={t.href}>Open →</Link>
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="mt-8 grid gap-4 md:grid-cols-2">
        <Card className="p-6">
          <div className="flex items-center gap-2">
            <Inbox className="h-4 w-4 text-cyan-deep" />
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-cyan-deep">Review queue</p>
          </div>
          <p className="mt-2 text-sm text-navy-700">
            {stats?.pendingReview
              ? `${stats.pendingReview} application${stats.pendingReview === 1 ? "" : "s"} waiting for your decision.`
              : "Nothing in the queue right now."}
          </p>
          <Button asChild variant="primary" size="sm" className="mt-4">
            <Link href="/admin/review-queue">Open review queue</Link>
          </Button>
        </Card>

        <Card className="p-6">
          <div className="flex items-center gap-2">
            <Network className="h-4 w-4 text-cyan-deep" />
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-cyan-deep">Linkages</p>
          </div>
          <p className="mt-2 text-sm text-navy-700">
            {stats?.activeLinkages
              ? `${stats.activeLinkages} linkage${stats.activeLinkages === 1 ? "" : "s"} active. AI proposes the next sequence per startup.`
              : "Activate linkages from any verified passport — AI generates the intro message."}
          </p>
          <Button asChild variant="outline" size="sm" className="mt-4">
            <Link href="/admin/linkages">View linkages</Link>
          </Button>
        </Card>
      </div>
    </div>
  );
}
