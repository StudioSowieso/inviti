import Link from "next/link";
import { fmtDateTime } from "@/lib/admin";
import { createClient } from "@/lib/supabase/server";
import { clearErrors } from "./actions";

type Err = {
  id: string; created_at: string; user_id: string | null; source: string;
  severity: string; message: string; path: string | null; detail: unknown;
};

export default async function ErrorsPage() {
  const supabase = await createClient();
  const { data } = await supabase
    .from("app_errors")
    .select("id, created_at, user_id, source, severity, message, path, detail")
    .order("created_at", { ascending: false })
    .limit(200);
  const errors = (data ?? []) as Err[];

  return (
    <div>
      <div className="mb-3 flex items-center justify-between">
        <h2 className="font-serif text-xl">Fouten ({errors.length})</h2>
        {errors.length > 0 && (
          <form action={clearErrors}>
            <button className="rounded-full border border-line bg-paper px-4 py-2 text-sm text-clay hover:bg-cream">
              Alles wissen
            </button>
          </form>
        )}
      </div>
      <ul className="divide-y divide-line rounded-2xl border border-line bg-paper text-sm">
        {errors.length === 0 && <li className="p-4 text-muted">Geen fouten geregistreerd. 🎉</li>}
        {errors.map((e) => (
          <li key={e.id} className="p-3.5">
            <div className="flex flex-wrap items-center gap-x-4 gap-y-1">
              <span className="text-muted">{fmtDateTime(e.created_at)}</span>
              <span className="rounded-full bg-blush/70 px-2.5 text-xs leading-6">{e.source}</span>
              {e.path && <span className="text-xs text-muted">{e.path}</span>}
              {e.user_id ? (
                <Link href={`/admin/gebruikers/${e.user_id}`} className="text-xs text-forest hover:underline">gebruiker</Link>
              ) : (
                <span className="text-xs text-muted">anoniem</span>
              )}
            </div>
            <p className="mt-1 break-words">{e.message}</p>
            {e.detail != null && (
              <pre className="mt-1 overflow-x-auto text-xs text-muted">{JSON.stringify(e.detail)}</pre>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}
