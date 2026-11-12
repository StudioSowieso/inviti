"use server";

import { revalidatePath } from "next/cache";
import { getIsAdmin } from "@/lib/admin";
import { createClient } from "@/lib/supabase/server";

export async function clearErrors() {
  if (!(await getIsAdmin())) return;
  const supabase = await createClient();
  // RLS laat alleen admins verwijderen; de filter dekt "alle rijen".
  await supabase.from("app_errors").delete().gte("created_at", "1970-01-01");
  revalidatePath("/admin/fouten");
  revalidatePath("/admin");
}
