import type { createClient } from "@/lib/supabase/server";

type Db = Awaited<ReturnType<typeof createClient>>;

const KEY = "invitation_created";

/**
 * Zorgt dat het geautomatiseerde item "Uitnodiging maken" bestaat en wordt afgevinkt
 * zodra er een uitnodiging is aangemaakt.
 */
export async function syncSystemTodos(supabase: Db, userId: string) {
  const [{ data: item }, { data: invitation }] = await Promise.all([
    supabase.from("todos").select("id, done").eq("system_key", KEY).maybeSingle(),
    supabase.from("invitations").select("owner_id").maybeSingle(),
  ]);
  const hasInvitation = !!invitation;

  if (!item) {
    // Bovenaan de lijst: net voor het oudste bestaande item.
    const { data: first } = await supabase
      .from("todos")
      .select("created_at")
      .order("created_at", { ascending: true })
      .limit(1)
      .maybeSingle();
    const createdAt = first?.created_at ? new Date(new Date(first.created_at as string).getTime() - 1000) : new Date();
    await supabase.from("todos").insert({
      owner_id: userId,
      title: "Uitnodiging maken",
      system_key: KEY,
      done: hasInvitation,
      created_at: createdAt.toISOString(),
    });
  } else if (hasInvitation && !item.done) {
    await supabase.from("todos").update({ done: true }).eq("id", item.id as string);
  }
}
