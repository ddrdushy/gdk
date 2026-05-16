import { NextRequest } from "next/server";
import { z } from "zod";
import { startupProfileSchema } from "@/lib/schemas/passport";
import { runVerificationOrchestrator } from "@/lib/gemini/agents/orchestrator";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const requestSchema = z.object({
  profile: startupProfileSchema,
  evidence: z.string().min(20),
  programmeCriteria: z.string().optional(),
});

export async function POST(req: NextRequest) {
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return new Response(JSON.stringify({ error: "Invalid JSON" }), {
      status: 400,
      headers: { "Content-Type": "application/json" },
    });
  }
  const parsed = requestSchema.safeParse(body);
  if (!parsed.success) {
    return new Response(
      JSON.stringify({ error: "Invalid request", issues: parsed.error.issues }),
      { status: 400, headers: { "Content-Type": "application/json" } }
    );
  }

  const encoder = new TextEncoder();
  const stream = new ReadableStream({
    async start(controller) {
      const send = (data: unknown) => {
        controller.enqueue(encoder.encode(`data: ${JSON.stringify(data)}\n\n`));
      };
      try {
        for await (const event of runVerificationOrchestrator(parsed.data)) {
          send(event);
        }
      } catch (err) {
        send({ type: "run:error", error: err instanceof Error ? err.message : String(err) });
      } finally {
        controller.close();
      }
    },
  });

  return new Response(stream, {
    headers: {
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache, no-transform",
      Connection: "keep-alive",
      "X-Accel-Buffering": "no",
    },
  });
}
