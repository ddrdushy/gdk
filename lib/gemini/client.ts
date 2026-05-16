import "server-only";
import { GoogleGenerativeAI } from "@google/generative-ai";
import OpenAI from "openai";

// ─────────────────────────────────────────────────────────────────────────
// Multi-provider AI client
//
// Priority chain (top to bottom). If a provider isn't configured (env var
// missing) it's skipped. If a configured provider fails with a retryable
// error (429 / quota / 5xx / network), the next provider is tried.
// Non-retryable errors (auth, malformed input) abort immediately.
//
//   1. Ollama Cloud — OLLAMA_API_KEY,  default model gemini-3-flash-preview:cloud
//      base URL https://ollama.com/v1 (override with OLLAMA_BASE_URL)
//
//   2. NVIDIA NIM   — NVIDIA_API_KEY,  default model google/gemma-3n-e4b-it
//      base URL https://integrate.api.nvidia.com/v1
//
//   3. Gemini direct — GEMINI_API_KEY, default model gemini-2.5-flash
//      via @google/generative-ai SDK
//
// All callers use generateJson() and get a schema-validated response back.
// ─────────────────────────────────────────────────────────────────────────

type ProviderName = "ollama" | "nvidia" | "gemini";

interface ProviderConfig {
  name: ProviderName;
  isConfigured: () => boolean;
  model: () => string;
  // Run a JSON-mode chat call. Returns raw text the caller will JSON.parse.
  run: (opts: { prompt: string; systemInstruction?: string; model: string }) => Promise<string>;
}

const PROVIDERS: ProviderConfig[] = [
  {
    name: "ollama",
    isConfigured: () => Boolean(process.env.OLLAMA_API_KEY),
    model: () => process.env.OLLAMA_MODEL ?? "gemini-3-flash-preview:cloud",
    run: async ({ prompt, systemInstruction, model }) => {
      const c = getOllamaClient();
      const r = await c.chat.completions.create({
        model,
        temperature: 0.4,
        response_format: { type: "json_object" },
        messages: [
          ...(systemInstruction ? [{ role: "system" as const, content: systemInstruction }] : []),
          { role: "user" as const, content: prompt },
        ],
      });
      const text = r.choices[0]?.message?.content ?? "";
      if (!text) throw new Error("Empty response from Ollama Cloud.");
      return text;
    },
  },
  {
    name: "nvidia",
    isConfigured: () => Boolean(process.env.NVIDIA_API_KEY),
    model: () => process.env.NVIDIA_MODEL ?? "google/gemma-3n-e4b-it",
    run: async ({ prompt, systemInstruction, model }) => {
      const c = getNvidiaClient();
      // NVIDIA's NIM doesn't support response_format=json_object on every model,
      // so we coax JSON via a strong system prompt and parse defensively.
      const sys =
        (systemInstruction ? systemInstruction + "\n\n" : "") +
        "Return ONLY a valid JSON object. No markdown fences, no prose, no commentary.";
      const r = await c.chat.completions.create({
        model,
        temperature: 0.4,
        max_tokens: 4096,
        messages: [
          { role: "system" as const, content: sys },
          { role: "user" as const, content: prompt },
        ],
      });
      const text = r.choices[0]?.message?.content ?? "";
      if (!text) throw new Error("Empty response from NVIDIA NIM.");
      return text;
    },
  },
  {
    name: "gemini",
    isConfigured: () => Boolean(process.env.GEMINI_API_KEY),
    model: () => process.env.GEMINI_MODEL ?? "gemini-2.5-flash",
    run: async ({ prompt, systemInstruction, model }) => {
      const genModel = getGeminiClient().getGenerativeModel({
        model,
        generationConfig: { responseMimeType: "application/json", temperature: 0.4 },
        ...(systemInstruction ? { systemInstruction } : {}),
      });
      const r = await genModel.generateContent(prompt);
      return r.response.text();
    },
  },
];

