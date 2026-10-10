import type { Metadata } from "next";
import { PageHeader } from "@/components/page-header";
import { firstName, greeting, initials } from "@/lib/format";
import { createClient, getUser } from "@/lib/supabase/server";
import { AccountForms } from "./account-forms";

export const metadata: Metadata = { title: "Account — Inviti" };

export default async function AccountPage() {
  const [supabase, user] = await Promise.all([createClient(), getUser()]);
  const { data: profile } = await supabase.from("profiles").select("full_name").eq("id", user!.id).maybeSingle();

  const name = profile?.full_name ?? user?.user_metadata?.full_name ?? "";
  const created = user?.created_at
    ? new Intl.DateTimeFormat("nl-NL", { day: "numeric", month: "long", year: "numeric" }).format(new Date(user.created_at))
    : "";

  return (
    <div className="space-y-7">
      <PageHeader
        greetingText={`${greeting()}, ${firstName(name)}`}
        title="Account"
        initials={initials(name)}
        backHref="/dashboard"
      />
      <AccountForms
        name={name}
        email={user?.email ?? ""}
        pendingEmail={user?.new_email ?? null}
        created={created}
      />
    </div>
  );
}
