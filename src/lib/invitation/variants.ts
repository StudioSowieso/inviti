import type { createClient } from "@/lib/supabase/server";

type Db = Awaited<ReturnType<typeof createClient>>;

export const DAY_GROUP = "Dag-gasten";
export const EVENING_GROUP = "Avond-gasten";

export type Variant = { id: string; groupId: string; name: string; guestCount: number };

type InvRow = { id: string; group_id: string | null; theme_slug: string; config: unknown };

/**
 * Elke uitnodiging hoort bij een groep uit de gastenlijst. Zorgt dat Dag-gasten en Avond-gasten bestaan
 * (bij een bestaande uitnodiging zonder groep) en dat elke groep met gasten een uitnodiging heeft.
 */
export async function ensureVariants(supabase: Db, userId: string): Promise<{ variants: Variant[]; rows: InvRow[] }> {
  const [{ data: invs }, { data: groups }, { data: guests }] = await Promise.all([
    supabase.from("invitations").select("id, group_id, theme_slug, config").order("created_at", { ascending: true }),
    supabase.from("guest_groups").select("id, name").order("created_at", { ascending: true }),
    supabase.from("guests").select("group_id").not("group_id", "is", null),
  ]);
  const rows = ((invs ?? []) as InvRow[]).slice();
  const allGroups = ((groups ?? []) as { id: string; name: string }[]).slice();
  if (!rows.length) return { variants: [], rows };

  const counts = new Map<string, number>();
  (guests ?? []).forEach((g) => counts.set(g.group_id as string, (counts.get(g.group_id as string) ?? 0) + 1));
  const base = rows[0];

  async function groupId(name: string) {
    const found = allGroups.find((g) => g.name === name);
    if (found) return found.id;
    const { data } = await supabase.from("guest_groups").insert({ name, owner_id: userId }).select("id, name").single();
    if (!data) return null;
    allGroups.push({ id: data.id as string, name });
    return data.id as string;
  }

  async function addVariant(gid: string) {
    const { data } = await supabase
      .from("invitations")
      .insert({ owner_id: userId, group_id: gid, theme_slug: base.theme_slug, config: base.config })
      .select("id, group_id, theme_slug, config")
      .single();
    if (data) rows.push(data as InvRow);
  }

  // Bestaande uitnodiging zonder groep wordt de uitnodiging voor Dag-gasten; daarnaast komt Avond-gasten.
  const legacy = rows.find((r) => !r.group_id);
  if (legacy) {
    const day = await groupId(DAY_GROUP);
    if (day) {
      await supabase.from("invitations").update({ group_id: day }).eq("id", legacy.id);
      legacy.group_id = day;
    }
    const evening = await groupId(EVENING_GROUP);
    if (evening && !rows.some((r) => r.group_id === evening)) await addVariant(evening);
  }

  // Elke groep met gasten heeft een eigen uitnodiging.
  for (const g of allGroups) {
    if ((counts.get(g.id) ?? 0) > 0 && !rows.some((r) => r.group_id === g.id)) await addVariant(g.id);
  }

  const variants = rows
    .filter((r) => r.group_id)
    .map((r) => {
      const g = allGroups.find((x) => x.id === r.group_id);
      return { id: r.id, groupId: r.group_id as string, name: g?.name ?? "Groep", guestCount: counts.get(r.group_id as string) ?? 0 };
    });
  return { variants, rows };
}
