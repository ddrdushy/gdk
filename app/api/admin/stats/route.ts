import { NextRequest, NextResponse } from "next/server";
import { adminAuth, adminDb } from "@/lib/firebase/admin";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/**
 * GET /api/admin/stats
 *
 * Returns the four headline counts the admin dashboard tiles need:
 *   pendingReview        startups+mentors awaiting admin decision
 *   verifiedThisMonth    passports issued in the last 30 days
 *   activeLinkages       linkage records in the activated state
 *   stampsIssued         total earned stamps across all issued passports
 */
export async function GET(req: NextRequest) {
  const authHeader = req.headers.get("authorization");
  if (!authHeader?.startsWith("Bearer ")) {
    return NextResponse.json({ error: "Missing bearer token" }, { status: 401 });
  }
  try {
    const decoded = await adminAuth().verifyIdToken(authHeader.slice(7));
    const userSnap = await adminDb().collection("users").doc(decoded.uid).get();
    const role = userSnap.exists ? (userSnap.data()?.role as string | undefined) : undefined;
    if (role !== "admin" && role !== "ecosystem-owner") {
      return NextResponse.json({ error: "Admin role required" }, { status: 403 });
    }

    const db = adminDb();
    const monthAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);

    const [pendingStartups, pendingMentors, recentPassports, linkagesSnap] = await Promise.all([
      db.collection("startups").where("status", "in", ["submitted", "ai-verified", "needs-review"]).get(),
      db.collection("mentors").where("status", "in", ["submitted", "ai-verified", "needs-review"]).get(),
      db.collection("passports").orderBy("issuedAt", "desc").limit(200).get(),
      db.collection("linkages").limit(200).get(),
    ]);

    const pendingReview = pendingStartups.size + pendingMentors.size;

    // verifiedThisMonth: passports issued within the last 30 days
    const verifiedThisMonth = recentPassports.docs.filter((d) => {
      const issuedAt = d.data().issuedAt?.toDate?.();
      return issuedAt instanceof Date && issuedAt >= monthAgo;
    }).length;

    // activeLinkages: anything not still in "draft" state
    const activeLinkages = linkagesSnap.docs.filter(
      (d) => (d.data().status as string | undefined) !== "draft"
    ).length;

    // stampsIssued: sum of earned stamps across all issued passports
    let stampsIssued = 0;
    for (const d of recentPassports.docs) {
      const stamps = d.data().stamps as { stamps?: Array<{ status?: string }> } | undefined;
      if (stamps?.stamps) {
        stampsIssued += stamps.stamps.filter((s) => s.status === "earned").length;
      }
    }

    return NextResponse.json({
      pendingReview,
      verifiedThisMonth,
      activeLinkages,
      stampsIssued,
    });
  } catch (err) {
    console.error("admin stats failed", err);
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Internal error" },
      { status: 500 }
    );
  }
}
