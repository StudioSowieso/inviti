import type { Metadata } from "next";
import { HomeContent } from "@/components/landing/home-content";

export const metadata: Metadata = {
  title: "Proost Mee — Digitale bruiloftsuitnodigingen en RSVP",
  robots: { index: false },
};

/** Tweede uitvoering van de voorkant in bordeaux, roze en oranje. */
export default function KleurHome() {
  return <HomeContent brand="wine" />;
}
