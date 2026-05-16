"use client";

import { useEffect } from "react";

/**
 * Client-side beacon that POSTs to the view-tracking endpoint exactly
 * once per mount. Renders nothing.
 *
 * Mounted on the public passport page; the endpoint dedupes repeated
 * pings from the same fingerprint within an hour.
 */
export function ViewTracker({ passportId }: { passportId: string }) {
  useEffect(() => {
    const controller = new AbortController();
    void fetch(`/api/passports/${encodeURIComponent(passportId)}/view`, {
      method: "POST",
      keepalive: true,
      signal: controller.signal,
    }).catch(() => {
      // tracking failures must never break the page
    });
    return () => controller.abort();
  }, [passportId]);
  return null;
}
