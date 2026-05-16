"use client";

import { useRef, useState } from "react";
import { FileUp, Globe2, Loader2, CheckCircle2, X, ShieldAlert } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

interface EvidenceImporterProps {
  onExtracted: (text: string, label: string) => void;
  disabled?: boolean;
  /** Hide the URL fetch option (e.g. CV-only contexts). Defaults to false. */
  urlDisabled?: boolean;
  /**
   * If set, the extracted text is checked for relevance against this
   * target via /api/validate-evidence BEFORE being passed to onExtracted.
   * Off-topic content is blocked with a visible error.
   *
   * Examples:
   *   "Startup pitch deck or company profile"
   *   "Mentor CV, LinkedIn profile, or professional bio"
   *   "Additional supporting evidence for an existing passport"
   */
  validateAs?: string;
  /**
   * When validating, how strict to be. Strict = only accept clear
   * matches (default for initial uploads). Lenient = accept anything
   * not obviously off-topic (good for "additional notes" supplements).
   */
  validationStrictness?: "strict" | "lenient";
}

/**
 * Three ways to load evidence into the parent's textarea:
 *
 *  1. Upload a PDF / PPTX / DOCX — server extracts text (/api/extract)
 *  2. Fetch a URL — server fetches and strips HTML
 *  3. (implicit) Paste into the textarea below — the parent owns that
 *
 * For paths 1 and 2: when validateAs is set, the extracted text is
 * routed through /api/validate-evidence first. If the AI judges it
 * off-topic for the stated purpose, onExtracted is NOT called and a
 * visible rejection banner appears explaining why.
 */
