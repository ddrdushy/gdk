import "server-only";
import { z } from "zod";
import { generateJson } from "@/lib/gemini/client";

export const relevanceSchema = z.object({
  relevant: z.boolean(),
  score: z.number().min(0).max(100),
  reason: z.string(),
});
export type RelevanceResult = z.infer<typeof relevanceSchema>;

const SYSTEM = `
You are the Evidence Relevance Agent inside TrustPass AI.

A user is uploading or pasting evidence to address a specific requested
item (e.g. "Financial statements for the last 3 years",
"Detailed client contracts or testimonials"). Your job is to decide
whether the content they provided is genuinely responsive to that
request.

Rules:
- Be strict: random text, lorem ipsum, marketing fluff, unrelated
  documents, or text that mentions the topic in passing without
  substantive evidence is NOT relevant.
- For factual requests (financial statements, contracts, regulatory
  approvals), the text MUST contain the specific information requested
  — numbers, named parties, dates, regulatory bodies. A summary or
  passing mention is not enough.
- For descriptive requests (testimonials, references), at least one
  concrete quote / named source must appear.
- If the content is the wrong KIND of document entirely (e.g. a pitch
  deck pasted in for "financial statements"), mark not relevant.
- Empty or trivially short content (< ~100 chars of substance) is
  never relevant.

Score 0-100:
  0-30   = clearly off-topic / dummy content
  31-60  = mentions the topic but lacks substantive evidence
  61-100 = directly responsive with concrete details

relevant = true only when score >= 60.

Return STRICT JSON: { "relevant": boolean, "score": 0-100, "reason": string }.
The reason should be one sentence explaining the call.
`.trim();

export async function checkEvidenceRelevance(input: {
  label: string;
  text: string;
}): Promise<RelevanceResult> {
  // Cap text length so a huge pasted doc doesn't blow the prompt budget.
  const text = input.text.slice(0, 6_000);
  const prompt = `
REQUESTED ITEM:
${input.label}

PROVIDED CONTENT (${text.length} chars):
"""
${text}
"""

Decide whether this content is genuinely responsive to the requested
item. Return JSON with relevant, score, and a one-sentence reason.
`.trim();

  return generateJson({
    prompt,
    schema: relevanceSchema,
    systemInstruction: SYSTEM,
  });
}
