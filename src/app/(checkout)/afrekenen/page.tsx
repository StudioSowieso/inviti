import type { Metadata } from "next";
import { headers } from "next/headers";
import Link from "next/link";
import { redirect } from "next/navigation";
import { EmbeddedCheckoutForm } from "@/components/embedded-checkout";
import { getHasPaid } from "@/lib/billing";
import { logError } from "@/lib/log-error";
import { billingAvailable, createCheckoutSession, publishableKey, PRICE_LABEL } from "@/lib/stripe";
import { getUser } from "@/lib/supabase/server";

export const metadata: Metadata = { title: "Afrekenen — Proost Mee" };
export const dynamic = "force-dynamic";

/** Maakt een Stripe-betaalsessie aan en toont het betaalformulier direct op deze pagina (ingebed). */
export default async function CheckoutPage() {
  const user = await getUser();
  if (!user) redirect("/inloggen");
  if (await getHasPaid()) redirect("/versturen");

  let problem: string | null = null;
  let clientSecret: string | null = null;
  const pk = publishableKey();

  if (!billingAvailable()) {
    problem = "Betalen is op dit moment nog niet beschikbaar. Probeer het later opnieuw.";
  } else if (!pk) {
    await logError("checkout", "STRIPE_PUBLISHABLE_KEY ontbreekt of hoort niet bij de geheime sleutel");
    problem = "Het betaalformulier is op dit moment niet beschikbaar. Probeer het later opnieuw.";
  } else {
    const h = await headers();
    const host = h.get("x-forwarded-host") ?? h.get("host") ?? "localhost:3000";
    const proto = h.get("x-forwarded-proto") ?? (host.startsWith("localhost") ? "http" : "https");
    try {
      const session = await createCheckoutSession({ userId: user.id, email: user.email ?? null, origin: `${proto}://${host}` });
      clientSecret = session.client_secret ?? null;
      if (!clientSecret) throw new Error("Stripe gaf geen client_secret terug");
    } catch (e) {
      await logError("checkout", e instanceof Error ? e.message : "Onbekende Stripe-fout");
      problem = "De betaalpagina kon niet worden geopend. Probeer het opnieuw.";
    }
  }

  if (!pk || !clientSecret) {
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

  return (
    <div className="mx-auto mt-6 max-w-2xl">
      <Link href="/upgrade" className="text-sm text-muted underline-offset-4 hover:underline">
        ← Terug
      </Link>
      <div className="card mt-4 p-6 sm:p-8">
        <p className="eyebrow text-clay">Afrekenen</p>
        <div className="mt-2 flex flex-wrap items-baseline justify-between gap-2">
          <h1 className="font-serif text-3xl leading-tight font-medium">Proost Mee — volledige versie</h1>
          <p className="font-serif text-3xl font-medium">{PRICE_LABEL}</p>
        </div>
        <p className="mt-2 text-sm text-muted">Eenmalig, geen abonnement. Verstuur de persoonlijke uitnodiging aan al je gasten.</p>
        <div className="mt-6">
          <EmbeddedCheckoutForm publishableKey={pk} clientSecret={clientSecret} />
        </div>
      </div>
    </div>
  );
}
