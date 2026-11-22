"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient as createAdminClient } from "@supabase/supabase-js";
import { getHasPaid, WAIVER_VERSION } from "@/lib/billing";
import { SUPABASE_URL } from "@/lib/supabase/config";
import { createClient } from "@/lib/supabase/server";
import { logError } from "@/lib/log-error";

/** Slaat het bericht op dat bij een WhatsApp of mail wordt meegestuurd. Leeg = terug naar de voorbeeldtekst. */
export async function saveInviteMessage(raw: string): Promise<{ ok: true } | { ok: false; error: string }> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/inloggen");
  if (!(await getHasPaid())) return { ok: false, error: "Alleen beschikbaar in de volledige versie." };

  const text = typeof raw === "string" ? raw.replace(/\r\n/g, "\n").trim().slice(0, 2000) : "";
  const { error } = await supabase
    .from("profiles")
    .update({ invite_message: text || null })
    .eq("id", user.id);
  if (error) {
    await logError("saveInviteMessage", error?.message ?? "Onbekende databasefout", { detail: { code: error?.code } });
    return { ok: false, error: "Het bericht kon niet worden opgeslagen." };
  }
  revalidatePath("/versturen");
  return { ok: true };
}

/** Vinkt een gast handmatig af als "uitnodiging verstuurd". Als iedereen is afgevinkt, vinkt ook het to-do item af. */
export async function setInviteSent(id: string, sent: boolean): Promise<{ ok: boolean }> {
  if (!(await getHasPaid())) return { ok: false };
  const supabase = await createClient();
  const { error } = await supabase.from("guests").update({ invite_sent: !!sent }).eq("id", id);
  if (error) {
    await logError("setInviteSent", error?.message ?? "Onbekende databasefout", { detail: { code: error?.code } });
    return { ok: false };
  }

  const [{ count: total }, { count: done }] = await Promise.all([
    supabase.from("guests").select("id", { count: "exact", head: true }),
    supabase.from("guests").select("id", { count: "exact", head: true }).eq("invite_sent", true),
  ]);
  const all = (total ?? 0) > 0 && total === done;
  await supabase.from("todos").update({ done: all }).eq("system_key", "invitations_sent");

  revalidatePath("/versturen");
  revalidatePath("/dashboard");
  revalidatePath("/todo");
  return { ok: true };
}

/**
 * Legt vast dat de klant bij het eerste versturen uitdrukkelijk heeft bevestigd dat de dienst is uitgevoerd en dat
 * het herroepingsrecht daarmee vervalt. Schrijven kan alleen met de service role: klanten mogen hun aankoop niet wijzigen.
 */
export async function acceptWithdrawalWaiver(): Promise<{ ok: boolean }> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/inloggen");
  if (!(await getHasPaid())) return { ok: false };

  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!key) {
    await logError("acceptWithdrawalWaiver", "service role ontbreekt");
    return { ok: false };
  }
  const admin = createAdminClient(SUPABASE_URL, key, { auth: { persistSession: false, autoRefreshToken: false } });
  const { error } = await admin
    .from("purchases")
    .update({ withdrawal_waived_at: new Date().toISOString(), withdrawal_waiver_version: WAIVER_VERSION })
    .eq("user_id", user.id)
    .is("withdrawal_waived_at", null);
  if (error) {
    await logError("acceptWithdrawalWaiver", error.message, { detail: { code: error.code } });
    return { ok: false };
  }
  revalidatePath("/versturen/uitnodiging");
  return { ok: true };
}
