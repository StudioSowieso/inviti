import { FALLBACK_THEMES } from "./fallback-themes";
import { DEFAULT_BODY_FONT, DEFAULT_HEADING_FONT, resolveFont } from "./fonts";
import type { ButtonShape, InvitationTheme, ThemeColors } from "./types";

export const THEMES_TAG = "sanity-themes";

const HEX = /^#(?:[0-9a-f]{3}|[0-9a-f]{6})$/i;
const SHAPES: ButtonShape[] = ["pill", "rounded", "square"];

const QUERY = `*[_type == "invitationTheme" && active != false] | order(order asc, title asc){
  "slug": slug.current,
  title,
  description,
  colors,
  headingFont,
  bodyFont,
  buttonShape
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
    headingFont: resolveFont(typeof r.headingFont === "string" ? r.headingFont : "", DEFAULT_HEADING_FONT),
    bodyFont: resolveFont(typeof r.bodyFont === "string" ? r.bodyFont : "", DEFAULT_BODY_FONT),
    buttonShape: SHAPES.includes(r.buttonShape as ButtonShape) ? (r.buttonShape as ButtonShape) : "pill",
  };
}

export type ThemeResult = { themes: InvitationTheme[]; source: "sanity" | "fallback" };

/**
 * Haalt de thema's op uit Sanity, los van releases van Inviti.
 * - Productie leest alleen gepubliceerde thema's (gecached, ververst via webhook of na 1 uur).
 * - Preview (SANITY_PERSPECTIVE=drafts + token) leest ook onbewerkte concepten, zonder cache.
 * Zonder Sanity-instellingen of bij een fout worden de ingebouwde thema's gebruikt.
 */
export async function getThemes(): Promise<ThemeResult> {
  const cfg = sanityConfig();
  if (!cfg) return { themes: FALLBACK_THEMES, source: "fallback" };

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
        : { next: { revalidate: 3600, tags: [THEMES_TAG] } }),
    });
    if (!res.ok) throw new Error(`Sanity antwoordde met ${res.status}`);
    const json = (await res.json()) as { result?: unknown[] };
    const themes = (json.result ?? []).map(normalizeTheme).filter((t): t is InvitationTheme => t !== null);
    if (themes.length === 0) throw new Error("Geen thema's gevonden in Sanity");
    return { themes, source: "sanity" };
  } catch (err) {
    console.error("[themes] Sanity niet beschikbaar, fallback-thema's gebruikt:", err);
    return { themes: FALLBACK_THEMES, source: "fallback" };
  }
}

export function pickTheme(themes: InvitationTheme[], slug: string | null | undefined) {
  return themes.find((t) => t.slug === slug) ?? themes[0];
}
