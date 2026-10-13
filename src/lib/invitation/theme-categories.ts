import type { InvitationTheme } from "./types";

/**
 * Categorieën waarin de thema's in het scherm "Uitnodiging maken" worden getoond.
 * Een thema mag in meerdere categorieën staan. De volgorde van de slugs is de volgorde op het scherm.
 * Slugs die niet bestaan (bijvoorbeeld omdat een thema in Sanity op inactief staat) worden overgeslagen.
 */
export type ThemeCategory = { id: string; title: string; slugs: string[] };

export const THEME_CATEGORIES: ThemeCategory[] = [
  { id: "meest-gekozen", title: "Meest gekozen", slugs: ["leaf", "sweet", "creme-taupe"] },
  { id: "modern", title: "Modern", slugs: ["modern", "creme-taupe"] },
  { id: "kleurrijk", title: "Kleurrijk", slugs: ["sweet", "sunset", "lemon"] },
  { id: "natuur", title: "Natuur", slugs: ["nature", "leaf", "flowers"] },
  { id: "feestelijk", title: "Feestelijk", slugs: ["bourgondisch"] },
];

/** Categorie die bij het openen van het scherm openstaat. */
export const DEFAULT_OPEN_CATEGORY = "meest-gekozen";

/** Categorie voor thema's (bijvoorbeeld nieuw in Sanity) die in geen enkele categorie hierboven staan. */
const OTHER_CATEGORY = { id: "overig", title: "Overige thema's" };

export type ThemeGroup = { id: string; title: string; themes: InvitationTheme[] };

export function groupThemes(themes: InvitationTheme[]): ThemeGroup[] {
  const bySlug = new Map(themes.map((t) => [t.slug, t]));
  const groups: ThemeGroup[] = THEME_CATEGORIES.map((c) => ({
    id: c.id,
    title: c.title,
    themes: c.slugs.map((s) => bySlug.get(s)).filter((t): t is InvitationTheme => !!t),
  })).filter((g) => g.themes.length > 0);

  // Een nieuw thema mag nooit verdwijnen omdat het nog geen categorie heeft.
  const used = new Set(THEME_CATEGORIES.flatMap((c) => c.slugs));
  const other = themes.filter((t) => !used.has(t.slug));
  if (other.length > 0) groups.push({ ...OTHER_CATEGORY, themes: other });

  return groups;
}
