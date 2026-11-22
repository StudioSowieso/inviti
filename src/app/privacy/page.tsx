import type { Metadata } from "next";
import { LegalList, LegalPage, LegalSection, MailLink } from "@/components/landing/legal-page";
import Link from "next/link";
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
      intro="Welke gegevens wij van jou en je gasten verwerken, waarom, met wie we ze delen, hoe lang we ze bewaren en wat je zelf kunt regelen."
    >
      <LegalSection title="1. Wie is verantwoordelijk">
        <p>
          {COMPANY.legalName} (handelsnaam {COMPANY.tradeName}), {COMPANY.street}, {COMPANY.postalCode} {COMPANY.city},{" "}
          {COMPANY.country}. KvK-nummer {COMPANY.kvk}. Vragen over privacy? Mail naar{" "}
          <MailLink email={COMPANY.email} />.
        </p>
        <LegalList>
          <li>
            <strong>Jouw gegevens</strong> (account, betaling, gebruik van de website): hiervoor zijn wij de
            verwerkingsverantwoordelijke.
          </li>
          <li>
            <strong>De gegevens van je gasten</strong> (de gastenlijst en hun reacties): hiervoor ben jij de
            verwerkingsverantwoordelijke. Wij verwerken ze in jouw opdracht en alleen om de dienst voor jou uit te
            voeren (verwerker). Voor deze verwerking gelden de afspraken in artikel 11 van onze{" "}
            <Link href="/voorwaarden" className="text-forest underline underline-offset-4">
              algemene voorwaarden
            </Link>
            . Een aparte verwerkersovereenkomst sturen we je op verzoek.
          </li>
        </LegalList>
      </LegalSection>

      <LegalSection title="2. Welke gegevens we verwerken">
        <LegalList>
          <li>
            <strong>Account:</strong> je naam, de naam van je partner, je e-mailadres, je wachtwoord (versleuteld) en de
            datum van de bruiloft.
          </li>
          <li>
            <strong>Je uitnodiging:</strong> thema, teksten, datums, locaties en foto&apos;s die je zelf toevoegt.
          </li>
          <li>
            <strong>Je gastenlijst:</strong> namen, e-mailadressen, telefoonnummers, of iemand een +1 meeneemt,
            dieetwensen, groepen en de reactie (RSVP) van je gasten. Dieetwensen kunnen soms iets zeggen over gezondheid
            of geloof. Neem alleen op wat nodig is en wat je gasten zelf aan jou doorgeven.
          </li>
          <li>
            <strong>Reacties van gasten:</strong> als een gast via de uitnodigingslink reageert, verwerken wij die
            reactie (komt wel of niet, eventuele +1 en dieetwens) en het tijdstip van reageren.
          </li>
          <li>
            <strong>Je betaling:</strong> het bedrag, de datum en het betaalnummer van Stripe. Je kaart- of
            bankgegevens zien wij niet.
          </li>
          <li>
            <strong>Technische gegevens:</strong> je IP-adres, apparaat- en browsergegevens en foutmeldingen, voor de
            beveiliging en om de dienst te laten werken.
          </li>
          <li>
            <strong>Websitestatistieken:</strong> alleen als je daarvoor toestemming geeft, zie artikel 7.
          </li>
          <li>
            <strong>Contact:</strong> wat je ons stuurt als je ons mailt, zoals je naam, e-mailadres en je bericht.
          </li>
        </LegalList>
      </LegalSection>

      <LegalSection title="3. Waarom we ze verwerken, en op welke grondslag">
        <LegalList>
          <li>
            Om je account, je uitnodiging, je gastenlijst en de RSVP-functie te laten werken, en om je aankoop uit te
            voeren: <em>uitvoering van de overeenkomst</em>.
          </li>
          <li>
            Om je betaling te verwerken en een aankoop te kunnen terugvinden, en voor de fiscale administratie:{" "}
            <em>uitvoering van de overeenkomst</em> en <em>wettelijke verplichting</em>.
          </li>
          <li>
            Om de dienst te beveiligen, misbruik en fraude tegen te gaan en storingen op te lossen:{" "}
            <em>gerechtvaardigd belang</em> van ons bij een veilige en werkende dienst.
          </li>
          <li>
            Om vragen en klachten te beantwoorden: <em>gerechtvaardigd belang</em> en <em>uitvoering van de
            overeenkomst</em>.
          </li>
          <li>
            Om te meten hoe de website wordt gebruikt en om hem te verbeteren: <em>toestemming</em>. Die kun je op elk
            moment intrekken.
          </li>
        </LegalList>
        <p>
          We gebruiken je gegevens niet voor reclame, we verkopen ze niet door en we nemen geen besluiten die alleen op
          geautomatiseerde verwerking zijn gebaseerd en jou merkbaar raken.
        </p>
      </LegalSection>

      <LegalSection title="4. Je gasten en je uitnodigingen">
        <LegalList>
          <li>
            Jij kiest welke gasten je toevoegt en jij verstuurt de uitnodigingen zelf, via je eigen e-mail, WhatsApp of een
            andere weg. Wij versturen niets namens jou. Dat betekent ook dat jij bepaalt wie een uitnodiging
            krijgt.
          </li>
          <li>
            Zorg dat je gasten weten dat je hun gegevens gebruikt om ze uit te nodigen en dat je ze in{" "}
            {COMPANY.tradeName} zet. Voor de gegevens van je gasten ben jij verantwoordelijk.
          </li>
          <li>
            Een uitnodigingslink geeft alleen toegang tot die ene uitnodiging en de reactie van die gast. Deel een link
            alleen met de gast voor wie hij bedoeld is.
          </li>
          <li>
            Wil een gast inzage in of verwijdering van zijn gegevens? Dan verwijst hij of zij naar jou door. Wij helpen
            jou daar redelijkerwijs bij.
          </li>
        </LegalList>
      </LegalSection>

      <LegalSection title="5. Met wie we gegevens delen">
        <p>We werken met de volgende partijen die gegevens voor ons verwerken. Met hen hebben we afspraken over de verwerking en beveiliging:</p>
        <LegalList>
          <li>Supabase: database, inloggen en opslag van foto&apos;s. De gegevens staan in de EU (Frankfurt).</li>
          <li>Vercel: hosting van de website, uitgevoerd vanuit de EU (Frankfurt).</li>
          <li>Stripe: het verwerken van betalingen. Stripe is voor de betaling zelf ook zelf verantwoordelijk, zie de privacyverklaring van Stripe.</li>
          <li>Sanity: het beheer van de thema&apos;s voor uitnodigingen. Hier staan geen persoonsgegevens in.</li>
          <li>Google (Google Analytics): websitestatistieken, alleen met jouw toestemming, zie artikel 7.</li>
        </LegalList>
        <p>
          Verder delen wij gegevens alleen met derden als dat wettelijk verplicht is, bijvoorbeeld op vordering van een
          overheidsinstantie, of als jij daar zelf toestemming voor geeft.
        </p>
      </LegalSection>

      <LegalSection title="6. Doorgifte buiten de EU">
        <p>
          Sommige partijen, zoals Stripe, Vercel en Google, zijn of hebben onderdelen gevestigd buiten de EU, bijvoorbeeld
          in de Verenigde Staten. Wij sluiten alleen gegevens door als daar passende waarborgen voor zijn, zoals een
          adequaatheidsbesluit van de Europese Commissie (waaronder het EU-US Data Privacy Framework) of de
          standaardcontractbepalingen.
        </p>
      </LegalSection>

      <LegalSection title="7. Cookies en websitestatistieken">
        <LegalList>
          <li>
            <strong>Functionele cookies.</strong> Deze zijn nodig om je ingelogd te houden en de dienst te laten werken.
            Hiervoor is geen toestemming nodig.
          </li>
          <li>
            <strong>Analytische cookies (Google Analytics).</strong> Met Google Analytics meten we hoe bezoekers onze
            publieke website gebruiken, bijvoorbeeld welke pagina&apos;s worden bekeken. Deze cookies plaatsen we alleen als
            je daar vooraf toestemming voor geeft. Zonder toestemming worden ze niet geladen. Je kunt je toestemming
            op elk moment intrekken door de cookies van deze website in je browser te verwijderen of door ons te mailen.
          </li>
          <li>
            Wij gebruiken geen advertentie- of volgcookies en delen geen gegevens met Google voor reclamedoeleinden.
          </li>
        </LegalList>
      </LegalSection>

      <LegalSection title="8. Hoe lang we gegevens bewaren">
        <LegalList>
          <li>
            Je account en de gegevens die je invoert, waaronder die van je gasten, bewaren we uiterlijk 12 maanden na de
            trouwdatum die je hebt ingevuld. Daarna verwijderen of anonimiseren we ze.
          </li>
          <li>Wil je dat we je account en alle gegevens eerder verwijderen? Mail ons, dan doen we dat.</li>
          <li>Gegevens over je betaling bewaren we 7 jaar, omdat de fiscale wetgeving dat van ons vraagt.</li>
          <li>
            Technische meldingen en foutmeldingen bewaren we niet langer dan nodig is om problemen te onderzoeken en op
            te lossen.
          </li>
          <li>Berichten die je ons mailt bewaren we zolang dat nodig is om je vraag af te handelen.</li>
          <li>Gegevens voor websitestatistieken bewaren we niet langer dan 14 maanden.</li>
        </LegalList>
      </LegalSection>

      <LegalSection title="9. Je rechten">
        <p>
          Je hebt het recht op inzage in je gegevens, op correctie, verwijdering of beperking ervan, op bezwaar tegen een
          verwerking en op overdracht van je gegevens in een gangbaar formaat. Heb je toestemming gegeven, dan kun je die
          op elk moment intrekken. Intrekken heeft geen gevolgen voor wat daarvoor al is verwerkt.
        </p>
        <p>
          Mail naar <MailLink email={COMPANY.email} />. Om misbruik te voorkomen kunnen wij je vragen om je te
          identificeren. Je krijgt binnen een maand antwoord.
        </p>
        <p>
          Ben je het niet eens met hoe wij met je gegevens omgaan? Dan kun je een klacht indienen bij de Autoriteit
          Persoonsgegevens (autoriteitpersoonsgegevens.nl). We horen graag eerst van je, zodat we het kunnen oplossen.
        </p>
      </LegalSection>

      <LegalSection title="10. Beveiliging en datalekken">
        <LegalList>
          <li>Gegevens worden versleuteld verzonden en opgeslagen op beveiligde servers.</li>
          <li>
            De database is zo ingesteld dat je alleen je eigen gegevens kunt zien en wachtwoorden worden versleuteld
            bewaard.
          </li>
          <li>Medewerkers en partijen met toegang tot gegevens zijn gebonden aan geheimhouding.</li>
          <li>
            Gaat er toch iets mis met de beveiliging van gegevens, dan melden wij dat waar nodig bij de Autoriteit
            Persoonsgegevens en informeren wij jou zonder onnodige vertraging als het gaat om jouw gegevens.
          </li>
        </LegalList>
      </LegalSection>

      <LegalSection title="11. Minderjarigen">
        <p>
          De dienst is bedoeld voor mensen van 18 jaar en ouder. Wij verwerken niet bewust gegevens van kinderen onder
          de 16 jaar zonder toestemming van hun ouder of voogd. Zet je gegevens van minderjarige gasten in de
          gastenlijst, dan ben jij daarvoor verantwoordelijk.
        </p>
      </LegalSection>

      <LegalSection title="12. Wijzigingen">
        <p>
          We kunnen deze verklaring aanpassen, bijvoorbeeld bij nieuwe functies of nieuwe regelgeving. De nieuwste versie
          staat altijd op deze pagina, met bovenaan de datum van de laatste wijziging. Bij een belangrijke wijziging
          informeren we je ook per e-mail of in de app.
        </p>
      </LegalSection>
    </LegalPage>
  );
}
