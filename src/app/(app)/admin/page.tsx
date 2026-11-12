import Link from "next/link";
import { fmtDateTime } from "@/lib/admin";
import { createClient } from "@/lib/supabase/server";

type Stats = {
  users: number;
  new_7d: number;
  active_7d: number;
  with_invitation: number;
  invitations: number;
  guests: number;
  invites_sent: number;
  responded: number;
  errors_24h: number;
  errors_total: number;
};
type Activity = { at: string; user_id: string; email: string | null; kind: string; detail: string };

const KIND: Record<string, string> = {
  account: "Account",
  login: "Login",
  uitnodiging: "Uitnodiging",
  gast: "Gast",
  reactie: "RSVP",
  fout: "Fout",
};

export default async function AdminOverview() {
  const supabase = await createClient();
  const [{ data: stats }, { data: activity }, { data: errors }] = await Promise.all([
    supabase.rpc("admin_stats"),
    supabase.rpc("admin_activity", { p_limit: 40 }),
    supabase
      .from("app_errors")
      .select("id, created_at, source, message, path")
      .order("created_at", { ascending: false })
      .limit(5),
  ]);
  const s = (stats ?? {}) as Partial<Stats>;

  const cards: { label: string; value: number | undefined; hint?: string; bad?: boolean }[] = [
    { label: "Gebruikers", value: s.users, hint: `${s.new_7d ?? 0} nieuw (7 d)` },
    { label: "Actief (7 d)", value: s.active_7d },
    { label: "Met uitnodiging", value: s.with_invitation, hint: `${s.invitations ?? 0} in totaal` },
    { label: "Gasten", value: s.guests },
    { label: "Verstuurd", value: s.invites_sent },
    { label: "Gereageerd", value: s.responded },
    { label: "Fouten (24 u)", value: s.errors_24h, hint: `${s.errors_total ?? 0} in totaal`, bad: (s.errors_24h ?? 0) > 0 },
  ];

  return (
    <div className="space-y-8">
      <section className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        {cards.map((c) => (
          <div key={c.label} className="rounded-2xl border border-line bg-paper p-4">
            <p className="text-[0.7rem] tracking-[0.12em] text-muted uppercase">{c.label}</p>
            <p className={`mt-1 font-serif text-3xl ${c.bad ? "text-clay" : ""}`}>{c.value ?? "–"}</p>
            {c.hint && <p className="mt-0.5 text-xs text-muted">{c.hint}</p>}
          </div>
        ))}
      </section>

      <section>
        <div className="mb-3 flex items-baseline justify-between">
          <h2 className="font-serif text-xl">Laatste fouten</h2>
          <Link href="/admin/fouten" className="text-sm text-forest underline">Alles bekijken</Link>
        </div>
        <ul className="divide-y divide-line rounded-2xl border border-line bg-paper text-sm">
          {(errors ?? []).length === 0 && <li className="p-4 text-muted">Geen fouten geregistreerd. 🎉</li>}
          {(errors ?? []).map((e) => (
            <li key={e.id} className="flex flex-wrap gap-x-4 gap-y-1 p-3.5">
              <span className="text-muted">{fmtDateTime(e.created_at)}</span>
              <span className="rounded-full bg-blush/70 px-2.5 text-xs leading-6">{e.source}</span>
              <span className="min-w-0 flex-1 break-words">{e.message}</span>
            </li>
          ))}
        </ul>
      </section>

      <section>
        <h2 className="mb-3 font-serif text-xl">Recente activiteit</h2>
        <ul className="divide-y divide-line rounded-2xl border border-line bg-paper text-sm">
          {((activity ?? []) as Activity[]).map((a, i) => (
            <li key={i} className="flex flex-wrap gap-x-4 gap-y-1 p-3.5">
              <span className="w-28 shrink-0 text-muted">{fmtDateTime(a.at)}</span>
              <span className="w-24 shrink-0 text-xs tracking-wide text-muted uppercase">{KIND[a.kind] ?? a.kind}</span>
              <Link href={`/admin/gebruikers/${a.user_id}`} className="w-56 shrink-0 truncate text-forest hover:underline">
                {a.email ?? a.user_id}
              </Link>
              <span className="min-w-0 flex-1">{a.detail}</span>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}
