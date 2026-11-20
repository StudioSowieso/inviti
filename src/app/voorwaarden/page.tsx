import type { Metadata } from "next";
import Link from "next/link";
import { LegalList, LegalPage, LegalSection, MailLink } from "@/components/landing/legal-page";
import { COMPANY } from "@/lib/company";
import { PRICE_LABEL } from "@/lib/stripe";

export const metadata: Metadata = {
  title: "Algemene voorwaarden — Proost Mee",
  description: "De voorwaarden voor het gebruik van Proost mee, inclusief betaling en herroeping.",
};

export default function TermsPage() {
  return (
    <LegalPage
      eyebrow="Voorwaarden"
      title="Algemene voorwaarden"
      intro="Heldere afspraken over het gebruik van Proost mee, de betaling en je recht om je aankoop ongedaan te maken."
    >
      <LegalSection title="1. Wie zijn wij">
        <p>
          {COMPANY.tradeName} is een handelsnaam van {COMPANY.legalName}, een {COMPANY.legalForm}.
        </p>
        <LegalList>
          <li>
            Adres: {COMPANY.street}, {COMPANY.postalCode} {COMPANY.city}, {COMPANY.country}
          </li>
          <li>KvK-nummer: {COMPANY.kvk}</li>
          <li>Btw-nummer: {COMPANY.vat}</li>
          <li>
            E-mail: <MailLink email={COMPANY.email} />
          </li>
        </LegalList>
      </LegalSection>

      <LegalSection title="2. Toepasselijkheid">
        <p>
          Deze voorwaarden gelden voor ieder gebruik van de website en de webapp van {COMPANY.tradeName} en voor elke
          aankoop. Door een account aan te maken of te betalen ga je ermee akkoord.
        </p>
      </LegalSection>

      <LegalSection title="3. De dienst">
        <p>
          {COMPANY.tradeName} is een webapp waarmee je online bruiloftsuitnodigingen ontwerpt, een gastenlijst bijhoudt,
          uitnodigingen verstuurt en reacties (RSVP) verzamelt.
        </p>
        <p>
          Je kunt de testomgeving gratis gebruiken om je uitnodiging te ontwerpen, je gastenlijst op te bouwen en je
          to-do&apos;s bij te houden. Om uitnodigingen te versturen heb je de volledige versie nodig.
        </p>
      </LegalSection>

      <LegalSection title="4. Prijs en betaling">
        <LegalList>
          <li>
            De volledige versie kost eenmalig {PRICE_LABEL}. Het is geen abonnement en er volgen geen vervolgkosten.
          </li>
          <li>Alle prijzen zijn in euro&apos;s en inclusief btw.</li>
          <li>
            Je betaalt veilig via Stripe, onder andere met iDEAL en creditcard. Wij zien en bewaren je kaart- of
            bankgegevens niet.
          </li>
          <li>De volledige versie wordt direct geactiveerd zodra je betaling is bevestigd.</li>
          <li>
            Wil je een factuur voor je aankoop? Stuur een bericht naar <MailLink email={COMPANY.email} />.
          </li>
        </LegalList>
      </LegalSection>

      <LegalSection title="5. Herroepen en geld terug">
        <p>
          Je kunt je aankoop binnen 14 dagen na betaling zonder opgaaf van reden ongedaan maken. Dat geldt ook als je de
          volledige versie al hebt gebruikt of uitnodigingen hebt verstuurd. Wij vragen geen vergoeding voor het gebruik
          in die periode.
        </p>
        <p>
          Stuur een bericht naar <MailLink email={COMPANY.email} /> met het e-mailadres van je account. Je krijgt het
          volledige bedrag binnen 14 dagen na je bericht terug, via dezelfde betaalmethode waarmee je hebt betaald.
        </p>
      </LegalSection>

      <LegalSection title="6. Je account en je gebruik">
        <LegalList>
          <li>Je geeft juiste gegevens op en houdt je inloggegevens voor jezelf.</li>
          <li>Je mag de dienst alleen gebruiken voor rechtmatige doeleinden, zoals het uitnodigen van je eigen gasten.</li>
          <li>
            Je mag geen spam versturen, geen misleidende of onrechtmatige inhoud plaatsen en de dienst niet verstoren.
          </li>
          <li>
            Bij misbruik mogen wij je account tijdelijk of definitief blokkeren. Is dat het geval, dan nemen we eerst
            contact met je op, tenzij dat niet verantwoord is.
          </li>
        </LegalList>
      </LegalSection>

      <LegalSection title="7. Gegevens van jou en je gasten">
        <p>
          Jij bepaalt welke gegevens van je gasten je in {COMPANY.tradeName} zet, zoals namen, e-mailadressen en
          dieetwensen. Zorg dat je die gegevens rechtmatig gebruikt. Wij verwerken ze alleen om de dienst voor jou uit
          te voeren. Meer hierover staat in onze{" "}
          <Link href="/privacy" className="text-forest underline underline-offset-4">
            privacyverklaring
          </Link>
          .
        </p>
      </LegalSection>

      <LegalSection title="8. Beschikbaarheid en aansprakelijkheid">
        <LegalList>
          <li>
            Wij doen ons best om de dienst goed en onderbrekingsvrij te laten werken, maar kunnen dat niet altijd
            garanderen. Onderhoud of storingen kunnen voorkomen.
          </li>
          <li>
            Controleer je uitnodiging en gastenlijst voordat je verstuurt. Jij bent verantwoordelijk voor de inhoud en
            voor de juistheid van de gegevens.
          </li>
          <li>
            Onze aansprakelijkheid is beperkt tot het bedrag dat je voor de volledige versie hebt betaald, behalve bij
            opzet of grove schuld, en voor zover de wet niets anders bepaalt. Je wettelijke rechten als consument
            blijven gelden.
          </li>
        </LegalList>
      </LegalSection>

      <LegalSection title="9. Klachten">
        <p>
          Ben je ergens niet tevreden over? Mail ons via <MailLink email={COMPANY.email} />. We reageren binnen 5
          werkdagen en zoeken samen met je naar een oplossing.
        </p>
      </LegalSection>

      <LegalSection title="10. Toepasselijk recht en wijzigingen">
        <p>
          Op deze voorwaarden en op onze overeenkomst is Nederlands recht van toepassing. Dwingende bescherming die je
          als consument volgens het recht van je woonland hebt, blijft gelden.
        </p>
        <p>
          We kunnen deze voorwaarden aanpassen. De voorwaarden die golden op het moment van je aankoop blijven voor die
          aankoop gelden.
        </p>
      </LegalSection>
    </LegalPage>
  );
}
