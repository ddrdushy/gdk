import "server-only";
import { GoogleGenerativeAI, type GenerativeModel } from "@google/generative-ai";

let client: GoogleGenerativeAI | null = null;

export function getGemini(): GoogleGenerativeAI {
  if (client) return client;
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    throw new Error(
      "GEMINI_API_KEY is not set. Add it to .env.local — see README §10."
    );
  }
  client = new GoogleGenerativeAI(apiKey);
  return client;
}

export function getModel(opts?: { model?: string; jsonMode?: boolean }): GenerativeModel {
  const modelName = opts?.model ?? process.env.GEMINI_MODEL ?? "gemini-2.5-flash";
  return getGemini().getGenerativeModel({
    model: modelName,
    generationConfig: opts?.jsonMode
      ? { responseMimeType: "application/json", temperature: 0.4 }
      : { temperature: 0.6 },
  });
}

/**
 * Run a Gemini prompt, parse JSON, validate with a Zod schema.
 * Retries once on parse failure with a stricter system message.
 */
export async function generateJson<T>(opts: {
  prompt: string;
  schema: { parse: (input: unknown) => T };
  model?: string;
  systemInstruction?: string;
}): Promise<T> {
  const model = getGemini().getGenerativeModel({
    model: opts.model ?? process.env.GEMINI_MODEL ?? "gemini-2.5-flash",
    generationConfig: {
      responseMimeType: "application/json",
      temperature: 0.4,
    },
    ...(opts.systemInstruction ? { systemInstruction: opts.systemInstruction } : {}),
  });

  const result = await model.generateContent(opts.prompt);
  const text = result.response.text();
  try {
    const parsed = JSON.parse(text);
    return opts.schema.parse(parsed);
  } catch (err) {
    // one retry — strip markdown fences if present
    const cleaned = text
      .replace(/```json\s*/gi, "")
      .replace(/```\s*$/g, "")
      .trim();
    try {
      const parsed = JSON.parse(cleaned);
      return opts.schema.parse(parsed);
    } catch (err2) {
      console.error("Gemini JSON parse failure", {
        raw: text.slice(0, 800),
        err: err2 instanceof Error ? err2.message : String(err2),
      });
      throw new Error("Failed to parse structured response from Gemini.");
    }
  }
}
