import Link from "next/link";
import { fmtDate, timeAgo } from "@/lib/admin";
import { createClient } from "@/lib/supabase/server";
import { grantFreeAccess, revokeFreeAccess } from "./actions";

type U = {
  id: string;
  email: string;
  full_name: string | null;
  partner_name: string | null;
  wedding_date: string | null;
  created_at: string;
  last_sign_in_at: string | null;
  confirmed: boolean;
  is_admin: boolean;
  invitations: number;
  guests: number;
  invites_sent: number;
  responded: number;
  todos_open: number;
  errors: number;
  last_activity: string | null;
};

type Free = { user_id: string; email: string; note: string | null; granted_at: string };

const FREE_MSG: Record<string, { text: string; bad?: boolean }> = {
  ok: { text: "Gratis toegang gegeven." },
  ingetrokken: { text: "Gratis toegang ingetrokken." },
  onbekend: { text: "Geen account gevonden met dit e-mailadres. Laat de persoon eerst een account aanmaken.", bad: true },
  leeg: { text: "Vul een e-mailadres in.", bad: true },
  fout: { text: "Dat is niet gelukt. Controleer of de nieuwste database-migratie is uitgevoerd.", bad: true },
};

export default async function UsersPage({ searchParams }: { searchParams: Promise<{ gratis?: string }> }) {
  const { gratis } = await searchParams;
  const supabase = await createClient();
  const [{ data, error }, { data: freeData }] = await Promise.all([
    supabase.rpc("admin_users"),
    supabase.rpc("admin_free_access"),
  ]);
  const users = (data ?? []) as U[];
  const free = (freeData ?? []) as Free[];
  const msg = gratis ? FREE_MSG[gratis] : undefined;

  return (
    <div>
      <section className="mb-8">
        <h2 className="mb-1 font-serif text-xl">Gratis toegang</h2>
        <p className="mb-3 text-sm text-muted">
          Voor familie of testers: het account krijgt de volledige versie zonder te betalen. Het account moet al bestaan.
        </p>
        {msg && <p className={`mb-3 text-sm ${msg.bad ? "text-clay" : "text-forest"}`}>{msg.text}</p>}
        <form action={grantFreeAccess} className="mb-3 flex flex-wrap gap-2">
          <input name="email" type="email" required placeholder="e-mailadres" className="min-w-[14rem] flex-1 rounded-xl border border-line bg-paper px-3 py-2 text-sm" />
          <input name="note" maxLength={200} placeholder="notitie (bijv. zus Anna)" className="min-w-[10rem] flex-1 rounded-xl border border-line bg-paper px-3 py-2 text-sm" />
          <button className="rounded-full bg-forest px-4 py-2 text-sm text-white">Geef gratis toegang</button>
        </form>
        {free.length > 0 && (
          <ul className="divide-y divide-line rounded-2xl border border-line bg-paper text-sm">
            {free.map((f) => (
              <li key={f.user_id} className="flex items-center justify-between gap-3 p-3">
                <span>
                  <Link href={`/admin/gebruikers/${f.user_id}`} className="font-medium text-forest hover:underline">{f.email}</Link>
                  <span className="ml-2 text-xs text-muted">{f.note ? `${f.note} · ` : ""}sinds {fmtDate(f.granted_at)}</span>
                </span>
                <form action={revokeFreeAccess}>
                  <input type="hidden" name="user_id" value={f.user_id} />
                  <button className="text-xs text-clay underline">Intrekken</button>
                </form>
              </li>
            ))}
          </ul>
        )}
      </section>
      <h2 className="mb-3 font-serif text-xl">Gebruikers ({users.length})</h2>
      {error && <p className="mb-3 text-sm text-clay">Kon gebruikers niet laden: {error.message}</p>}
      <div className="overflow-x-auto rounded-2xl border border-line bg-paper">
        <table className="w-full min-w-[56rem] text-left text-sm">
          <thead className="text-[0.7rem] tracking-[0.1em] text-muted uppercase">
            <tr className="border-b border-line">
              <th className="p-3">Gebruiker</th>
              <th className="p-3">Aangemeld</th>
              <th className="p-3">Laatst actief</th>
              <th className="p-3">Trouwdatum</th>
              <th className="p-3 text-right">Uitn.</th>
              <th className="p-3 text-right">Gasten</th>
              <th className="p-3 text-right">Verstuurd</th>
              <th className="p-3 text-right">Reacties</th>
              <th className="p-3 text-right">Fouten</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-line">
            {users.map((u) => (
              <tr key={u.id} className="hover:bg-cream/60">
                <td className="p-3">
                  <Link href={`/admin/gebruikers/${u.id}`} className="font-medium text-forest hover:underline">
                    {u.full_name || u.email}
                  </Link>
                  {u.is_admin && <span className="ml-2 rounded-full bg-blush/70 px-2 text-xs">admin</span>}
                  {!u.confirmed && <span className="ml-2 rounded-full bg-cream px-2 text-xs text-muted">niet bevestigd</span>}
                  <div className="text-xs text-muted">{u.full_name ? u.email : ""}{u.partner_name ? ` · & ${u.partner_name}` : ""}</div>
                </td>
                <td className="p-3 whitespace-nowrap">{fmtDate(u.created_at)}</td>
                <td className="p-3 whitespace-nowrap">{timeAgo(u.last_activity ?? u.last_sign_in_at)}</td>
                <td className="p-3 whitespace-nowrap">{fmtDate(u.wedding_date)}</td>
                <td className="p-3 text-right">{u.invitations}</td>
                <td className="p-3 text-right">{u.guests}</td>
                <td className="p-3 text-right">{u.invites_sent}</td>
                <td className="p-3 text-right">{u.responded}</td>
                <td className={`p-3 text-right ${u.errors ? "font-medium text-clay" : ""}`}>{u.errors}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
