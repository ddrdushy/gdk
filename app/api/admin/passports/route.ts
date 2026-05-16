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
    const snap = await db
      .collection("passports")
      .orderBy("issuedAt", "desc")
      .limit(100)
      .get();
    const items = snap.docs.map((d) => {
      const data = d.data();
      const stamps = data.stamps as { stamps?: Array<{ status?: string }> } | undefined;
      return {
        ownerUid: d.id,
        type: (data.type as string) ?? "startup",
        holderName: (data.holderName as string) ?? "Unknown",
        sector: (data.sector as string) ?? "—",
        stage: (data.stage as string) ?? "—",
        country: (data.country as string) ?? "—",
        status: (data.status as string) ?? "verified",
        issuedAt: data.issuedAt?.toMillis?.() ?? null,
        reviewDate: (data.reviewDate as string) ?? null,
        earnedStamps: stamps?.stamps?.filter((s) => s.status === "earned").length ?? 0,
        pendingStamps: stamps?.stamps?.filter((s) => s.status === "pending").length ?? 0,
      };
    });
    return NextResponse.json({ items });
  } catch (err) {
    console.error("admin passports failed", err);
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Internal error" },
      { status: 500 }
    );
  }
}
