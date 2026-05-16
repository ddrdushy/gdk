import { NextRequest, NextResponse } from "next/server";
import { FieldValue } from "firebase-admin/firestore";
import { adminDb } from "@/lib/firebase/admin";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/**
 * POST /api/passports/:id/view
 * Records a public passport view. Atomically increments the counter on
 * passports/{id}/stats and appends a thin entry to passport_views/{auto}
 * so we can later derive per-day analytics.
 *
 * The viewer is intentionally NOT authenticated (public verification is
 * the whole point), but we hash the IP + UA so repeated reloads from
 * the same browser within the same hour collapse to one view.
 */
export async function POST(req: NextRequest, ctx: { params: Promise<{ id: string }> }) {
  const { id } = await ctx.params;
  try {
    const ipHeader =
      req.headers.get("x-forwarded-for") ?? req.headers.get("x-real-ip") ?? "anon";
    const ip = ipHeader.split(",")[0].trim();
    const ua = req.headers.get("user-agent") ?? "";
    const referer = req.headers.get("referer") ?? null;

    const fingerprint = await hashFingerprint(`${ip}|${ua}|${id}|${Math.floor(Date.now() / 3_600_000)}`);

    const db = adminDb();
    const dedupRef = db.collection("passport_view_dedup").doc(fingerprint);
    const dedup = await dedupRef.get();
    if (dedup.exists) {
      return NextResponse.json({ ok: true, deduped: true });
    }

    await db.runTransaction(async (tx) => {
      const statsRef = db.collection("passport_stats").doc(id);
      tx.set(
        statsRef,
        {
          ownerUid: id,
          viewCount: FieldValue.increment(1),
          lastViewedAt: FieldValue.serverTimestamp(),
        },
        { merge: true }
      );
      tx.set(dedupRef, { at: FieldValue.serverTimestamp() });
      const logRef = db.collection("passport_views").doc();
      tx.set(logRef, {
        ownerUid: id,
        ip,
        userAgent: ua.slice(0, 240),
        referer,
        at: FieldValue.serverTimestamp(),
      });
    });

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("track view failed", err);
    // Tracking failures should never break the public passport page.
    return NextResponse.json({ ok: false }, { status: 200 });
  }
}

async function hashFingerprint(input: string): Promise<string> {
  const data = new TextEncoder().encode(input);
  const buf = await crypto.subtle.digest("SHA-256", data);
  return Array.from(new Uint8Array(buf))
    .slice(0, 16)
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

/**
 * GET /api/passports/:id/view
 * Returns the current view stats for a passport. Used by the owner's
 * passport dashboard so they can see how many people have looked at
 * their public passport.
 */
export async function GET(_req: NextRequest, ctx: { params: Promise<{ id: string }> }) {
  const { id } = await ctx.params;
  try {
    const snap = await adminDb().collection("passport_stats").doc(id).get();
    if (!snap.exists) {
      return NextResponse.json({ viewCount: 0, lastViewedAt: null });
    }
    const data = snap.data() ?? {};
    return NextResponse.json({
      viewCount: data.viewCount ?? 0,
      lastViewedAt: data.lastViewedAt?.toMillis?.() ?? null,
    });
  } catch (err) {
    console.error("stats fetch failed", err);
    return NextResponse.json({ viewCount: 0, lastViewedAt: null });
  }
}
