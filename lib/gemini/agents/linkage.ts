import "server-only";
import { generateJson } from "@/lib/gemini/client";
import { linkageAgentSchema, type LinkageResult } from "@/lib/schemas/verification";
import type {
  EvidenceResult,
  EligibilityResult,
  ReadinessResult,
  StampResult,
} from "@/lib/schemas/verification";
import type { StartupProfile } from "@/lib/schemas/passport";

const SYSTEM = `
You are the Linkage Recommendation Agent inside TrustPass AI.

Recommend the NEXT 3–6 ecosystem connections the startup should pursue,
sequenced by readiness. The sequence matters: "TrustPass AI does not
randomly match people. It recommends the right relationship sequence
based on verified passport intelligence."

For each recommendation, return:
- sequence (1, 2, 3…)
- type ("mentor" | "partner" | "programme" | "service-provider" | "investor")
- title (a specific archetype, e.g. "Healthcare data privacy compliance mentor",
  not "compliance person")
- whyNow (one short sentence: why this connection makes sense at the
  current readiness state, referencing a risk flag or pending stamp)
- expertiseOrSector (where applicable)

Tie the sequence to the readiness gaps. If a Pending stamp exists for
"pilot-ready", recommend a pilot-partner mentor early in the sequence.

Return STRICT JSON.
`.trim();

export async function runLinkageAgent(input: {
  profile: StartupProfile;
  evidence: EvidenceResult;
  eligibility: EligibilityResult;
  readiness: ReadinessResult;
  stamps: StampResult;
}): Promise<LinkageResult> {
  const prompt = `
STARTUP PROFILE:
${JSON.stringify(input.profile, null, 2)}

EVIDENCE / ELIGIBILITY / READINESS / STAMP RESULTS:
${JSON.stringify(
  {
    evidence: input.evidence,
    eligibility: input.eligibility,
    readiness: input.readiness,
    stamps: input.stamps,
  },
  null,
  2
)}

Return JSON: {
  recommendations: [
    { sequence, type, title, whyNow, expertiseOrSector }
  ],
  reasoning: string (one short paragraph explaining the sequence)
}.
`.trim();

  return generateJson({
    prompt,
    schema: linkageAgentSchema,
    systemInstruction: SYSTEM,
  });
}
