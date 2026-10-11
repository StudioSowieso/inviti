import type { Metadata } from "next";
import Link from "next/link";
import { ChevronRightIcon, PlusIcon } from "@/components/icons";
import { PageHeader } from "@/components/page-header";
import { firstName, greeting, coupleInitials, type RsvpStatus } from "@/lib/format";
import { pruneEmptyGroups } from "@/lib/prune-groups";
import { createClient, getUser } from "@/lib/supabase/server";
import { GuestList, type Guest, type GroupInfo } from "./guest-list";

export const metadata: Metadata = { title: "Gastenlijst — Inviti" };

// Op de server opgemaakt in Nederlandse tijd, zodat server en browser hetzelfde tonen.
function formatResponded(iso: string) {
  return new Intl.DateTimeFormat("nl-NL", {
    day: "numeric",
    month: "long",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    timeZone: "Europe/Amsterdam",
  }).format(new Date(iso));
}

export default async function GuestsPage({
  searchParams,
}: {
  searchParams: Promise<{ toegevoegd?: string; bewerkt?: string; geimporteerd?: string }>;
}) {
  const { toegevoegd, bewerkt, geimporteerd } = await searchParams;
  const [supabase, user] = await Promise.all([createClient(), getUser()]);

  await pruneEmptyGroups(supabase);

  const [{ data: groupRows }, { data: invGroups }] = await Promise.all([
    supabase.from("guest_groups").select("id, name").order("name"),
    supabase.from("invitations").select("group_id").not("group_id", "is", null),
  ]);

  const [{ data: profile }, { data: rows }] = await Promise.all([
    supabase.from("profiles").select("full_name, partner_name").eq("id", user!.id).maybeSingle(),
    supabase
      .from("guests")
      .select(
        "id, first_name, last_name, email, phone, plus_one_name, dietary, rsvp_status, rsvp_response, rsvp_responded_at, created_at, guest_groups(name)",
      )
      .order("created_at", { ascending: false }),
  ]);

  const name = profile?.full_name ?? user?.user_metadata?.full_name ?? "";

  const guests: Guest[] = (rows ?? []).map((r) => {
    const group = r.guest_groups as unknown as { name: string } | { name: string }[] | null;
    const groupName = Array.isArray(group) ? (group[0]?.name ?? null) : (group?.name ?? null);
    return {
      id: r.id as string,
      firstName: r.first_name as string,
      lastName: (r.last_name as string | null) ?? "",
      email: r.email as string | null,
      phone: r.phone as string | null,
      plusOne: r.plus_one_name as string | null,
      dietary: r.dietary as string | null,
      status: r.rsvp_status as RsvpStatus,
      response: (r.rsvp_response as "attending" | "declined" | null) ?? null,
      respondedAt: r.rsvp_responded_at ? formatResponded(r.rsvp_responded_at as string) : null,
      group: groupName,
    };
  });

  const withInvitation = new Set((invGroups ?? []).map((i) => i.group_id as string));
  const groups: GroupInfo[] = (groupRows ?? []).map((g) => ({
    id: g.id as string,
    name: g.name as string,
    count: guests.filter((x) => x.group === g.name).length,
    hasInvitation: withInvitation.has(g.id as string),
  }));

  return (
    <div className="space-y-7">
      <PageHeader
        greetingText={`${greeting()}, ${firstName(name)}`}
        title="Gastenlijst beheren"
        initials={coupleInitials(name, profile?.partner_name)}
      />

      <Link
        href="/gasten/nieuw"
        className="flex items-center gap-4 rounded-[1.25rem] bg-sage/70 p-4 transition hover:bg-sage"
      >
        <span className="grid size-11 shrink-0 place-items-center rounded-xl bg-paper text-forest shadow-sm">
          <PlusIcon />
        </span>
        <span className="min-w-0 flex-1">
          <span className="block font-medium">Gast toevoegen</span>
          <span className="block text-sm text-muted">Voeg een nieuwe gast toe aan de lijst</span>
        </span>
        <ChevronRightIcon className="text-muted" />
      </Link>

      {geimporteerd && (
        <p className="rounded-xl bg-paper px-4 py-3 text-sm text-forest ring-1 ring-sage">
          {Number(geimporteerd) || 0} gasten geïmporteerd.
        </p>
      )}

      {bewerkt && (
        <p className="rounded-xl bg-paper px-4 py-3 text-sm text-forest ring-1 ring-sage">
          Wijzigingen opgeslagen.
        </p>
      )}

      {toegevoegd && (
        <p className="rounded-xl bg-paper px-4 py-3 text-sm text-forest ring-1 ring-sage">
          Gast toegevoegd aan je lijst.
        </p>
      )}

      <GuestList guests={guests} groups={groups} />
    </div>
  );
}
