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

export async function addGuest(
  _prev: GuestFormState,
  formData: FormData,
): Promise<GuestFormState> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/inloggen");

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
        .insert({ name: groupName, owner_id: user.id })
        .select("id")
        .single();
      if (error) return { error: "De groep kon niet worden opgeslagen. Probeer het opnieuw." };
      groupId = created.id;
    }
  }

  const { error } = await supabase.from("guests").insert({
    owner_id: user.id,
    first_name: firstName,
    last_name: clean(formData.get("last_name")),
    email,
    phone: clean(formData.get("phone")),
    plus_one_name: clean(formData.get("plus_one_name")),
    dietary: clean(formData.get("dietary")),
    group_id: groupId,
  });

  if (error) return { error: "De gast kon niet worden opgeslagen. Probeer het opnieuw." };

  revalidatePath("/gasten");
  revalidatePath("/dashboard");
  redirect("/gasten?toegevoegd=1");
}
