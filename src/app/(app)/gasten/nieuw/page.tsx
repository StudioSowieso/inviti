import type { Metadata } from "next";
import { PageHeader } from "@/components/page-header";
import { firstName, greeting, coupleInitials } from "@/lib/format";
import { createClient, getUser } from "@/lib/supabase/server";
import { GuestForm } from "./guest-form";

export const metadata: Metadata = { title: "Gast toevoegen — Inviti" };

export default async function NewGuestPage() {
  const [supabase, user] = await Promise.all([createClient(), getUser()]);

  const [{ data: profile }, { data: groups }] = await Promise.all([
    supabase.from("profiles").select("full_name, partner_name").eq("id", user!.id).maybeSingle(),
    supabase.from("guest_groups").select("name").order("name"),
  ]);

  const name = profile?.full_name ?? user?.user_metadata?.full_name ?? "";

  return (
    <div className="mx-auto max-w-2xl space-y-7">
      <PageHeader
        greetingText={`${greeting()}, ${firstName(name)}`}
        title="Gast toevoegen"
        initials={coupleInitials(name, profile?.partner_name)}
        backHref="/gasten"
        hideSettings
      />
      <GuestForm groups={(groups ?? []).map((g) => g.name as string)} />
    </div>
  );
}
