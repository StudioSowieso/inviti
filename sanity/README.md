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
- Zonder Sanity-instellingen gebruikt Inviti 2 ingebouwde thema's (`src/lib/invitation/fallback-themes.ts`).
  Ook als Sanity tijdelijk onbereikbaar is werkt alles gewoon door.

## 1. Sanity-project aanmaken

1. Maak een account op <https://www.sanity.io> en kies **Create new project** op <https://www.sanity.io/manage>.
2. Naam: `Inviti`, dataset: `production`. Noteer het **Project ID**.

## 2. Studio starten en thema's importeren

```bash
cd sanity
cp .env.example .env          # vul SANITY_STUDIO_PROJECT_ID in
npm install
npx sanity login
npm run dev                   # Studio op http://localhost:3333
npm run import-themes         # importeert de 2 startthema's uit seed/themes.ndjson
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
| `SANITY_API_READ_TOKEN`    | het Viewer-token      | alleen nodig bij een privé-dataset |
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

## Regels om te onthouden

- **Wijzig de slug nooit** van een thema dat al gebruikt wordt: uitnodigingen verwijzen er via de slug naar.
  Verwijderde of verborgen thema's blijven werken voor bestaande uitnodigingen (die vallen terug op het eerste thema
  als de slug helemaal niet meer bestaat).
- Kleuren zijn hex-codes (`#f4f0ea`). Lettertypes komen uit een vaste lijst; een nieuw lettertype toevoegen vraagt
  een kleine codewijziging in `src/lib/invitation/fonts.ts` én de lijst in `sanity/schemaTypes/invitationTheme.ts`.
- Het bewerken van thema's raakt de gasten of uitnodigingsteksten van gebruikers niet.
