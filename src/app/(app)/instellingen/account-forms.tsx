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
  email,
  pendingEmail,
  created,
}: {
  name: string;
  email: string;
  pendingEmail: string | null;
  created: string;
}) {
  const router = useRouter();
  const supabase = createClient();

  const [fullName, setFullName] = useState(name);
  const [nameNotice, setNameNotice] = useState<Notice>(null);
  const [nameBusy, setNameBusy] = useState(false);

  const [newEmail, setNewEmail] = useState("");
  const [emailNotice, setEmailNotice] = useState<Notice>(
    pendingEmail ? { kind: "ok", text: `Bevestig de wijziging via de link die we naar ${pendingEmail} hebben gestuurd.` } : null,
  );
  const [emailBusy, setEmailBusy] = useState(false);

  const [password, setPassword] = useState("");
  const [repeat, setRepeat] = useState("");
  const [pwNotice, setPwNotice] = useState<Notice>(null);
  const [pwBusy, setPwBusy] = useState(false);

  async function saveName(e: FormEvent) {
    e.preventDefault();
    const value = fullName.trim().slice(0, 80);
    setNameNotice(null);
    setNameBusy(true);
    const {
      data: { user },
    } = await supabase.auth.getUser();
    const [{ error: profileError }, { error: metaError }] = await Promise.all([
      user ? supabase.from("profiles").update({ full_name: value }).eq("id", user.id) : Promise.resolve({ error: new Error("geen gebruiker") }),
      supabase.auth.updateUser({ data: { full_name: value } }),
    ]);
    setNameBusy(false);
    if (profileError || metaError) {
      setNameNotice({ kind: "error", text: "Je naam kon niet worden opgeslagen. Probeer het opnieuw." });
      return;
    }
    setNameNotice({ kind: "ok", text: "Je naam is opgeslagen." });
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

  async function savePassword(e: FormEvent) {
    e.preventDefault();
    setPwNotice(null);
    if (password.length < 8) {
      setPwNotice({ kind: "error", text: "Kies een wachtwoord van minstens 8 tekens." });
      return;
    }
    if (password !== repeat) {
      setPwNotice({ kind: "error", text: "De twee wachtwoorden zijn niet hetzelfde." });
      return;
    }
    setPwBusy(true);
    const { error } = await supabase.auth.updateUser({ password });
    setPwBusy(false);
    if (error) {
      setPwNotice({
        kind: "error",
        text: /same|different/i.test(error.message)
          ? "Kies een wachtwoord dat verschilt van je huidige."
          : /weak|short|least/i.test(error.message)
            ? "Dit wachtwoord is te zwak. Kies een langer of lastiger wachtwoord."
            : "Het wachtwoord kon niet worden opgeslagen. Probeer het opnieuw.",
      });
      return;
    }
    setPassword("");
    setRepeat("");
    setPwNotice({ kind: "ok", text: "Je wachtwoord is opgeslagen. Je kunt nu ook met e-mail en wachtwoord inloggen." });
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
            <label htmlFor="acc-email" className="mb-2 block text-sm font-medium">
              E-mailadres
            </label>
            <input id="acc-email" className="field opacity-70" value={email} readOnly />
          </div>
          <Message notice={nameNotice} />
          <button type="submit" className="btn-primary" disabled={nameBusy}>
            {nameBusy ? "Bezig met opslaan…" : "Naam opslaan"}
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

      <Card
        title="Wachtwoord"
        text="Inloggen kan altijd met een link per e-mail. Stel hier ook een wachtwoord in als je liever met e-mail en wachtwoord inlogt."
      >
        <form onSubmit={savePassword} className="max-w-xl space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label htmlFor="pw" className="mb-2 block text-sm font-medium">
                Nieuw wachtwoord
              </label>
              <input
                id="pw"
                type="password"
                autoComplete="new-password"
                minLength={8}
                className="field"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
            <div>
              <label htmlFor="pw2" className="mb-2 block text-sm font-medium">
                Herhaal wachtwoord
              </label>
              <input
                id="pw2"
                type="password"
                autoComplete="new-password"
                className="field"
                value={repeat}
                onChange={(e) => setRepeat(e.target.value)}
              />
            </div>
          </div>
          <Message notice={pwNotice} />
          <button type="submit" className="btn-primary sm:w-auto" disabled={pwBusy}>
            {pwBusy ? "Bezig met opslaan…" : "Wachtwoord opslaan"}
          </button>
        </form>
      </Card>
    </div>
  );
}
