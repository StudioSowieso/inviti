# Inviti thema's in Sanity

De thema's van de uitnodiging (kleuren, lettertypes, knopvorm) staan in Sanity en zijn los van
releases van Inviti te bewerken. Een thema aanpassen of toevoegen vraagt dus geen deploy.

```
Sanity Studio (inviti.sanity.studio)  ──►  Sanity dataset  ──►  Inviti (Next.js) leest thema's
        thema bewerken                       concept / gepubliceerd     preview: concepten
                                                                        productie: gepubliceerd
```

- **Preview** (`preview`-branch) leest ook **concepten** (perspective `drafts`): je ziet een wijziging
  direct, nog voordat je op *Publish* klikt.
- **Productie** (`main`) leest alleen **gepubliceerde** thema's. Na *Publish* ververst een webhook de
  cache direct (anders na uiterlijk 1 uur).
- Zonder Sanity-instellingen gebruikt Inviti 3 ingebouwde thema's (`src/lib/invitation/fallback-themes.ts`).
  Ook als Sanity tijdelijk onbereikbaar is werkt alles gewoon door.

## 1. Sanity-project (al aangemaakt)

- Project: **Inviti**, Project ID `98wj3rgp`, dataset `production` (publiek leesbaar).
- De startthema's zijn *Basic* (slug `creme-taupe`), *Nature*, *Leaf*, *Modern* en *Sweet*. *Bosgroen & Blush* is verwijderd (in Sanity op niet-actief gezet).
- Het thema *Nature* (slug `nature`, stijl **Natuur**) staat als **concept** in de dataset, zodat de preview-omgeving
  het al toont. Publiceer het pas nadat de code van `preview` naar `main` is gegaan; anders zou productie het
  thema nog zonder de nieuwe vormgeving laten zien.
  Draai daarom **niet** `npm run import-themes` op deze dataset: dat maakt dubbele thema's.
  (`seed/themes.ndjson` is alleen bedoeld voor een nieuwe, lege dataset.)

## 2. Studio starten

```bash
cd sanity
cp .env.example .env          # zet SANITY_STUDIO_PROJECT_ID=98wj3rgp
npm install
npx sanity login
npm run dev                   # Studio op http://localhost:3333
```

## 3. Studio publiceren (zodat je er zonder code bij kunt)

```bash
npm run deploy                # kies hostnaam "inviti" -> https://inviti.sanity.studio
```

Nodig collega's uit via <https://www.sanity.io/manage> -> *Members*.

## 4. Environment variables in Vercel

Maak in Sanity een token: <https://www.sanity.io/manage> -> project -> *API* -> *Tokens* -> *Add API token*,
rol **Viewer**. Zet daarna in Vercel (Project -> Settings -> Environment Variables):

| Variabele                  | Preview (`preview`)   | Production (`main`) |
|----------------------------|-----------------------|---------------------|
| `SANITY_PROJECT_ID`        | je Project ID         | je Project ID       |
| `SANITY_DATASET`           | `production`          | `production`        |
| `SANITY_PERSPECTIVE`       | `drafts`              | `published`         |
| `SANITY_API_READ_TOKEN`    | het Viewer-token (nodig voor `drafts`) | niet nodig zolang de dataset publiek is |
| `SANITY_REVALIDATE_SECRET` | n.v.t.                | zelfbedacht geheim (lang, willekeurig) |

Redeploy daarna (Deployments -> ... -> Redeploy) zodat de waarden worden gebruikt.

## 5. Webhook voor productie

Op <https://www.sanity.io/manage> -> project -> *API* -> *Webhooks* -> *Create webhook*:

- **URL:** `https://<jullie-productiedomein>/api/revalidate/themes`
- **Dataset:** `production`
- **Trigger on:** Create, Update, Delete
- **Filter:** `_type == "invitationTheme"`
- **HTTP method:** `POST`
- **HTTP headers:** naam `x-revalidate-secret`, waarde = dezelfde als `SANITY_REVALIDATE_SECRET`
- **Drafts:** uitgevinkt (alleen bij publiceren)

## Werkwijze

1. Open de Studio -> *Uitnodigingsthema* -> pas een thema aan (of maak een nieuw thema).
2. De preview-omgeving toont de wijziging meteen (ververs de pagina).
3. Klik op **Publish** -> productie toont de wijziging binnen enkele seconden.

## Stijl van een thema

Naast kleuren, lettertypes en knopvorm heeft elk thema een **stijl**:

- **Standaard** (`classic`): vlakke secties.
- **Natuur** (`nature`): papieren textuur, gescheurde randen tussen de secties, botanische lijnicoontjes,
  een tijdlijn in het programma en de namen in het handschrift-lettertype (*Lettertype namen*).

- **Leaf** (`leaf`): elegant en rustig: boogvormige foto, dunne lijnen, olijftakken als scheiding en geen
  gescheurde randen; ook met het handschrift-lettertype voor de namen.

- **Sweet** (`sweet`): gestreept behang in twee kleuren, witte boogkaarten met dubbele rand, een strikje en
  cijfers met kleurverloop.
- **Modern** (`modern`): editorial zwart-wit op greige met witte kaarten, extra grote letters (de trouwdatum),
  handschrift voor koppen en rechthoekige knoppen.

De stijlen zijn code (`src/components/invitation/nature.tsx`, `leaf.tsx`, `modern.tsx` en `sweet.tsx`); kleuren en lettertypes blijven in Sanity te kiezen.
Een nieuwe stijl toevoegen vraagt dus een codewijziging, een nieuw thema met een bestaande stijl niet.

## Regels om te onthouden

- **Wijzig de slug nooit** van een thema dat al gebruikt wordt: uitnodigingen verwijzen er via de slug naar.
  Verwijderde of verborgen thema's blijven werken voor bestaande uitnodigingen (die vallen terug op het eerste thema
  als de slug helemaal niet meer bestaat).
- Kleuren zijn hex-codes (`#f4f0ea`). Lettertypes komen uit een vaste lijst; een nieuw lettertype toevoegen vraagt
  een kleine codewijziging in `src/lib/invitation/fonts.ts` én de lijst in `sanity/schemaTypes/invitationTheme.ts`.
- Het bewerken van thema's raakt de gasten of uitnodigingsteksten van gebruikers niet.

## Kleuropties per thema

Elk thema heeft drie kleuropties: "Standaard" (de kleuren die je in Sanity instelt) en twee extra paletten.
De extra paletten staan in `src/lib/invitation/palettes.ts` (per thema-slug). Een thema zonder eigen paletten
krijgt automatisch een warme en een koele variant van de Sanity-kleuren. De gekozen optie wordt per uitnodiging
opgeslagen in `config.palette`; er is dus geen Sanity-wijziging of databasemigratie nodig.

