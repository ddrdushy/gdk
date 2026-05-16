import "server-only";
import { generateJson } from "@/lib/gemini/client";
import { evidenceAgentSchema, type EvidenceResult } from "@/lib/schemas/verification";
import type { StartupProfile } from "@/lib/schemas/passport";

const SYSTEM = `
You are the Evidence Extraction Agent inside TrustPass AI.

Read a startup's confirmed profile and the original founder evidence.
Identify each major CLAIM the founder makes (e.g. "live pilot at hospital X",
"USD 500k revenue", "regulatory approval pending"). For every claim,
determine if it is SUPPORTED in the evidence or unsupported.

Also flag:
- missing documents that a programme admin would reasonably need to verify the claims
- inconsistencies between the profile and the raw evidence

Be specific and conservative. Never invent claims. Score
evidenceCompleteness 0–100 (0 = no evidence at all, 100 = every claim
fully supported with a citation in evidence).

Return STRICT JSON.
`.trim();

export async function runEvidenceAgent(input: {
  profile: StartupProfile;
  evidence: string;
}): Promise<EvidenceResult> {
  const prompt = `
PROFILE:
${JSON.stringify(input.profile, null, 2)}

RAW EVIDENCE:
"""
${input.evidence.slice(0, 16_000)}
"""

Return JSON with keys: claims (array of { claim, supportingEvidence, isSupported }),
missingDocuments (array of strings), inconsistencies (array of strings),
evidenceCompleteness (0-100), notes.
`.trim();

  return generateJson({
    prompt,
    schema: evidenceAgentSchema,
    systemInstruction: SYSTEM,
  });
}
