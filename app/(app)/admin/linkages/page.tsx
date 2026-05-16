"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Loader2, Network, ArrowRight, Send, Sparkles, X } from "lucide-react";
import { toast } from "sonner";
import { useAuth } from "@/lib/auth/auth-provider";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";

interface LinkageRow {
  ownerUid: string;
  startupName: string;
  sector: string;
  stage: string;
  status: string;
  recommendations: Array<{ sequence: number; type: string; title: string; whyNow: string; expertiseOrSector?: string }>;
}

export default function AdminLinkagesPage() {
  const { user } = useAuth();
  const [rows, setRows] = useState<LinkageRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activating, setActivating] = useState<{
    ownerUid: string;
    sequence: number;
  } | null>(null);
  const [intro, setIntro] = useState<{ subject: string; body: string } | null>(null);
  const [generating, setGenerating] = useState(false);

  useEffect(() => {
    if (!user) return;
    let cancelled = false;
    void (async () => {
      try {
        const idToken = await user.getIdToken();
        const res = await fetch("/api/admin/linkages", {
          headers: { Authorization: `Bearer ${idToken}` },
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error ?? `HTTP ${res.status}`);
        if (!cancelled) setRows(data.items ?? []);
      } catch (err) {
        if (!cancelled) setError(err instanceof Error ? err.message : "Could not load linkages");
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => { cancelled = true; };
  }, [user]);

  async function onActivate(row: LinkageRow, rec: LinkageRow["recommendations"][number]) {
    if (!user) return;
    setActivating({ ownerUid: row.ownerUid, sequence: rec.sequence });
    setGenerating(true);
    setIntro(null);
    try {
      const idToken = await user.getIdToken();
      const res = await fetch("/api/agents/intro-message", {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${idToken}` },
        body: JSON.stringify({
          ownerUid: row.ownerUid,
          recommendation: rec,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Could not generate intro");
      setIntro(data.intro);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Intro generation failed");
      setActivating(null);
    } finally {
      setGenerating(false);
    }
  }

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
      ) : error ? (
        <Card className="mt-8 p-6 border-rose-200 bg-rose-50">
          <p className="text-sm text-rose-800">{error}</p>
        </Card>
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
                  <p className="mt-1 text-xs text-navy-500">
                    {row.recommendations.length} recommendations
                  </p>
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
                  .slice()
                  .sort((a, b) => a.sequence - b.sequence)
                  .map((r) => {
                    const isActive = activating?.ownerUid === row.ownerUid && activating.sequence === r.sequence;
                    return (
                      <li
                        key={r.sequence}
                        className={cn(
                          "flex items-start gap-3 rounded-lg border p-3 transition-colors",
                          isActive ? "border-cyan-deep bg-cyan-50/40" : "border-navy-100 bg-navy-50/40"
                        )}
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
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => onActivate(row, r)}
                          disabled={isActive && generating}
                        >
                          {isActive && generating ? (
                            <Loader2 className="h-3.5 w-3.5 animate-spin" />
                          ) : (
                            <Sparkles className="h-3.5 w-3.5" />
                          )}
                          Activate
                        </Button>
                      </li>
                    );
                  })}
              </ol>
            </Card>
          ))}
        </div>
      )}

      {activating && intro && (
        <IntroDialog
          intro={intro}
          onClose={() => {
            setActivating(null);
            setIntro(null);
          }}
          onSend={() => {
            toast.success("Intro queued (mock send — real delivery wired in next iteration).");
            setActivating(null);
            setIntro(null);
          }}
        />
      )}
    </div>
  );
}

function IntroDialog({
  intro,
  onClose,
  onSend,
}: {
  intro: { subject: string; body: string };
  onClose: () => void;
  onSend: () => void;
}) {
  const [subject, setSubject] = useState(intro.subject);
  const [body, setBody] = useState(intro.body);
  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-navy-950/40 backdrop-blur-sm sm:items-center">
      <div className="w-full max-w-xl rounded-t-2xl bg-white shadow-2xl sm:rounded-2xl">
        <div className="flex items-start justify-between border-b border-navy-100 p-5">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-cyan-deep">
              AI-generated intro
            </p>
            <h2 className="mt-1 text-lg font-semibold text-navy-950">
              Review & send
            </h2>
          </div>
          <button onClick={onClose} className="rounded-md p-1.5 text-navy-500 hover:bg-navy-50">
            <X className="h-4 w-4" />
          </button>
        </div>
        <div className="space-y-3 p-5">
          <div>
            <label className="text-[11px] font-semibold uppercase tracking-wider text-navy-700">Subject</label>
            <input
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              className="mt-1.5 flex h-10 w-full rounded-lg border border-navy-200 bg-white px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-deep"
            />
          </div>
          <div>
            <label className="text-[11px] font-semibold uppercase tracking-wider text-navy-700">Body</label>
            <Textarea
              value={body}
              onChange={(e) => setBody(e.target.value)}
              rows={10}
              className="mt-1.5"
            />
          </div>
        </div>
        <div className="flex items-center justify-end gap-2 border-t border-navy-100 p-4">
          <Button variant="outline" onClick={onClose}>Cancel</Button>
          <Button variant="primary" onClick={onSend}>
            <Send className="h-4 w-4" /> Send intro
          </Button>
        </div>
      </div>
    </div>
  );
}
