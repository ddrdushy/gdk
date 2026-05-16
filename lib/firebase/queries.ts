"use client";

import {
  collection,
  getDocs,
  query,
  orderBy,
  where,
  doc,
  getDoc,
} from "firebase/firestore";
import { getDb } from "@/lib/firebase/client";

export interface AdminQueueItem {
  ownerUid: string;
  startupName: string;
  sector: string;
  stage: string;
  country: string;
  status: string;
  aiCompletedAt?: { seconds?: number } | string;
}

export async function fetchAdminReviewQueue(): Promise<AdminQueueItem[]> {
  const db = getDb();
  const ref = collection(db, "startups");
  const q = query(ref, where("status", "in", ["ai-verified", "needs-review", "submitted"]), orderBy("updatedAt", "desc"));
  let snap;
  try {
    snap = await getDocs(q);
  } catch {
    // Fallback if the composite index isn't ready
    snap = await getDocs(collection(db, "startups"));
  }
  return snap.docs.map((d) => {
    const data = d.data() as Record<string, unknown>;
    return {
      ownerUid: (data.ownerUid as string) ?? d.id,
      startupName: (data.startupName as string) ?? "Untitled",
      sector: (data.sector as string) ?? "—",
      stage: (data.stage as string) ?? "—",
      country: (data.country as string) ?? "—",
      status: (data.status as string) ?? "submitted",
      aiCompletedAt: data.aiCompletedAt as AdminQueueItem["aiCompletedAt"],
    };
  });
}

export async function fetchVerificationRun(ownerUid: string) {
  const db = getDb();
  const [profileSnap, runSnap] = await Promise.all([
    getDoc(doc(db, "startups", ownerUid)),
    getDoc(doc(db, "verification_results", ownerUid)),
  ]);
  return {
    profile: profileSnap.exists() ? profileSnap.data() : null,
    run: runSnap.exists() ? runSnap.data() : null,
  };
}
