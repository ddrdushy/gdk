"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { doc, getDoc } from "firebase/firestore";
import { Loader2 } from "lucide-react";
import { useAuth } from "@/lib/auth/auth-provider";
import { getDb } from "@/lib/firebase/client";
import { Button } from "@/components/ui/button";
import { MentorPassportDetail } from "@/components/passport/mentor-passport-detail";
import { mentorProfileSchema, type MentorProfile } from "@/lib/schemas/mentor";
import {
  mentorEvidenceSchema,
  mentorEligibilitySchema,
  mentorReadinessSchema,
  mentorStampsSchema,
  mentorMatchesSchema,
  type MentorEvidenceResult,
  type MentorEligibilityResult,
  type MentorReadinessResult,
  type MentorStampsResult,
  type MentorMatchesResult,
} from "@/lib/schemas/mentor-verification";
import { formatPassportId } from "@/lib/utils";

interface Loaded {
  profile: MentorProfile;
  evidence?: MentorEvidenceResult;
  eligibility?: MentorEligibilityResult;
  readiness?: MentorReadinessResult;
  stamps?: MentorStampsResult;
  matches?: MentorMatchesResult;
}

export default function MentorPassportPage() {
  const { user, loading } = useAuth();
  const [data, setData] = useState<Loaded | null>(null);
  const [fetching, setFetching] = useState(true);

  useEffect(() => {
    async function load() {
      if (!user) return;
      try {
        const db = getDb();
        const [profileSnap, runSnap] = await Promise.all([
          getDoc(doc(db, "mentors", user.uid)),
          getDoc(doc(db, "verification_results", user.uid)),
        ]);
        if (!profileSnap.exists()) { setData(null); return; }
        const parsed = mentorProfileSchema.safeParse(profileSnap.data());
        if (!parsed.success) { setData(null); return; }
        const run = runSnap.exists() ? runSnap.data() : null;
        setData({
          profile: parsed.data,
          evidence: run?.evidence ? mentorEvidenceSchema.parse(run.evidence) : undefined,
          eligibility: run?.eligibility ? mentorEligibilitySchema.parse(run.eligibility) : undefined,
          readiness: run?.readiness ? mentorReadinessSchema.parse(run.readiness) : undefined,
          stamps: run?.stamps ? mentorStampsSchema.parse(run.stamps) : undefined,
          matches: run?.matches ? mentorMatchesSchema.parse(run.matches) : undefined,
        });
      } catch (err) {
        console.error("failed to load mentor passport", err);
      } finally {
        setFetching(false);
      }
    }
    void load();
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
        <p className="mt-2 text-navy-600">Build your Mentor Passport to begin verification.</p>
        <Button asChild variant="primary" size="lg" className="mt-6">
          <Link href="/mentor/passport/new">Build my passport</Link>
        </Button>
      </div>
    );
  }

  const passportId = formatPassportId("MN", new Date().getFullYear(), 1);

  return (
    <MentorPassportDetail
      profile={data.profile}
      passportId={passportId}
      evidence={data.evidence}
      eligibility={data.eligibility}
      readiness={data.readiness}
      stamps={data.stamps}
      matches={data.matches}
    />
  );
}
