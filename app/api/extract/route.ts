import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { extractText, getDocumentProxy } from "unpdf";
import { convert as htmlToText } from "html-to-text";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const maxDuration = 60;

const MAX_PDF_BYTES = 10 * 1024 * 1024; // 10 MB
const MAX_HTML_BYTES = 5 * 1024 * 1024; // 5 MB after fetch
const MAX_OUTPUT_CHARS = 24_000; // keep room for the Gemini prompt

/**
 * POST /api/extract
 *
 * Two shapes, distinguished by Content-Type:
 *
 * 1. multipart/form-data
 *    - field "file" — required, PDF (.pdf) up to 10 MB
 *    Returns { text, meta: { source: "pdf", pages, chars } }
 *
 * 2. application/json
 *    - { url: "https://…" }
 *    Server fetches the URL, strips HTML, returns plain text.
 *    Returns { text, meta: { source: "url", chars, finalUrl } }
 *
 * Errors are JSON: { error, hint? }.
 */
export async function POST(req: NextRequest) {
  const ct = req.headers.get("content-type") ?? "";

  if (ct.includes("multipart/form-data")) {
    return handlePdf(req);
  }
  if (ct.includes("application/json")) {
    return handleUrl(req);
  }
  return NextResponse.json(
    { error: "Unsupported Content-Type. Use multipart/form-data (file) or application/json ({ url })." },
    { status: 415 }
  );
}

async function handlePdf(req: NextRequest) {
  let form: FormData;
  try {
    form = await req.formData();
  } catch (err) {
    return NextResponse.json({ error: "Bad multipart body" }, { status: 400 });
  }
  const file = form.get("file");
  if (!(file instanceof File)) {
    return NextResponse.json({ error: "Missing `file`" }, { status: 400 });
  }
  if (file.size > MAX_PDF_BYTES) {
    return NextResponse.json(
      { error: `File is ${(file.size / 1024 / 1024).toFixed(1)}MB — limit is 10MB.` },
      { status: 413 }
    );
  }
  const isPdf =
    file.type === "application/pdf" ||
    file.name.toLowerCase().endsWith(".pdf");
  if (!isPdf) {
    return NextResponse.json(
      { error: "Only PDF uploads are supported right now." },
      { status: 415 }
    );
  }

  try {
    const bytes = new Uint8Array(await file.arrayBuffer());
    const pdf = await getDocumentProxy(bytes);
    const { text: pages } = await extractText(pdf, { mergePages: false });
    const joined = (Array.isArray(pages) ? pages.join("\n\n") : String(pages)).trim();
    if (!joined) {
      return NextResponse.json(
        {
          error: "No text extracted from this PDF.",
          hint: "If the file is a scan, run OCR first (e.g. Preview → Export as Text), then paste the text.",
        },
        { status: 422 }
      );
    }
    const trimmed = joined.slice(0, MAX_OUTPUT_CHARS);
    return NextResponse.json({
      text: trimmed,
      meta: {
        source: "pdf",
        pages: Array.isArray(pages) ? pages.length : 1,
        chars: trimmed.length,
        filename: file.name,
      },
    });
  } catch (err) {
    console.error("pdf extract failed", err);
    return NextResponse.json(
      { error: "Could not parse this PDF.", hint: "Try a different export — flattened text, not images." },
      { status: 500 }
    );
  }
}

const urlBodySchema = z.object({
  url: z.string().url(),
});

async function handleUrl(req: NextRequest) {
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }
  const parsed = urlBodySchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Provide a valid `url`.", issues: parsed.error.issues },
      { status: 400 }
    );
  }
  const { url } = parsed.data;

  const host = (() => {
    try { return new URL(url).hostname.toLowerCase(); } catch { return ""; }
  })();
  // Block obviously local + cloud-metadata destinations from SSRF.
  if (
    host === "localhost" ||
    host === "127.0.0.1" ||
    host === "0.0.0.0" ||
    host === "169.254.169.254" ||
    host.endsWith(".internal") ||
    host.endsWith(".local")
  ) {
    return NextResponse.json({ error: "URL not allowed." }, { status: 400 });
  }
  // LinkedIn aggressively blocks crawlers — warn the user up front instead
  // of returning their generic "you've been blocked" page as the source.
  if (host.endsWith("linkedin.com")) {
    return NextResponse.json(
      {
        error: "LinkedIn blocks automated fetches.",
        hint: "Copy the About + Experience sections into the text box, or use the LinkedIn 'Save as PDF' export and upload the file.",
      },
      { status: 422 }
    );
  }

  let res: Response;
  try {
    res = await fetch(url, {
      redirect: "follow",
      headers: {
        // Identifying ourselves honestly while still being fetch-able by
        // most public sites.
        "User-Agent": "Mozilla/5.0 (compatible; TrustPassAI/1.0; +https://trustpass.ai/bot)",
        Accept: "text/html,application/xhtml+xml",
      },
      signal: AbortSignal.timeout(15_000),
    });
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Fetch failed" },
      { status: 502 }
    );
  }
  if (!res.ok) {
    return NextResponse.json(
      { error: `Site returned HTTP ${res.status}.`, hint: "Try a different URL or paste the page text directly." },
      { status: 502 }
    );
  }

  const buf = await res.arrayBuffer();
  if (buf.byteLength > MAX_HTML_BYTES) {
    return NextResponse.json({ error: "Page too large." }, { status: 413 });
  }
  const ct = res.headers.get("content-type") ?? "";
  if (!ct.includes("text/html") && !ct.includes("text/plain") && !ct.includes("application/xhtml")) {
    return NextResponse.json(
      { error: `Unsupported content type: ${ct.split(";")[0] || "unknown"}` },
      { status: 415 }
    );
  }

  const html = new TextDecoder("utf-8", { fatal: false }).decode(buf);
  const text = htmlToText(html, {
    wordwrap: false,
    selectors: [
      // Strip noise
      { selector: "script", format: "skip" },
      { selector: "style", format: "skip" },
      { selector: "nav", format: "skip" },
      { selector: "footer", format: "skip" },
      { selector: "header", format: "skip" },
      { selector: "form", format: "skip" },
      { selector: "img", format: "skip" },
      { selector: "a", options: { ignoreHref: true } },
    ],
  })
    .replace(/\n{3,}/g, "\n\n")
    .trim();

  if (!text) {
    return NextResponse.json(
      { error: "No readable text on that page.", hint: "Many SPAs need JavaScript — paste content directly." },
      { status: 422 }
    );
  }

  const trimmed = text.slice(0, MAX_OUTPUT_CHARS);
  return NextResponse.json({
    text: trimmed,
    meta: {
      source: "url",
      chars: trimmed.length,
      finalUrl: res.url,
    },
  });
}
