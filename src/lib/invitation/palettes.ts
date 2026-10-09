import type { InvitationTheme, ThemeColors, ThemePalette } from "./types";

/** Slug van de originele kleuren van een thema. */
export const DEFAULT_PALETTE = "standaard";

type PaletteDef = { slug: string; title: string; colors: Partial<ThemeColors> };

/**
 * Handgekozen kleuropties per thema. De eerste optie ("Standaard") zijn altijd de kleuren van het
 * thema zelf (uit Sanity); de andere twee overschrijven alleen de kleuren die hier staan.
 * Elk palet is een complete set: achtergrond, vlakken, tekst, accent, knop, afsluiting en envelop
 * horen bij elkaar, zodat een kleurkeuze het hele thema meeneemt.
 */
const EXTRA_PALETTES: Record<string, PaletteDef[]> = {
  "creme-taupe": [
    {
      slug: "salie",
      title: "Salie",
      colors: {
        background: "#f1f2ea",
        surface: "#f8f9f3",
        surfaceAlt: "#dfe4d6",
        text: "#262b24",
        muted: "#727a6c",
        line: "#d3d9c8",
        accent: "#8f9c78",
        buttonBackground: "#3d4a38",
        buttonText: "#f1f2ea",
        footerBackground: "#3d4a38",
        footerText: "#f1f2ea",
        envelope: "#d9dfcb",
        envelopeCard: "#f8f9f3",
      },
    },
    {
      slug: "terracotta",
      title: "Terracotta",
      colors: {
        background: "#f6eee8",
        surface: "#fbf6f1",
        surfaceAlt: "#ecd8cb",
        text: "#33261f",
        muted: "#85705f",
        line: "#e2cfc2",
        accent: "#b9694a",
        buttonBackground: "#6b3a28",
        buttonText: "#f6eee8",
        footerBackground: "#6b3a28",
        footerText: "#f6eee8",
        envelope: "#e8cdbc",
        envelopeCard: "#fbf6f1",
      },
    },
  ],
  sweet: [
    {
      slug: "roze",
      title: "Roze",
      colors: {
        background: "#f0dcdc",
        surface: "#ffffff",
        surfaceAlt: "#f5e4e4",
        text: "#5a3b40",
        muted: "#97787d",
        line: "#ecd8d8",
        accent: "#b2616e",
        buttonBackground: "#a45866",
        buttonText: "#ffffff",
        footerBackground: "#a45866",
        footerText: "#fbeeee",
        envelope: "#f0d3d5",
        envelopeCard: "#ffffff",
      },
    },
    {
      slug: "boter",
      title: "Boter",
      colors: {
        background: "#f1e8c9",
        surface: "#ffffff",
        surfaceAlt: "#f5eed6",
        text: "#55492b",
        muted: "#8e8362",
        line: "#e9e0c1",
        accent: "#a78d2c",
        buttonBackground: "#8d7a2c",
        buttonText: "#ffffff",
        footerBackground: "#8d7a2c",
        footerText: "#fbf6e3",
        envelope: "#ebdfb3",
        envelopeCard: "#ffffff",
      },
    },
  ],
  lemon: [
    {
      slug: "sorbet",
      title: "Sorbet",
      colors: {
        background: "#e8f0d2",
        surface: "#fbfbf1",
        surfaceAlt: "#eaf1ea",
        text: "#3d4e46",
        muted: "#86928b",
        line: "#d3e0d6",
        accent: "#d99a1c",
        buttonBackground: "#5f9f84",
        buttonText: "#ffffff",
        footerBackground: "#5f9f84",
        footerText: "#fbf8e6",
        envelope: "#dde8c0",
        envelopeCard: "#fbfbf1",
      },
    },
    {
      slug: "perzik",
      title: "Perzik",
      colors: {
        background: "#f9e3d0",
        surface: "#fdf8f0",
        surfaceAlt: "#f6ebe3",
        text: "#5a4038",
        muted: "#99807a",
        line: "#ecd8cb",
        accent: "#d2641f",
        buttonBackground: "#df8a68",
        buttonText: "#ffffff",
        footerBackground: "#df8a68",
        footerText: "#fff6ea",
        envelope: "#f3cdb2",
        envelopeCard: "#fdf8f0",
      },
    },
  ],
  modern: [
    {
      slug: "zand",
      title: "Zand",
      colors: {
        background: "#e3d8c7",
        surface: "#fdfbf7",
        surfaceAlt: "#efe6d8",
        text: "#2a2520",
        muted: "#8a7f70",
        line: "#e4dccd",
        accent: "#a58f70",
        buttonBackground: "#3b3128",
        buttonText: "#fdfbf7",
        footerBackground: "#3b3128",
        footerText: "#f4ece0",
        envelope: "#b39d80",
        envelopeCard: "#fdfbf7",
      },
    },
    {
      slug: "leisteen",
      title: "Leisteen",
      colors: {
        background: "#cfd4d8",
        surface: "#f9fafb",
        surfaceAlt: "#e4e8eb",
        text: "#1b2227",
        muted: "#6d777e",
        line: "#d9dee1",
        accent: "#7d8c96",
        buttonBackground: "#1f2b33",
        buttonText: "#f9fafb",
        footerBackground: "#1f2b33",
        footerText: "#e8edf0",
        envelope: "#2d3b45",
        envelopeCard: "#f9fafb",
      },
    },
  ],
  leaf: [
    {
      slug: "eucalyptus",
      title: "Eucalyptus",
      colors: {
        background: "#f1f4f2",
        surface: "#f7f9f7",
        surfaceAlt: "#d8e3e1",
        text: "#33423f",
        muted: "#6d7f7a",
        line: "#d0dbd7",
        accent: "#5f8a82",
        buttonBackground: "#557972",
        buttonText: "#f7f9f7",
        footerBackground: "#e0e9e6",
        footerText: "#33423f",
        envelope: "#7ea39b",
        envelopeCard: "#f7f9f7",
      },
    },
    {
      slug: "champagne",
      title: "Champagne",
      colors: {
        background: "#f8f3ea",
        surface: "#fcf8f0",
        surfaceAlt: "#e9e0cf",
        text: "#463d2c",
        muted: "#8a7e66",
        line: "#e3d9c3",
        accent: "#a68b55",
        buttonBackground: "#9a8051",
        buttonText: "#fcf8f0",
        footerBackground: "#eee4d0",
        footerText: "#463d2c",
        envelope: "#b19b6a",
        envelopeCard: "#fcf8f0",
      },
    },
  ],
  nature: [
    {
      slug: "blush",
      title: "Blush",
      colors: {
        background: "#f6ede8",
        surface: "#fbf5f0",
        surfaceAlt: "#e6d3d2",
        text: "#4f403d",
        muted: "#8a7571",
        line: "#e3d2c9",
        accent: "#b48078",
        buttonBackground: "#9a6a63",
        buttonText: "#fbf5f0",
        footerBackground: "#ecdcd2",
        footerText: "#4f403d",
        envelope: "#b08a82",
        envelopeCard: "#fbf5f0",
      },
    },
    {
      slug: "blauw",
      title: "Lucht",
      colors: {
        background: "#eff0ec",
        surface: "#f5f6f2",
        surfaceAlt: "#d3dde6",
        text: "#3c4651",
        muted: "#6f7b87",
        line: "#d3d8d4",
        accent: "#7b93a8",
        buttonBackground: "#5f7890",
        buttonText: "#f5f6f2",
        footerBackground: "#dfe3e0",
        footerText: "#3c4651",
        envelope: "#7790a6",
        envelopeCard: "#f5f6f2",
      },
    },
  ],
};

