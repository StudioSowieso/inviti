import type { Metadata } from "next";
import Link from "next/link";
import { LegalList, LegalPage, LegalSection, MailLink } from "@/components/landing/legal-page";
import { COMPANY } from "@/lib/company";
import { PRICE_LABEL } from "@/lib/stripe";

export const metadata: Metadata = {
  title: "Algemene voorwaarden — Proost Mee",
  description: "De voorwaarden voor het gebruik van Proost mee: de dienst, betaling via Stripe, herroeping, gegevens en aansprakelijkheid.",
};

export default function TermsPage() {
  return (
    <LegalPage
      eyebrow="Voorwaarden"
      title="Algemene voorwaarden"
      intro="Heldere afspraken over het gebruik van Proost mee: wat je krijgt, hoe je betaalt, wat je rechten zijn en waar onze verantwoordelijkheid ophoudt."
    >
      <LegalSection title="1. Wie zijn wij">
        <p>
          {COMPANY.tradeName} is een handelsnaam van {COMPANY.legalName}, een {COMPANY.legalForm} (hierna: “wij”,
          “ons” of “{COMPANY.tradeName}”).
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

      <LegalSection title="2. Toepasselijkheid en definities">
        <LegalList>
          <li>
            Deze voorwaarden gelden voor ieder gebruik van de website en de webapp van {COMPANY.tradeName} (samen: “de
            dienst”) en voor elke overeenkomst die je met ons sluit.
          </li>
          <li>
            “Jij” of “de gebruiker” is de persoon die een account aanmaakt of de volledige versie koopt. “Gasten” zijn
            de personen die jij via de dienst uitnodigt.
          </li>
          <li>
            De dienst is bedoeld voor consumenten: particulieren die een eigen bruiloft of een ander persoonlijk feest
            organiseren. Je bent minimaal 18 jaar of hebt toestemming van een wettelijk vertegenwoordiger.
          </li>
          <li>
            Door een account aan te maken, de dienst te gebruiken of te betalen, ga je akkoord met deze voorwaarden. Je
            kunt ze op elk moment terugvinden op deze pagina en wij sturen ze op verzoek toe.
          </li>
          <li>Algemene voorwaarden van jou zijn niet van toepassing.</li>
        </LegalList>
      </LegalSection>

      <LegalSection title="3. De dienst">
        <p>
          {COMPANY.tradeName} is een webapp waarmee je online bruiloftsuitnodigingen ontwerpt, een gastenlijst bijhoudt,
          uitnodigingen verstuurt en reacties (RSVP) verzamelt.
        </p>
        <LegalList>
          <li>
            <strong>Testomgeving (gratis).</strong> Je kunt je uitnodiging ontwerpen, je gastenlijst opbouwen en je
            to-do&apos;s bijhouden zonder te betalen en zonder betaalgegevens. De testomgeving heeft niet alle functies
            en is bedoeld om de dienst uit te proberen. Voor het versturen van uitnodigingen en het ontvangen van
            RSVP&apos;s is de volledige versie nodig.
          </li>
          <li>
            <strong>Volledige versie.</strong> Na aankoop kun je je uitnodiging aan je gasten versturen en hun reacties
            verzamelen, zoals beschreven op de pagina{" "}
            <Link href="/prijzen" className="text-forest underline underline-offset-4">
              Prijzen
            </Link>
            . De volledige versie is een eenmalige aankoop voor één bruiloft en geen abonnement.
          </li>
          <li>
            We werken de dienst voortdurend bij. We mogen functies toevoegen, aanpassen of verwijderen, zolang de
            kernfuncties van de volledige versie waarvoor je hebt betaald beschikbaar blijven.
          </li>
          <li>
            Thema&apos;s en voorbeelden op onze website geven een indruk. De weergave kan per scherm, apparaat of
            browser iets verschillen.
          </li>
        </LegalList>
      </LegalSection>

      <LegalSection title="4. Je account">
        <LegalList>
          <li>Je geeft juiste en volledige gegevens op en houdt die actueel.</li>
          <li>
            Je houdt je inloggegevens geheim. Alles wat via jouw account gebeurt, is voor jouw rekening, tenzij je ons
            direct op de hoogte brengt van misbruik en het misbruik niet aan jou te wijten is.
          </li>
          <li>
            Merk je dat iemand anders toegang heeft tot je account? Mail ons dan direct via{" "}
            <MailLink email={COMPANY.email} />.
          </li>
          <li>Je mag je account niet overdragen aan iemand anders.</li>
        </LegalList>
      </LegalSection>

      <LegalSection title="5. Totstandkoming van de overeenkomst">
        <p>
          De overeenkomst voor de volledige versie komt tot stand op het moment dat je betaling is bevestigd. Daarvoor
          doorloop je onze bestelprocedure. Voordat je betaalt, zie je de prijs en een knop met de tekst die duidelijk
          maakt dat je een betaalverplichting aangaat. Na je betaling ontvang je een bevestiging van Stripe en kun je een
          factuur bij ons opvragen.
        </p>
      </LegalSection>

      <LegalSection title="6. Prijs en betaling via Stripe">
        <LegalList>
          <li>
            De volledige versie kost eenmalig {PRICE_LABEL}. Het is geen abonnement en er volgen geen vervolgkosten.
          </li>
          <li>
            Alle prijzen zijn in euro&apos;s en inclusief btw, tenzij anders vermeld. Er zijn geen verborgen kosten.
            Kosten van je eigen bank of kaartuitgever vallen buiten onze invloed.
          </li>
          <li>
            Betalingen verlopen via Stripe, een externe betaaldienstverlener, onder andere met iDEAL en creditcard.
            Stripe verwerkt je betaling op een eigen beveiligde betaalpagina. Wij zien en bewaren je kaart- of
            bankgegevens niet. Wij ontvangen van Stripe alleen de bevestiging en de gegevens die nodig zijn om je
            aankoop te koppelen aan je account.
          </li>
          <li>
            Voor het betaalproces gelden daarnaast de voorwaarden en het privacybeleid van Stripe. Die vind je op de
            website van Stripe. Wij zijn niet verantwoordelijk voor storingen of fouten bij Stripe of bij je bank, maar
            helpen je graag verder als een betaling vastloopt.
          </li>
          <li>
            Mislukt je betaling of wordt deze teruggeboekt? Dan wordt de volledige versie niet geactiveerd, of mogen wij
            deze weer deactiveren totdat de betaling alsnog is voldaan.
          </li>
          <li>De volledige versie wordt direct geactiveerd zodra je betaling is bevestigd.</li>
          <li>
            Wil je een factuur voor je aankoop? Stuur een bericht naar <MailLink email={COMPANY.email} />.
          </li>
        </LegalList>
      </LegalSection>

      <LegalSection title="7. Herroepen en geld terug">
        <LegalList>
          <li>
            Als consument heb je het recht om de aankoop binnen 14 dagen na betaling zonder opgaaf van reden te
            herroepen (bedenktijd).
          </li>
          <li>
            <strong>Heb je nog geen uitnodigingen verstuurd?</strong> Dan krijg je het volledige bedrag terug.
          </li>
          <li>
            <strong>Heb je al uitnodigingen verstuurd?</strong> Op het moment dat je voor het eerst uitnodigingen
            verstuurt, begint de uitvoering van de dienst. Wij vragen je dan om uitdrukkelijk te bevestigen dat de
            dienst daarmee is uitgevoerd en dat je daardoor je herroepingsrecht verliest. Na die bevestiging kun je de
            aankoop niet meer herroepen.
          </li>
          <li>
            Wil je herroepen? Stuur een bericht naar <MailLink email={COMPANY.email} /> met het e-mailadres van je
            account en de tekst dat je de aankoop herroept. Je mag hiervoor ook het modelformulier voor herroeping
            gebruiken, maar dat is niet verplicht.
          </li>
          <li>
            Na een geldige herroeping krijg je het bedrag binnen 14 dagen terug, via dezelfde betaalmethode waarmee je
            hebt betaald. De volledige versie wordt dan gedeactiveerd.
          </li>
          <li>Je wettelijke rechten als consument blijven altijd gelden.</li>
        </LegalList>
      </LegalSection>

      <LegalSection title="8. Gebruik van de dienst">
        <p>Je gebruikt de dienst op een nette en rechtmatige manier. Dat betekent onder meer dat je:</p>
        <LegalList>
          <li>alleen je eigen gasten uitnodigt en geen ongevraagde berichten of spam verstuurt;</li>
          <li>geen misleidende, beledigende, discriminerende of onrechtmatige inhoud plaatst;</li>
          <li>geen gegevens van anderen gebruikt zonder dat je daar het recht toe hebt;</li>
          <li>de dienst niet verstoort, beveiligingsmaatregelen niet omzeilt en geen geautomatiseerde middelen inzet om de dienst te belasten of te kopiëren;</li>
          <li>geen wettelijke regels of rechten van derden schendt.</li>
        </LegalList>
        <p>
          Bij misbruik of bij een redelijk vermoeden daarvan mogen wij inhoud verwijderen en je account tijdelijk of
          definitief blokkeren. Wij nemen dan eerst contact met je op, tenzij dat gezien de ernst of urgentie niet
          verantwoord is. Voor misbruik kun je aansprakelijk zijn, ook voor schade die wij of derden daardoor lijden.
        </p>
      </LegalSection>

      <LegalSection title="9. Inhoud die je plaatst">
        <LegalList>
          <li>
            Alles wat je in de dienst zet, zoals teksten, namen, foto&apos;s en gastgegevens (“jouw inhoud”), blijft van
            jou. Je geeft ons alleen het recht om jouw inhoud op te slaan, te verwerken en te tonen aan jou en aan jouw
            gasten, voor zover dat nodig is om de dienst uit te voeren.
          </li>
          <li>
            Jij garandeert dat je het recht hebt om jouw inhoud te gebruiken, bijvoorbeeld dat je toestemming hebt van
            de fotograaf of van de mensen die op een foto staan.
          </li>
          <li>
            Jij bent verantwoordelijk voor de inhoud en de juistheid van jouw uitnodiging en gastenlijst. Controleer
            beide goed voordat je verstuurt. Een eenmaal verstuurde uitnodiging kunnen wij niet terughalen.
          </li>
        </LegalList>
      </LegalSection>

      <LegalSection title="10. Intellectueel eigendom">
        <p>
          De dienst, de software, de thema&apos;s, ontwerpen, illustraties, teksten en het merk {COMPANY.tradeName} zijn
          van ons of van onze licentiegevers. Met je aankoop krijg je een persoonlijk, niet-overdraagbaar en
          niet-exclusief recht om de thema&apos;s te gebruiken voor je eigen uitnodiging. Je mag ze niet kopiëren,
          doorverkopen, delen met anderen of voor andere doeleinden gebruiken.
        </p>
      </LegalSection>

      <LegalSection title="11. Gegevens van jou en je gasten">
        <LegalList>
          <li>
            Jij bepaalt welke gegevens van je gasten je in {COMPANY.tradeName} zet, zoals namen, e-mailadressen,
            telefoonnummers en dieetwensen. Voor die gegevens ben jij de verantwoordelijke in de zin van de AVG. Zorg
            dat je een rechtmatige reden hebt om ze te gebruiken en dat je gasten weten dat je ze uitnodigt via
            {" "}{COMPANY.tradeName}.
          </li>
          <li>
            Wij verwerken de gegevens van je gasten uitsluitend in jouw opdracht en om de dienst voor jou uit te voeren
            (verwerker). Wij nemen passende technische en organisatorische maatregelen om die gegevens te beveiligen,
            behandelen ze vertrouwelijk, gebruiken ze niet voor eigen doeleinden en schakelen alleen
            hostingpartijen en andere dienstverleners in die op dezelfde wijze zijn gebonden. Bij een datalek dat jouw
            gegevens raakt, informeren wij je zonder onnodige vertraging.
          </li>
          <li>
            Op jouw verzoek helpen wij je redelijkerwijs bij vragen van gasten over hun gegevens, zoals inzage of
            verwijdering.
          </li>
          <li>
            Wij bewaren je account- en gastgegevens uiterlijk 12 maanden na de trouwdatum die je hebt ingevuld.
            Daarna verwijderen of anonimiseren wij ze. Wil je je gegevens eerder laten verwijderen? Mail ons, dan doen
            we dat. Betaalgegevens bewaren we zo lang de wet dat vereist.
          </li>
          <li>
            Wat wij met jouw eigen persoonsgegevens doen, lees je in onze{" "}
            <Link href="/privacy" className="text-forest underline underline-offset-4">
              privacyverklaring
            </Link>
            .
          </li>
        </LegalList>
      </LegalSection>

      <LegalSection title="12. Beschikbaarheid en externe partijen">
        <LegalList>
          <li>
            Wij doen ons best om de dienst goed en onderbrekingsvrij te laten werken, maar kunnen dat niet garanderen.
            Onderhoud, updates en storingen kunnen voorkomen. Waar mogelijk kondigen wij gepland onderhoud vooraf aan.
          </li>
          <li>
            De dienst maakt gebruik van externe partijen, zoals Stripe voor betalingen, hostingpartijen en e-mail- en
            berichtendiensten. Ook het versturen via WhatsApp, e-mail of een link is afhankelijk van die partijen en van
            jouw eigen apparaat, app en verbinding. Wij zijn niet verantwoordelijk voor storingen of beperkingen bij
            hen.
          </li>
          <li>
            <strong>Jij verstuurt de uitnodigingen zelf.</strong> {COMPANY.tradeName} levert de uitnodiging en de link
            of het bericht, maar het versturen gebeurt door jou, via je eigen e-mail, WhatsApp of een andere manier die
            je kiest. Wij versturen niets namens jou en hebben geen invloed op het verzenden, het bezorgen of het
            ontvangen van die berichten.
          </li>
          <li>
            Wij zijn daarom niet verantwoordelijk voor de ontvangst van uitnodigingen. Dat geldt bijvoorbeeld als een
            bericht niet aankomt, vertraagd is, in een spamfilter of ongewenste-berichtenmap terechtkomt, naar een
            verkeerd e-mailadres of telefoonnummer is gestuurd, of niet wordt geopend of gelezen. Ook zijn wij niet
            verantwoordelijk voor beperkingen of storingen van e-mailproviders en WhatsApp. Controleer bij belangrijke
            gasten zelf of de uitnodiging is aangekomen.
          </li>
          <li>
            Gasten kunnen zelf bepalen of en hoe zij reageren. Wij staan niet in voor de juistheid, tijdigheid of
            volledigheid van reacties (RSVP) van gasten.
          </li>
        </LegalList>
      </LegalSection>

      <LegalSection title="13. Aansprakelijkheid">
        <LegalList>
          <li>
            Wij zijn alleen aansprakelijk voor directe schade die het rechtstreekse gevolg is van een toerekenbare
            tekortkoming van ons. Onze totale aansprakelijkheid is beperkt tot het bedrag dat je voor de volledige
            versie hebt betaald ({PRICE_LABEL}).
          </li>
          <li>
            Wij zijn niet aansprakelijk voor indirecte schade of gevolgschade. Denk aan gemiste of niet-aangekomen
            uitnodigingen, gasten die niet of te laat reageren of komen, kosten van locatie, catering of leveranciers,
            gemiste inkomsten, verlies van gegevens, immateriële schade en schade door een verkeerd ingevulde of
            niet-gecontroleerde uitnodiging of gastenlijst.
          </li>
          <li>
            Wij zijn niet aansprakelijk voor schade doordat uitnodigingen die jij zelf via e-mail, WhatsApp of een andere
            weg hebt verstuurd niet, niet op tijd of niet bij de juiste persoon aankomen.
          </li>
          <li>
            Wij zijn niet aansprakelijk voor schade door storingen of fouten bij externe partijen (zoals Stripe,
            hostingpartijen, e-mail- en berichtendiensten), door overmacht, of door handelen of nalaten van jou of je
            gasten.
          </li>
          <li>
            Je meldt schade zo snel mogelijk nadat je die hebt ontdekt, zodat wij die kunnen onderzoeken en waar
            mogelijk beperken.
          </li>
          <li>
            Bovenstaande beperkingen gelden niet bij opzet of bewuste roekeloosheid van ons, niet bij schade door
            overlijden of letsel, en niet voor zover de wet de aansprakelijkheid niet toestaat te beperken. Je wettelijke
            rechten als consument blijven gelden.
          </li>
          <li>
            Je vrijwaart ons tegen claims van derden, bijvoorbeeld gasten of rechthebbenden, die voortkomen uit jouw
            inhoud of uit gebruik van de dienst dat in strijd is met deze voorwaarden of met de wet.
          </li>
        </LegalList>
      </LegalSection>

      <LegalSection title="14. Overmacht">
        <p>
          Wij zijn niet gehouden onze verplichtingen na te komen als dat niet mogelijk is door een omstandigheid die
          niet aan ons te wijten is en niet voor onze rekening komt. Denk aan een storing bij internet-, hosting- of
          betaalproviders, een cyberaanval, een stroomstoring, overheidsmaatregelen of extreme omstandigheden. Duurt
          zo&apos;n situatie langer dan 60 dagen, dan mag ieder van ons de overeenkomst ontbinden. Je krijgt dan het
          bedrag terug voor de periode waarin je de dienst niet kon gebruiken.
        </p>
      </LegalSection>

      <LegalSection title="15. Opzeggen, beëindigen en verwijderen">
        <LegalList>
          <li>
            Je kunt je account op elk moment laten verwijderen door ons te mailen. Het bedrag voor de volledige versie
            krijg je daarna niet terug, behalve bij herroeping volgens artikel 7 of als de wet iets anders bepaalt.
          </li>
          <li>
            Wij mogen je account blokkeren of beëindigen bij misbruik of een ernstige schending van deze voorwaarden,
            zoals beschreven in artikel 8.
          </li>
          <li>
            Beëindigen wij je account zonder dat jij deze voorwaarden hebt geschonden? Dan krijg je het bedrag voor de
            volledige versie terug.
          </li>
          <li>
            Na beëindiging verwijderen wij je gegevens volgens artikel 11. Maak daarom vooraf een kopie van gegevens die
            je wilt bewaren.
          </li>
        </LegalList>
      </LegalSection>

      <LegalSection title="16. Klachten">
        <p>
          Ben je ergens niet tevreden over? Mail ons via <MailLink email={COMPANY.email} /> met een duidelijke
          omschrijving. We bevestigen je klacht en reageren inhoudelijk binnen 5 werkdagen. Hebben we meer tijd nodig,
          dan laten we dat binnen die termijn weten. We zoeken samen met je naar een oplossing.
        </p>
      </LegalSection>

      <LegalSection title="17. Wijzigingen in deze voorwaarden">
        <p>
          We kunnen deze voorwaarden aanpassen, bijvoorbeeld door nieuwe functies of nieuwe regelgeving. Bij een
          wezenlijke wijziging informeren wij je minimaal 30 dagen vooraf per e-mail of in de app. Voor een
          aankoop die je al hebt gedaan, blijven de voorwaarden gelden die golden op het moment van die aankoop, tenzij
          de wijziging in jouw voordeel is of wettelijk verplicht is.
        </p>
      </LegalSection>

      <LegalSection title="18. Toepasselijk recht en rechter">
        <LegalList>
          <li>Op deze voorwaarden en op iedere overeenkomst met ons is Nederlands recht van toepassing.</li>
          <li>Het Weens Koopverdrag is niet van toepassing.</li>
          <li>
            Geschillen worden voorgelegd aan de bevoegde rechter van de rechtbank Limburg, tenzij dwingend recht
            anders bepaalt. Als consument kun je een geschil altijd ook voorleggen aan de rechter die volgens de wet
            bevoegd is in jouw woonplaats, en blijft de dwingende bescherming van het recht van je woonland gelden.
          </li>
          <li>
            Is een bepaling in deze voorwaarden niet geldig of niet afdwingbaar? Dan blijven de overige bepalingen
            gelden en vervangen wij die bepaling door een geldige die zo dicht mogelijk bij de bedoeling ligt.
          </li>
        </LegalList>
      </LegalSection>
    </LegalPage>
  );
}
