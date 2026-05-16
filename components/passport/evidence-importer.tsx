"use client";

import { useRef, useState } from "react";
import { FileUp, Globe2, Loader2, CheckCircle2, X } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

interface EvidenceImporterProps {
  onExtracted: (text: string, label: string) => void;
  disabled?: boolean;
  /** Hide the URL fetch option (e.g. CV-only contexts). Defaults to false. */
  urlDisabled?: boolean;
}

/**
 * Two ways to load evidence into the textarea without typing:
 *
 *  1. Upload a PDF (CV, pitch deck) — server-side text extraction via /api/extract
 *  2. Fetch a URL (startup website, blog post) — server fetch + html-to-text
 *
 * Result is plain text. The caller decides where the text lands; usually
 * the parent setState fills in the existing textarea so the user can
 * still review + edit before clicking Build.
 */
export function EvidenceImporter({ onExtracted, disabled, urlDisabled }: EvidenceImporterProps) {
  const fileRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [fetchingUrl, setFetchingUrl] = useState(false);
  const [url, setUrl] = useState("");
  const [lastImport, setLastImport] = useState<{ source: "pdf" | "url"; label: string; chars: number } | null>(null);

  async function onFile(file: File) {
    setUploading(true);
    try {
      const fd = new FormData();
      fd.append("file", file);
      const res = await fetch("/api/extract", { method: "POST", body: fd });
      const data = await res.json();
      if (!res.ok) throw new Error(`${data.error ?? "Extract failed"}${data.hint ? ` — ${data.hint}` : ""}`);
      onExtracted(data.text as string, file.name);
      setLastImport({ source: "pdf", label: file.name, chars: data.meta?.chars ?? 0 });
      const ocrNote = data.meta?.ocr ? " (Gemini vision OCR)" : "";
      toast.success(`Extracted ${(data.meta?.chars ?? 0).toLocaleString()} chars from ${file.name}${ocrNote}`);
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
    try {
      const res = await fetch("/api/extract", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url: url.trim() }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(`${data.error ?? "Fetch failed"}${data.hint ? ` — ${data.hint}` : ""}`);
      onExtracted(data.text as string, data.meta?.finalUrl ?? url.trim());
      setLastImport({ source: "url", label: data.meta?.finalUrl ?? url.trim(), chars: data.meta?.chars ?? 0 });
      toast.success(`Fetched ${(data.meta?.chars ?? 0).toLocaleString()} chars from ${new URL(url.trim()).hostname}`);
      setUrl("");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Could not fetch URL");
    } finally {
      setFetchingUrl(false);
    }
  }

  return (
    <div className={cn("rounded-xl border border-navy-100 bg-navy-50/40 p-4", disabled && "opacity-60 pointer-events-none")}>
      <p className="text-xs font-semibold uppercase tracking-wider text-navy-700">
        Skip the paste — import instead
      </p>

      <div className="mt-3 grid gap-3 sm:grid-cols-2">
        {/* PDF upload */}
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
            disabled={uploading || disabled}
            onClick={() => fileRef.current?.click()}
          >
            {uploading ? (
              <><Loader2 className="h-4 w-4 animate-spin" /> Extracting…</>
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
                disabled={fetchingUrl || disabled || !url.trim()}
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

      {lastImport && (
        <div className="mt-3 flex items-center justify-between rounded-lg border border-emerald-200 bg-emerald-50 px-3 py-2 text-xs text-emerald-800">
          <div className="flex items-center gap-2 min-w-0">
            <CheckCircle2 className="h-4 w-4 flex-none" />
            <span className="truncate">
              Imported {lastImport.chars.toLocaleString()} chars from {lastImport.label}
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
    </div>
  );
}
