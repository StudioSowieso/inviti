"use server";

import { createClient as createAdminClient } from "@supabase/supabase-js";
import { SUPABASE_URL } from "@/lib/supabase/config";
import { createClient } from "@/lib/supabase/server";

/**
 * Snelkoppeling voor de testomgeving: met het testadres (TEST_LOGIN_EMAIL) log je direct in, zonder
 * link of code. Er wordt server-side een inloglink voor dat adres gemaakt en meteen gebruikt.
 *
 * Veiligheid: werkt nooit in productie (VERCEL_ENV=production) en alleen als TEST_LOGIN_EMAIL en
 * SUPABASE_SERVICE_ROLE_KEY zijn ingesteld. Zonder die instellingen doet deze functie niets.
 */
export async function tryTestLogin(email: string): Promise<{ ok: boolean }> {
  const testEmail = process.env.TEST_LOGIN_EMAIL?.trim().toLowerCase();
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (process.env.VERCEL_ENV === "production" || !testEmail || !serviceKey) return { ok: false };
  if (typeof email !== "string" || email.trim().toLowerCase() !== testEmail) return { ok: false };

  const admin = createAdminClient(SUPABASE_URL, serviceKey, { auth: { persistSession: false, autoRefreshToken: false } });
  const { data, error } = await admin.auth.admin.generateLink({ type: "magiclink", email: testEmail });
  const tokenHash = data?.properties?.hashed_token;
  if (error || !tokenHash) return { ok: false };

  const supabase = await createClient();
  const { error: verifyError } = await supabase.auth.verifyOtp({ type: "magiclink", token_hash: tokenHash });
  return { ok: !verifyError };
}
