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

  // Eén uitnodiging per gebruiker: bestaat er al een, dan blijft die ongewijzigd.
  const { error } = await supabase.from("invitations").insert({ owner_id: user.id, theme_slug: slug, config });
  if (error && error.code !== "23505") {
    console.error("[createInvitation]", error);
  }

  revalidatePath("/uitnodiging");
  redirect("/uitnodiging");
}

export type SaveResult = { ok: true; savedAt: string } | { ok: false; error: string };

export async function saveInvitation(themeSlug: string, rawConfig: unknown): Promise<SaveResult> {
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
    .eq("owner_id", user.id)
    .select("updated_at")
    .maybeSingle();

  if (error || !data) {
    console.error("[saveInvitation]", error);
    return { ok: false, error: "Opslaan is niet gelukt. Probeer het opnieuw." };
  }

  revalidatePath("/uitnodiging");
  return { ok: true, savedAt: data.updated_at as string };
}
