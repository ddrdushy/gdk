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

function stripTimestamps(data: Record<string, unknown>) {
  const out: Record<string, unknown> = { ...data };
  for (const k of Object.keys(out)) {
    const v = out[k];
    if (v && typeof v === "object" && "toMillis" in (v as object)) {
      out[k] = (v as { toMillis: () => number }).toMillis();
    }
  }
  return out;
}

export async function GET(req: NextRequest, ctx: { params: Promise<{ id: string }> }) {
  const auth = await requireAdmin(req);
  if ("error" in auth) {
    return NextResponse.json({ error: auth.error }, { status: auth.status });
  }
  const { id } = await ctx.params;
  const explicitType = req.nextUrl.searchParams.get("type");

  try {
    const db = adminDb();
    // Probe both collections so callers don't have to know the type;
    // honour ?type=startup|mentor if it's provided to skip the extra read.
    const checks: Array<Promise<[string, FirebaseFirestore.DocumentSnapshot]>> = [];
    if (!explicitType || explicitType === "startup") {
      checks.push(db.collection("startups").doc(id).get().then((s) => ["startup", s]));
    }
    if (!explicitType || explicitType === "mentor") {
      checks.push(db.collection("mentors").doc(id).get().then((s) => ["mentor", s]));
    }

    const results = await Promise.all(checks);
    const hit = results.find(([, snap]) => snap.exists);
    if (!hit) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }
    const [type, profileSnap] = hit;

    const runSnap = await db.collection("verification_results").doc(id).get();

    return NextResponse.json({
      type,
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
