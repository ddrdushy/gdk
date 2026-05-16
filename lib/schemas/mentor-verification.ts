import { z } from "zod";
import { CONFIDENCE, PASSPORT_STATUS, STAMP_STATUS } from "./verification";

const MENTOR_STAMP_KEYS = [
  "identity-verified",
  "expertise-verified",
  "mentor-approved",
  "high-impact-mentor",
  "profile-confirmed",
] as const;

export const mentorEvidenceSchema = z.object({
  claims: z
    .array(
      z.object({
        claim: z.string(),
        supportingEvidence: z.string().nullable(),
        isSupported: z.boolean(),
      })
    )
    .default([]),
  missingDocuments: z.array(z.string()).default([]),
  inconsistencies: z.array(z.string()).default([]),
  evidenceCompleteness: z.number().min(0).max(100),
  notes: z.string().optional().default(""),
});
export type MentorEvidenceResult = z.infer<typeof mentorEvidenceSchema>;

export const mentorEligibilitySchema = z.object({
  eligibilityScore: z.number().min(0).max(100),
  decision: z.enum(["eligible", "conditionally-eligible", "ineligible"]),
  reason: z.string(),
  matchedCriteria: z.array(z.string()).default([]),
  unmatchedCriteria: z.array(z.string()).default([]),
});
export type MentorEligibilityResult = z.infer<typeof mentorEligibilitySchema>;

export const mentorReadinessSchema = z.object({
  readinessScore: z.number().min(0).max(100),
  dimensions: z.object({
    expertise: z.number().min(0).max(100),
    sectorAlignment: z.number().min(0).max(100),
    credentials: z.number().min(0).max(100),
    availability: z.number().min(0).max(100),
    trackRecord: z.number().min(0).max(100),
  }),
  confidence: CONFIDENCE,
  riskFlags: z
    .array(
      z.object({
        severity: z.enum(["low", "medium", "high"]),
        flag: z.string(),
        reason: z.string(),
      })
    )
    .default([]),
  summary: z.string(),
});
export type MentorReadinessResult = z.infer<typeof mentorReadinessSchema>;

export const mentorStampsSchema = z.object({
  recommendedStatus: PASSPORT_STATUS,
  reviewDate: z.string(),
  stamps: z.array(
    z.object({
      key: z.enum(MENTOR_STAMP_KEYS),
      status: STAMP_STATUS,
      reason: z.string(),
    })
  ),
  nextAction: z.string(),
});
export type MentorStampsResult = z.infer<typeof mentorStampsSchema>;

export const mentorMatchesSchema = z.object({
  startupArchetypes: z
    .array(
      z.object({
        sequence: z.number().int().min(1),
        title: z.string(),
        sector: z.string(),
        stage: z.string(),
        whyMatch: z.string(),
      })
    )
    .min(1)
    .max(6),
  reasoning: z.string(),
});
export type MentorMatchesResult = z.infer<typeof mentorMatchesSchema>;
