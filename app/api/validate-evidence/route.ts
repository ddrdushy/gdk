import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { checkEvidenceRelevance } from "@/lib/gemini/agents/relevance";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const requestSchema = z.object({
  label: z.string().min(3).max(400),
  text: z.string().min(1),
});

/**
 * POST /api/validate-evidence
 *
 * Decide whether the pasted/extracted text actually constitutes
 * evidence for the requested item. Used by MissingDocItem after a
 * file upload (or on submit for typed text) to block off-topic
 * uploads with a clear reason.
 */
export async function POST(req: NextRequest) {
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }
  const parsed = requestSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Invalid request", issues: parsed.error.issues },
      { status: 400 }
    );
  }

  // Quick local short-circuit: trivially short text is always off-topic.
  // Saves an AI roundtrip on obviously empty submissions.
  if (parsed.data.text.trim().length < 60) {
    return NextResponse.json({
      relevant: false,
      score: 0,
      reason: "Not enough content to constitute evidence (under 60 characters).",
    });
  }

  try {
    const result = await checkEvidenceRelevance(parsed.data);
    return NextResponse.json(result);
  } catch (err) {
    console.error("validate-evidence failed", err);
    // On AI errors, fall open — don't block the user just because the
    // relevance check is rate-limited. They'll still see scrutiny from
    // the main verification chain.
    return NextResponse.json({
      relevant: true,
      score: 50,
      reason: "Validation skipped (AI provider unavailable). The main verification will still review this evidence.",
      degraded: true,
    });
  }
}
