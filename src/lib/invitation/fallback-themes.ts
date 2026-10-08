import type { InvitationTheme } from "./types";

/**
 * Ingebouwde thema's. Ze worden gebruikt als Sanity (nog) niet is ingesteld of niet
 * bereikbaar is. De slugs zijn gelijk aan de documenten in sanity/seed/themes.ndjson,
 * zodat een uitnodiging altijd naar hetzelfde thema blijft wijzen.
 */
export const FALLBACK_THEMES: InvitationTheme[] = [
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
    buttonShape: "pill",
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
    buttonShape: "rounded",
  },
];
