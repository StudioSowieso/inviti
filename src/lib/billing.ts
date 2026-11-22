import { createClient as createAdminClient } from "@supabase/supabase-js";
import { redirect } from "next/navigation";
import { cache } from "react";
import { SUPABASE_URL } from "@/lib/supabase/config";
import { createClient } from "@/lib/supabase/server";
import { PRICE_CENTS, type StripeSession } from "@/lib/stripe";

/** Heeft de ingelogde gebruiker betaald (of is admin)? De check zit in de database (`has_paid`). */
export const getHasPaid = cache(async (): Promise<boolean> => {
  const supabase = await createClient();
  const { data } = await supabase.rpc("has_paid");
  return data === true;
});

/** Zet op elke beschermde pagina en in elke beschermde actie: niet-betalers gaan naar /upgrade. */
export async function requirePaid() {
  if (!(await getHasPaid())) redirect("/upgrade");
}

const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

/** Legt een geslaagde betaling vast. Alleen voor betaalde sessies met het juiste bedrag. */
export async function fulfilSession(s: StripeSession): Promise<{ ok: boolean; reason?: string }> {
  const userId = s.client_reference_id;
  if (s.mode !== "payment" || s.payment_status !== "paid") return { ok: false, reason: "niet betaald" };
  if (s.amount_total !== PRICE_CENTS || s.currency !== "eur") return { ok: false, reason: "bedrag klopt niet" };
  if (!userId || !UUID.test(userId)) return { ok: false, reason: "geen gebruiker" };
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!key) return { ok: false, reason: "service role ontbreekt" };

  const admin = createAdminClient(SUPABASE_URL, key, { auth: { persistSession: false, autoRefreshToken: false } });
  const { error } = await admin.from("purchases").upsert(
    {
      user_id: userId,
      stripe_session_id: s.id,
      stripe_payment_intent: s.payment_intent,
      amount_total: s.amount_total,
      currency: s.currency,
      livemode: s.livemode, // false = testbetaling (Stripe-testsleutel); preview en productie delen één database
    },
    { onConflict: "user_id", ignoreDuplicates: true },
  );
  return error ? { ok: false, reason: error.message } : { ok: true };
}

/**
 * Heeft de klant bij het eerste versturen uitdrukkelijk afstand gedaan van het herroepingsrecht?
 * Zonder aankoopregel (bijvoorbeeld een beheerder) is er niets om vast te leggen en tonen we de melding niet.
 */
export async function getWithdrawalWaived(): Promise<boolean> {
  const supabase = await createClient();
  const { data } = await supabase.from("purchases").select("withdrawal_waived_at").maybeSingle();
  if (!data) return true;
  return !!data.withdrawal_waived_at;
}

/** Versie van de tekst waarmee de klant akkoord gaat; verhoog bij elke inhoudelijke wijziging van de melding. */
export const WAIVER_VERSION = "2026-11-22";
