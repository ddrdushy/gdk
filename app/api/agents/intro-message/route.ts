import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { FieldValue } from "firebase-admin/firestore";
import { adminAuth, adminDb } from "@/lib/firebase/admin";
import { runIntroMessageAgent } from "@/lib/gemini/agents/intro-message";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const requestSchema = z.object({
  ownerUid: z.string().min(1),
  recommendation: z.object({
    sequence: z.number().int().min(1),
    type: z.string(),
    title: z.string(),
    whyNow: z.string(),
    expertiseOrSector: z.string().optional(),
  }),
});

export async function POST(req: NextRequest) {
  const authHeader = req.headers.get("authorization");
  if (!authHeader?.startsWith("Bearer ")) {
    return NextResponse.json({ error: "Missing bearer token" }, { status: 401 });
  }
  try {
    const decoded = await adminAuth().verifyIdToken(authHeader.slice(7));
    const adminUserSnap = await adminDb().collection("users").doc(decoded.uid).get();
    const role = adminUserSnap.exists ? (adminUserSnap.data()?.role as string | undefined) : undefined;
    if (role !== "admin" && role !== "ecosystem-owner") {
      return NextResponse.json({ error: "Admin role required" }, { status: 403 });
    }

    const body = await req.json();
    const parsed = requestSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: "Invalid request", issues: parsed.error.issues },
        { status: 400 }
      );
    }
    const { ownerUid, recommendation } = parsed.data;

    const startupSnap = await adminDb().collection("startups").doc(ownerUid).get();
    if (!startupSnap.exists) {
      return NextResponse.json({ error: "Startup not found" }, { status: 404 });
    }
    const startup = startupSnap.data() ?? {};

    const intro = await runIntroMessageAgent({
      startupName: (startup.startupName as string) ?? "the startup",
      startupSummary: (startup.productSummary as string) ?? "",
      startupSector: (startup.sector as string) ?? "",
      startupStage: (startup.stage as string) ?? "",
      recommendation,
      adminOrganisation: (adminUserSnap.data()?.organisationName as string) ?? undefined,
    });

    // Record the activation
    await adminDb().collection("linkages").add({
      ownerUid,
      sequence: recommendation.sequence,
      title: recommendation.title,
      type: recommendation.type,
      whyNow: recommendation.whyNow,
      introSubject: intro.subject,
      introBody: intro.body,
      activatedBy: decoded.uid,
      activatedAt: FieldValue.serverTimestamp(),
      status: "draft",
    });

    return NextResponse.json({ intro });
  } catch (err) {
    console.error("intro-message failed", err);
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Internal error" },
      { status: 500 }
    );
  }
}
