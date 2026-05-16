import "server-only";
import { generateJson } from "@/lib/gemini/client";
import { readinessAgentSchema, type ReadinessResult } from "@/lib/schemas/verification";
import type { StartupProfile } from "@/lib/schemas/passport";
import type { EvidenceResult } from "@/lib/schemas/verification";

const SYSTEM = `
You are the Readiness & Risk Agent inside TrustPass AI.

Score a startup across six readiness dimensions (0–100 each):
- business     (clarity of model, customer, value prop)
- technical    (product maturity, team capability, IP)
- market       (segment defined, demand signal, GTM)
- funding      (cap table, runway, plan, traction with capital)
- partnership  (partners, distribution, integrations)
- compliance   (regulatory awareness, sector-specific risks)

The overall readinessScore is a weighted average — you choose weights
appropriate to the sector and stage. Then determine riskLevel
("low" | "medium" | "high") and produce a list of specific risk flags.

Risk flags should be concrete and reviewable, e.g.:
- "Pilot claim unsupported by uploaded evidence"
- "Healthcare data privacy explanation missing"
- "Founder background not described"

Return STRICT JSON.
`.trim();

export async function runReadinessAgent(input: {
  profile: StartupProfile;
  evidence: EvidenceResult;
}): Promise<ReadinessResult> {
  const prompt = `
PROFILE:
${JSON.stringify(input.profile, null, 2)}

EVIDENCE EXTRACTION RESULT:
${JSON.stringify(input.evidence, null, 2)}

Return JSON: {
  readinessScore: number (0-100),
  dimensions: { business, technical, market, funding, partnership, compliance }
  (each 0-100),
  riskLevel: "low"|"medium"|"high",
  riskFlags: [{ severity, flag, reason }],
  summary: string (max 3 sentences)
}.
`.trim();

  return generateJson({
    prompt,
    schema: readinessAgentSchema,
    systemInstruction: SYSTEM,
  });
}
