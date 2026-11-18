import type { Metadata } from "next";
import { HomeContent } from "@/components/landing/home-content";

export const metadata: Metadata = {
  title: "Proost Mee — Digitale bruiloftsuitnodigingen en RSVP",
  description:
    "Ontwerp jullie digitale bruiloftsuitnodiging, beheer de gastenlijst en volg alle RSVP's op één rustige plek.",
};

export default function Home() {
  return <HomeContent />;
}
