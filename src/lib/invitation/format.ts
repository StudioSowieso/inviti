/** Hulpfuncties voor datums in de uitnodiging. Datums zijn 'YYYY-MM-DD' en tijdzone-onafhankelijk. */

function parts(date: string) {
  const m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(date);
  if (!m) return null;
  return { y: Number(m[1]), m: Number(m[2]), d: Number(m[3]) };
}

/** "12 · 09 · 2027" */
export function formatDateDots(date: string) {
  const p = parts(date);
  if (!p) return "";
  return `${String(p.d).padStart(2, "0")} · ${String(p.m).padStart(2, "0")} · ${p.y}`;
}

/** "12 september 2027" */
export function formatDateLong(date: string) {
  const p = parts(date);
  if (!p) return "";
  return new Intl.DateTimeFormat("nl-NL", {
    day: "numeric",
    month: "long",
    year: "numeric",
    timeZone: "UTC",
  }).format(new Date(Date.UTC(p.y, p.m - 1, p.d)));
}

/** "12 SEPTEMBER 2027" */
export function formatDateUpper(date: string) {
  return formatDateLong(date).toUpperCase();
}

export function monogram(a: string, b: string, joiner = "") {
  const i = (s: string) => (s.trim()[0] ?? "").toUpperCase();
  return [i(a), i(b)].filter(Boolean).join(joiner);
}

/** Lokale doeltijd voor het aftellen, of null als de datum ongeldig is. */
export function targetTimestamp(date: string, time: string) {
  const p = parts(date);
  if (!p) return null;
  const t = /^(\d{2}):(\d{2})$/.exec(time);
  const hh = t ? Number(t[1]) : 0;
  const mm = t ? Number(t[2]) : 0;
  return new Date(p.y, p.m - 1, p.d, hh, mm, 0).getTime();
}

// ---------- Google Maps ----------

const MAPS_HOSTS = new Set([
  "google.com",
  "www.google.com",
  "maps.google.com",
  "google.nl",
  "www.google.nl",
  "maps.app.goo.gl",
  "goo.gl",
  "g.co",
]);

/**
 * Een door de gebruiker geplakte Google Maps-link, of "" als het geen (veilige) Google Maps-link is.
 * Geaccepteerd: google.com/maps/..., maps.google.com, maps.app.goo.gl/..., goo.gl/maps/... en g.co/kgs/...
 * Zonder "https://" erbij werkt ook; alles met een ander domein of protocol wordt geweigerd.
 */
export function normalizeMapsUrl(value: unknown): string {
  if (typeof value !== "string") return "";
  let v = value.trim();
  if (!v || v.length > 600) return "";
  if (!/^https?:\/\//i.test(v)) v = `https://${v}`;
  let u: URL;
  try {
    u = new URL(v);
  } catch {
    return "";
  }
  const host = u.hostname.toLowerCase();
  if (!MAPS_HOSTS.has(host)) return "";
  const ok =
    host === "maps.app.goo.gl" || host === "g.co" || host === "maps.google.com"
      ? true
      : host === "goo.gl"
        ? u.pathname.startsWith("/maps")
        : u.pathname.startsWith("/maps");
  if (!ok) return "";
  u.protocol = "https:";
  return u.toString();
}

/** De link achter de knop "Bekijk route": de ingevoerde Google Maps-link, anders een zoekopdracht op naam en plaats. */
export function mapsHref(mapsUrl: string | undefined, title: string, city: string) {
  const own = normalizeMapsUrl(mapsUrl);
  if (own) return own;
  return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent([title, city].filter(Boolean).join(" "))}`;
}
