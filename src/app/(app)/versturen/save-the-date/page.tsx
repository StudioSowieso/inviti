import type { Metadata } from "next";
import { SoonPage } from "../soon-page";

export const metadata: Metadata = { title: "Save the Date versturen — Inviti" };

export default function SaveTheDatePage() {
  return <SoonPage title="Save the Date versturen" text="Hier kun je straks je Save the Date naar je gasten sturen, voordat de uitnodiging volgt." />;
}
