import type { createClient } from "@/lib/supabase/server";

type Db = Awaited<ReturnType<typeof createClient>>;

/** Verwijdert groepen waar geen enkele gast meer in zit. */
export async function pruneEmptyGroups(supabase: Db) {
  const [{ data: groups }, { data: used }] = await Promise.all([
    supabase.from("guest_groups").select("id"),
    supabase.from("guests").select("group_id").not("group_id", "is", null),
  ]);
  const inUse = new Set((used ?? []).map((g) => g.group_id as string));
  const empty = (groups ?? []).map((g) => g.id as string).filter((id) => !inUse.has(id));
  if (empty.length) await supabase.from("guest_groups").delete().in("id", empty);
}

