import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { extractText, getDocumentProxy, renderPageAsImage } from "unpdf";
import { convert as htmlToText } from "html-to-text";
import { parseOffice } from "officeparser";
import { GoogleGenerativeAI } from "@google/generative-ai";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const maxDuration = 60;

const MAX_UPLOAD_BYTES = 15 * 1024 * 1024; // 15 MB (PPTX with images runs bigger)
const MAX_HTML_BYTES = 5 * 1024 * 1024; // 5 MB after fetch
const MAX_OUTPUT_CHARS = 24_000; // keep room for the AI prompt

type DocKind = "pdf" | "pptx" | "docx" | "xlsx";

const EXT_TO_KIND: Record<string, DocKind> = {
  ".pdf": "pdf",
  ".pptx": "pptx",
  ".ppt": "pptx", // best-effort — officeparser will reject true binary .ppt
  ".docx": "docx",
  ".doc": "docx",
  ".xlsx": "xlsx",
  ".xls": "xlsx",
};

function detectKind(file: File): DocKind | null {
  const name = file.name.toLowerCase();
  for (const ext of Object.keys(EXT_TO_KIND)) {
    if (name.endsWith(ext)) return EXT_TO_KIND[ext];
  }
  if (file.type === "application/pdf") return "pdf";
  if (file.type === "application/vnd.openxmlformats-officedocument.presentationml.presentation") return "pptx";
  if (file.type === "application/vnd.openxmlformats-officedocument.wordprocessingml.document") return "docx";
  if (file.type === "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet") return "xlsx";
  return null;
}

/**
 * POST /api/extract
 *
 * Two shapes, distinguished by Content-Type:
 *
 * 1. multipart/form-data with field "file"
 *    Supported formats: .pdf, .pptx (.ppt best-effort), .docx, .xlsx, up to 15 MB
 *    Returns { text, meta: { source: <kind>, pages, chars, filename } }
 *
 * 2. application/json { url: "https://…" }
 *    Server fetches, strips HTML, returns plain text.
 *    Returns { text, meta: { source: "url", chars, finalUrl } }
 */
export async function POST(req: NextRequest) {
  const ct = req.headers.get("content-type") ?? "";
  if (ct.includes("multipart/form-data")) return handleFile(req);
  if (ct.includes("application/json")) return handleUrl(req);
  return NextResponse.json(
    { error: "Unsupported Content-Type. Use multipart/form-data (file) or application/json ({ url })." },
    { status: 415 }
  );
}

async function handleFile(req: NextRequest) {
  let form: FormData;
  try {
    form = await req.formData();
  } catch {
    return NextResponse.json({ error: "Bad multipart body" }, { status: 400 });
  }
  const file = form.get("file");
  if (!(file instanceof File)) {
    return NextResponse.json({ error: "Missing `file`" }, { status: 400 });
  }
  if (file.size > MAX_UPLOAD_BYTES) {
    return NextResponse.json(
      { error: `File is ${(file.size / 1024 / 1024).toFixed(1)}MB — limit is 15MB.` },
      { status: 413 }
    );
  }
  const kind = detectKind(file);
  if (!kind) {
    return NextResponse.json(
      {
        error: "Unsupported file format.",
        hint: "Accepted: PDF, PPTX/PPT, DOCX, XLSX. Convert other formats first.",
      },
      { status: 415 }
    );
  }

  try {
    const buf = Buffer.from(await file.arrayBuffer());
    let raw = kind === "pdf" ? await extractPdf(buf) : await extractOffice(buf, kind);
    let usedVision = false;

    // PDF fallback chain:
    //   1. unpdf failed → try officeparser's PDF parser
    //   2. still empty  → Gemini vision OCR (multimodal, reads images in PDF)
    if (kind === "pdf" && !raw.trim()) {
      try {
        raw = await extractOffice(buf, "pdf");
      } catch {
        /* fall through to vision */
      }
    }
    let ocrEngine: "gemini-vision" | "tesseract" | null = null;
    let visionError: string | null = null;
    if (kind === "pdf" && !raw.trim() && process.env.GEMINI_API_KEY) {
      try {
        raw = await extractPdfWithVision(buf);
        ocrEngine = "gemini-vision";
        usedVision = true;
      } catch (err) {
        const msg = err instanceof Error ? err.message : String(err);
        visionError = msg;
        console.warn("Gemini vision OCR failed", msg);
      }
    }
    // Tesseract fallback — runs locally, no API quota. Slow but reliable.
    if (kind === "pdf" && !raw.trim()) {
      try {
        raw = await extractPdfWithTesseract(buf);
        ocrEngine = "tesseract";
        usedVision = true;
      } catch (err) {
        console.warn("Tesseract OCR failed", err instanceof Error ? err.message : err);
      }
    }

    const cleaned = raw.trim();
    if (!cleaned) {
      return NextResponse.json(
        {
          error: `No readable text in this ${kind.toUpperCase()}.`,
          hint:
            kind === "pdf"
              ? "Both vision OCR and Tesseract gave up. Upload the original .PPTX/.DOCX if you have it, or paste the content directly."
              : "Slides may be image-heavy. Paste the speaker notes or descriptions instead.",
          quotaExhausted: visionError && /429|quota|rate.*limit/i.test(visionError),
        },
        { status: 422 }
      );
    }
    const trimmed = cleaned.slice(0, MAX_OUTPUT_CHARS);
    return NextResponse.json({
      text: trimmed,
      meta: {
        source: kind,
        chars: trimmed.length,
        filename: file.name,
        ocr: usedVision || undefined,
        ocrEngine,
      },
    });
  } catch (err) {
    console.error(`${kind} extract failed`, err);
    return NextResponse.json(
      {
        error: `Could not parse this ${kind.toUpperCase()}.`,
        hint:
          kind === "pdf"
            ? "Try a different export — flattened text, not images."
            : "Try saving as PDF and uploading that, or paste the slide content directly.",
      },
      { status: 500 }
    );
  }
}

