"use server";

import { createClient } from "@/lib/supabase/server";

/**
 * Snelkoppeling voor de testomgeving: met het testadres (TEST_LOGIN_EMAIL) log je direct in, zonder
 * link of wachtwoord, met het wachtwoord uit TEST_LOGIN_PASSWORD.
 *
 * Veiligheid: werkt nooit in productie (VERCEL_ENV=production), en alleen als beide variabelen zijn
 * ingesteld. Zonder die instellingen doet deze functie niets.
 */
export async function tryTestLogin(email: string): Promise<{ ok: boolean }> {
  const testEmail = process.env.TEST_LOGIN_EMAIL?.trim().toLowerCase();
  const testPassword = process.env.TEST_LOGIN_PASSWORD;
  if (process.env.VERCEL_ENV === "production" || !testEmail || !testPassword) return { ok: false };
  if (typeof email !== "string" || email.trim().toLowerCase() !== testEmail) return { ok: false };

  const supabase = await createClient();
  const { error } = await supabase.auth.signInWithPassword({ email: testEmail, password: testPassword });
  return { ok: !error };
}
