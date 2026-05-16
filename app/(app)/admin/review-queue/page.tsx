"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Loader2, Inbox, ArrowRight } from "lucide-react";
import { useAuth } from "@/lib/auth/auth-provider";
import { fetchAdminReviewQueue, type AdminQueueItem } from "@/lib/firebase/queries";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

const STATUS_LABELS: Record<string, { label: string; variant: "verified" | "pending" | "risk" | "outline" }> = {
  submitted: { label: "Submitted", variant: "outline" },
  "ai-verified": { label: "AI verified · ready to review", variant: "pending" },
  "needs-review": { label: "Needs review", variant: "risk" },
  approved: { label: "Approved", variant: "verified" },
};

export default function ReviewQueuePage() {
  const { profile } = useAuth();
  const [items, setItems] = useState<AdminQueueItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    void (async () => {
      try {
        const data = await fetchAdminReviewQueue();
        if (!cancelled) setItems(data);
      } catch (err) {
        console.error(err);
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <div className="mx-auto max-w-6xl px-6 py-10 lg:px-8">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-cyan-deep">
            Admin · Review queue
          </p>
          <h1 className="mt-2 text-3xl font-semibold tracking-tight text-navy-950">
            {profile?.organisationName ? `${profile.organisationName} review queue` : "Review queue"}
          </h1>
          <p className="mt-1 text-sm text-navy-600">
            AI has prepared recommendations. You decide the final outcome.
          </p>
        </div>
        <Badge variant="outline">{items.length} pending</Badge>
      </div>

      {loading ? (
        <div className="mt-12 flex justify-center">
          <Loader2 className="h-5 w-5 animate-spin text-navy-400" />
        </div>
      ) : items.length === 0 ? (
        <Card className="mt-8 p-12 text-center border-dashed">
          <Inbox className="mx-auto h-10 w-10 text-navy-300" />
          <p className="mt-3 text-base font-medium text-navy-900">No applications in your queue yet.</p>
          <p className="mt-1 text-sm text-navy-600">
            When founders submit, you&apos;ll see AI recommendations here ready for review.
          </p>
        </Card>
      ) : (
        <div className="mt-8 space-y-3">
          {items.map((item) => {
            const status = STATUS_LABELS[item.status] ?? STATUS_LABELS.submitted;
            return (
              <Link
                key={item.ownerUid}
                href={`/admin/review/${item.ownerUid}`}
                className="group flex items-center justify-between rounded-xl border border-navy-100 bg-white p-5 transition-all hover:border-navy-200 hover:shadow-md"
              >
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <p className="text-base font-semibold text-navy-950">{item.startupName}</p>
                    <Badge variant={status.variant}>{status.label}</Badge>
                  </div>
                  <p className="mt-1 text-xs text-navy-600">
                    {item.sector} · {item.stage} · {item.country}
                  </p>
                </div>
                <div className="flex items-center gap-3 text-sm text-navy-600 group-hover:text-navy-900">
                  Open review
                  <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
                </div>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}
