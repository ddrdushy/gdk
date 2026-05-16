import { NextRequest, NextResponse } from "next/server";
import { adminAuth, adminDb } from "@/lib/firebase/admin";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

async function requireAdmin(req: NextRequest) {
  const authHeader = req.headers.get("authorization");
  if (!authHeader?.startsWith("Bearer ")) {
    return { error: "Missing bearer token", status: 401 as const };
  }
  try {
    const decoded = await adminAuth().verifyIdToken(authHeader.slice(7));
    const userSnap = await adminDb().collection("users").doc(decoded.uid).get();
    const role = userSnap.exists ? (userSnap.data()?.role as string | undefined) : undefined;
    if (role !== "admin" && role !== "ecosystem-owner") {
      return { error: "Admin role required", status: 403 as const };
    }
    return { uid: decoded.uid, role };
  } catch (err) {
    console.error("verifyIdToken failed", err);
    return { error: "Invalid token", status: 401 as const };
  }
}

export async function GET(req: NextRequest) {
  const auth = await requireAdmin(req);
  if ("error" in auth) {
    return NextResponse.json({ error: auth.error }, { status: auth.status });
  }
  try {
    const db = adminDb();
    const snap = await db
      .collection("startups")
      .where("status", "in", ["ai-verified", "needs-review", "submitted"])
      .limit(50)
      .get();
    const items = snap.docs.map((d) => {
      const data = d.data();
      return {
        ownerUid: data.ownerUid ?? d.id,
        startupName: data.startupName ?? "Untitled",
        sector: data.sector ?? "—",
        stage: data.stage ?? "—",
        country: data.country ?? "—",
        status: data.status ?? "submitted",
        updatedAt: data.updatedAt?.toMillis?.() ?? null,
      };
    });
    items.sort((a, b) => (b.updatedAt ?? 0) - (a.updatedAt ?? 0));
    return NextResponse.json({ items });
  } catch (err) {
    console.error("admin queue failed", err);
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Internal error" },
      { status: 500 }
    );
  }
}
