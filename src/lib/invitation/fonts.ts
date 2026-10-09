import type { InvitationTheme } from "./types";

/**
 * Lettertypes die een thema mag gebruiken. De namen komen overeen met de keuzelijsten in
 * het Sanity-schema (sanity/schemaTypes/invitationTheme.ts). Een onbekende naam valt
 * terug op de standaardfont, zodat een typefout in Sanity de uitnodiging niet breekt.
 */
export const FONT_CATALOG: Record<string, { css2: string; kind: "serif" | "sans" | "script" }> = {
  "Cormorant Garamond": { css2: "Cormorant+Garamond:ital,wght@0,400;0,500;0,600;1,400;1,500", kind: "serif" },
  "Playfair Display": { css2: "Playfair+Display:ital,wght@0,400;0,500;0,600;1,400", kind: "serif" },
  Lora: { css2: "Lora:ital,wght@0,400;0,500;0,600;1,400", kind: "serif" },
  "DM Serif Display": { css2: "DM+Serif+Display:ital@0;1", kind: "serif" },
  "EB Garamond": { css2: "EB+Garamond:ital,wght@0,400;0,500;0,600;1,400", kind: "serif" },
  Italiana: { css2: "Italiana", kind: "serif" },
  Gloock: { css2: "Gloock", kind: "serif" },
  Inter: { css2: "Inter:wght@400;500;600", kind: "sans" },
  "Josefin Sans": { css2: "Josefin+Sans:wght@300;400;600", kind: "sans" },
  Jost: { css2: "Jost:wght@400;500;600", kind: "sans" },
  "DM Sans": { css2: "DM+Sans:wght@400;500;600", kind: "sans" },
  Manrope: { css2: "Manrope:wght@400;500;600", kind: "sans" },
  "Great Vibes": { css2: "Great+Vibes", kind: "script" },
  "Pinyon Script": { css2: "Pinyon+Script", kind: "script" },
  Allura: { css2: "Allura", kind: "script" },
  "Mrs Saint Delafield": { css2: "Mrs+Saint+Delafield", kind: "script" },
};

export const DEFAULT_HEADING_FONT = "Cormorant Garamond";
export const DEFAULT_BODY_FONT = "Inter";
export const DEFAULT_SCRIPT_FONT = "Great Vibes";

export function resolveFont(name: string, fallback: string) {
  return name in FONT_CATALOG ? name : fallback;
}

export function fontStack(name: string) {
  const f = FONT_CATALOG[name];
  const generic =
    f?.kind === "serif"
      ? "Georgia, 'Times New Roman', serif"
      : f?.kind === "script"
        ? "'Snell Roundhand', cursive"
        : "ui-sans-serif, system-ui, sans-serif";
  return `"${name}", ${generic}`;
}

export function googleFontsHref(...names: string[]) {
  const families = Array.from(new Set(names))
    .filter((n) => n in FONT_CATALOG)
    .map((n) => `family=${FONT_CATALOG[n].css2}`);
  return `https://fonts.googleapis.com/css2?${families.join("&")}&display=swap`;
}

/** De lettertypes die een thema echt gebruikt (het scriptlettertype alleen bij de stijlen "nature", "leaf", "modern" en "sweet"). */
export function themeFonts(theme: InvitationTheme) {
  return [theme.headingFont, theme.bodyFont, ...(theme.style !== "classic" ? [theme.scriptFont] : [])];
}
