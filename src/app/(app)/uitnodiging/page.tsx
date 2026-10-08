import type { Metadata } from "next";
import { PageHeader } from "@/components/page-header";
import { ThemeThumb } from "@/components/invitation/theme-thumb";
import { Sparkle } from "@/components/icons";
import { normalizeConfig } from "@/lib/invitation/defaults";
import { getThemes, pickTheme } from "@/lib/invitation/themes";
import { firstName, greeting, initials } from "@/lib/format";
import { createClient } from "@/lib/supabase/server";
import { createInvitation } from "./actions";
import { Configurator } from "./configurator";

export const metadata: Metadata = { title: "Uitnodiging — Inviti" };

export default async function InvitationPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const [{ data: profile }, { data: invitation }, { themes }] = await Promise.all([
    supabase.from("profiles").select("full_name").eq("id", user!.id).maybeSingle(),
    supabase.from("invitations").select("theme_slug, config").maybeSingle(),
    getThemes(),
  ]);

  const name = profile?.full_name ?? user?.user_metadata?.full_name ?? "";
  const header = (
    <PageHeader
      greetingText={`${greeting()}, ${firstName(name)}`}
      title="Uitnodiging maken"
      initials={initials(name)}
      backHref="/dashboard"
    />
  );

  if (!invitation) {
    return (
      <div className="space-y-8">
        {header}
        <section>
          <p className="eyebrow flex items-center gap-2 text-clay">
            Stap 1 <Sparkle width={9} height={9} />
          </p>
          <h2 className="mt-3 font-serif text-4xl leading-tight font-medium">Kies een thema</h2>
          <p className="mt-2 max-w-xl text-[0.95rem] leading-relaxed text-muted">
            Dit is de basis van jullie uitnodiging. Je kunt het thema later altijd wisselen en alle
            teksten, kleuren en blokken blijven staan.
          </p>

          <div className="mt-8 grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
            {themes.map((t) => (
              <form key={t.slug} action={createInvitation}>
                <input type="hidden" name="theme" value={t.slug} />
                <button
                  type="submit"
                  className="card w-full p-3 text-left transition hover:border-clay/50 hover:shadow-[0_8px_30px_-16px_rgb(31_36_32/0.3)]"
                >
                  <ThemeThumb theme={t} />
                  <span className="mt-3 block px-1 font-serif text-2xl font-medium">{t.title}</span>
                  {t.description && <span className="block px-1 pb-1 text-sm text-muted">{t.description}</span>}
                </button>
              </form>
            ))}
          </div>
        </section>
      </div>
    );
  }

  const theme = pickTheme(themes, invitation.theme_slug);
  return (
    <div className="space-y-7">
      {header}
      <Configurator
        themes={themes}
        initialThemeSlug={theme.slug}
        initialConfig={normalizeConfig(invitation.config)}
      />
    </div>
  );
}
