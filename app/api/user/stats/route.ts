import { NextRequest, NextResponse } from "next/server";
import { adminAuth, adminDb } from "@/lib/firebase/admin";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/**
 * GET /api/user/stats
 *
 * Returns the founder/mentor's own progress in one round-trip:
 *   kind            "startup" | "mentor" | null (no profile yet)
 *   status          submitted | ai-verified | verified | conditionally-verified | pending-evidence | needs-review | rejected
 *   passportId      formatted ID (TP-ST-2026-001 / TP-MN-2026-001)
 *   stamps          { earned, pending, locked, recommendedStatus }
 *   scores          { eligibility, readiness, evidence }
 *   viewCount       public passport views
 *   updatedAt       millis
 *   adminNote       string | null
 */
export async function GET(req: NextRequest) {
  const authHeader = req.headers.get("authorization");
  if (!authHeader?.startsWith("Bearer ")) {
    return NextResponse.json({ error: "Missing bearer token" }, { status: 401 });
  }
  try {
    const decoded = await adminAuth().verifyIdToken(authHeader.slice(7));
    const uid = decoded.uid;
    const db = adminDb();

    const [startupSnap, mentorSnap, runSnap, statsSnap] = await Promise.all([
      db.collection("startups").doc(uid).get(),
      db.collection("mentors").doc(uid).get(),
      db.collection("verification_results").doc(uid).get(),
      db.collection("passport_stats").doc(uid).get(),
    ]);

    let kind: "startup" | "mentor" | null = null;
    let profile: Record<string, unknown> | null = null;
    if (startupSnap.exists) {
      kind = "startup";
      profile = startupSnap.data() ?? null;
    } else if (mentorSnap.exists) {
      kind = "mentor";
      profile = mentorSnap.data() ?? null;
    }

    if (!kind || !profile) {
      return NextResponse.json({ kind: null });
    }

    const run = runSnap.exists ? (runSnap.data() ?? {}) : {};
    const stamps = run.stamps as { stamps?: Array<{ status?: string }>; recommendedStatus?: string } | undefined;
    const stampCounts = {
      earned: stamps?.stamps?.filter((s) => s.status === "earned").length ?? 0,
      pending: stamps?.stamps?.filter((s) => s.status === "pending").length ?? 0,
      locked: stamps?.stamps?.filter((s) => s.status === "locked").length ?? 0,
      recommendedStatus: stamps?.recommendedStatus ?? null,
    };

    const eligibility = run.eligibility as { eligibilityScore?: number } | undefined;
    const readiness = run.readiness as { readinessScore?: number } | undefined;
    const evidence = run.evidence as { evidenceCompleteness?: number } | undefined;

    return NextResponse.json({
      kind,
      passportId: kind === "startup" ? "TP-ST-2026-001" : "TP-MN-2026-001",
      status: (profile.status as string) ?? "draft",
      displayName: (kind === "startup" ? profile.startupName : profile.mentorName) ?? null,
      stamps: stampCounts,
      scores: {
        eligibility: eligibility?.eligibilityScore ?? null,
        readiness: readiness?.readinessScore ?? null,
        evidence: evidence?.evidenceCompleteness ?? null,
      },
      viewCount: statsSnap.exists ? ((statsSnap.data()?.viewCount as number) ?? 0) : 0,
      updatedAt: (profile.updatedAt as { toMillis?: () => number } | undefined)?.toMillis?.() ?? null,
      adminNote: (profile.adminNote as string) ?? null,
      adminDecision: (profile.adminDecision as string) ?? null,
    });
  } catch (err) {
    console.error("user stats failed", err);
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Internal error" },
      { status: 500 }
    );
  }
}