/**
 * Last-resort PDF extraction: send the raw PDF bytes to Gemini and let
 * its multimodal model read the slides as images. Works for scans,
 * Keynote / Canva exports, and any other PDF where the text is encoded
 * as graphics.
 *
 * Uses GEMINI_API_KEY (the same direct-Gemini provider in lib/gemini/client).
 * Costs more than text extraction and takes 5–20 s on a real deck.
 */
async function extractPdfWithVision(buf: Buffer): Promise<string> {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) throw new Error("GEMINI_API_KEY not configured");
  const client = new GoogleGenerativeAI(apiKey);
  const model = client.getGenerativeModel({
    // Gemini 2.5 Flash supports PDF input directly. Override via env if needed.
    model: process.env.GEMINI_VISION_MODEL ?? "gemini-2.5-flash",
    generationConfig: { temperature: 0.1 },
  });

  const result = await model.generateContent([
    {
      inlineData: {
        mimeType: "application/pdf",
        data: buf.toString("base64"),
      },
    },
    `You are reading a document and extracting its text content.

Output the text content of every page in reading order. Preserve:
- slide titles or section headings (one per line, no markdown)
- bullets and list items as separate lines
- tables as tab-separated rows
- captions and labels

Skip purely decorative imagery. Do not narrate, do not summarize,
do not wrap in JSON or code fences — return the raw text only.`,
  ]);

  return result.response.text();
}

/**
 * True offline OCR for image-only PDFs. No API quota. Slower than
 * Gemini vision (~3–8 s per page on a modern Mac) but works regardless
 * of network or rate limits. Used as the last-resort fallback.
 *
 * Strategy: render each PDF page to a PNG via unpdf's renderPageAsImage
 * (which wraps pdfjs-dist) and feed it through Tesseract.js with the
 * English language pack.
 */
async function extractPdfWithTesseract(buf: Buffer): Promise<string> {
  // Dynamic import keeps tesseract.js out of the cold-start hot path
  // — the route boots in ~50 ms and only pulls the OCR engine in when
  // we actually need it.
  const Tesseract = (await import("tesseract.js")).default;

  // Discover the page count
  const pdf = await getDocumentProxy(new Uint8Array(buf));
  const pageCount = pdf.numPages;
  // Cap at 20 pages to keep latency bounded — pitch decks are rarely longer
  const maxPages = Math.min(pageCount, 20);

  const worker = await Tesseract.createWorker("eng", undefined, {
    // Suppress tesseract's loud per-page logging
    logger: () => {},
  });

  try {
    const texts: string[] = [];
    for (let p = 1; p <= maxPages; p++) {
      try {
        const png = await renderPageAsImage(new Uint8Array(buf), p, {
          canvasImport: () => import("@napi-rs/canvas"),
          scale: 2, // 2x for better OCR accuracy
        });
        const { data } = await worker.recognize(Buffer.from(png));
        if (data.text.trim()) texts.push(`--- Page ${p} ---\n${data.text.trim()}`);
      } catch (err) {
        console.warn(`tesseract page ${p} failed`, err instanceof Error ? err.message : err);
      }
    }
    return texts.join("\n\n");
  } finally {
    await worker.terminate();
  }
}

async function extractPdf(buf: Buffer): Promise<string> {
  const pdf = await getDocumentProxy(new Uint8Array(buf));
  const { text: pages } = await extractText(pdf, { mergePages: false });
  return (Array.isArray(pages) ? pages.join("\n\n") : String(pages));
}

async function extractOffice(buf: Buffer, kind: DocKind): Promise<string> {
  // officeparser handles .pptx, .docx, .xlsx, .odt, .odp, .ods, and .pdf.
  // Auto-detection from buffer magic bytes fails on some Node runtimes
  // (notably Alpine in Docker), so we pass the fileType hint explicitly
  // based on the kind we already detected from the upload.
  const ast = await parseOffice(buf, { fileType: kind });
  if (typeof ast === "string") return ast;
  if (ast && typeof (ast as { toText?: () => string }).toText === "function") {
    return (ast as { toText: () => string }).toText();
  }
  return "";
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
