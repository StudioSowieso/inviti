-- Aankopen: onderscheid echte betalingen van testbetalingen.
--
-- Preview en productie delen één database. Een betaling met een Stripe-testsleutel (preview) schrijft
-- dus in dezelfde tabel als een echte betaling. Met `livemode` blijft dat uit elkaar te houden:
--   livemode = true   echte betaling (live-sleutel, productie)
--   livemode = false  testbetaling (testsleutel, preview)
--
-- Bestaande rijen zijn echt (default true). Opruimen van testaankopen na het testen:
--   delete from public.purchases where livemode = false;
--
-- Toegang (`has_paid`, `owner_has_access`) verandert niet: een testaankoop opent Versturen alleen voor het
-- testaccount waarmee is betaald. Echte klanten kunnen niet met een testsleutel betalen, want de app
-- weigert een testsleutel op productie (zie billingAvailable in src/lib/stripe.ts).

alter table public.purchases
  add column if not exists livemode boolean not null default true;

comment on column public.purchases.livemode is
  'true = echte betaling, false = testbetaling met een Stripe-testsleutel (preview).';
