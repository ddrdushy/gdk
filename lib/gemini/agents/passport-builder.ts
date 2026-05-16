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

Extract a structured startup profile from the founder's evidence
(pitch deck text, website copy, or free-form description).

OUTPUT FORMAT — read carefully:
Every extracted field MUST be a JSON object with EXACTLY these three
keys: "value", "confidence", "source".

  { "value": <extracted thing or null>,
    "confidence": "high" | "medium" | "low",
    "source": "<short quote from evidence>" }

Example:
  "startupName": {
    "value": "MediNova AI",
    "confidence": "high",
    "source": "MediNova AI is an AI triage assistant"
  }

Do NOT return raw scalars like "startupName": "MediNova AI". Always
wrap in the { value, confidence, source } object.

Be conservative with confidence. If a field is implied rather than
stated, mark "medium" or "low". NEVER fabricate URLs, customer
names, traction metrics, or funding amounts. If unsure, return
{ "value": null, "confidence": "low" } and add the field name to
missingFields.

Return STRICT JSON. No prose. No markdown fences.
`.trim();

const MENTOR_SYSTEM_INSTRUCTION = `
You are the Passport Builder Agent inside TrustPass AI.

Extract a structured mentor profile from raw evidence (CV, bio,
LinkedIn-style text).

OUTPUT FORMAT — read carefully:
Every extracted field MUST be a JSON object with EXACTLY these three
keys: "value", "confidence", "source".

  { "value": <extracted thing or null>,
    "confidence": "high" | "medium" | "low",
    "source": "<short quote from evidence>" }

Example:
  "mentorName": {
    "value": "Dr. Sarah Lim",
    "confidence": "high",
    "source": "bio"
  },
  "expertiseAreas": {
    "value": ["healthcare compliance", "hospital pilots"],
    "confidence": "high",
    "source": "Focus: healthcare data privacy, hospital pilot pathways"
  }

Do NOT return raw scalars like "mentorName": "Dr. Sarah Lim". Always
wrap each field in the { value, confidence, source } object.

Be conservative — never fabricate credentials, companies, or
affiliations. Return STRICT JSON. No prose. No markdown fences.
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
