"use client";

import { useRef, useState } from "react";
import { FileUp, Loader2, CheckCircle2, X } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";

export interface DocResponse {
  text: string;
  filename?: string;
}

interface MissingDocItemProps {
  index: number;
  label: string;
  response: DocResponse;
  onChange: (next: DocResponse) => void;
  disabled?: boolean;
}

/**
 * One row in the "Missing documents" list.
 *
 * Lets the user respond to a specific AI request by either:
 *   - uploading a file (we extract text server-side via /api/extract)
 *   - typing/pasting directly
 * Both end up in the same `text` field so the parent component can
 * combine them with the missing-doc label as a header before submission.
 */
export function MissingDocItem({ index, label, response, onChange, disabled }: MissingDocItemProps) {
  const fileRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [expanded, setExpanded] = useState(false);

  const addressed = response.text.trim().length > 0;

  async function onFile(file: File) {
    setUploading(true);
    try {
      const fd = new FormData();
      fd.append("file", file);
      const res = await fetch("/api/extract", { method: "POST", body: fd });
      const data = await res.json();
      if (!res.ok) throw new Error(`${data.error ?? "Extract failed"}${data.hint ? ` — ${data.hint}` : ""}`);
      onChange({
        text: (response.text ? response.text + "\n\n" : "") + (data.text as string),
        filename: file.name,
      });
      toast.success(`Tagged ${(data.meta?.chars ?? 0).toLocaleString()} chars to "${truncate(label, 40)}"`);
      setExpanded(true);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Could not parse file");
    } finally {
      setUploading(false);
      if (fileRef.current) fileRef.current.value = "";
    }
  }

  function clearResponse() {
    onChange({ text: "" });
  }

  return (
    <div
      className={cn(
        "rounded-lg border bg-white p-3 transition-colors",
        addressed ? "border-emerald-300 bg-emerald-50/30" : "border-amber-200"
      )}
    >
      <div className="flex items-start gap-2.5">
        <span
          className={cn(
            "mt-0.5 flex h-5 w-5 flex-none items-center justify-center rounded-full text-[10px] font-bold",
            addressed ? "bg-emerald-500 text-white" : "bg-amber-100 text-amber-700"
          )}
        >
          {addressed ? <CheckCircle2 className="h-3 w-3" /> : index + 1}
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
              disabled={uploading || disabled}
              onClick={() => fileRef.current?.click()}
              className="h-7 px-2 text-[11.5px]"
            >
              {uploading ? (
                <><Loader2 className="h-3 w-3 animate-spin" /> Extracting…</>
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
            {addressed && (
              <>
                <span className="text-[10.5px] text-emerald-700">
                  ✓ {response.text.length.toLocaleString()} chars{response.filename ? ` · ${truncate(response.filename, 30)}` : ""}
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

          {/* Inline textarea */}
          {(expanded || addressed) && (
            <Textarea
              value={response.text}
              onChange={(e) => onChange({ ...response, text: e.target.value })}
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
