import Link from "next/link";
import { PageHeader } from "@/components/page-header";
import { Sparkle } from "@/components/icons";
import { firstName, greeting, coupleInitials } from "@/lib/format";
import { createClient, getUser } from "@/lib/supabase/server";

/** Tijdelijke pagina voor verstuurschermen die er nog niet zijn. */
export async function SoonPage({ title, text }: { title: string; text: string }) {
  const [supabase, user] = await Promise.all([createClient(), getUser()]);
  const { data: profile } = await supabase.from("profiles").select("full_name, partner_name").eq("id", user!.id).maybeSingle();
  const name = profile?.full_name ?? user?.user_metadata?.full_name ?? "";

  return (
    <div className="space-y-7">
      <PageHeader
        greetingText={`${greeting()}, ${firstName(name)}`}
        title={title}
        initials={coupleInitials(name, profile?.partner_name)}
      />
      <Link href="/versturen" className="inline-block text-sm text-muted underline-offset-4 hover:text-ink hover:underline">
        ← Terug naar versturen
      </Link>
      <div className="card flex flex-col items-center px-6 py-12 text-center">
        <Sparkle className="text-clay" />
        <p className="mt-3 font-serif text-2xl">Binnenkort beschikbaar</p>
        <p className="mt-1 max-w-sm text-sm text-muted">{text}</p>
      </div>
    </div>
  );
}
