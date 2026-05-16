import "server-only";
import { z } from "zod";
import { generateJson } from "@/lib/gemini/client";

export const introMessageSchema = z.object({
  subject: z.string().min(3).max(160),
  body: z.string().min(40),
});

export type IntroMessage = z.infer<typeof introMessageSchema>;

const SYSTEM = `
You are the Linkage Intro Agent inside TrustPass AI.

Generate a short, professional intro message from a programme admin to
a recommended ecosystem connection (mentor, partner, programme, service
provider, or investor) on behalf of a verified startup.

Tone: warm, concise, factual. Always include:
- Why the introduction is being made (referencing the startup's verified state)
- Specifically what the startup needs from the recipient
- A clear next step

Length: 80–160 words for the body. Avoid filler. Plain text, no markdown.

Return STRICT JSON: { "subject": "...", "body": "..." }.
`.trim();

export async function runIntroMessageAgent(input: {
  startupName: string;
  startupSummary: string;
  startupSector: string;
  startupStage: string;
  recommendation: { title: string; type: string; whyNow: string; expertiseOrSector?: string };
  adminOrganisation?: string;
}): Promise<IntroMessage> {
  const prompt = `
ADMIN ORGANISATION: ${input.adminOrganisation ?? "TrustPass ecosystem partner"}

STARTUP:
  name: ${input.startupName}
  sector: ${input.startupSector}
  stage: ${input.startupStage}
  summary: ${input.startupSummary}

RECOMMENDATION:
  archetype: ${input.recommendation.title}
  type: ${input.recommendation.type}
  expertise / sector: ${input.recommendation.expertiseOrSector ?? "(not specified)"}
  why this matters now: ${input.recommendation.whyNow}

Write the intro as if the admin is connecting the recipient to the
startup founder. Address the recipient generically ("Hi [Mentor name]"
is fine — the admin will personalize). Keep it tight.
`.trim();

  return generateJson({
    prompt,
    schema: introMessageSchema,
    systemInstruction: SYSTEM,
  });
}
