import "server-only";
import { runEvidenceAgent } from "./evidence";
import { runEligibilityAgent } from "./eligibility";
import { runReadinessAgent } from "./readiness";
import { runStampAgent } from "./stamps";
import { runLinkageAgent } from "./linkage";
import type { StartupProfile } from "@/lib/schemas/passport";
import type {
  EvidenceResult,
  EligibilityResult,
  ReadinessResult,
  StampResult,
  LinkageResult,
} from "@/lib/schemas/verification";

export type OrchestratorEvent =
  | { type: "agent:start"; agent: string }
  | { type: "agent:complete"; agent: string; result: unknown }
  | { type: "agent:error"; agent: string; error: string }
  | { type: "run:complete"; result: OrchestratorResult }
  | { type: "run:error"; error: string };

export interface OrchestratorResult {
  evidence: EvidenceResult;
  eligibility: EligibilityResult;
  readiness: ReadinessResult;
  stamps: StampResult;
  linkage: LinkageResult;
}

export interface OrchestratorInput {
  profile: StartupProfile;
  evidence: string;
  programmeCriteria?: string;
}

/**
 * Chain the 5 downstream verification agents.
 * Each later agent receives the prior agents' outputs so it can reason about them.
 * Use the streaming variant (`runVerificationOrchestrator`) when you want
 * per-agent progress events; use `runVerificationOrchestratorBatch` for a single
 * synchronous JSON response.
 */
export async function* runVerificationOrchestrator(
  input: OrchestratorInput
): AsyncGenerator<OrchestratorEvent, OrchestratorResult | null, void> {
  try {
    yield { type: "agent:start", agent: "evidence" };
    const evidence = await runEvidenceAgent({
      profile: input.profile,
      evidence: input.evidence,
    });
    yield { type: "agent:complete", agent: "evidence", result: evidence };

    yield { type: "agent:start", agent: "eligibility" };
    const eligibility = await runEligibilityAgent({
      profile: input.profile,
      programmeCriteria: input.programmeCriteria,
    });
    yield { type: "agent:complete", agent: "eligibility", result: eligibility };

    yield { type: "agent:start", agent: "readiness" };
    const readiness = await runReadinessAgent({ profile: input.profile, evidence });
    yield { type: "agent:complete", agent: "readiness", result: readiness };

    yield { type: "agent:start", agent: "stamps" };
    const stamps = await runStampAgent({
      profile: input.profile,
      evidence,
      eligibility,
      readiness,
    });
    yield { type: "agent:complete", agent: "stamps", result: stamps };

    yield { type: "agent:start", agent: "linkage" };
    const linkage = await runLinkageAgent({
      profile: input.profile,
      evidence,
      eligibility,
      readiness,
      stamps,
    });
    yield { type: "agent:complete", agent: "linkage", result: linkage };

    const result: OrchestratorResult = { evidence, eligibility, readiness, stamps, linkage };
    yield { type: "run:complete", result };
    return result;
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    yield { type: "run:error", error: msg };
    return null;
  }
}

export async function runVerificationOrchestratorBatch(
  input: OrchestratorInput
): Promise<OrchestratorResult> {
  const evidence = await runEvidenceAgent({ profile: input.profile, evidence: input.evidence });
  const eligibility = await runEligibilityAgent({
    profile: input.profile,
    programmeCriteria: input.programmeCriteria,
  });
  const readiness = await runReadinessAgent({ profile: input.profile, evidence });
  const stamps = await runStampAgent({ profile: input.profile, evidence, eligibility, readiness });
  const linkage = await runLinkageAgent({
    profile: input.profile,
    evidence,
    eligibility,
    readiness,
    stamps,
  });
  return { evidence, eligibility, readiness, stamps, linkage };
}
