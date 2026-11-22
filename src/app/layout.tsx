import type { Metadata, Viewport } from "next";
import { Caveat, Cormorant_Garamond, Figtree, Jost, Outfit } from "next/font/google";
import "./globals.css";

const cormorant = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  variable: "--font-cormorant",
});

const caveat = Caveat({
  subsets: ["latin"],
  weight: ["500"],
  variable: "--font-caveat",
});

const figtree = Figtree({
  subsets: ["latin"],
  weight: ["400", "600"],
  variable: "--font-figtree",
});

const outfit = Outfit({
  subsets: ["latin"],
  variable: "--font-outfit",
});

const jost = Jost({
  subsets: ["latin"],
  variable: "--font-jost",
});

export const metadata: Metadata = {
  title: "Proost Mee — Jullie bruiloft, mooi geregeld",
  description: "Verstuur online bruiloftsuitnodigingen en houd RSVP's bij.",
};

export const viewport: Viewport = {
  themeColor: "#f4f0ea",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="nl" className={`${cormorant.variable} ${jost.variable} ${caveat.variable} ${outfit.variable} ${figtree.variable}`}>
      <body className="min-h-dvh">{children}</body>
    </html>
  );
}
