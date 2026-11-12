"use client";

import { createClient } from "@/lib/supabase/client";

/** Zelfde als logError, maar vanuit de browser (voor error boundaries en formulieren). */
export function logClientError(source: string, message: string, detail?: Record<string, unknown>) {
  try {
    void createClient()
      .rpc("log_app_error", {
        p_source: source,
        p_message: message,
        p_path: typeof window !== "undefined" ? window.location.pathname : null,
        p_detail: detail ?? null,
        p_severity: "error",
      })
      .then(() => undefined, () => undefined);
  } catch {
    // bewust genegeerd
  }
}
