"use client";

import { useRef, useState } from "react";
import { FileUp, Loader2, CheckCircle2, X, ShieldAlert } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";

export interface DocResponse {
  text: string;
  filename?: string;
  /** Last successful relevance score, 0-100. */
  score?: number;
}

interface MissingDocItemProps {
  index: number;
  label: string;
  response: DocResponse;
  onChange: (next: DocResponse) => void;
  disabled?: boolean;
}

interface RejectedFile {
  filename: string;
  reason: string;
  score: number;
}

/**
 * One row in the "Missing documents" list.
 *
 * Two ways to respond:
 *   - upload a file (we extract text server-side via /api/extract,
 *     then validate relevance via /api/validate-evidence)
 *   - type / paste directly into the inline textarea (validated on
 *     blur if non-trivial)
 *
 * Off-topic content is rejected with a visible reason so the user
 * understands why their upload didn't satisfy the requested item.
 */
export function MissingDocItem({ index, label, response, onChange, disabled }: MissingDocItemProps) {
  const fileRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [validating, setValidating] = useState(false);
  const [expanded, setExpanded] = useState(false);
  const [rejection, setRejection] = useState<RejectedFile | null>(null);

  const addressed = response.text.trim().length > 0;

  async function validateRelevance(text: string): Promise<{ ok: boolean; score: number; reason: string }> {
    setValidating(true);
    try {
      const res = await fetch("/api/validate-evidence", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ label, text }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Validation failed");
      return { ok: Boolean(data.relevant), score: Number(data.score ?? 0), reason: String(data.reason ?? "") };
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

      const extracted = data.text as string;
      // Relevance gate
      const verdict = await validateRelevance(extracted);
      if (!verdict.ok) {
        setRejection({ filename: file.name, reason: verdict.reason, score: verdict.score });
        toast.error(`Rejected "${file.name}" — ${verdict.reason}`);
        return;
      }

      onChange({
        text: (response.text ? response.text + "\n\n" : "") + extracted,
        filename: file.name,
        score: verdict.score,
      });
      toast.success(
        `Tagged ${(data.meta?.chars ?? 0).toLocaleString()} chars to "${truncate(label, 40)}" (${verdict.score}% match)`
      );
      setExpanded(true);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Could not parse file");
    } finally {
      setUploading(false);
      if (fileRef.current) fileRef.current.value = "";
    }
  }

  async function onTextBlur() {
    // Only validate substantive paste-ins to avoid burning quota on
    // partial typing. Skip if we already have a score from the upload path.
    if (!response.text.trim() || response.score != null) return;
    if (response.text.trim().length < 60) return;
    const verdict = await validateRelevance(response.text);
    if (!verdict.ok) {
      setRejection({ filename: "typed text", reason: verdict.reason, score: verdict.score });
      // Don't clear — let the user see what they typed and fix it.
      // But surface the issue.
    } else {
      onChange({ ...response, score: verdict.score });
      setRejection(null);
    }
  }

  function clearResponse() {
    onChange({ text: "" });
    setRejection(null);
  }

  return (
    <div
      className={cn(
        "rounded-lg border bg-white p-3 transition-colors",
        rejection
          ? "border-rose-300 bg-rose-50/40"
          : addressed
            ? "border-emerald-300 bg-emerald-50/30"
            : "border-amber-200"
      )}
    >
      <div className="flex items-start gap-2.5">
        <span
          className={cn(
            "mt-0.5 flex h-5 w-5 flex-none items-center justify-center rounded-full text-[10px] font-bold",
            rejection
              ? "bg-rose-500 text-white"
              : addressed
                ? "bg-emerald-500 text-white"
                : "bg-amber-100 text-amber-700"
          )}
        >
          {rejection ? <ShieldAlert className="h-3 w-3" /> : addressed ? <CheckCircle2 className="h-3 w-3" /> : index + 1}
        </span>

        <div className="min-w-0 flex-1">
          <p className="text-[13px] text-navy-800">{label}</p>

          {/* Action row */}
          <div className="mt-2 flex flex-wrap items-center gap-2">
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
              disabled={uploading || validating || disabled}
              onClick={() => fileRef.current?.click()}
              className="h-7 px-2 text-[11.5px]"
            >
              {uploading ? (
                <><Loader2 className="h-3 w-3 animate-spin" /> Extracting…</>
              ) : validating ? (
                <><Loader2 className="h-3 w-3 animate-spin" /> Validating…</>
              ) : (
                <><FileUp className="h-3 w-3" /> Upload file</>
              )}
            </Button>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => setExpanded((e) => !e)}
              className="h-7 px-2 text-[11.5px]"
            >
              {expanded ? "Hide" : addressed ? "Edit" : "Type instead"}
            </Button>
            {addressed && !rejection && (
              <>
                <span className="text-[10.5px] text-emerald-700">
                  ✓ {response.text.length.toLocaleString()} chars
                  {response.score != null ? ` · ${response.score}% match` : ""}
                  {response.filename ? ` · ${truncate(response.filename, 30)}` : ""}
                </span>
                <button
                  type="button"
                  onClick={clearResponse}
                  className="text-navy-400 hover:text-rose-600"
                  aria-label="Clear"
                >
                  <X className="h-3 w-3" />
                </button>
              </>
            )}
          </div>

          {/* Rejection banner */}
          {rejection && (
            <div className="mt-2 flex items-start gap-2 rounded-md border border-rose-200 bg-rose-50 p-2.5 text-[12px] text-rose-800">
              <ShieldAlert className="mt-0.5 h-3.5 w-3.5 flex-none" />
              <div>
                <p>
                  <span className="font-semibold">Not accepted</span> ({rejection.score}% match):{" "}
                  {rejection.reason}
                </p>
                <p className="mt-1 text-[11px] text-rose-700">
                  Try a different file or type a more specific response for this item.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setRejection(null)}
                className="ml-auto text-rose-400 hover:text-rose-700"
                aria-label="Dismiss"
              >
                <X className="h-3 w-3" />
              </button>
            </div>
          )}

          {/* Inline textarea */}
          {(expanded || addressed) && (
            <Textarea
              value={response.text}
              onChange={(e) => onChange({ ...response, text: e.target.value, score: undefined })}
              onBlur={onTextBlur}
              placeholder={`Paste or describe: ${label}`}
              rows={4}
              className="mt-2.5 min-h-[80px] text-[12.5px]"
              disabled={disabled}
            />
          )}
        </div>
      </div>
    </div>
  );
}

function truncate(s: string, max: number) {
  return s.length > max ? s.slice(0, max - 1) + "…" : s;
}
