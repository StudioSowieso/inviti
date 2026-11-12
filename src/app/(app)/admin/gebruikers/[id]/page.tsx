import Link from "next/link";
import { notFound } from "next/navigation";
import { fmtDate, fmtDateTime } from "@/lib/admin";
import { createClient } from "@/lib/supabase/server";

type Detail = {
  user: { id: string; email: string; created_at: string; last_sign_in_at: string | null; confirmed: boolean; is_admin: boolean };
  profile: { full_name: string | null; partner_name: string | null; wedding_date: string | null } | null;
  invitations: {
    id: string; theme_slug: string; created_at: string; updated_at: string; group: string | null;
    partner1: string | null; partner2: string | null; date: string | null; city: string | null;
    palette: string | null; animation: string | null; blocks: number;
  }[];
  groups: { id: string; name: string; guests: number }[];
  guests: {
    id: string; first_name: string; last_name: string | null; group: string | null;
    rsvp_status: string; invite_sent: boolean; created_at: string; responded_at: string | null;
  }[];
  guest_counts: { total: number; attending: number; declined: number; pending: number; invites_sent: number };
  todos: { total: number; done: number };
};
type Activity = { at: string; kind: string; detail: string };
type Err = { id: string; created_at: string; source: string; message: string; path: string | null };

const RSVP: Record<string, string> = { attending: "Komt", declined: "Komt niet", pending: "Geen reactie" };
const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

export default async function UserDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  if (!UUID.test(id)) notFound();

  const supabase = await createClient();
  const [{ data }, { data: activity }, { data: errors }] = await Promise.all([
    supabase.rpc("admin_user_detail", { p_user: id }),
    supabase.rpc("admin_activity", { p_user: id, p_limit: 50 }),
    supabase
      .from("app_errors")
      .select("id, created_at, source, message, path")
      .eq("user_id", id)
      .order("created_at", { ascending: false })
      .limit(20),
  ]);
  const d = data as Detail | null;
  if (!d) notFound();

  const c = d.guest_counts;
  return (
    <div className="space-y-8">
      <div>
        <Link href="/admin/gebruikers" className="text-sm text-forest underline">← Alle gebruikers</Link>
        <h2 className="mt-2 font-serif text-2xl">
          {d.profile?.full_name || d.user.email}
          {d.profile?.partner_name ? ` & ${d.profile.partner_name}` : ""}
        </h2>
        <p className="text-sm text-muted">
          {d.user.email} · aangemeld {fmtDate(d.user.created_at)} · laatst ingelogd {fmtDateTime(d.user.last_sign_in_at)}
          {d.profile?.wedding_date ? ` · trouwdatum ${fmtDate(d.profile.wedding_date)}` : ""}
        </p>
      </div>

      <section className="grid grid-cols-2 gap-3 sm:grid-cols-5">
        {[
          ["Gasten", c.total],
          ["Komen", c.attending],
          ["Komen niet", c.declined],
          ["Geen reactie", c.pending],
          ["Verstuurd", c.invites_sent],
        ].map(([l, v]) => (
          <div key={l as string} className="rounded-2xl border border-line bg-paper p-4">
            <p className="text-[0.7rem] tracking-[0.12em] text-muted uppercase">{l}</p>
            <p className="mt-1 font-serif text-3xl">{v}</p>
          </div>
        ))}
      </section>

      <section>
        <h3 className="mb-3 font-serif text-xl">Uitnodigingen ({d.invitations.length})</h3>
        <ul className="divide-y divide-line rounded-2xl border border-line bg-paper text-sm">
          {d.invitations.length === 0 && <li className="p-4 text-muted">Nog geen uitnodiging gemaakt.</li>}
          {d.invitations.map((i) => (
            <li key={i.id} className="p-3.5">
              <span className="font-medium">{i.partner1 || "–"} &amp; {i.partner2 || "–"}</span>
              <span className="ml-2 rounded-full bg-blush/70 px-2.5 text-xs leading-6">{i.theme_slug}</span>
              <div className="mt-1 text-xs text-muted">
                {i.group ? `Groep: ${i.group} · ` : ""}
                {i.date ?? "geen datum"}{i.city ? ` · ${i.city}` : ""} · palet {i.palette ?? "standaard"} · animatie {i.animation ?? "–"} · {i.blocks} blokken · aangepast {fmtDateTime(i.updated_at)}
              </div>
            </li>
          ))}
        </ul>
      </section>

      <section>
        <h3 className="mb-3 font-serif text-xl">Gasten ({c.total}) · to-do’s {d.todos.done}/{d.todos.total} klaar</h3>
        <p className="mb-2 text-xs text-muted">
          Alleen namen en status; e-mail, telefoon en dieetwensen van gasten zijn bewust niet zichtbaar.
          {d.groups.length > 0 && ` Groepen: ${d.groups.map((g) => `${g.name} (${g.guests})`).join(", ")}.`}
        </p>
        <div className="max-h-96 overflow-auto rounded-2xl border border-line bg-paper">
          <table className="w-full text-left text-sm">
            <tbody className="divide-y divide-line">
              {d.guests.map((g) => (
                <tr key={g.id}>
                  <td className="p-3">{g.first_name} {g.last_name ?? ""}</td>
                  <td className="p-3 text-muted">{g.group ?? "–"}</td>
                  <td className="p-3">{RSVP[g.rsvp_status] ?? g.rsvp_status}</td>
                  <td className="p-3 text-muted">{g.invite_sent ? "verstuurd" : "niet verstuurd"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section>
        <h3 className="mb-3 font-serif text-xl">Fouten van deze gebruiker</h3>
        <ul className="divide-y divide-line rounded-2xl border border-line bg-paper text-sm">
          {((errors ?? []) as Err[]).length === 0 && <li className="p-4 text-muted">Geen fouten.</li>}
          {((errors ?? []) as Err[]).map((e) => (
            <li key={e.id} className="flex flex-wrap gap-x-4 gap-y-1 p-3.5">
              <span className="text-muted">{fmtDateTime(e.created_at)}</span>
              <span className="rounded-full bg-blush/70 px-2.5 text-xs leading-6">{e.source}</span>
              <span className="min-w-0 flex-1 break-words">{e.message}{e.path ? ` (${e.path})` : ""}</span>
            </li>
          ))}
        </ul>
      </section>

      <section>
        <h3 className="mb-3 font-serif text-xl">Tijdlijn</h3>
        <ul className="divide-y divide-line rounded-2xl border border-line bg-paper text-sm">
          {((activity ?? []) as Activity[]).map((a, i) => (
            <li key={i} className="flex gap-4 p-3.5">
              <span className="w-28 shrink-0 text-muted">{fmtDateTime(a.at)}</span>
              <span>{a.detail}</span>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}
