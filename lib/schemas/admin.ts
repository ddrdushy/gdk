import { z } from "zod";

export const ADMIN_DECISIONS = [
  "approve",
  "conditionally-approve",
  "request-evidence",
  "reject",
] as const;

export type AdminDecision = (typeof ADMIN_DECISIONS)[number];

export const adminDecisionRequest = z.object({
  ownerUid: z.string().min(1),
  decision: z.enum(ADMIN_DECISIONS),
  note: z.string().max(2000).optional(),
  requestedEvidence: z.array(z.string()).optional(),
});

export type AdminDecisionRequest = z.infer<typeof adminDecisionRequest>;

export const DECISION_TO_STATUS: Record<AdminDecision, string> = {
  approve: "verified",
  "conditionally-approve": "conditionally-verified",
  "request-evidence": "pending-evidence",
  reject: "rejected",
};

export const DECISION_LABEL: Record<AdminDecision, string> = {
  approve: "Approve",
  "conditionally-approve": "Conditionally Approve",
  "request-evidence": "Request Evidence",
  reject: "Reject",
};
