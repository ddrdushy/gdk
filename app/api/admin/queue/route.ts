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

interface QueueItem {
  type: "startup" | "mentor";
  ownerUid: string;
  displayName: string;
  subtitleA: string;
  subtitleB: string;
  subtitleC: string;
  status: string;
  updatedAt: number | null;
}

export async function GET(req: NextRequest) {
  const auth = await requireAdmin(req);
  if ("error" in auth) {
    return NextResponse.json({ error: auth.error }, { status: auth.status });
  }
  try {
    const db = adminDb();
    const statusFilter = ["ai-verified", "needs-review", "submitted"];

    const [startupsSnap, mentorsSnap] = await Promise.all([
      db.collection("startups").where("status", "in", statusFilter).limit(50).get(),
      db.collection("mentors").where("status", "in", statusFilter).limit(50).get(),
    ]);

    const items: QueueItem[] = [];

    for (const d of startupsSnap.docs) {
      const data = d.data();
      items.push({
        type: "startup",
        ownerUid: (data.ownerUid as string) ?? d.id,
        displayName: (data.startupName as string) ?? "Untitled startup",
        subtitleA: (data.sector as string) ?? "—",
        subtitleB: (data.stage as string) ?? "—",
        subtitleC: (data.country as string) ?? "—",
        status: (data.status as string) ?? "submitted",
        updatedAt: data.updatedAt?.toMillis?.() ?? null,
      });
    }

    for (const d of mentorsSnap.docs) {
      const data = d.data();
      const expertise = Array.isArray(data.expertiseAreas) ? data.expertiseAreas : [];
      const sectors = Array.isArray(data.sectorFocus) ? data.sectorFocus : [];
      items.push({
        type: "mentor",
        ownerUid: (data.ownerUid as string) ?? d.id,
        displayName: (data.mentorName as string) ?? "Untitled mentor",
        subtitleA: expertise.slice(0, 2).join(" · ") || "—",
        subtitleB: sectors.slice(0, 2).join(" · ") || "—",
        subtitleC: (data.country as string) ?? "—",
        status: (data.status as string) ?? "submitted",
        updatedAt: data.updatedAt?.toMillis?.() ?? null,
      });
    }

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
