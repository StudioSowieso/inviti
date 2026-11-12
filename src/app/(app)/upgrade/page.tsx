import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { CheckIcon } from "@/components/icons";
import { getHasPaid } from "@/lib/billing";
import { PRICE_LABEL } from "@/lib/stripe";

export const metadata: Metadata = { title: "Volledige versie — Inviti" };

const POINTS = [
  "Verstuur de persoonlijke uitnodiging aan al je gasten",
  "Via WhatsApp, e-mail of een link per groep",
  "RSVP's komen automatisch binnen",
  "Eenmalig, geen abonnement",
];

export default async function UpgradePage() {
  if (await getHasPaid()) redirect("/versturen");

  return (
    <div className="mx-auto mt-6 max-w-xl">
      <div className="card p-8 sm:p-10">
        <p className="eyebrow text-clay">Je zit in de testomgeving</p>
        <h1 className="mt-3 font-serif text-4xl leading-tight font-medium">Klaar om te versturen?</h1>
        <p className="mt-3 text-[0.95rem] leading-relaxed text-muted">
          In de testomgeving kun je alles uitproberen: je uitnodiging ontwerpen, je gastenlijst opbouwen en je to-do’s
          bijhouden. Voor het versturen zelf heb je de volledige versie nodig.
        </p>
        <ul className="mt-6 space-y-3 text-sm">
          {POINTS.map((t) => (
            <li key={t} className="flex items-center gap-3">
              <span className="grid size-6 place-items-center rounded-full bg-sage text-forest">
                <CheckIcon width={13} height={13} />
              </span>
              {t}
            </li>
          ))}
        </ul>
        <div className="mt-8 flex flex-wrap items-center gap-4">
          {/* Gewone link: de pagina maakt per bezoek een betaalsessie aan, dus niet vooraf laden. */}
          <a href="/afrekenen" className="btn-primary">Direct kopen · {PRICE_LABEL}</a>
          <Link href="/dashboard" className="text-sm text-muted underline-offset-4 hover:underline">
            Verder in de testomgeving
          </Link>
        </div>
        <p className="mt-5 text-xs text-muted">Veilig betalen via Stripe, onder andere met iDEAL en creditcard.</p>
      </div>
    </div>
  );
}
