"use client";

import type { StartupAutofill, MentorAutofill } from "@/lib/schemas/passport";

type DraftKind = "startup" | "mentor";
const KEY_FOR = (kind: DraftKind) => `trustpass:draft:${kind}`;

export interface DraftStartup {
  source: "pitch-deck" | "website" | "description" | "manual";
  sourceLabel?: string;
  evidence?: string;
  autofill?: StartupAutofill;
  confirmedProfile?: Record<string, unknown>;
  createdAt: number;
}

export interface DraftMentor {
  source: "cv" | "linkedin" | "bio" | "manual";
  sourceLabel?: string;
  evidence?: string;
  autofill?: MentorAutofill;
  confirmedProfile?: Record<string, unknown>;
  createdAt: number;
}

export function saveDraft(draft: DraftStartup) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(KEY_FOR("startup"), JSON.stringify(draft));
}
export function loadDraft(): DraftStartup | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = window.localStorage.getItem(KEY_FOR("startup"));
    return raw ? (JSON.parse(raw) as DraftStartup) : null;
  } catch {
    return null;
  }
}
export function clearDraft() {
  if (typeof window === "undefined") return;
  window.localStorage.removeItem(KEY_FOR("startup"));
}

export function saveMentorDraft(draft: DraftMentor) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(KEY_FOR("mentor"), JSON.stringify(draft));
}
export function loadMentorDraft(): DraftMentor | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = window.localStorage.getItem(KEY_FOR("mentor"));
    return raw ? (JSON.parse(raw) as DraftMentor) : null;
  } catch {
    return null;
  }
}
export function clearMentorDraft() {
  if (typeof window === "undefined") return;
  window.localStorage.removeItem(KEY_FOR("mentor"));
}
