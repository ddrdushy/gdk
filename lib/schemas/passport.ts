import { z } from "zod";

export const SECTORS = [
  "HealthTech",
  "FinTech",
  "EdTech",
  "AgriTech",
  "CleanTech",
  "DeepTech",
  "AI / Machine Learning",
  "Consumer / D2C",
  "SaaS / Enterprise",
  "Marketplace",
  "Logistics",
  "Cybersecurity",
  "Climate",
  "Other",
] as const;

export const STAGES = [
  "Idea",
  "Prototype",
  "MVP",
  "Early Revenue",
  "Growth",
  "Scaling",
] as const;

export const CONFIDENCE_LEVELS = ["high", "medium", "low"] as const;

export const fieldWithConfidence = <T extends z.ZodTypeAny>(value: T) =>
  z.object({
    value: value.nullable().optional(),
    confidence: z.enum(CONFIDENCE_LEVELS).nullable().optional(),
    source: z.string().nullable().optional(),
  });

/**
 * Output schema for the Passport Builder Agent (startup version).
 * The agent returns each field with confidence + source citation.
 */
export const startupAutofillSchema = z.object({
  startupName: fieldWithConfidence(z.string()),
  sector: fieldWithConfidence(z.string()),
  country: fieldWithConfidence(z.string()),
  stage: fieldWithConfidence(z.string()),
  founderName: fieldWithConfidence(z.string()),
  productSummary: fieldWithConfidence(z.string()),
  problemSolved: fieldWithConfidence(z.string()),
  targetCustomers: fieldWithConfidence(z.string()),
  businessModel: fieldWithConfidence(z.string()),
  supportNeeded: fieldWithConfidence(z.string()),
  traction: fieldWithConfidence(z.string()),
  websiteUrl: fieldWithConfidence(z.string()),
  teamSize: fieldWithConfidence(z.number()),
  fundingStatus: fieldWithConfidence(z.string()),
  missingFields: z.array(z.string()).default([]),
  overallConfidence: z.enum(CONFIDENCE_LEVELS),
  summary: z.string(),
});

export type StartupAutofill = z.infer<typeof startupAutofillSchema>;

/**
 * Confirmed startup profile — what gets persisted after the user reviews.
 */
export const startupProfileSchema = z.object({
  startupName: z.string().min(1),
  sector: z.string().min(1),
  country: z.string().min(1),
  stage: z.string().min(1),
  founderName: z.string().min(1),
  productSummary: z.string().min(1),
  problemSolved: z.string().optional(),
  targetCustomers: z.string().optional(),
  businessModel: z.string().optional(),
  supportNeeded: z.string().optional(),
  traction: z.string().optional(),
  websiteUrl: z.string().optional(),
  teamSize: z.number().int().nonnegative().optional(),
  fundingStatus: z.string().optional(),
});

export type StartupProfile = z.infer<typeof startupProfileSchema>;

/**
 * Mentor autofill schema.
 */
// Gemini occasionally returns a free-form text field as an array (e.g.
// credentials as a list of items rather than a single paragraph). Accept
// both shapes — the UI coerces to a comma-separated string at the input.
const stringOrArray = z.union([z.string(), z.array(z.string())]);

export const mentorAutofillSchema = z.object({
  mentorName: fieldWithConfidence(z.string()),
  expertiseAreas: fieldWithConfidence(stringOrArray),
  sectorFocus: fieldWithConfidence(stringOrArray),
  country: fieldWithConfidence(z.string()),
  organisation: fieldWithConfidence(z.string()),
  startupStageFit: fieldWithConfidence(stringOrArray),
  availability: fieldWithConfidence(z.string()),
  credentials: fieldWithConfidence(stringOrArray),
  bio: fieldWithConfidence(z.string()),
  linkedinUrl: fieldWithConfidence(z.string()),
  missingFields: z.array(z.string()).default([]),
  overallConfidence: z.enum(CONFIDENCE_LEVELS),
  summary: z.string(),
});

export type MentorAutofill = z.infer<typeof mentorAutofillSchema>;
