"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Building2, Network, Loader2, ArrowRight } from "lucide-react";
import { useAuth } from "@/lib/auth/auth-provider";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

interface InboxItem {
  id: string;
  ownerUid: string;
  startupName: string;
  sector: string;
  stage: string;
  title: string;
  whyNow: string;
  status: string;
  sentAt: number | null;
}

interface Inbox {
  items: InboxItem[];
  counts: { pending: number; active: number; feedback: number };
}

export default function PartnerDashboard() {
  const { user, profile } = useAuth();
  const [inbox, setInbox] = useState<Inbox | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;
    let cancelled = false;
    void (async () => {
      try {
        const idToken = await user.getIdToken();
        const res = await fetch("/api/partner/inbox", { headers: { Authorization: `Bearer ${idToken}` } });
        const data = await res.json();
        if (!cancelled && res.ok) setInbox(data);
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
          Partner dashboard
        </p>
        <h1 className="mt-2 text-3xl font-semibold tracking-tight text-navy-950">
          {profile?.organisationName ?? "Ecosystem Partner"}
        </h1>
        <p className="mt-1 text-sm text-navy-600">
          Connect with pre-verified startups that match your services.
        </p>
      </div>

      <div className="mt-8 grid gap-4 md:grid-cols-3">
        <StatTile label="Linkage requests" value={inbox?.counts.pending ?? 0} body="Startups matched to your offering." loading={loading} />
        <StatTile label="Active engagements" value={inbox?.counts.active ?? 0} body="Intro sent or accepted." loading={loading} />
        <StatTile label="Feedback received" value={inbox?.counts.feedback ?? 0} body="Closes the loop on every linkage." loading={loading} />
      </div>

      <div className="mt-8">
        {loading ? (
          <div className="flex justify-center py-12"><Loader2 className="h-5 w-5 animate-spin text-navy-400" /></div>
        ) : !inbox?.items.length ? (
          <Card className="border-dashed p-10 text-center">
            <Network className="mx-auto h-10 w-10 text-navy-300" />
            <p className="mt-3 text-base font-medium text-navy-900">No linkage requests yet.</p>
            <p className="mx-auto mt-2 max-w-md text-sm text-navy-600">
              We&apos;ll surface only startups that match your sector, services, and stage.
            </p>
          </Card>
        ) : (
          <div className="space-y-3">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-cyan-deep">Linkage inbox</p>
            {inbox.items.map((item) => (
              <Card key={item.id} className="p-5">
                <div className="flex items-start justify-between gap-4">
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <Building2 className="h-4 w-4 text-navy-400" />
                      <p className="text-sm font-semibold text-navy-950">{item.startupName}</p>
                      <Badge variant="outline">{item.stage}</Badge>
                      <Badge variant="outline">{item.sector}</Badge>
                      <Badge variant={item.status === "sent" ? "accent" : item.status === "accepted" ? "verified" : "outline"}>
                        {item.status}
                      </Badge>
                    </div>
                    <p className="mt-2 text-sm text-navy-700">{item.title}</p>
                    <p className="mt-1 text-xs text-navy-600">{item.whyNow}</p>
                  </div>
                  <Button asChild variant="outline" size="sm">
                    <Link href={`/passport/${item.ownerUid}`} target="_blank">
                      View passport <ArrowRight className="h-3 w-3" />
                    </Link>
                  </Button>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function StatTile({
  label,
  value,
  body,
  loading,
}: {
  label: string;
  value: number;
  body: string;
  loading?: boolean;
}) {
  return (
    <Card>
      <CardContent className="p-5">
        <Badge variant="outline">{label}</Badge>
        <p className="mt-3 text-2xl font-semibold text-navy-950 tabular-nums">
          {loading ? <Loader2 className="h-5 w-5 animate-spin text-navy-400" /> : value}
        </p>
        <p className="mt-1 text-sm text-navy-600">{body}</p>
      </CardContent>
    </Card>
  );
}
