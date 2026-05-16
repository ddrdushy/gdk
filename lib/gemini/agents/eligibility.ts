import "server-only";
import { generateJson } from "@/lib/gemini/client";
import { eligibilityAgentSchema, type EligibilityResult } from "@/lib/schemas/verification";
import type { StartupProfile } from "@/lib/schemas/passport";

const SYSTEM = `
You are the Eligibility Agent inside TrustPass AI.

You compare a startup profile against generic ecosystem programme criteria
that most accelerators, government programmes, and corporate innovation
teams share. Score eligibility 0–100. Decide:
  - "eligible" (>=80, no major gaps)
  - "conditionally-eligible" (50–79, fixable gaps)
  - "ineligible" (<50, fundamental mismatch)

Be transparent. List matched criteria and unmatched criteria explicitly.
Return STRICT JSON.
`.trim();

const DEFAULT_PROGRAMME_CRITERIA = `
1. Has a clear product/solution defined
2. Operates in a recognised innovation sector
3. At least MVP stage (Idea/Prototype are conditionally eligible)
4. Has an identifiable founder team
5. Operates in a target region (any country accepted for general programme)
6. Articulated target customer segment
7. Articulated business model
8. Has at least one form of traction signal (pilot, paying customer, LOI, grant)
9. Knows what kind of support it needs from the ecosystem
10. No obvious compliance disqualifiers in the sector (healthcare, fintech)
`.trim();

export async function runEligibilityAgent(input: {
  profile: StartupProfile;
  programmeCriteria?: string;
}): Promise<EligibilityResult> {
  const prompt = `
PROGRAMME CRITERIA:
${input.programmeCriteria ?? DEFAULT_PROGRAMME_CRITERIA}

STARTUP PROFILE:
${JSON.stringify(input.profile, null, 2)}

Return JSON: { eligibilityScore (0-100), decision, reason,
matchedCriteria (array), unmatchedCriteria (array) }.
`.trim();

  return generateJson({
    prompt,
    schema: eligibilityAgentSchema,
    systemInstruction: SYSTEM,
  });
}
