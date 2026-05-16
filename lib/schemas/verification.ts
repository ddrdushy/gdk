import { z } from "zod";

export const CONFIDENCE = z.enum(["high", "medium", "low"]);
export const RISK_LEVEL = z.enum(["low", "medium", "high"]);
export const STAMP_STATUS = z.enum(["earned", "pending", "locked"]);
export const PASSPORT_STATUS = z.enum([
  "verified",
  "conditionally-verified",
  "pending-evidence",
  "needs-review",
]);

// ─── Evidence Extraction Agent ──────────────────────────────────────────────
export const evidenceAgentSchema = z.object({
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
export type EvidenceResult = z.infer<typeof evidenceAgentSchema>;

// ─── Eligibility Agent ──────────────────────────────────────────────────────
export const eligibilityAgentSchema = z.object({
  eligibilityScore: z.number().min(0).max(100),
  decision: z.enum(["eligible", "conditionally-eligible", "ineligible"]),
  reason: z.string(),
  matchedCriteria: z.array(z.string()).default([]),
  unmatchedCriteria: z.array(z.string()).default([]),
});
export type EligibilityResult = z.infer<typeof eligibilityAgentSchema>;

// ─── Readiness & Risk Agent ─────────────────────────────────────────────────
export const readinessAgentSchema = z.object({
  readinessScore: z.number().min(0).max(100),
  dimensions: z.object({
    business: z.number().min(0).max(100),
    technical: z.number().min(0).max(100),
    market: z.number().min(0).max(100),
    funding: z.number().min(0).max(100),
    partnership: z.number().min(0).max(100),
    compliance: z.number().min(0).max(100),
  }),
  riskLevel: RISK_LEVEL,
  riskFlags: z
    .array(
      z.object({
        severity: RISK_LEVEL,
        flag: z.string(),
        reason: z.string(),
      })
    )
    .default([]),
  summary: z.string(),
});
export type ReadinessResult = z.infer<typeof readinessAgentSchema>;

// ─── Passport & Stamp Agent ─────────────────────────────────────────────────
const STAMP_KEYS = [
  "identity-verified",
  "pitch-deck-reviewed",
  "programme-eligible",
  "pilot-ready",
  "compliance-reviewed",
  "funding-ready",
  "expertise-verified",
  "mentor-approved",
  "high-impact-mentor",
  "profile-confirmed",
] as const;

export const stampAgentSchema = z.object({
  recommendedStatus: PASSPORT_STATUS,
  reviewDate: z.string().describe("ISO date string for next review"),
  stamps: z.array(
    z.object({
      key: z.enum(STAMP_KEYS),
      status: STAMP_STATUS,
      reason: z.string(),
    })
  ),
  nextAction: z.string(),
});
export type StampResult = z.infer<typeof stampAgentSchema>;

// ─── Linkage Recommendation Agent ───────────────────────────────────────────
export const linkageAgentSchema = z.object({
  recommendations: z
    .array(
      z.object({
        sequence: z.number().int().min(1),
        type: z.enum(["mentor", "partner", "programme", "service-provider", "investor"]),
        title: z.string(),
        whyNow: z.string(),
        expertiseOrSector: z.string().optional(),
      })
    )
    .min(1)
    .max(8),
  reasoning: z.string(),
});
export type LinkageResult = z.infer<typeof linkageAgentSchema>;

// ─── Verification run record ────────────────────────────────────────────────
export const verificationRunSchema = z.object({
  startupId: z.string(),
  ownerUid: z.string(),
  type: z.enum(["startup", "mentor"]),
  status: z.enum(["running", "complete", "failed"]),
  evidence: evidenceAgentSchema.optional(),
  eligibility: eligibilityAgentSchema.optional(),
  readiness: readinessAgentSchema.optional(),
  stamps: stampAgentSchema.optional(),
  linkage: linkageAgentSchema.optional(),
  error: z.string().optional(),
  startedAt: z.union([z.string(), z.date()]).optional(),
  completedAt: z.union([z.string(), z.date()]).optional(),
});
export type VerificationRun = z.infer<typeof verificationRunSchema>;
