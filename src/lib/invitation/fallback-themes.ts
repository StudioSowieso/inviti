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
    title: "Basic",
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
  {
    slug: "leaf",
    title: "Leaf",
    description:
      "Elegant en rustig: ivoor met olijfgroen, een boogvormige foto, dunne lijnen en sierlijke takjes.",
    colors: {
      background: "#f7f3ec",
      surface: "#fbf8f2",
      surfaceAlt: "#dde3e2",
      text: "#3f4635",
      muted: "#7c8068",
      line: "#ded7c8",
      accent: "#7d8660",
      buttonBackground: "#7b8460",
      buttonText: "#fbf8f2",
      footerBackground: "#ece6d8",
      footerText: "#3f4635",
      envelope: "#8c9774",
      envelopeCard: "#fbf8f2",
    },
    headingFont: "Cormorant Garamond",
    bodyFont: "EB Garamond",
    scriptFont: "Pinyon Script",
    buttonShape: "pill",
    style: "leaf",
  },
];

export const FALLBACK_THEMES: InvitationTheme[] = THEMES.map((t) => ({
  ...t,
  palettes: buildPalettes(t.slug, t.colors),
}));
