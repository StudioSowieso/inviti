import { createClient } from "@/lib/supabase/server";

/**
 * Legt een fout vast in het adminoverzicht (tabel `app_errors`).
 * Mag nooit zelf een fout veroorzaken, dus alles is afgevangen.
 */
export async function logError(
  source: string,
  message: string,
  opts: { path?: string; detail?: Record<string, unknown>; severity?: "info" | "warning" | "error" } = {},
) {
  try {
    const supabase = await createClient();
    await supabase.rpc("log_app_error", {
      p_source: source,
      p_message: message,
      p_path: opts.path ?? null,
      p_detail: opts.detail ?? null,
      p_severity: opts.severity ?? "error",
    });
  } catch {
    // bewust genegeerd
  }
}
