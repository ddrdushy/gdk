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
    return { uid: decoded.uid };
  } catch (err) {
    console.error("verifyIdToken failed", err);
    return { error: "Invalid token", status: 401 as const };
  }
}

export async function GET(req: NextRequest, ctx: { params: Promise<{ id: string }> }) {
  const auth = await requireAdmin(req);
  if ("error" in auth) {
    return NextResponse.json({ error: auth.error }, { status: auth.status });
  }
  const { id } = await ctx.params;
  try {
    const db = adminDb();
    const [profileSnap, runSnap] = await Promise.all([
      db.collection("startups").doc(id).get(),
      db.collection("verification_results").doc(id).get(),
    ]);
    if (!profileSnap.exists) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }
    // Strip Firestore Timestamp fields the client doesn't need to render.
    const stripTimestamps = (data: Record<string, unknown>) => {
      const out: Record<string, unknown> = { ...data };
      for (const k of Object.keys(out)) {
        const v = out[k];
        if (v && typeof v === "object" && "toMillis" in (v as object)) {
          out[k] = (v as { toMillis: () => number }).toMillis();
        }
      }
      return out;
    };
    return NextResponse.json({
      profile: stripTimestamps(profileSnap.data() ?? {}),
      run: runSnap.exists ? stripTimestamps(runSnap.data() ?? {}) : null,
    });
  } catch (err) {
    console.error("admin review fetch failed", err);
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Internal error" },
      { status: 500 }
    );
  }
}
