import type { Metadata } from "next";
import { headers } from "next/headers";
import Link from "next/link";
import { redirect } from "next/navigation";
import { getHasPaid } from "@/lib/billing";
import { logError } from "@/lib/log-error";
import { billingAvailable, createCheckoutSession } from "@/lib/stripe";
import { getUser } from "@/lib/supabase/server";

export const metadata: Metadata = { title: "Afrekenen — Proost Mee" };
export const dynamic = "force-dynamic";

/** Maakt een Stripe-betaalpagina aan en stuurt de gebruiker erheen. */
export default async function CheckoutPage() {
  const user = await getUser();
  if (!user) redirect("/inloggen");
  if (await getHasPaid()) redirect("/versturen");

  let problem: string | null = null;
  let url: string | null = null;

  if (!billingAvailable()) {
    problem = "Betalen is op dit moment nog niet beschikbaar. Probeer het later opnieuw.";
  } else {
    const h = await headers();
    const host = h.get("x-forwarded-host") ?? h.get("host") ?? "localhost:3000";
    const proto = h.get("x-forwarded-proto") ?? (host.startsWith("localhost") ? "http" : "https");
    try {
      const session = await createCheckoutSession({ userId: user.id, email: user.email ?? null, origin: `${proto}://${host}` });
      url = session.url;
    } catch (e) {
      await logError("checkout", e instanceof Error ? e.message : "Onbekende Stripe-fout");
      problem = "De betaalpagina kon niet worden geopend. Probeer het opnieuw.";
    }
  }
  if (url) redirect(url);

  return (
    <div className="card mx-auto mt-10 max-w-lg p-8 text-center">
      <h1 className="font-serif text-3xl font-medium">Er ging iets mis</h1>
      <p className="mt-3 text-sm text-muted">{problem ?? "De betaalpagina kon niet worden geopend."}</p>
      <div className="mt-6 flex justify-center gap-3">
        <a href="/afrekenen" className="btn-primary">Opnieuw proberen</a>
        <Link href="/dashboard" className="rounded-full border border-line px-6 py-3 text-sm">Naar dashboard</Link>
      </div>
    </div>
  );
}
