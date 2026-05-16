import "server-only";
import { generateJson } from "@/lib/gemini/client";
import {
  startupAutofillSchema,
  mentorAutofillSchema,
  type StartupAutofill,
  type MentorAutofill,
} from "@/lib/schemas/passport";

const STARTUP_SYSTEM_INSTRUCTION = `
You are the Passport Builder Agent inside TrustPass AI.

Your job is to extract a structured startup profile from raw evidence
provided by the founder. Evidence may be:
- a pitch deck (already converted to plain text),
- the text of a startup website,
- a free-form description, or
- a combination.

For every output field, return:
- value (best-effort extraction, or null if absent),
- confidence ("high" | "medium" | "low"),
- source (a short quote from the evidence or the section name).

Be conservative with confidence. If a field requires interpretation
beyond the evidence (e.g. a stage is implied rather than stated),
mark it medium or low.

NEVER fabricate URLs, customer logos, traction metrics, or funding
amounts. If unsure, return null with low confidence and add the field
name to missingFields.

Return STRICT JSON matching the schema. No prose. No markdown fences.
`.trim();

const MENTOR_SYSTEM_INSTRUCTION = `
You are the Passport Builder Agent inside TrustPass AI.

Your job is to extract a structured mentor profile from raw evidence
(CV, bio, LinkedIn-style text). For every output field, return value,
confidence, and source. Be conservative — never fabricate credentials,
companies, or affiliations.

Return STRICT JSON matching the schema.
`.trim();

export async function runStartupPassportBuilder(input: {
  evidence: string;
  sourceLabel?: string;
}): Promise<StartupAutofill> {
  const prompt = `
Source: ${input.sourceLabel ?? "founder-provided evidence"}

EVIDENCE:
"""
${input.evidence.slice(0, 18_000)}
"""

Return a JSON object with EXACTLY these keys:
- startupName, sector, country, stage, founderName, productSummary,
  problemSolved, targetCustomers, businessModel, supportNeeded,
  traction, websiteUrl, teamSize, fundingStatus
  (each is an object: { "value": ..., "confidence": "high|medium|low", "source": "..." })
- missingFields: array of field names that you could not confidently extract
- overallConfidence: "high" | "medium" | "low"
- summary: one-sentence plain-English summary of the startup

teamSize.value must be a number or null.
For any string field that cannot be extracted, return { "value": null, "confidence": "low" }.
`.trim();

  return generateJson({
    prompt,
    schema: startupAutofillSchema,
    systemInstruction: STARTUP_SYSTEM_INSTRUCTION,
  });
}

export async function runMentorPassportBuilder(input: {
  evidence: string;
  sourceLabel?: string;
}): Promise<MentorAutofill> {
  const prompt = `
Source: ${input.sourceLabel ?? "mentor-provided evidence"}

EVIDENCE:
"""
${input.evidence.slice(0, 18_000)}
"""

Return JSON with these keys:
mentorName, expertiseAreas (array), sectorFocus (array), country,
organisation, startupStageFit (array), availability, credentials, bio,
linkedinUrl (each as { value, confidence, source }), plus
missingFields, overallConfidence, summary.
`.trim();

  return generateJson({
    prompt,
    schema: mentorAutofillSchema,
    systemInstruction: MENTOR_SYSTEM_INSTRUCTION,
  });
}
