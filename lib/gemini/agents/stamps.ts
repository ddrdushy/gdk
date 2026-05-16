import "server-only";
import { generateJson } from "@/lib/gemini/client";
import { stampAgentSchema, type StampResult } from "@/lib/schemas/verification";
import type {
  EvidenceResult,
  EligibilityResult,
  ReadinessResult,
} from "@/lib/schemas/verification";
import type { StartupProfile } from "@/lib/schemas/passport";

const SYSTEM = `
You are the Passport & Stamp Agent inside TrustPass AI.

You RECOMMEND a passport status, stamps, and a review date based on
prior agent results. You do NOT issue anything — a human admin makes
the final call.

Allowed stamp keys (use ONLY these; do not invent new ones):
- identity-verified
- profile-confirmed
- pitch-deck-reviewed
- programme-eligible
- pilot-ready
- compliance-reviewed
- funding-ready
- expertise-verified         (mentor-only — skip for startups)
- mentor-approved            (mentor-only — skip for startups)
- high-impact-mentor         (mentor-only — skip for startups)

Stamp statuses:
- "earned"   — clear evidence, recommended to issue
- "pending"  — missing one specific piece of evidence; admin can request it
- "locked"   — currently inapplicable (stage too early, sector mismatch)

For startups, always include identity-verified (status depends on
evidence) and profile-confirmed if the founder confirmed the AI profile.

Recommend a status:
- "verified"               (eligibility >=80 AND readiness >=70 AND risk=low)
- "conditionally-verified" (eligibility >=60 AND fixable gaps)
- "pending-evidence"       (specific missing docs)
- "needs-review"           (admin should investigate manually)

reviewDate: 90 days from today, ISO 8601.

Return STRICT JSON.
`.trim();

export async function runStampAgent(input: {
  profile: StartupProfile;
  evidence: EvidenceResult;
  eligibility: EligibilityResult;
  readiness: ReadinessResult;
  today?: string;
}): Promise<StampResult> {
  const today = input.today ?? new Date().toISOString().slice(0, 10);
  const prompt = `
TODAY: ${today}

STARTUP PROFILE:
${JSON.stringify(input.profile, null, 2)}

EVIDENCE RESULT:
${JSON.stringify(input.evidence, null, 2)}

ELIGIBILITY RESULT:
${JSON.stringify(input.eligibility, null, 2)}

READINESS RESULT:
${JSON.stringify(input.readiness, null, 2)}

Return JSON: { recommendedStatus, reviewDate (ISO date 90 days out),
stamps: [{ key, status, reason }], nextAction: string }.
`.trim();

  return generateJson({
    prompt,
    schema: stampAgentSchema,
    systemInstruction: SYSTEM,
  });
}