// ─── Lazy SDK constructors ──────────────────────────────────────────────
let geminiClient: GoogleGenerativeAI | null = null;
function getGeminiClient(): GoogleGenerativeAI {
  if (!geminiClient) geminiClient = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);
  return geminiClient;
}
let ollamaClient: OpenAI | null = null;
function getOllamaClient(): OpenAI {
  if (!ollamaClient) {
    ollamaClient = new OpenAI({
      apiKey: process.env.OLLAMA_API_KEY!,
      baseURL: process.env.OLLAMA_BASE_URL ?? "https://ollama.com/v1",
    });
  }
  return ollamaClient;
}
let nvidiaClient: OpenAI | null = null;
function getNvidiaClient(): OpenAI {
  if (!nvidiaClient) {
    nvidiaClient = new OpenAI({
      apiKey: process.env.NVIDIA_API_KEY!,
      baseURL: process.env.NVIDIA_BASE_URL ?? "https://integrate.api.nvidia.com/v1",
    });
  }
  return nvidiaClient;
}

// ─── Public API ─────────────────────────────────────────────────────────

export interface GenerateJsonOptions<T> {
  prompt: string;
  schema: { parse: (input: unknown) => T };
  systemInstruction?: string;
  /** Override the model for a single call (provider-specific). */
  model?: string;
}

/**
 * Run a prompt through the provider fallback chain, parse the JSON result,
 * validate with a Zod schema. Falls forward to the next provider on
 * retryable errors (429, 5xx, network); throws immediately on auth /
 * bad-input errors.
 */
export async function generateJson<T>(opts: GenerateJsonOptions<T>): Promise<T> {
  const configured = PROVIDERS.filter((p) => p.isConfigured());
  if (configured.length === 0) {
    throw new Error(
      "No AI provider configured. Set one of OLLAMA_API_KEY / NVIDIA_API_KEY / GEMINI_API_KEY in .env.local."
    );
  }

  let lastErr: unknown;
  for (const provider of configured) {
    const model = opts.model ?? provider.model();
    try {
      const text = await provider.run({
        prompt: opts.prompt,
        systemInstruction: opts.systemInstruction,
        model,
      });
      try {
        return opts.schema.parse(JSON.parse(text));
      } catch {
        // One in-provider retry: strip markdown fences in case the model
        // wrapped the JSON in ```json ... ```
        const cleaned = stripJsonFences(text);
        try {
          return opts.schema.parse(JSON.parse(cleaned));
        } catch (parseErr) {
          console.error("AI JSON parse failure", {
            provider: provider.name,
            model,
            raw: text.slice(0, 800),
            err: parseErr instanceof Error ? parseErr.message : String(parseErr),
          });
          // Treat parse failures as retryable across providers — sometimes
          // the next model returns cleaner output.
          lastErr = parseErr;
          continue;
        }
      }
    } catch (err) {
      lastErr = err;
      if (isFatal(err)) {
        throw friendlyError(provider.name, err);
      }
      console.warn(`[ai] ${provider.name} failed, falling forward:`, err instanceof Error ? err.message : err);
      continue;
    }
  }

  throw friendlyError(configured[configured.length - 1]?.name ?? "ai", lastErr);
}

function stripJsonFences(s: string): string {
  // Match the outermost ```json ... ``` if present, else just trim fences.
  const fenced = s.match(/```(?:json)?\s*([\s\S]*?)```/i);
  return (fenced ? fenced[1] : s).trim();
}

function isFatal(err: unknown): boolean {
  const msg = err instanceof Error ? err.message : String(err);
  // 401/403 → bad credentials; 400 → bad request shape (retrying won't help).
  return /401|403|invalid.*api.*key|unauthorized|forbidden/i.test(msg);
}

function friendlyError(provider: string, err: unknown): Error {
  const msg = err instanceof Error ? err.message : String(err);
  if (/quota|rate.*limit|429/i.test(msg)) {
    return new Error(`All AI providers exhausted (last: ${provider} hit a rate limit). Try again in a minute.`);
  }
  if (/401|403|unauthorized|invalid.*api.*key/i.test(msg)) {
    return new Error(`Auth rejected on ${provider}. Check the API key in .env.local.`);
  }
  if (/404|model.*not.*found|model_not_found/i.test(msg)) {
    return new Error(`Model not found on ${provider}. Check the *_MODEL env var.`);
  }
  return err instanceof Error ? err : new Error(String(err));
}
