import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { InvitationView } from "@/components/invitation/invitation-view";
import { normalizeConfig } from "@/lib/invitation/defaults";
import { applyPalette, validPalette } from "@/lib/invitation/palettes";
import { getThemes, pickTheme } from "@/lib/invitation/themes";
import { createClient } from "@/lib/supabase/server";

export const metadata: Metadata = {
  title: "Je bent uitgenodigd",
  robots: { index: false, follow: false },
};

/** Publieke pagina waar gasten hun uitnodiging openen, via een persoonlijke link of een groepslink. */
export default async function PublicInvitationPage({ params }: { params: Promise<{ token: string }> }) {
  const { token } = await params;
  if (!/^[a-z0-9]{16,64}$/.test(token)) notFound();

  const supabase = await createClient();
  const [{ data }, { themes }] = await Promise.all([supabase.rpc("public_invitation", { p_token: token }), getThemes()]);
  const row = Array.isArray(data) ? data[0] : null;
  if (!row) notFound();

  const config = normalizeConfig(row.config);
  const base = pickTheme(themes, row.theme_slug as string);
  const theme = applyPalette(base, validPalette(base, config.palette));

  return (
    <div className="h-dvh">
      <InvitationView config={config} theme={theme} className="h-full" />
    </div>
  );
}
