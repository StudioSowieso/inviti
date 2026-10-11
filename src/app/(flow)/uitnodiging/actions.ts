"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { normalizeConfig } from "@/lib/invitation/defaults";
import { validPalette } from "@/lib/invitation/palettes";
import { getThemes } from "@/lib/invitation/themes";
import { createClient } from "@/lib/supabase/server";

export async function createInvitation(formData: FormData) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/inloggen");

  const slug = String(formData.get("theme") ?? "");
  const { themes } = await getThemes();
  const chosen = themes.find((t) => t.slug === slug);
  if (!chosen) redirect("/uitnodiging");

  const { data: profile } = await supabase
    .from("profiles")
    .select("full_name, partner_name, wedding_date")
    .eq("id", user.id)
    .maybeSingle();

  const config = normalizeConfig(
    {},
    {
      partner1: (profile?.full_name as string | null)?.split(" ")[0] ?? undefined,
      partner2: (profile?.partner_name as string | null)?.split(" ")[0] ?? undefined,
      date: (profile?.wedding_date as string | null) ?? undefined,
    },
  );

  config.palette = validPalette(chosen, String(formData.get("palette") ?? ""));

  // Bestaat er al een uitnodiging, dan blijft die ongewijzigd. De groepen (Dag-/Avond-gasten) volgen bij het openen.
  const { count } = await supabase.from("invitations").select("id", { count: "exact", head: true });
  if (!count) {
    const { error } = await supabase.from("invitations").insert({ owner_id: user.id, theme_slug: slug, config });
    if (error) console.error("[createInvitation]", error);
  }

  revalidatePath("/uitnodiging");
  redirect("/uitnodiging");
}

export type SaveResult = { ok: true; savedAt: string } | { ok: false; error: string };

export async function saveInvitation(id: string, themeSlug: string, rawConfig: unknown): Promise<SaveResult> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { ok: false, error: "Je bent uitgelogd. Log opnieuw in om op te slaan." };

  const { themes } = await getThemes();
  if (!themes.some((t) => t.slug === themeSlug)) {
    return { ok: false, error: "Dit thema bestaat niet meer. Kies een ander thema." };
  }

  const config = normalizeConfig(rawConfig);
  const theme = themes.find((t) => t.slug === themeSlug)!;
  config.palette = validPalette(theme, config.palette);
  const { data, error } = await supabase
    .from("invitations")
    .update({ theme_slug: themeSlug, config })
    .eq("id", id)
    .select("updated_at")
    .maybeSingle();

  if (error || !data) {
    console.error("[saveInvitation]", error);
    return { ok: false, error: "Opslaan is niet gelukt. Probeer het opnieuw." };
  }

  // Thema, kleuren, animatie en details gelden voor alle uitnodigingen; alleen de blokken verschillen per groep.
  const { data: others } = await supabase.from("invitations").select("id, config").neq("id", id);
  for (const o of others ?? []) {
    const oc = normalizeConfig(o.config);
    await supabase
      .from("invitations")
      .update({
        theme_slug: themeSlug,
        config: {
          ...oc,
          partner1: config.partner1,
          partner2: config.partner2,
          date: config.date,
          time: config.time,
          city: config.city,
          animation: config.animation,
          palette: config.palette,
        },
      })
      .eq("id", o.id as string);
  }

  revalidatePath("/uitnodiging");
  return { ok: true, savedAt: data.updated_at as string };
}

// ---------- Uitnodigingen per groep ----------

export type VariantResult = { ok: true; id?: string } | { ok: false; error: string };

function cleanName(raw: string) {
  return raw.trim().replace(/\s+/g, " ").slice(0, 60);
}

async function currentUser() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  return { supabase, user };
}

function revalidateVariants() {
  revalidatePath("/uitnodiging");
  revalidatePath("/gasten");
  revalidatePath("/versturen");
}

/** Nieuwe uitnodiging voor een nieuwe groep; de inhoud begint als kopie van de huidige uitnodiging. */
export async function createVariant(rawName: string, fromId: string): Promise<VariantResult> {
  const { supabase, user } = await currentUser();
  if (!user) return { ok: false, error: "Je bent uitgelogd." };
  const name = cleanName(rawName);
  if (!name) return { ok: false, error: "Geef de groep een naam." };

  const { data: source } = await supabase.from("invitations").select("theme_slug, config").eq("id", fromId).maybeSingle();
  if (!source) return { ok: false, error: "De huidige uitnodiging is niet gevonden." };

  let groupId: string | null = null;
  const { data: existing } = await supabase.from("guest_groups").select("id").eq("name", name).maybeSingle();
  if (existing) {
    const { count } = await supabase.from("invitations").select("id", { count: "exact", head: true }).eq("group_id", existing.id);
    if (count) return { ok: false, error: "Er is al een uitnodiging voor deze groep." };
    groupId = existing.id as string;
  } else {
    const { data: created, error } = await supabase.from("guest_groups").insert({ name, owner_id: user.id }).select("id").single();
    if (error || !created) return { ok: false, error: "De groep kon niet worden aangemaakt." };
    groupId = created.id as string;
  }

  const { data, error } = await supabase
    .from("invitations")
    .insert({ owner_id: user.id, group_id: groupId, theme_slug: source.theme_slug, config: source.config })
    .select("id")
    .single();
  if (error || !data) return { ok: false, error: "De uitnodiging kon niet worden aangemaakt." };
  revalidateVariants();
  return { ok: true, id: data.id as string };
}

/** Hernoemt de uitnodiging én de bijbehorende groep in de gastenlijst. */
export async function renameVariant(id: string, rawName: string): Promise<VariantResult> {
  const { supabase, user } = await currentUser();
  if (!user) return { ok: false, error: "Je bent uitgelogd." };
  const name = cleanName(rawName);
  if (!name) return { ok: false, error: "Geef de groep een naam." };

  const { data: inv } = await supabase.from("invitations").select("group_id").eq("id", id).maybeSingle();
  if (!inv?.group_id) return { ok: false, error: "Deze uitnodiging is niet gevonden." };
  const { data: clash } = await supabase.from("guest_groups").select("id").eq("name", name).neq("id", inv.group_id).maybeSingle();
  if (clash) return { ok: false, error: "Er bestaat al een groep met deze naam." };

  const { error } = await supabase.from("guest_groups").update({ name }).eq("id", inv.group_id);
  if (error) return { ok: false, error: "De naam kon niet worden gewijzigd." };
  revalidateVariants();
  return { ok: true };
}

/** Verwijdert een uitnodiging en de lege groep erbij. Alleen als er geen gasten in de groep zitten. */
export async function deleteVariant(id: string): Promise<VariantResult> {
  const { supabase, user } = await currentUser();
  if (!user) return { ok: false, error: "Je bent uitgelogd." };

  const { count: total } = await supabase.from("invitations").select("id", { count: "exact", head: true });
  if ((total ?? 0) <= 1) return { ok: false, error: "Je hebt minimaal één uitnodiging nodig." };

  const { data: inv } = await supabase.from("invitations").select("group_id").eq("id", id).maybeSingle();
  if (!inv?.group_id) return { ok: false, error: "Deze uitnodiging is niet gevonden." };
  const { count: guests } = await supabase.from("guests").select("id", { count: "exact", head: true }).eq("group_id", inv.group_id);
  if (guests) return { ok: false, error: "Er zitten nog gasten in deze groep. Verplaats ze eerst in de gastenlijst." };

  // De uitnodiging verdwijnt mee met de groep.
  await supabase.from("guest_groups").delete().eq("id", inv.group_id);
  revalidateVariants();
  return { ok: true };
}
