import Link from "next/link";
import { fmtDate, timeAgo } from "@/lib/admin";
import { createClient } from "@/lib/supabase/server";

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

export default async function UsersPage() {
  const supabase = await createClient();
  const { data, error } = await supabase.rpc("admin_users");
  const users = (data ?? []) as U[];

  return (
    <div>
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
