import type { Metadata } from "next";
import { LegalList, LegalPage, LegalSection, MailLink } from "@/components/landing/legal-page";
import { COMPANY } from "@/lib/company";

export const metadata: Metadata = {
  title: "Privacyverklaring — Proost Mee",
  description: "Welke gegevens Proost mee verwerkt, waarom, met wie we ze delen en welke rechten je hebt.",
};

export default function PrivacyPage() {
  return (
    <LegalPage
      eyebrow="Privacy"
      title="Privacyverklaring"
      intro="Wat we van jou en je gasten bewaren, waarom, en wat je zelf kunt regelen."
    >
      <LegalSection title="1. Wie is verantwoordelijk">
        <p>
          {COMPANY.legalName} (handelsnaam {COMPANY.tradeName}), {COMPANY.street}, {COMPANY.postalCode} {COMPANY.city}.
          KvK-nummer {COMPANY.kvk}. Vragen over privacy? Mail naar <MailLink email={COMPANY.email} />.
        </p>
        <p>
          Voor de gegevens van je account en je betaling zijn wij de verantwoordelijke. Voor de gegevens van je gasten
          ben jij de verantwoordelijke en verwerken wij ze in jouw opdracht. Een verwerkersovereenkomst sturen we je op
          verzoek.
        </p>
      </LegalSection>

      <LegalSection title="2. Welke gegevens we verwerken">
        <LegalList>
          <li>Account: je naam, de naam van je partner, je e-mailadres en de datum van de bruiloft.</li>
          <li>
            Je uitnodiging: thema, teksten, datums en foto&apos;s die je zelf toevoegt.
          </li>
          <li>
            Je gastenlijst: namen, e-mailadressen, telefoonnummers, of iemand een +1 meeneemt, dieetwensen, groepen en
            de reactie (RSVP) van je gasten.
          </li>
          <li>
            Je betaling: het bedrag, de datum en het betaalnummer van Stripe. Je kaart- of bankgegevens zien wij niet.
          </li>
          <li>Technische meldingen, bijvoorbeeld foutmeldingen, om de dienst te laten werken.</li>
        </LegalList>
      </LegalSection>

      <LegalSection title="3. Waarom we ze verwerken">
        <LegalList>
          <li>Om je account, je uitnodiging, je gastenlijst en de RSVP-functie te laten werken.</li>
          <li>Om je betaling te verwerken en een aankoop te kunnen terugvinden.</li>
          <li>Om de dienst te beveiligen en storingen op te lossen.</li>
          <li>Om te voldoen aan wettelijke verplichtingen, zoals de fiscale administratie.</li>
        </LegalList>
        <p>We gebruiken je gegevens niet voor reclame en verkopen ze niet door.</p>
      </LegalSection>

      <LegalSection title="4. Met wie we gegevens delen">
        <p>We werken met de volgende partijen die gegevens voor ons verwerken:</p>
        <LegalList>
          <li>Supabase: database, inloggen en opslag van foto&apos;s. De gegevens staan in de EU (Frankfurt).</li>
          <li>Vercel: hosting van de website, uitgevoerd vanuit de EU (Frankfurt).</li>
          <li>Stripe: het verwerken van betalingen.</li>
          <li>Sanity: het beheer van de thema&apos;s voor uitnodigingen. Hier staan geen persoonsgegevens in.</li>
        </LegalList>
        <p>
          Sommige van deze partijen zijn gevestigd buiten de EU. Zij hanteren passende waarborgen, zoals de
          standaardcontractbepalingen van de Europese Commissie.
        </p>
      </LegalSection>

      <LegalSection title="5. Cookies">
        <p>
          We gebruiken alleen functionele cookies die nodig zijn om je ingelogd te houden. We gebruiken geen
          advertentie- of volgcookies.
        </p>
      </LegalSection>

      <LegalSection title="6. Hoe lang we gegevens bewaren">
        <LegalList>
          <li>Je account en de gegevens die je invoert bewaren we zolang je account bestaat.</li>
          <li>
            Wil je dat we je account en alle gegevens verwijderen? Mail ons, dan doen we dat.
          </li>
          <li>
            Gegevens over je betaling bewaren we 7 jaar, omdat de fiscale wetgeving dat van ons vraagt.
          </li>
        </LegalList>
      </LegalSection>

      <LegalSection title="7. Je rechten">
        <p>
          Je kunt ons vragen om inzage in je gegevens, om ze te laten verbeteren, te verwijderen of te beperken, om
          bezwaar te maken tegen een verwerking en om je gegevens over te dragen. Mail naar{" "}
          <MailLink email={COMPANY.email} />. Je krijgt binnen een maand antwoord.
        </p>
        <p>
          Ben je het niet eens met hoe wij met je gegevens omgaan? Dan kun je een klacht indienen bij de Autoriteit
          Persoonsgegevens. We horen graag eerst van je, zodat we het kunnen oplossen.
        </p>
      </LegalSection>

      <LegalSection title="8. Beveiliging">
        <p>
          Gegevens worden versleuteld verzonden. De database is zo ingesteld dat je alleen je eigen gegevens kunt zien.
          Een uitnodigingslink geeft alleen toegang tot de uitnodiging zelf.
        </p>
      </LegalSection>

      <LegalSection title="9. Wijzigingen">
        <p>We kunnen deze verklaring aanpassen. De nieuwste versie staat altijd op deze pagina.</p>
      </LegalSection>
    </LegalPage>
  );
}
