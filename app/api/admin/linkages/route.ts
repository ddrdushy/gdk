import { NextRequest, NextResponse } from "next/server";
import { adminAuth, adminDb } from "@/lib/firebase/admin";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

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
    const results = await db.collection("verification_results").limit(50).get();
    const items: Array<{
      ownerUid: string;
      startupName: string;
      sector: string;
      stage: string;
      status: string;
      recommendations: Array<{ sequence: number; type: string; title: string; whyNow: string }>;
    }> = [];

    for (const d of results.docs) {
      const data = d.data();
      const linkage = data.linkage as { recommendations?: Array<{ sequence: number; type: string; title: string; whyNow: string }> } | undefined;
      if (!linkage?.recommendations) continue;
      const startupSnap = await db.collection("startups").doc(d.id).get();
      const s = startupSnap.exists ? (startupSnap.data() ?? {}) : {};
      items.push({
        ownerUid: d.id,
        startupName: (s.startupName as string) ?? "Unknown",
        sector: (s.sector as string) ?? "—",
        stage: (s.stage as string) ?? "—",
        status: (s.status as string) ?? "unknown",
        recommendations: linkage.recommendations,
      });
    }

    return NextResponse.json({ items });
  } catch (err) {
    console.error("admin linkages failed", err);
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Internal error" },
      { status: 500 }
    );
  }
}
