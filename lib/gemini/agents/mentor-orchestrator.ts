import "server-only";
import {
  runMentorEvidence,
  runMentorEligibility,
  runMentorReadiness,
  runMentorStamps,
  runMentorMatches,
} from "./mentor-agents";
import type { MentorProfile } from "@/lib/schemas/mentor";
import type {
  MentorEvidenceResult,
  MentorEligibilityResult,
  MentorReadinessResult,
  MentorStampsResult,
  MentorMatchesResult,
} from "@/lib/schemas/mentor-verification";

export type MentorOrchestratorEvent =
  | { type: "agent:start"; agent: string }
  | { type: "agent:complete"; agent: string; result: unknown }
  | { type: "run:complete"; result: MentorOrchestratorResult }
  | { type: "run:error"; error: string };

export interface MentorOrchestratorResult {
  evidence: MentorEvidenceResult;
  eligibility: MentorEligibilityResult;
  readiness: MentorReadinessResult;
  stamps: MentorStampsResult;
  matches: MentorMatchesResult;
}

export interface MentorOrchestratorInput {
  profile: MentorProfile;
  evidence: string;
}

export async function* runMentorVerificationOrchestrator(
  input: MentorOrchestratorInput
): AsyncGenerator<MentorOrchestratorEvent, MentorOrchestratorResult | null, void> {
  try {
    yield { type: "agent:start", agent: "evidence" };
    const evidence = await runMentorEvidence({ profile: input.profile, evidence: input.evidence });
    yield { type: "agent:complete", agent: "evidence", result: evidence };

    yield { type: "agent:start", agent: "eligibility" };
    const eligibility = await runMentorEligibility({ profile: input.profile });
    yield { type: "agent:complete", agent: "eligibility", result: eligibility };

    yield { type: "agent:start", agent: "readiness" };
    const readiness = await runMentorReadiness({ profile: input.profile, evidence });
    yield { type: "agent:complete", agent: "readiness", result: readiness };

    yield { type: "agent:start", agent: "stamps" };
    const stamps = await runMentorStamps({ profile: input.profile, evidence, eligibility, readiness });
    yield { type: "agent:complete", agent: "stamps", result: stamps };

    yield { type: "agent:start", agent: "matches" };
    const matches = await runMentorMatches({ profile: input.profile, readiness, stamps });
    yield { type: "agent:complete", agent: "matches", result: matches };

    const result: MentorOrchestratorResult = { evidence, eligibility, readiness, stamps, matches };
    yield { type: "run:complete", result };
    return result;
  } catch (err) {
    yield { type: "run:error", error: err instanceof Error ? err.message : String(err) };
    return null;
  }
}
