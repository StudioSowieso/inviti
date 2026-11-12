import { cache } from "react";
import { createClient } from "@/lib/supabase/server";

/** Is de ingelogde gebruiker admin? De check gebeurt in de database (tabel `admins`). */
export const getIsAdmin = cache(async (): Promise<boolean> => {
  const supabase = await createClient();
  const { data } = await supabase.rpc("is_admin");
  return data === true;
});

const TZ = "Europe/Amsterdam";

export function fmtDateTime(iso: string | null | undefined) {
  if (!iso) return "–";
  return new Intl.DateTimeFormat("nl-NL", {
    day: "numeric",
    month: "short",
    hour: "2-digit",
    minute: "2-digit",
    timeZone: TZ,
  }).format(new Date(iso));
}

export function fmtDate(iso: string | null | undefined) {
  if (!iso) return "–";
  return new Intl.DateTimeFormat("nl-NL", {
    day: "numeric",
    month: "short",
    year: "numeric",
    timeZone: TZ,
  }).format(new Date(iso));
}

export function timeAgo(iso: string | null | undefined) {
  if (!iso) return "nooit";
  const s = Math.max(0, (Date.now() - Date.parse(iso)) / 1000);
  if (s < 60) return "zojuist";
  if (s < 3600) return `${Math.floor(s / 60)} min geleden`;
  if (s < 86400) return `${Math.floor(s / 3600)} uur geleden`;
  if (s < 86400 * 30) return `${Math.floor(s / 86400)} d geleden`;
  return fmtDate(iso);
}
