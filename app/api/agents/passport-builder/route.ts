import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { runStartupPassportBuilder, runMentorPassportBuilder } from "@/lib/gemini/agents/passport-builder";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const requestSchema = z.object({
  type: z.enum(["startup", "mentor"]),
  evidence: z.string().min(20, "evidence is too short"),
  sourceLabel: z.string().optional(),
});

export async function POST(req: NextRequest) {
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  const parsed = requestSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Invalid request", issues: parsed.error.issues },
      { status: 400 }
    );
  }

  try {
    const result =
      parsed.data.type === "startup"
        ? await runStartupPassportBuilder({
            evidence: parsed.data.evidence,
            sourceLabel: parsed.data.sourceLabel,
          })
        : await runMentorPassportBuilder({
            evidence: parsed.data.evidence,
            sourceLabel: parsed.data.sourceLabel,
          });
    return NextResponse.json({ ok: true, autofill: result });
  } catch (err) {
    console.error("passport-builder failed", err);
    const msg = err instanceof Error ? err.message : "Internal error";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
