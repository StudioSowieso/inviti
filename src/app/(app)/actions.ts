"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

export async function signOut() {
  const supabase = await createClient();
  await supabase.auth.signOut();
  redirect("/inloggen");
}

export async function toggleTodo(id: string, done: boolean) {
  const supabase = await createClient();
  await supabase.from("todos").update({ done }).eq("id", id);
  revalidatePath("/dashboard");
  revalidatePath("/todo");
}

export async function deleteTodo(id: string) {
  const supabase = await createClient();
  // Systeemitems (met system_key) blijven altijd staan.
  await supabase.from("todos").delete().eq("id", id).is("system_key", null);
  revalidatePath("/dashboard");
  revalidatePath("/todo");
}

export type TodoFormState = { error: string | null; saved: number };

export async function addTodo(
  prev: TodoFormState,
  formData: FormData,
): Promise<TodoFormState> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/inloggen");

  const title = clean(formData.get("title"));
  if (!title) return { error: "Geef je to-do een titel.", saved: prev.saved };
  if (title.length > 160) {
    return { error: "Houd de titel onder de 160 tekens.", saved: prev.saved };
  }

  const dueRaw = clean(formData.get("due_date"));
  const dueDate = dueRaw && /^\d{4}-\d{2}-\d{2}$/.test(dueRaw) ? dueRaw : null;

  const { error } = await supabase.from("todos").insert({
    owner_id: user.id,
    title,
    due_date: dueDate,
    assignee: clean(formData.get("assignee")),
  });

  if (error) {
    return { error: "De to-do kon niet worden opgeslagen. Probeer het opnieuw.", saved: prev.saved };
  }

  revalidatePath("/dashboard");
  revalidatePath("/todo");
  return { error: null, saved: prev.saved + 1 };
}

export async function setGuestStatus(id: string, status: "pending" | "attending" | "declined") {
  const supabase = await createClient();
  await supabase.from("guests").update({ rsvp_status: status }).eq("id", id);
  revalidatePath("/gasten");
  revalidatePath("/dashboard");
}

export async function deleteGuest(id: string) {
  const supabase = await createClient();
  await supabase.from("guests").delete().eq("id", id);
  revalidatePath("/gasten");
  revalidatePath("/dashboard");
}

export type GuestFormState = { error: string | null };

function clean(value: FormDataEntryValue | null) {
  const v = typeof value === "string" ? value.trim() : "";
  return v.length ? v : null;
}

async function readGuestForm(
  supabase: Awaited<ReturnType<typeof createClient>>,
  ownerId: string,
  formData: FormData,
): Promise<{ error: string } | { values: Record<string, string | null> }> {
  const firstName = clean(formData.get("first_name"));
  if (!firstName) return { error: "Vul in elk geval een voornaam in." };

  const email = clean(formData.get("email"));
  if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return { error: "Dit e-mailadres lijkt niet te kloppen." };
  }

  // Groep zoeken of aanmaken
  let groupId: string | null = null;
  const groupName = clean(formData.get("group"));
  if (groupName) {
    const { data: existing } = await supabase
      .from("guest_groups")
      .select("id")
      .eq("name", groupName)
      .maybeSingle();

    if (existing) {
      groupId = existing.id;
    } else {
      const { data: created, error } = await supabase
        .from("guest_groups")
        .insert({ name: groupName, owner_id: ownerId })
        .select("id")
        .single();
      if (error) return { error: "De groep kon niet worden opgeslagen. Probeer het opnieuw." };
      groupId = created.id;
    }
  }

  return {
    values: {
      first_name: firstName,
      last_name: clean(formData.get("last_name")),
      email,
      phone: clean(formData.get("phone")),
      plus_one_name: clean(formData.get("plus_one_name")),
      dietary: clean(formData.get("dietary")),
      group_id: groupId,
    },
  };
}

export async function addGuest(
  _prev: GuestFormState,
  formData: FormData,
): Promise<GuestFormState> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/inloggen");

  const parsed = await readGuestForm(supabase, user.id, formData);
  if ("error" in parsed) return { error: parsed.error };

  const { error } = await supabase.from("guests").insert({ owner_id: user.id, ...parsed.values });
  if (error) return { error: "De gast kon niet worden opgeslagen. Probeer het opnieuw." };

  revalidatePath("/gasten");
  revalidatePath("/dashboard");
  redirect("/gasten?toegevoegd=1");
}

export async function updateGuest(
  id: string,
  _prev: GuestFormState,
  formData: FormData,
): Promise<GuestFormState> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/inloggen");

  const parsed = await readGuestForm(supabase, user.id, formData);
  if ("error" in parsed) return { error: parsed.error };

  const { error } = await supabase.from("guests").update(parsed.values).eq("id", id);
  if (error) return { error: "De wijzigingen konden niet worden opgeslagen. Probeer het opnieuw." };

  revalidatePath("/gasten");
  revalidatePath("/dashboard");
  redirect("/gasten?bewerkt=1");
}

export type ImportRow = {
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  plus_one_name: string;
  dietary: string;
  group: string;
};

const MAX_IMPORT = 500;

/** Importeert gasten uit een gecontroleerde spreadsheet. Geeft het aantal toegevoegde gasten of een foutmelding. */
export async function importGuests(rows: ImportRow[]): Promise<{ error: string } | { count: number }> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/inloggen");

  if (!Array.isArray(rows) || rows.length === 0) return { error: "Er zijn geen gasten om te importeren." };
  if (rows.length > MAX_IMPORT) return { error: `Importeer maximaal ${MAX_IMPORT} gasten per keer.` };

  const cut = (v: unknown, max: number) => (typeof v === "string" ? v.trim().slice(0, max) : "");
  const cleaned = rows.map((r) => ({
    first_name: cut(r.first_name, 80),
    last_name: cut(r.last_name, 80) || null,
    email: cut(r.email, 160) || null,
    phone: cut(r.phone, 40) || null,
    plus_one_name: cut(r.plus_one_name, 120) || null,
    dietary: cut(r.dietary, 300) || null,
    group: cut(r.group, 60),
  }));
  if (cleaned.some((r) => !r.first_name)) return { error: "Elke gast heeft een voornaam nodig." };
  if (cleaned.some((r) => r.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(r.email))) {
    return { error: "Een of meer e-mailadressen kloppen niet." };
  }

  // Groepen: bestaande hergebruiken, ontbrekende aanmaken.
  const names = Array.from(new Set(cleaned.map((r) => r.group).filter(Boolean)));
  const groupIds = new Map<string, string>();
  if (names.length) {
    const { data: existing } = await supabase.from("guest_groups").select("id, name").in("name", names);
    (existing ?? []).forEach((g) => groupIds.set(g.name as string, g.id as string));
    const missing = names.filter((n) => !groupIds.has(n));
    if (missing.length) {
      const { data: created, error } = await supabase
        .from("guest_groups")
        .insert(missing.map((name) => ({ name, owner_id: user.id })))
        .select("id, name");
      if (error) return { error: "De groepen konden niet worden aangemaakt. Probeer het opnieuw." };
      (created ?? []).forEach((g) => groupIds.set(g.name as string, g.id as string));
    }
  }

  const { error } = await supabase.from("guests").insert(
    cleaned.map(({ group, ...r }) => ({ owner_id: user.id, ...r, group_id: group ? (groupIds.get(group) ?? null) : null })),
  );
  if (error) return { error: "De gasten konden niet worden opgeslagen. Probeer het opnieuw." };

  revalidatePath("/gasten");
  revalidatePath("/dashboard");
  revalidatePath("/versturen");
  return { count: cleaned.length };
}
