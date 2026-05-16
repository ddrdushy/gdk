"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { doc, getDoc } from "firebase/firestore";
import { Loader2, ExternalLink, Share2, Eye } from "lucide-react";
import { toast } from "sonner";
import { useAuth } from "@/lib/auth/auth-provider";
import { getDb } from "@/lib/firebase/client";
import { Button } from "@/components/ui/button";
import { PassportDetail } from "@/components/passport/passport-detail";
import { startupProfileSchema, type StartupProfile } from "@/lib/schemas/passport";
import {
  evidenceAgentSchema,
  eligibilityAgentSchema,
  readinessAgentSchema,
  stampAgentSchema,
  linkageAgentSchema,
  type EvidenceResult,
  type EligibilityResult,
  type ReadinessResult,
  type StampResult,
  type LinkageResult,
} from "@/lib/schemas/verification";
import { formatPassportId } from "@/lib/utils";

type Loaded = {
  profile: StartupProfile;
  evidence?: EvidenceResult;
  eligibility?: EligibilityResult;
  readiness?: ReadinessResult;
  stamps?: StampResult;
  linkage?: LinkageResult;
};

export default function FounderPassportPage() {
  const { user, loading } = useAuth();
  const [data, setData] = useState<Loaded | null>(null);
  const [fetching, setFetching] = useState(true);
  const [viewCount, setViewCount] = useState<number | null>(null);

  useEffect(() => {
    async function load() {
      if (!user) return;
      try {
        const db = getDb();
        const [profileSnap, runSnap] = await Promise.all([
          getDoc(doc(db, "startups", user.uid)),
          getDoc(doc(db, "verification_results", user.uid)),
        ]);

        if (!profileSnap.exists()) {
          setData(null);
          return;
        }

        const profileParsed = startupProfileSchema.safeParse(profileSnap.data());
        if (!profileParsed.success) {
          console.warn("Invalid profile in Firestore", profileParsed.error.issues);
          setData(null);
          return;
        }

        const run = runSnap.exists() ? runSnap.data() : null;
        setData({
          profile: profileParsed.data,
          evidence: run?.evidence ? evidenceAgentSchema.parse(run.evidence) : undefined,
          eligibility: run?.eligibility ? eligibilityAgentSchema.parse(run.eligibility) : undefined,
          readiness: run?.readiness ? readinessAgentSchema.parse(run.readiness) : undefined,
          stamps: run?.stamps ? stampAgentSchema.parse(run.stamps) : undefined,
          linkage: run?.linkage ? linkageAgentSchema.parse(run.linkage) : undefined,
        });
      } catch (err) {
        console.error("failed to load passport", err);
      } finally {
        setFetching(false);
      }
    }
    void load();
  }, [user]);

  useEffect(() => {
    if (!user) return;
    let cancelled = false;
    const tick = async () => {
      try {
        const r = await fetch(`/api/passports/${user.uid}/view`);
        const j = await r.json();
        if (!cancelled) setViewCount(Number(j.viewCount ?? 0));
      } catch {
        // ignore — counter just stays at last known value
      }
    };
    void tick();
    const id = setInterval(tick, 15_000);
    return () => { cancelled = true; clearInterval(id); };
  }, [user]);

  if (loading || fetching) {
    return (
      <div className="flex h-[50vh] items-center justify-center">
        <Loader2 className="h-6 w-6 animate-spin text-navy-400" />
      </div>
    );
  }

  if (!data) {
    return (
      <div className="mx-auto max-w-2xl px-6 py-20 text-center">
        <h1 className="text-2xl font-semibold text-navy-950">No passport yet.</h1>
        <p className="mt-2 text-navy-600">Build your Startup Passport to begin verification.</p>
        <Button asChild variant="primary" size="lg" className="mt-6">
          <Link href="/founder/passport/new">Build my passport</Link>
        </Button>
      </div>
    );
  }

  const passportId = user ? formatPassportId("ST", new Date().getFullYear(), 1) : "TP-ST-XXXX-XXX";

  function onShare() {
    if (!user) return;
    const url = `${window.location.origin}/passport/${user.uid}`;
    void navigator.clipboard.writeText(url);
    toast.success("Public verification link copied.");
  }

  return (
    <>
      <div className="border-b border-navy-100 bg-white">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4 lg:px-8">
          <div className="flex items-center gap-3">
            <p className="text-sm text-navy-600">
              This is your live passport. Share the public link with investors and programmes.
            </p>
            {viewCount !== null && (
              <span className="inline-flex items-center gap-1.5 rounded-full bg-navy-50 px-2.5 py-1 text-xs font-medium text-navy-700 ring-1 ring-navy-100">
                <Eye className="h-3 w-3" />
                {viewCount} {viewCount === 1 ? "view" : "views"}
              </span>
            )}
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" onClick={onShare}>
              <Share2 className="h-4 w-4" /> Copy share link
            </Button>
            <Button asChild variant="primary" size="sm">
              <Link href={`/passport/${user?.uid}`} target="_blank">
                Public view <ExternalLink className="h-4 w-4" />
              </Link>
            </Button>
          </div>
        </div>
      </div>
      <PassportDetail
        profile={data.profile}
        passportId={passportId}
        evidence={data.evidence}
        eligibility={data.eligibility}
        readiness={data.readiness}
        stamps={data.stamps}
        linkage={data.linkage}
      />
    </>
  );
}