// ---------- Automatische varianten voor thema's die geen handgekozen paletten hebben ----------

function hexToRgb(hex: string): [number, number, number] {
  let h = hex.replace("#", "");
  if (h.length === 3) h = h.split("").map((c) => c + c).join("");
  const n = parseInt(h, 16);
  return [(n >> 16) & 255, (n >> 8) & 255, n & 255];
}

function rgbToHex(r: number, g: number, b: number) {
  const to = (v: number) => Math.max(0, Math.min(255, Math.round(v))).toString(16).padStart(2, "0");
  return `#${to(r)}${to(g)}${to(b)}`;
}

function rotateHue(hex: string, degrees: number) {
  const [r0, g0, b0] = hexToRgb(hex).map((v) => v / 255);
  const max = Math.max(r0, g0, b0);
  const min = Math.min(r0, g0, b0);
  const l = (max + min) / 2;
  const d = max - min;
  if (d === 0) return hex;
  const s = d / (1 - Math.abs(2 * l - 1));
  let h =
    max === r0 ? ((g0 - b0) / d) % 6 : max === g0 ? (b0 - r0) / d + 2 : (r0 - g0) / d + 4;
  h = (h * 60 + degrees + 360) % 360;
  const c = (1 - Math.abs(2 * l - 1)) * s;
  const x = c * (1 - Math.abs(((h / 60) % 2) - 1));
  const m = l - c / 2;
  const [r, g, b] =
    h < 60 ? [c, x, 0] : h < 120 ? [x, c, 0] : h < 180 ? [0, c, x] : h < 240 ? [0, x, c] : h < 300 ? [x, 0, c] : [c, 0, x];
  return rgbToHex((r + m) * 255, (g + m) * 255, (b + m) * 255);
}

function shifted(colors: ThemeColors, degrees: number): ThemeColors {
  const out = { ...colors };
  for (const key of Object.keys(colors) as (keyof ThemeColors)[]) out[key] = rotateHue(colors[key], degrees);
  return out;
}

/** De drie kleuropties van een thema; de eerste is altijd het thema zelf. */
export function buildPalettes(slug: string, colors: ThemeColors): ThemePalette[] {
  const base: ThemePalette = { slug: DEFAULT_PALETTE, title: "Standaard", colors };
  const extra = EXTRA_PALETTES[slug];
  if (extra) {
    return [base, ...extra.map((p) => ({ slug: p.slug, title: p.title, colors: { ...colors, ...p.colors } }))];
  }
  return [
    base,
    { slug: "warm", title: "Warm", colors: shifted(colors, -45) },
    { slug: "koel", title: "Koel", colors: shifted(colors, 60) },
  ];
}

/** Het thema met de gekozen kleuroptie; een onbekende of lege keuze geeft de standaardkleuren. */
export function applyPalette(theme: InvitationTheme, paletteSlug: string | null | undefined): InvitationTheme {
  const palette = theme.palettes.find((p) => p.slug === paletteSlug) ?? theme.palettes[0];
  return palette ? { ...theme, colors: palette.colors } : theme;
}

/** Houdt de keuze alleen als het thema die kleuroptie heeft. */
export function validPalette(theme: InvitationTheme, paletteSlug: string | null | undefined) {
  return theme.palettes.some((p) => p.slug === paletteSlug) ? (paletteSlug as string) : DEFAULT_PALETTE;
}
