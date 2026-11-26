"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { getIsAdmin } from "@/lib/admin";
import { createClient } from "@/lib/supabase/server";

/** Geef een bestaand account gratis toegang tot de volledige versie (de database controleert nogmaals of je admin bent). */
export async function grantFreeAccess(formData: FormData) {
  if (!(await getIsAdmin())) return;
  const email = String(formData.get("email") ?? "").trim();
  const note = String(formData.get("note") ?? "").trim().slice(0, 200);
  if (!email) redirect("/admin/gebruikers?gratis=leeg");
  const supabase = await createClient();
  const { data, error } = await supabase.rpc("admin_grant_free_access", { p_email: email, p_note: note || null });
  revalidatePath("/admin/gebruikers");
  redirect(`/admin/gebruikers?gratis=${error ? "fout" : data ? "ok" : "onbekend"}`);
}

export async function revokeFreeAccess(formData: FormData) {
  if (!(await getIsAdmin())) return;
  const id = String(formData.get("user_id") ?? "");
  if (!/^[0-9a-f-]{36}$/i.test(id)) return;
  const supabase = await createClient();
  await supabase.rpc("admin_revoke_free_access", { p_user: id });
  revalidatePath("/admin/gebruikers");
  redirect("/admin/gebruikers?gratis=ingetrokken");
}
