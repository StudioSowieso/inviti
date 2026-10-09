import { FALLBACK_THEMES } from "./fallback-themes";
import { buildPalettes } from "./palettes";
import { DEFAULT_BODY_FONT, DEFAULT_HEADING_FONT, DEFAULT_SCRIPT_FONT, resolveFont } from "./fonts";
import type { ButtonShape, InvitationTheme, ThemeColors, ThemeStyle } from "./types";

export const THEMES_TAG = "sanity-themes";

const HEX = /^#(?:[0-9a-f]{3}|[0-9a-f]{6})$/i;
const SHAPES: ButtonShape[] = ["pill", "rounded", "square"];
const STYLES: ThemeStyle[] = ["classic", "nature", "leaf", "modern", "sweet"];

const QUERY = `*[_type == "invitationTheme" && active != false] | order(order asc, title asc){
  "slug": slug.current,
  title,
  description,
  colors,
  headingFont,
  bodyFont,
  scriptFont,
  buttonShape,
  style
}`;

function sanityConfig() {
  const projectId = process.env.SANITY_PROJECT_ID;
  if (!projectId) return null;
  const perspective = process.env.SANITY_PERSPECTIVE === "drafts" ? "drafts" : "published";
  return {
    projectId,
    dataset: process.env.SANITY_DATASET || "production",
    token: process.env.SANITY_API_READ_TOKEN,
    perspective,
  } as const;
}

/** Vult ontbrekende of ongeldige velden uit Sanity aan met die van het eerste fallback-thema. */
function normalizeTheme(raw: unknown): InvitationTheme | null {
  if (typeof raw !== "object" || raw === null) return null;
  const r = raw as Record<string, unknown>;
  if (typeof r.slug !== "string" || !r.slug) return null;

  const base = FALLBACK_THEMES[0];
  const rawColors = (typeof r.colors === "object" && r.colors !== null ? r.colors : {}) as Record<string, unknown>;
  const colors = { ...base.colors };
  for (const key of Object.keys(base.colors) as (keyof ThemeColors)[]) {
    const v = rawColors[key];
    if (typeof v === "string" && HEX.test(v.trim())) colors[key] = v.trim();
  }

  return {
    slug: r.slug,
    title: typeof r.title === "string" && r.title ? r.title : r.slug,
    description: typeof r.description === "string" ? r.description : "",
    colors,
    palettes: buildPalettes(r.slug, colors),
    headingFont: resolveFont(typeof r.headingFont === "string" ? r.headingFont : "", DEFAULT_HEADING_FONT),
    bodyFont: resolveFont(typeof r.bodyFont === "string" ? r.bodyFont : "", DEFAULT_BODY_FONT),
    scriptFont: resolveFont(typeof r.scriptFont === "string" ? r.scriptFont : "", DEFAULT_SCRIPT_FONT),
    buttonShape: SHAPES.includes(r.buttonShape as ButtonShape) ? (r.buttonShape as ButtonShape) : "pill",
    // Bestaande thema's in Sanity hebben nog geen stijl: die blijven "classic".
    style: STYLES.includes(r.style as ThemeStyle) ? (r.style as ThemeStyle) : "classic",
  };
}

export type ThemeResult = {
  themes: InvitationTheme[];
  source: "sanity" | "fallback";
  /** Korte reden waarom de fallback is gebruikt (bevat geen geheimen). */
  reason?: string;
};

/**
 * Haalt de thema's op uit Sanity, los van releases van Inviti.
 * - Productie leest alleen gepubliceerde thema's (gecached, ververst via webhook of na 1 uur).
 * - Preview (SANITY_PERSPECTIVE=drafts + token) leest ook onbewerkte concepten, zonder cache.
 * Zonder Sanity-instellingen of bij een fout worden de ingebouwde thema's gebruikt.
 */
export async function getThemes(): Promise<ThemeResult> {
  const cfg = sanityConfig();
  if (!cfg) return { themes: FALLBACK_THEMES, source: "fallback", reason: "SANITY_PROJECT_ID ontbreekt in deze omgeving" };

  const host = cfg.perspective === "drafts" || cfg.token ? "api" : "apicdn";
  const url =
    `https://${cfg.projectId}.${host}.sanity.io/v2025-02-19/data/query/${cfg.dataset}` +
    `?query=${encodeURIComponent(QUERY)}&perspective=${cfg.perspective}`;

  try {
    const res = await fetch(url, {
      headers: cfg.token ? { Authorization: `Bearer ${cfg.token}` } : undefined,
      signal: AbortSignal.timeout(5000),
      ...(cfg.perspective === "drafts"
        ? { cache: "no-store" as const }
        : {
            // Productie: 1 uur (of direct via de webhook). Preview en lokaal: 10 seconden, zodat nieuwe
            // of aangepaste thema's in Sanity vrijwel meteen zichtbaar zijn.
            next: { revalidate: process.env.VERCEL_ENV === "production" ? 3600 : 10, tags: [THEMES_TAG] },
          }),
    });
    if (!res.ok) throw new Error(`Sanity antwoordde met ${res.status}`);
    const json = (await res.json()) as { result?: unknown[] };
    const themes = (json.result ?? []).map(normalizeTheme).filter((t): t is InvitationTheme => t !== null);
    if (themes.length === 0) throw new Error("Geen thema's gevonden in Sanity");
    return { themes, source: "sanity" };
  } catch (err) {
    console.error("[themes] Sanity niet beschikbaar, fallback-thema's gebruikt:", err);
    const reason = err instanceof Error ? err.message : "onbekende fout";
    return { themes: FALLBACK_THEMES, source: "fallback", reason: reason.slice(0, 120) };
  }
}

export function pickTheme(themes: InvitationTheme[], slug: string | null | undefined) {
  return themes.find((t) => t.slug === slug) ?? themes[0];
}
