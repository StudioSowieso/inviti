"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

/** Slaat het bericht op dat bij een WhatsApp of mail wordt meegestuurd. Leeg = terug naar de voorbeeldtekst. */
export async function saveInviteMessage(raw: string): Promise<{ ok: true } | { ok: false; error: string }> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/inloggen");

  const text = typeof raw === "string" ? raw.replace(/\r\n/g, "\n").trim().slice(0, 2000) : "";
  const { error } = await supabase
    .from("profiles")
    .update({ invite_message: text || null })
    .eq("id", user.id);
  if (error) return { ok: false, error: "Het bericht kon niet worden opgeslagen." };
  revalidatePath("/versturen");
  return { ok: true };
}

/** Vinkt een gast handmatig af als "uitnodiging verstuurd". Als iedereen is afgevinkt, vinkt ook het to-do item af. */
export async function setInviteSent(id: string, sent: boolean): Promise<{ ok: boolean }> {
  const supabase = await createClient();
  const { error } = await supabase.from("guests").update({ invite_sent: !!sent }).eq("id", id);
  if (error) return { ok: false };

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
