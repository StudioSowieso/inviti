import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { PageHeader } from "@/components/page-header";
import { firstName, greeting, initials } from "@/lib/format";
import { createClient, getUser } from "@/lib/supabase/server";
import { GuestForm } from "../../nieuw/guest-form";

export const metadata: Metadata = { title: "Gast bewerken — Inviti" };

export default async function EditGuestPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const [supabase, user] = await Promise.all([createClient(), getUser()]);

  const [{ data: profile }, { data: groups }, { data: guest }] = await Promise.all([
    supabase.from("profiles").select("full_name").eq("id", user!.id).maybeSingle(),
    supabase.from("guest_groups").select("name").order("name"),
    supabase
      .from("guests")
      .select("id, first_name, last_name, email, phone, plus_one_name, dietary, guest_groups(name)")
      .eq("id", id)
      .maybeSingle(),
  ]);
  if (!guest) notFound();

  const group = guest.guest_groups as unknown as { name: string } | { name: string }[] | null;
  const groupName = Array.isArray(group) ? (group[0]?.name ?? "") : (group?.name ?? "");
  const name = profile?.full_name ?? user?.user_metadata?.full_name ?? "";

  return (
    <div className="mx-auto max-w-2xl space-y-7">
      <PageHeader
        greetingText={`${greeting()}, ${firstName(name)}`}
        title="Gast bewerken"
        initials={initials(name)}
        backHref="/gasten"
        hideSettings
      />
      <GuestForm
        groups={(groups ?? []).map((g) => g.name as string)}
        guest={{
          id: guest.id as string,
          firstName: (guest.first_name as string) ?? "",
          lastName: (guest.last_name as string | null) ?? "",
          email: (guest.email as string | null) ?? "",
          phone: (guest.phone as string | null) ?? "",
          plusOne: (guest.plus_one_name as string | null) ?? "",
          group: groupName,
          dietary: (guest.dietary as string | null) ?? "",
        }}
      />
    </div>
  );
}
