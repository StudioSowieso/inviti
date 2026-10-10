"use client";

import { useRouter } from "next/navigation";
import { useState, type FormEvent, type ReactNode } from "react";
import { createClient } from "@/lib/supabase/client";

type Notice = { kind: "ok" | "error"; text: string } | null;

function Card({ title, text, children }: { title: string; text?: string; children: ReactNode }) {
  return (
    <section className="card p-5 sm:p-6">
      <h2 className="font-serif text-2xl font-medium">{title}</h2>
      {text && <p className="mt-1 text-sm leading-relaxed text-muted">{text}</p>}
      <div className="mt-5">{children}</div>
    </section>
  );
}

function Message({ notice }: { notice: Notice }) {
  if (!notice) return null;
  return (
    <p
      role={notice.kind === "error" ? "alert" : "status"}
      className={`rounded-xl px-4 py-3 text-sm ${notice.kind === "error" ? "bg-blush text-[#7a3f2c]" : "bg-sage/70 text-forest"}`}
    >
      {notice.text}
    </p>
  );
}

export function AccountForms({
  name,
  partner,
  email,
  pendingEmail,
  created,
}: {
  name: string;
  partner: string;
  email: string;
  pendingEmail: string | null;
  created: string;
}) {
  const router = useRouter();
  const supabase = createClient();

  const [fullName, setFullName] = useState(name);
  const [partnerName, setPartnerName] = useState(partner);
  const [nameNotice, setNameNotice] = useState<Notice>(null);
  const [nameBusy, setNameBusy] = useState(false);

  const [newEmail, setNewEmail] = useState("");
  const [emailNotice, setEmailNotice] = useState<Notice>(
    pendingEmail ? { kind: "ok", text: `Bevestig de wijziging via de link die we naar ${pendingEmail} hebben gestuurd.` } : null,
  );
  const [emailBusy, setEmailBusy] = useState(false);


  async function saveName(e: FormEvent) {
    e.preventDefault();
    const value = fullName.trim().slice(0, 80);
    const partnerValue = partnerName.trim().slice(0, 80);
    setNameNotice(null);
    setNameBusy(true);
    const {
      data: { user },
    } = await supabase.auth.getUser();
    const [{ error: profileError }, { error: metaError }] = await Promise.all([
      user ? supabase.from("profiles").update({ full_name: value, partner_name: partnerValue || null }).eq("id", user.id) : Promise.resolve({ error: new Error("geen gebruiker") }),
      supabase.auth.updateUser({ data: { full_name: value, partner_name: partnerValue } }),
    ]);
    setNameBusy(false);
    if (profileError || metaError) {
      setNameNotice({ kind: "error", text: "Je gegevens konden niet worden opgeslagen. Probeer het opnieuw." });
      return;
    }
    setNameNotice({ kind: "ok", text: "Je gegevens zijn opgeslagen." });
    router.refresh();
  }

  async function saveEmail(e: FormEvent) {
    e.preventDefault();
    const value = newEmail.trim();
    setEmailNotice(null);
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
      setEmailNotice({ kind: "error", text: "Dit e-mailadres lijkt niet te kloppen." });
      return;
    }
    if (value.toLowerCase() === email.toLowerCase()) {
      setEmailNotice({ kind: "error", text: "Dit is al je huidige e-mailadres." });
      return;
    }
    setEmailBusy(true);
    const { error } = await supabase.auth.updateUser(
      { email: value },
      { emailRedirectTo: `${window.location.origin}/auth/callback?next=/instellingen` },
    );
    setEmailBusy(false);
    if (error) {
      setEmailNotice({
        kind: "error",
        text: /already|registered|exists/i.test(error.message)
          ? "Dit e-mailadres is al in gebruik."
          : /rate limit|security purposes/i.test(error.message)
            ? "Je hebt net al een wijziging aangevraagd. Probeer het over een minuutje opnieuw."
            : "Het e-mailadres kon niet worden gewijzigd. Probeer het opnieuw.",
      });
      return;
    }
    setNewEmail("");
    setEmailNotice({
      kind: "ok",
      text: `We hebben een bevestigingslink gestuurd naar ${value}. Je e-mailadres verandert zodra je daarop klikt (mogelijk ook op je huidige adres).`,
    });
  }

  return (
    <div className="grid gap-6 xl:grid-cols-2">
      <Card title="Accountgegevens" text={created ? `Account aangemaakt op ${created}.` : undefined}>
        <form onSubmit={saveName} className="space-y-4">
          <div>
            <label htmlFor="acc-name" className="mb-2 block text-sm font-medium">
              Naam
            </label>
            <input
              id="acc-name"
              className="field"
              value={fullName}
              maxLength={80}
              autoComplete="name"
              onChange={(e) => setFullName(e.target.value)}
            />
          </div>
          <div>
            <label htmlFor="acc-partner" className="mb-2 block text-sm font-medium">
              Naam van je partner
            </label>
            <input
              id="acc-partner"
              className="field"
              value={partnerName}
              maxLength={80}
              autoComplete="off"
              placeholder="Met wie ga je trouwen?"
              onChange={(e) => setPartnerName(e.target.value)}
            />
          </div>
          <div>
            <label htmlFor="acc-email" className="mb-2 block text-sm font-medium">
              E-mailadres
            </label>
            <input id="acc-email" className="field opacity-70" value={email} readOnly />
          </div>
          <Message notice={nameNotice} />
          <button type="submit" className="btn-primary" disabled={nameBusy}>
            {nameBusy ? "Bezig met opslaan…" : "Gegevens opslaan"}
          </button>
        </form>
      </Card>

      <Card title="E-mailadres wijzigen" text="We sturen een bevestigingslink. Pas na het klikken op de link wordt je e-mailadres gewijzigd.">
        <form onSubmit={saveEmail} className="space-y-4">
          <div>
            <label htmlFor="new-email" className="mb-2 block text-sm font-medium">
              Nieuw e-mailadres
            </label>
            <input
              id="new-email"
              type="email"
              required
              autoComplete="email"
              placeholder="naam@voorbeeld.nl"
              className="field"
              value={newEmail}
              onChange={(e) => setNewEmail(e.target.value)}
            />
          </div>
          <Message notice={emailNotice} />
          <button type="submit" className="btn-primary" disabled={emailBusy}>
            {emailBusy ? "Bezig met versturen…" : "E-mailadres wijzigen"}
          </button>
        </form>
      </Card>

    </div>
  );
}
