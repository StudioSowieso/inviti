import type { Metadata } from "next";
import Link from "next/link";
import { PageHeader } from "@/components/page-header";
import { Sparkle } from "@/components/icons";
import { firstName, greeting, coupleInitials } from "@/lib/format";
import { createClient, getUser } from "@/lib/supabase/server";

export const metadata: Metadata = { title: "Versturen — Inviti" };

export default async function SendHubPage() {
  const [supabase, user] = await Promise.all([createClient(), getUser()]);

  const [{ data: profile }, { data: guestRows }] = await Promise.all([
    supabase.from("profiles").select("full_name, partner_name").eq("id", user!.id).maybeSingle(),
    supabase.from("guests").select("id, invite_sent"),
  ]);

  const name = profile?.full_name ?? user?.user_metadata?.full_name ?? "";
  const total = guestRows?.length ?? 0;
  const sent = (guestRows ?? []).filter((g) => g.invite_sent).length;

  return (
    <div className="space-y-7">
      <PageHeader
        greetingText={`${greeting()}, ${firstName(name)}`}
        title="Versturen"
        initials={coupleInitials(name, profile?.partner_name)}
      />

      <div className="grid gap-4 sm:grid-cols-2">
        {/* Hoofdoptie: groter en prominenter dan de andere twee */}
        <Link
          href="/versturen/uitnodiging"
          className="group flex min-h-64 flex-col justify-between rounded-3xl bg-forest p-7 text-paper shadow-[0_30px_80px_-40px_rgb(0_0_0/0.55)] transition hover:brightness-110 sm:col-span-2 sm:min-h-72 sm:p-10"
        >
          <div>
            <p className="eyebrow flex items-center gap-2 text-paper/70">
              De uitnodiging <Sparkle width={9} height={9} />
            </p>
            <h2 className="mt-4 font-serif text-4xl leading-none font-medium sm:text-6xl">Uitnodiging versturen</h2>
            <p className="mt-4 max-w-xl text-[0.95rem] leading-relaxed text-paper/80">
              Stuur je gasten hun persoonlijke uitnodiging via WhatsApp of mail, of deel een link per groep.
            </p>
          </div>
          <div className="mt-8 flex flex-wrap items-center gap-3">
            <span className="inline-flex items-center gap-2 rounded-full bg-paper px-6 py-3 text-sm font-semibold text-forest transition group-hover:translate-x-0.5">
              Naar uitnodigingen →
            </span>
            {total > 0 && (
              <span className="rounded-full bg-paper/15 px-4 py-2 text-sm">
                {sent} van {total} verstuurd
              </span>
            )}
          </div>
        </Link>

        <Link href="/versturen/save-the-date" className="card group p-6 transition hover:bg-sage/40">
          <p className="eyebrow text-clay">Eerder in het traject</p>
          <h2 className="mt-3 font-serif text-2xl font-medium">Save the Date versturen</h2>
          <p className="mt-2 text-sm leading-relaxed text-muted">Laat je gasten alvast de datum noteren, voordat de uitnodiging volgt.</p>
          <span className="mt-5 inline-block text-sm font-medium text-forest">Openen →</span>
        </Link>

        <Link href="/versturen/after-wedding" className="card group p-6 transition hover:bg-sage/40">
          <p className="eyebrow text-clay">Na de bruiloft</p>
          <h2 className="mt-3 font-serif text-2xl font-medium">After Wedding versturen</h2>
          <p className="mt-2 text-sm leading-relaxed text-muted">Bedank je gasten en deel een bericht of herinnering na de grote dag.</p>
          <span className="mt-5 inline-block text-sm font-medium text-forest">Openen →</span>
        </Link>
      </div>
    </div>
  );
}
