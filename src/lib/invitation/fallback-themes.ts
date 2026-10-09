import { buildPalettes } from "./palettes";
import type { InvitationTheme } from "./types";

/**
 * Ingebouwde thema's. Ze worden gebruikt als Sanity (nog) niet is ingesteld of niet
 * bereikbaar is. De slugs zijn gelijk aan de documenten in sanity/seed/themes.ndjson,
 * zodat een uitnodiging altijd naar hetzelfde thema blijft wijzen.
 */
type ThemeInput = Omit<InvitationTheme, "palettes">;

const THEMES: ThemeInput[] = [
  {
    slug: "creme-taupe",
    title: "Crème & Taupe",
    description: "Rustig en editorial: warme crèmetinten met een donkere afsluiting.",
    colors: {
      background: "#f4f0ea",
      surface: "#faf8f4",
      surfaceAlt: "#e8e0d4",
      text: "#2d2a26",
      muted: "#7a746b",
      line: "#d9d2c7",
      accent: "#a89880",
      buttonBackground: "#3a3733",
      buttonText: "#f4f0ea",
      footerBackground: "#3a3733",
      footerText: "#f4f0ea",
      envelope: "#e4dccf",
      envelopeCard: "#faf8f4",
    },
    headingFont: "Cormorant Garamond",
    bodyFont: "Inter",
    scriptFont: "Great Vibes",
    buttonShape: "pill",
    style: "classic",
  },
  {
    slug: "bosgroen-blush",
    title: "Bosgroen & Blush",
    description: "Botanisch en warm: saliegroen, bosgroen en een vleugje blush.",
    colors: {
      background: "#f7f2ec",
      surface: "#fbf9f6",
      surfaceAlt: "#dde1d6",
      text: "#1f2420",
      muted: "#6f776f",
      line: "#cfd5c8",
      accent: "#b57f6b",
      buttonBackground: "#3a483c",
      buttonText: "#fbf9f6",
      footerBackground: "#2c382f",
      footerText: "#f1ded4",
      envelope: "#3a483c",
      envelopeCard: "#f1ded4",
    },
    headingFont: "Playfair Display",
    bodyFont: "DM Sans",
    scriptFont: "Great Vibes",
    buttonShape: "rounded",
    style: "classic",
  },
  {
    slug: "nature",
    title: "Nature",
    description:
      "Zacht en natuurlijk: papieren textuur met gescheurde randen, olijfgroen, botanische lijntekeningen en sierlijk handschrift.",
    colors: {
      background: "#f3eee5",
      surface: "#f8f4ec",
      surfaceAlt: "#d9e0e5",
      text: "#4a4f3d",
      muted: "#7b7d6a",
      line: "#dcd5c5",
      accent: "#8a9069",
      buttonBackground: "#6e7755",
      buttonText: "#f8f4ec",
      footerBackground: "#e7e0d1",
      footerText: "#4a4f3d",
      envelope: "#79835c",
      envelopeCard: "#f8f4ec",
    },
    headingFont: "Cormorant Garamond",
    bodyFont: "EB Garamond",
    scriptFont: "Great Vibes",
    buttonShape: "pill",
    style: "nature",
  },
];

export const FALLBACK_THEMES: InvitationTheme[] = THEMES.map((t) => ({
  ...t,
  palettes: buildPalettes(t.slug, t.colors),
}));
