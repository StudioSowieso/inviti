# Inviti

Online bruiloftsuitnodigingen en RSVP-beheer voor bruidsparen.

**Stack:** Next.js 15 (App Router) · Supabase (Auth + Postgres) · Tailwind CSS 4 · Vercel

## Omgevingen

| Branch    | Omgeving   | Vercel                  |
|-----------|------------|-------------------------|
| `main`    | Productie  | Production deployment   |
| `preview` | Preview    | Preview deployment      |

Werk altijd op `preview`; merge naar `main` via een pull request om naar productie te gaan.

## Schermen (fase 1)

- `/inloggen`: inloggen met een magic link (geen wachtwoord nodig)
- `/account-aanmaken`: naam, e-mail en wachtwoord
- `/dashboard`: RSVP-overzicht, snel starten en to-do's
- `/gasten`: gastenlijst met filters, CSV-export en RSVP-status per gast
- `/gasten/nieuw`: gast toevoegen (groepen worden automatisch aangemaakt)
- `/uitnodiging`: thema kiezen en de uitnodiging samenstellen (details, blokken, animatie) met live voorbeeld. Thema's staan in Sanity: zie `sanity/README.md`

## Database

Tabellen in Supabase (`public`), allemaal met Row Level Security per gebruiker:

- `profiles`: wordt automatisch aangemaakt bij registratie
- `guest_groups`: groepen zoals "Daggasten" en "Avondgasten"
- `guests`: gasten met `rsvp_status` (`pending` | `attending` | `declined`)
- `invitations`: één uitnodiging per gebruiker (`theme_slug` + `config` als JSON)
- `todos`: bij registratie gevuld met "Gastenlijst aanmaken" en "Uitnodigingen versturen". De eerste wordt automatisch afgevinkt zodra je je eerste gast toevoegt.

## Lokaal draaien

```bash
cp .env.example .env.local   # vul de publishable key in
npm install
npm run dev
```

## Supabase Auth instellen

In Supabase → Authentication → URL Configuration:

- **Site URL**: de productie-URL van Vercel
- **Redirect URLs**: `https://*-studio-sowieso.vercel.app/**`, de productie-URL + `/**` en `http://localhost:3000/**`
