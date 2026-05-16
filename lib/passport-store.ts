"use client";

import type { StartupAutofill } from "@/lib/schemas/passport";

const KEY = "trustpass:draft:startup";

export interface DraftStartup {
  source: "pitch-deck" | "website" | "description" | "manual";
  sourceLabel?: string;
  evidence?: string;
  autofill?: StartupAutofill;
  confirmedProfile?: Record<string, unknown>;
  createdAt: number;
}

export function saveDraft(draft: DraftStartup) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(KEY, JSON.stringify(draft));
}

export function loadDraft(): DraftStartup | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = window.localStorage.getItem(KEY);
    return raw ? (JSON.parse(raw) as DraftStartup) : null;
  } catch {
    return null;
  }
}

export function clearDraft() {
  if (typeof window === "undefined") return;
  window.localStorage.removeItem(KEY);
}
