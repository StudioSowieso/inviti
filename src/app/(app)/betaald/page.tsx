import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { fulfilSession, getHasPaid } from "@/lib/billing";
import { logError } from "@/lib/log-error";
import { retrieveSession } from "@/lib/stripe";
import { getUser } from "@/lib/supabase/server";

export const metadata: Metadata = { title: "Betaling — Proost Mee" };
export const dynamic = "force-dynamic";

/** Stripe stuurt de klant hierheen na de betaling. We controleren de sessie bij Stripe zelf; de URL alleen is nooit genoeg. */
export default async function PaidPage({ searchParams }: { searchParams: Promise<{ session_id?: string }> }) {
  const { session_id } = await searchParams;
  const user = await getUser();
  if (!user) redirect("/inloggen");
  if (await getHasPaid()) redirect("/dashboard?betaald=1");

  let state: "pending" | "failed" = "failed";
  if (session_id && /^cs_(test|live)_[A-Za-z0-9]+$/.test(session_id)) {
    try {
      const s = await retrieveSession(session_id);
      if (s.client_reference_id === user.id) {
        if (s.payment_status === "paid") {
          const r = await fulfilSession(s);
          if (r.ok) redirect("/dashboard?betaald=1");
          await logError("fulfil", `Betaling niet verwerkt: ${r.reason}`, { detail: { session: s.id } });
        } else if (s.status === "complete") {
          state = "pending"; // bijvoorbeeld iDEAL dat nog bevestigd moet worden
        }
      }
    } catch (e) {
      if (e && typeof e === "object" && "digest" in e) throw e; // redirect() doorlaten
      await logError("betaald", e instanceof Error ? e.message : "Onbekende fout");
    }
  }

  return (
    <div className="card mx-auto mt-10 max-w-lg p-8 text-center">
      <h1 className="font-serif text-3xl font-medium">
        {state === "pending" ? "We wachten op je bank" : "Betaling niet bevestigd"}
      </h1>
      <p className="mt-3 text-sm leading-relaxed text-muted">
        {state === "pending"
          ? "Je betaling is gestart maar nog niet bevestigd. Zodra die binnen is, wordt Uitnodiging versturen automatisch geopend. Ververs deze pagina over een paar minuten."
          : "We konden je betaling niet bevestigen. Is er geld afgeschreven? Neem dan contact met ons op, dan zoeken we het uit."}
      </p>
      <div className="mt-6 flex justify-center gap-3">
        <Link href="/dashboard" className="btn-primary">Naar dashboard</Link>
        <Link href="/upgrade" className="rounded-full border border-line px-6 py-3 text-sm">Opnieuw betalen</Link>
      </div>
    </div>
  );
}
