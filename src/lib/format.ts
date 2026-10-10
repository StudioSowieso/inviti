const TZ = "Europe/Amsterdam";

export function greeting(now = new Date()) {
  const hour = Number(
    new Intl.DateTimeFormat("nl-NL", { hour: "numeric", hour12: false, timeZone: TZ }).format(now),
  );
  if (hour < 6) return "Goedenacht";
  if (hour < 12) return "Goedemorgen";
  if (hour < 18) return "Goedemiddag";
  return "Goedenavond";
}

export function firstName(fullName: string | null | undefined) {
  return (fullName ?? "").trim().split(/\s+/)[0] || "daar";
}

export function initials(fullName: string | null | undefined) {
  const parts = (fullName ?? "").trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return "–";
  const first = parts[0][0] ?? "";
  const last = parts.length > 1 ? parts[parts.length - 1][0] : "";
  return (first + last).toUpperCase();
}

/** Initialen van het stel, bijvoorbeeld "A&M". Zonder partner vallen we terug op de eigen initialen. */
export function coupleInitials(name: string | null | undefined, partner: string | null | undefined) {
  const a = (name ?? "").trim()[0];
  const b = (partner ?? "").trim()[0];
  if (a && b) return `${a}&${b}`.toUpperCase();
  return initials(name);
}

function todayIso() {
  // en-CA geeft YYYY-MM-DD
  return new Intl.DateTimeFormat("en-CA", { timeZone: TZ }).format(new Date());
}

/** "Vandaag", "Morgen", "Overmorgen", "Gisteren" of een korte datum. */
export function dueLabel(dueDate: string | null) {
  if (!dueDate) return "Geen deadline";
  const day = 86_400_000;
  const diff = Math.round((Date.parse(dueDate) - Date.parse(todayIso())) / day);
  if (diff === 0) return "Vandaag";
  if (diff === 1) return "Morgen";
  if (diff === 2) return "Overmorgen";
  if (diff === -1) return "Gisteren";
  const formatted = new Intl.DateTimeFormat("nl-NL", {
    day: "numeric",
    month: "short",
    timeZone: "UTC",
  }).format(new Date(dueDate));
  return diff < 0 ? `Verlopen · ${formatted}` : formatted;
}

export type RsvpStatus = "pending" | "attending" | "declined";

export const RSVP_LABEL: Record<RsvpStatus, string> = {
  attending: "Aanwezig",
  pending: "Geen reactie",
  declined: "Afgemeld",
};
