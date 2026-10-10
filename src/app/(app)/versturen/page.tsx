import type { Metadata } from "next";
import { headers } from "next/headers";
import { PageHeader } from "@/components/page-header";
import { firstName, greeting, initials } from "@/lib/format";
import { normalizeConfig } from "@/lib/invitation/defaults";
import { createClient, getUser } from "@/lib/supabase/server";
import { SendView, type SendGroup, type SendGuest } from "./send-view";

export const metadata: Metadata = { title: "Versturen — Inviti" };

export default async function SendPage() {
  const [supabase, user, h] = await Promise.all([createClient(), getUser(), headers()]);

  const host = h.get("x-forwarded-host") ?? h.get("host") ?? "localhost:3000";
  const proto = h.get("x-forwarded-proto") ?? (host.startsWith("localhost") ? "http" : "https");
  const origin = `${proto}://${host}`;

  const [{ data: profile }, { data: invitation }, { data: guestRows }, { data: groupRows }] = await Promise.all([
    supabase.from("profiles").select("full_name").eq("id", user!.id).maybeSingle(),
    supabase.from("invitations").select("config").maybeSingle(),
    supabase
      .from("guests")
      .select("id, first_name, last_name, email, phone, invite_token, guest_groups(name)")
      .order("first_name", { ascending: true }),
    supabase.from("guest_groups").select("id, name, invite_token").order("name", { ascending: true }),
  ]);

  const name = profile?.full_name ?? user?.user_metadata?.full_name ?? "";
  const config = invitation ? normalizeConfig(invitation.config) : null;

  const guests: SendGuest[] = (guestRows ?? []).map((r) => {
    const group = r.guest_groups as unknown as { name: string } | { name: string }[] | null;
    return {
      id: r.id as string,
      firstName: r.first_name as string,
      lastName: (r.last_name as string | null) ?? "",
      email: r.email as string | null,
      phone: r.phone as string | null,
      token: r.invite_token as string,
      group: Array.isArray(group) ? (group[0]?.name ?? null) : (group?.name ?? null),
    };
  });

  const groups: SendGroup[] = (groupRows ?? []).map((g) => ({
    id: g.id as string,
    name: g.name as string,
    token: g.invite_token as string,
    members: guests.filter((x) => x.group === g.name).map((x) => `${x.firstName} ${x.lastName}`.trim()),
  }));

  return (
    <div className="space-y-7">
      <PageHeader
        greetingText={`${greeting()}, ${firstName(name)}`}
        title="Uitnodiging versturen"
        initials={initials(name)}
      />
      <SendView
        origin={origin}
        guests={guests}
        groups={groups}
        hasInvitation={!!invitation}
        couple={config ? { partner1: config.partner1, partner2: config.partner2, date: config.date } : null}
      />
    </div>
  );
}
