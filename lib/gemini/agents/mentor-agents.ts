import "server-only";
import { generateJson } from "@/lib/gemini/client";
import {
  mentorEvidenceSchema,
  mentorEligibilitySchema,
  mentorReadinessSchema,
  mentorStampsSchema,
  mentorMatchesSchema,
  type MentorEvidenceResult,
  type MentorEligibilityResult,
  type MentorReadinessResult,
  type MentorStampsResult,
  type MentorMatchesResult,
} from "@/lib/schemas/mentor-verification";
import type { MentorProfile } from "@/lib/schemas/mentor";

// ─── Evidence Extraction ──────────────────────────────────────────────────
const EVIDENCE_SYS = `
You are the Evidence Extraction Agent for a Mentor Passport.

Read the mentor's confirmed profile and the original evidence (CV /
LinkedIn / bio). For each major CLAIM the mentor makes (e.g. "15
years in compliance", "ex-Head of X", "mentored 12+ startups"),
record supportingEvidence and isSupported.

Flag missing documents and any inconsistencies between profile and
evidence. Score evidenceCompleteness 0-100.
`.trim();

export async function runMentorEvidence(input: {
  profile: MentorProfile;
  evidence: string;
}): Promise<MentorEvidenceResult> {
  return generateJson({
    prompt: `PROFILE:\n${JSON.stringify(input.profile, null, 2)}\n\nEVIDENCE:\n"""${input.evidence.slice(0, 16_000)}"""\n\nReturn JSON: { claims, missingDocuments, inconsistencies, evidenceCompleteness, notes }.`,
    schema: mentorEvidenceSchema,
    systemInstruction: EVIDENCE_SYS,
  });
}

// ─── Eligibility ──────────────────────────────────────────────────────────
const ELIG_SYS = `
You are the Mentor Eligibility Agent. Check whether a mentor meets the
generic ecosystem mentor criteria:

1. Has clearly stated expertise areas
2. Has at least one sector focus relevant to the ecosystem
3. Has identifiable credentials (degree, prior roles, or portfolio)
4. Has stated availability or commitment level
5. Has a bio that establishes track record
6. No obvious red flags (e.g. claims without any evidence)

Score 0-100 and decide:
  "eligible"               (>=80, no major gaps)
  "conditionally-eligible" (50-79, fixable gaps)
  "ineligible"             (<50)
`.trim();

export async function runMentorEligibility(input: { profile: MentorProfile }): Promise<MentorEligibilityResult> {
  return generateJson({
    prompt: `MENTOR PROFILE:\n${JSON.stringify(input.profile, null, 2)}\n\nReturn JSON with: eligibilityScore, decision, reason, matchedCriteria, unmatchedCriteria.`,
    schema: mentorEligibilitySchema,
    systemInstruction: ELIG_SYS,
  });
}

// ─── Readiness & Risk ─────────────────────────────────────────────────────
const READY_SYS = `
You are the Mentor Readiness & Risk Agent. Score the mentor 0-100 on:

- expertise         (depth and specificity of expertise areas)
- sectorAlignment   (relevance to recognised innovation sectors)
- credentials       (evidence supporting credentials)
- availability      (stated commitment level)
- trackRecord       (history of mentoring / industry impact)

The overall readinessScore is a weighted average. Then determine
confidence ("high" | "medium" | "low") and list specific risk flags
(unsubstantiated claims, vague expertise, no track record, etc.).
`.trim();

export async function runMentorReadiness(input: {
  profile: MentorProfile;
  evidence: MentorEvidenceResult;
}): Promise<MentorReadinessResult> {
  return generateJson({
    prompt: `PROFILE:\n${JSON.stringify(input.profile, null, 2)}\n\nEVIDENCE RESULT:\n${JSON.stringify(input.evidence, null, 2)}\n\nReturn JSON: { readinessScore, dimensions { expertise, sectorAlignment, credentials, availability, trackRecord }, confidence, riskFlags, summary }.`,
    schema: mentorReadinessSchema,
    systemInstruction: READY_SYS,
  });
}

// ─── Passport & Stamp ─────────────────────────────────────────────────────
const STAMP_SYS = `
You are the Mentor Passport & Stamp Agent. Recommend passport status and
stamps for a mentor based on prior agent outputs. You RECOMMEND only —
admin makes the final call.

Allowed mentor stamp keys (USE ONLY these):
- identity-verified
- profile-confirmed
- expertise-verified
- mentor-approved
- high-impact-mentor

Stamp statuses: earned | pending | locked.

Status thresholds:
  "verified"               (eligibility >=80 AND readiness >=75)
  "conditionally-verified" (eligibility >=60, fixable gaps)
  "pending-evidence"       (specific evidence missing)
  "needs-review"           (manual investigation required)

reviewDate: 90 days from today, ISO 8601.
`.trim();

export async function runMentorStamps(input: {
  profile: MentorProfile;
  evidence: MentorEvidenceResult;
  eligibility: MentorEligibilityResult;
  readiness: MentorReadinessResult;
  today?: string;
}): Promise<MentorStampsResult> {
  const today = input.today ?? new Date().toISOString().slice(0, 10);
  return generateJson({
    prompt: `TODAY: ${today}\n\nMENTOR PROFILE:\n${JSON.stringify(input.profile, null, 2)}\n\nEVIDENCE / ELIGIBILITY / READINESS:\n${JSON.stringify({ evidence: input.evidence, eligibility: input.eligibility, readiness: input.readiness }, null, 2)}\n\nReturn JSON: { recommendedStatus, reviewDate, stamps: [{ key, status, reason }], nextAction }.`,
    schema: mentorStampsSchema,
    systemInstruction: STAMP_SYS,
  });
}

// ─── Startup Matches (reverse-linkage for mentors) ────────────────────────
const MATCH_SYS = `
You are the Startup Match Recommendation Agent for mentors.

Given a verified mentor's profile + readiness signals, recommend the
NEXT 3-6 startup archetypes this mentor would add most value to.

For each, return:
- sequence (1, 2, 3…)
- title (a specific startup archetype, e.g. "HealthTech compliance-stage
  startup preparing for hospital pilot")
- sector
- stage (Idea / Prototype / MVP / Early Revenue / Growth)
- whyMatch (one sentence: why this mentor's expertise fits)
`.trim();

export async function runMentorMatches(input: {
  profile: MentorProfile;
  readiness: MentorReadinessResult;
  stamps: MentorStampsResult;
}): Promise<MentorMatchesResult> {
  return generateJson({
    prompt: `MENTOR PROFILE:\n${JSON.stringify(input.profile, null, 2)}\n\nREADINESS / STAMP RESULTS:\n${JSON.stringify({ readiness: input.readiness, stamps: input.stamps }, null, 2)}\n\nReturn JSON: { startupArchetypes: [{ sequence, title, sector, stage, whyMatch }], reasoning }.`,
    schema: mentorMatchesSchema,
    systemInstruction: MATCH_SYS,
  });
}
