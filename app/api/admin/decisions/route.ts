import { NextRequest, NextResponse } from "next/server";
import { FieldValue } from "firebase-admin/firestore";
import { adminAuth, adminDb } from "@/lib/firebase/admin";
import { adminDecisionRequest, DECISION_TO_STATUS } from "@/lib/schemas/admin";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

async function verifyAdmin(req: NextRequest) {
  const authHeader = req.headers.get("authorization");
  if (!authHeader?.startsWith("Bearer ")) {
    return { error: "Missing bearer token", status: 401 as const };
  }
  const idToken = authHeader.slice(7);
  try {
    const decoded = await adminAuth().verifyIdToken(idToken);
    const userSnap = await adminDb().collection("users").doc(decoded.uid).get();
    const role = userSnap.exists ? (userSnap.data()?.role as string | undefined) : undefined;
    if (role !== "admin" && role !== "ecosystem-owner") {
      return { error: "Admin role required", status: 403 as const };
    }
    return { uid: decoded.uid, role };
  } catch (err) {
    console.error("verify id token failed", err);
    return { error: "Invalid or expired token", status: 401 as const };
  }
}

export async function POST(req: NextRequest) {
  const auth = await verifyAdmin(req);
  if ("error" in auth) {
    return NextResponse.json({ error: auth.error }, { status: auth.status });
  }

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }
  const parsed = adminDecisionRequest.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid request", issues: parsed.error.issues }, { status: 400 });
  }
  const { ownerUid, decision, note, requestedEvidence } = parsed.data;
  const status = DECISION_TO_STATUS[decision];

  const db = adminDb();

  // Detect whether this is a startup or mentor passport. The admin queue
  // already knows, but the API shouldn't trust the client — re-check from
  // the source-of-truth collections.
  const [startupSnap, mentorSnap, runSnap] = await Promise.all([
    db.collection("startups").doc(ownerUid).get(),
    db.collection("mentors").doc(ownerUid).get(),
    db.collection("verification_results").doc(ownerUid).get(),
  ]);
  const kind: "startup" | "mentor" | null = startupSnap.exists
    ? "startup"
    : mentorSnap.exists
      ? "mentor"
      : null;
  if (!kind) {
    return NextResponse.json({ error: "Subject not found" }, { status: 404 });
  }
  const sourceData = (kind === "startup" ? startupSnap.data() : mentorSnap.data()) ?? {};
  const runData = (runSnap.exists ? runSnap.data() : null) ?? null;

  try {
    await db.runTransaction(async (tx) => {
      const sourceRef = db.collection(kind === "startup" ? "startups" : "mentors").doc(ownerUid);
      const reviewRef = db.collection("admin_reviews").doc();
      const auditRef = db.collection("audit_logs").doc();
      const passportRef = db.collection("passports").doc(ownerUid);

      tx.set(
        sourceRef,
        {
          status,
          adminDecision: decision,
          adminDecisionAt: FieldValue.serverTimestamp(),
          adminDecisionBy: auth.uid,
          adminNote: note ?? null,
        },
        { merge: true }
      );

      tx.set(reviewRef, {
        ownerUid,
        type: kind,
        decision,
        status,
        note: note ?? null,
        requestedEvidence: requestedEvidence ?? [],
        decidedBy: auth.uid,
        decidedAt: FieldValue.serverTimestamp(),
      });

      tx.set(auditRef, {
        type: "admin.decision",
        actorUid: auth.uid,
        targetUid: ownerUid,
        targetKind: kind,
        decision,
        at: FieldValue.serverTimestamp(),
      });

      if (decision === "approve" || decision === "conditionally-approve") {
        // Build a denormalised passport snapshot so the public passport
        // page and analytics don't need to re-walk verification_results.
        // We copy the agent outputs verbatim — they were already validated
        // when the orchestrator wrote them.
        const passportSnapshot: Record<string, unknown> = {
          ownerUid,
          type: kind,
          status,
          issuedBy: auth.uid,
          issuedAt: FieldValue.serverTimestamp(),
          reviewDate: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000).toISOString(),
          // Identity snapshot
          holderName:
            kind === "startup"
              ? sourceData.startupName
              : sourceData.mentorName,
          sector: sourceData.sector ?? null,
          stage: sourceData.stage ?? null,
          country: sourceData.country ?? null,
          // Verification snapshot
          stamps: runData?.stamps ?? null,
          eligibility: runData?.eligibility ?? null,
          readiness: runData?.readiness ?? null,
          evidence: runData?.evidence ?? null,
          linkage: runData?.linkage ?? null,
          matches: runData?.matches ?? null,
        };
        tx.set(passportRef, passportSnapshot, { merge: true });
      }
    });

    return NextResponse.json({ ok: true, status, type: kind });
  } catch (err) {
    console.error("admin decision failed", err);
    const msg = err instanceof Error ? err.message : "Internal error";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
