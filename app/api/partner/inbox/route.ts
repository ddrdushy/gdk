import { NextRequest, NextResponse } from "next/server";
import { adminAuth, adminDb } from "@/lib/firebase/admin";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/**
 * GET /api/partner/inbox
 *
 * Lists activated linkage records where the recommended type maps to a
 * partner-style introduction (partner / service-provider / programme).
 *
 * Returns:
 *   items[] — { ownerUid, startupName, sector, stage, title, whyNow, status, sentAt }
 *   counts  — { pending, active, feedback }
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
    if (role !== "partner" && role !== "admin" && role !== "ecosystem-owner") {
      return NextResponse.json({ error: "Partner role required" }, { status: 403 });
    }

    const db = adminDb();
    const linkagesSnap = await db
      .collection("linkages")
      .where("type", "in", ["partner", "service-provider", "programme"])
      .limit(50)
      .get();

    const items = [] as Array<{
      id: string;
      ownerUid: string;
      startupName: string;
      sector: string;
      stage: string;
      title: string;
      whyNow: string;
      status: string;
      sentAt: number | null;
    }>;

    for (const d of linkagesSnap.docs) {
      const data = d.data();
      const startupSnap = await db.collection("startups").doc(data.ownerUid as string).get();
      const s = startupSnap.exists ? (startupSnap.data() ?? {}) : {};
      items.push({
        id: d.id,
        ownerUid: data.ownerUid as string,
        startupName: (s.startupName as string) ?? "Unknown",
        sector: (s.sector as string) ?? "—",
        stage: (s.stage as string) ?? "—",
        title: (data.title as string) ?? "—",
        whyNow: (data.whyNow as string) ?? "",
        status: (data.status as string) ?? "draft",
        sentAt: data.activatedAt?.toMillis?.() ?? null,
      });
    }

    const counts = {
      pending: items.filter((i) => i.status === "draft").length,
      active: items.filter((i) => i.status === "sent" || i.status === "accepted").length,
      feedback: items.filter((i) => i.status === "feedback").length,
    };

    return NextResponse.json({ items, counts });
  } catch (err) {
    console.error("partner inbox failed", err);
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Internal error" },
      { status: 500 }
    );
  }
}
