import type { Metadata } from "next";
import { PageHeader } from "@/components/page-header";
import { firstName, greeting, initials } from "@/lib/format";
import { createClient, getUser } from "@/lib/supabase/server";
import { ImportView } from "./import-view";

export const metadata: Metadata = { title: "Gasten importeren — Inviti" };

export default async function ImportPage() {
  const [supabase, user] = await Promise.all([createClient(), getUser()]);
  const { data: profile } = await supabase.from("profiles").select("full_name").eq("id", user!.id).maybeSingle();
  const name = profile?.full_name ?? user?.user_metadata?.full_name ?? "";

  return (
    <div className="mx-auto max-w-3xl space-y-7">
      <PageHeader
        greetingText={`${greeting()}, ${firstName(name)}`}
        title="Gasten importeren"
        initials={initials(name)}
        backHref="/gasten"
        hideSettings
      />
      <ImportView />
    </div>
  );
}