export function EvidenceImporter({
  onExtracted,
  disabled,
  urlDisabled,
  validateAs,
  validationStrictness = "strict",
}: EvidenceImporterProps) {
  const fileRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [fetchingUrl, setFetchingUrl] = useState(false);
  const [validating, setValidating] = useState(false);
  const [url, setUrl] = useState("");
  const [lastImport, setLastImport] = useState<{ source: "pdf" | "url"; label: string; chars: number; score?: number } | null>(null);
  const [rejection, setRejection] = useState<{ source: "pdf" | "url"; label: string; reason: string; score: number } | null>(null);

  async function maybeValidate(text: string): Promise<{ ok: boolean; score: number; reason: string }> {
    if (!validateAs) return { ok: true, score: 100, reason: "validation disabled" };
    setValidating(true);
    try {
      const res = await fetch("/api/validate-evidence", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ label: validateAs, text }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Validation failed");
      const score = Number(data.score ?? 0);
      // Lenient mode lets through scores >= 40 (the validator's relevant=true threshold is 60).
      const minScore = validationStrictness === "lenient" ? 40 : 60;
      const ok = data.degraded ? true : score >= minScore;
      return { ok, score, reason: String(data.reason ?? "") };
    } finally {
      setValidating(false);
    }
  }

  async function onFile(file: File) {
    setUploading(true);
    setRejection(null);
    try {
      const fd = new FormData();
      fd.append("file", file);
      const res = await fetch("/api/extract", { method: "POST", body: fd });
      const data = await res.json();
      if (!res.ok) throw new Error(`${data.error ?? "Extract failed"}${data.hint ? ` — ${data.hint}` : ""}`);

      const text = data.text as string;
      const verdict = await maybeValidate(text);
      if (!verdict.ok) {
        setRejection({ source: "pdf", label: file.name, reason: verdict.reason, score: verdict.score });
        toast.error(`Rejected "${file.name}" — ${verdict.reason}`);
        return;
      }

      onExtracted(text, file.name);
      setLastImport({ source: "pdf", label: file.name, chars: data.meta?.chars ?? 0, score: validateAs ? verdict.score : undefined });
      const ocrNote = data.meta?.ocr ? " (Gemini vision OCR)" : "";
      const matchNote = validateAs ? ` · ${verdict.score}% match` : "";
      toast.success(`Extracted ${(data.meta?.chars ?? 0).toLocaleString()} chars from ${file.name}${matchNote}${ocrNote}`);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Could not parse file");
    } finally {
      setUploading(false);
      if (fileRef.current) fileRef.current.value = "";
    }
  }

  async function onFetchUrl() {
    if (!url.trim()) return;
    setFetchingUrl(true);
    setRejection(null);
    try {
      const res = await fetch("/api/extract", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url: url.trim() }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(`${data.error ?? "Fetch failed"}${data.hint ? ` — ${data.hint}` : ""}`);

      const text = data.text as string;
      const finalUrl = (data.meta?.finalUrl as string) ?? url.trim();
      const verdict = await maybeValidate(text);
      if (!verdict.ok) {
        setRejection({ source: "url", label: finalUrl, reason: verdict.reason, score: verdict.score });
        toast.error(`Rejected ${new URL(finalUrl).hostname} — ${verdict.reason}`);
        return;
      }

      onExtracted(text, finalUrl);
      setLastImport({ source: "url", label: finalUrl, chars: data.meta?.chars ?? 0, score: validateAs ? verdict.score : undefined });
      const matchNote = validateAs ? ` · ${verdict.score}% match` : "";
      toast.success(`Fetched ${(data.meta?.chars ?? 0).toLocaleString()} chars from ${new URL(finalUrl).hostname}${matchNote}`);
      setUrl("");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Could not fetch URL");
    } finally {
      setFetchingUrl(false);
    }
  }

  const busy = uploading || fetchingUrl || validating;

  return (
    <div className={cn("rounded-xl border border-navy-100 bg-navy-50/40 p-4", disabled && "opacity-60 pointer-events-none")}>
      <p className="text-xs font-semibold uppercase tracking-wider text-navy-700">
        Skip the paste — import instead
      </p>

      <div className="mt-3 grid gap-3 sm:grid-cols-2">
        {/* File upload */}
        <div>
          <input
            ref={fileRef}
            type="file"
            accept=".pdf,.pptx,.ppt,.docx,.doc,.xlsx,application/pdf,application/vnd.openxmlformats-officedocument.presentationml.presentation,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
            className="sr-only"
            onChange={(e) => {
              const f = e.target.files?.[0];
              if (f) void onFile(f);
            }}
          />
          <Button
            type="button"
            variant="outline"
            size="sm"
            className="w-full"
            disabled={busy || disabled}
            onClick={() => fileRef.current?.click()}
          >
            {uploading ? (
              <><Loader2 className="h-4 w-4 animate-spin" /> Extracting…</>
            ) : validating && lastImport === null ? (
              <><Loader2 className="h-4 w-4 animate-spin" /> Validating…</>
            ) : (
              <><FileUp className="h-4 w-4" /> Upload pitch deck or CV</>
            )}
          </Button>
          <p className="mt-1 text-[10.5px] text-navy-500">
            PDF, PPTX, DOCX up to 15MB · text-based only (no scans)
          </p>
        </div>

        {/* URL fetch */}
        {!urlDisabled && (
          <div>
            <div className="flex gap-2">
              <Input
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                placeholder="https://medinova.ai/about"
                className="text-sm"
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    void onFetchUrl();
                  }
                }}
              />
              <Button
                type="button"
                variant="outline"
                size="sm"
                disabled={busy || disabled || !url.trim()}
                onClick={onFetchUrl}
              >
                {fetchingUrl ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Globe2 className="h-4 w-4" />
                )}
                Fetch
              </Button>
            </div>
            <p className="mt-1 text-[10.5px] text-navy-500">
              LinkedIn is blocked — use the PDF export instead.
            </p>
          </div>
        )}
      </div>

      {/* Accepted */}
      {lastImport && !rejection && (
        <div className="mt-3 flex items-center justify-between rounded-lg border border-emerald-200 bg-emerald-50 px-3 py-2 text-xs text-emerald-800">
          <div className="flex items-center gap-2 min-w-0">
            <CheckCircle2 className="h-4 w-4 flex-none" />
            <span className="truncate">
              Imported {lastImport.chars.toLocaleString()} chars from {lastImport.label}
              {lastImport.score != null ? ` · ${lastImport.score}% match` : ""}
            </span>
          </div>
          <button
            type="button"
            onClick={() => setLastImport(null)}
            className="flex-none rounded p-0.5 hover:bg-emerald-100"
            aria-label="Dismiss"
          >
            <X className="h-3 w-3" />
          </button>
        </div>
      )}

      {/* Rejected */}
      {rejection && (
        <div className="mt-3 flex items-start gap-2 rounded-lg border border-rose-200 bg-rose-50 px-3 py-2.5 text-[12px] text-rose-800">
          <ShieldAlert className="mt-0.5 h-4 w-4 flex-none" />
          <div className="min-w-0 flex-1">
            <p>
              <span className="font-semibold">Not accepted</span> ({rejection.score}% match):{" "}
              {rejection.reason}
            </p>
            <p className="mt-1 text-[11px] text-rose-700">
              {rejection.source === "url"
                ? `The fetched page at ${(() => { try { return new URL(rejection.label).hostname; } catch { return rejection.label; } })()} doesn't look like ${validateAs ? `"${validateAs}"` : "the expected content"}. Try a different URL or paste content directly.`
                : `"${rejection.label}" doesn't look like ${validateAs ? `"${validateAs}"` : "the expected content"}. Try a different file.`}
            </p>
          </div>
          <button
            type="button"
            onClick={() => setRejection(null)}
            className="flex-none rounded p-0.5 text-rose-400 hover:bg-rose-100 hover:text-rose-700"
            aria-label="Dismiss"
          >
            <X className="h-3 w-3" />
          </button>
        </div>
      )}
    </div>
  );
}
