"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  collection,
  getDocs,
  orderBy,
  query,
} from "firebase/firestore";
import { Loader2, Network, ArrowRight } from "lucide-react";
import { getDb } from "@/lib/firebase/client";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface LinkageRow {
  ownerUid: string;
  startupName: string;
  sector: string;
  stage: string;
  status: string;
  recommendations?: Array<{ sequence: number; type: string; title: string; whyNow: string }>;
}

export default function AdminLinkagesPage() {
  const [rows, setRows] = useState<LinkageRow[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    void (async () => {
      try {
        const db = getDb();
        let resultsSnap;
        try {
          resultsSnap = await getDocs(
            query(collection(db, "verification_results"), orderBy("completedAt", "desc"))
          );
        } catch {
          resultsSnap = await getDocs(collection(db, "verification_results"));
        }
        const items: LinkageRow[] = [];
        for (const d of resultsSnap.docs) {
          const data = d.data() as Record<string, unknown>;
          const linkage = data.linkage as { recommendations?: LinkageRow["recommendations"] } | undefined;
          if (!linkage?.recommendations) continue;
          // best-effort enrich from startups collection
          const startupsSnap = await getDocs(query(collection(db, "startups")));
          const startup = startupsSnap.docs.find((s) => s.id === d.id);
          const startupData = startup?.data() as Record<string, unknown> | undefined;
          items.push({
            ownerUid: d.id,
            startupName: (startupData?.startupName as string) ?? "Unknown",
            sector: (startupData?.sector as string) ?? "—",
            stage: (startupData?.stage as string) ?? "—",
            status: (startupData?.status as string) ?? "unknown",
            recommendations: linkage.recommendations,
          });
        }
        if (!cancelled) setRows(items);
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
      <div>
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-cyan-deep">
          Admin · Ecosystem linkage
        </p>
        <h1 className="mt-2 text-3xl font-semibold tracking-tight text-navy-950">
          Linkage recommendations
        </h1>
        <p className="mt-1 text-sm text-navy-600">
          AI proposes the next ecosystem connection for each verified startup. You decide what to activate.
        </p>
      </div>

      {loading ? (
        <div className="mt-12 flex justify-center">
          <Loader2 className="h-5 w-5 animate-spin text-navy-400" />
        </div>
      ) : rows.length === 0 ? (
        <Card className="mt-8 p-12 text-center border-dashed">
          <Network className="mx-auto h-10 w-10 text-navy-300" />
          <p className="mt-3 text-base font-medium text-navy-900">No linkage recommendations yet.</p>
          <p className="mt-1 text-sm text-navy-600">
            Once founders complete verification, AI will sequence the most relevant mentors and partners here.
          </p>
        </Card>
      ) : (
        <div className="mt-8 space-y-4">
          {rows.map((row) => (
            <Card key={row.ownerUid} className="p-6">
              <div className="flex items-start justify-between">
                <div>
                  <div className="flex items-center gap-2">
                    <p className="text-base font-semibold text-navy-950">{row.startupName}</p>
                    <Badge variant="outline">{row.stage}</Badge>
                    <Badge variant="outline">{row.sector}</Badge>
                  </div>
                  <p className="mt-1 text-xs text-navy-500">{row.recommendations?.length ?? 0} recommendations</p>
                </div>
                <Link
                  href={`/admin/review/${row.ownerUid}`}
                  className="inline-flex items-center gap-1 text-sm font-medium text-navy-700 hover:text-cyan-deep"
                >
                  Full review <ArrowRight className="h-3 w-3" />
                </Link>
              </div>

              <ol className="mt-5 space-y-2">
                {row.recommendations
                  ?.slice()
                  .sort((a, b) => a.sequence - b.sequence)
                  .map((r) => (
                    <li
                      key={r.sequence}
                      className="flex items-start gap-3 rounded-lg border border-navy-100 bg-navy-50/40 p-3"
                    >
                      <div className="flex h-6 w-6 flex-none items-center justify-center rounded-md bg-navy-900 text-cyan-glow font-mono text-[11px]">
                        {r.sequence}
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="flex flex-wrap items-center gap-2">
                          <p className="text-sm font-semibold text-navy-900">{r.title}</p>
                          <Badge variant="outline" className="capitalize">{r.type.replace("-", " ")}</Badge>
                        </div>
                        <p className="mt-0.5 text-xs text-navy-600">{r.whyNow}</p>
                      </div>
                    </li>
                  ))}
              </ol>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
