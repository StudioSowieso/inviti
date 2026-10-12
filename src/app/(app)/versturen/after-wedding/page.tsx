import type { Metadata } from "next";
import { SoonPage } from "../soon-page";

export const metadata: Metadata = { title: "After Wedding versturen — Inviti" };

export default function AfterWeddingPage() {
  return <SoonPage title="After Wedding versturen" text="Hier kun je straks een bedankbericht of herinnering naar je gasten sturen na de bruiloft." />;
}
