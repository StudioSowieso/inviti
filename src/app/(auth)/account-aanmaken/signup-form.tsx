"use client";

import Link from "next/link";
import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { MailIcon, Sparkle, UserIcon } from "@/components/icons";

export function SignupForm() {
  const [name, setName] = useState("");
  const [partner, setPartner] = useState("");
  const [email, setEmail] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [status, setStatus] = useState<"idle" | "saving" | "confirm">("idle");

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    setStatus("saving");
    const supabase = createClient();
    const { error } = await supabase.auth.signInWithOtp({
      email: email.trim(),
      options: {
        shouldCreateUser: true,
        data: { full_name: name.trim(), partner_name: partner.trim() },
        emailRedirectTo: `${window.location.origin}/auth/callback?next=/dashboard`,
      },
    });

    if (error) {
      setStatus("idle");
      if (/already registered|already exists/i.test(error.message)) {
        setError("Er bestaat al een account met dit e-mailadres. Log in.");
      } else if (/rate limit/i.test(error.message)) {
        setError("Te veel pogingen achter elkaar. Probeer het later opnieuw.");
      } else {
        setError("Er ging iets mis bij het aanmaken van je account. Probeer het opnieuw.");
      }
      return;
    }

    setStatus("confirm");
  }

  if (status === "confirm") {
    return (
      <div>
        <p className="eyebrow flex items-center gap-2 text-clay">
          Nog één stap <Sparkle width={9} height={9} />
        </p>
        <h1 className="mt-4 font-serif text-5xl leading-none font-medium">Check je inbox</h1>
        <p className="mt-4 text-[0.95rem] leading-relaxed text-muted">
          We hebben een inloglink gestuurd naar{" "}
          <strong className="text-ink">{email}</strong>. Klik erop en je komt direct in je
          dashboard terecht.
        </p>
        <Link
          href="/inloggen"
          className="mt-8 inline-block text-sm font-medium text-forest underline-offset-4 hover:underline"
        >
          Terug naar inloggen
        </Link>
      </div>
    );
  }

  return (
    <div className="flex flex-col">
      <p className="eyebrow flex items-center gap-2 text-clay">
        Nieuw account <Sparkle width={9} height={9} />
      </p>
      <h1 className="mt-4 font-serif text-5xl leading-none font-medium">Account aanmaken</h1>
      <p className="mt-4 text-[0.95rem] leading-relaxed text-muted">
        Vul je gegevens in om een account aan te maken en je bruiloftsorganisatie veilig te
        beheren.
      </p>

      <form onSubmit={onSubmit} className="mt-8 space-y-4">
        <div>
          <label htmlFor="name" className="mb-2 block text-sm font-medium">
            Naam
          </label>
          <div className="relative">
            <UserIcon className="pointer-events-none absolute top-1/2 left-4 -translate-y-1/2 text-muted" />
            <input
              id="name"
              required
              autoComplete="name"
              placeholder="Je volledige naam"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="field pl-12"
            />
          </div>
        </div>

        <div>
          <label htmlFor="partner" className="mb-2 block text-sm font-medium">
            Naam van degene met wie je gaat trouwen
          </label>
          <div className="relative">
            <UserIcon className="pointer-events-none absolute top-1/2 left-4 -translate-y-1/2 text-muted" />
            <input
              id="partner"
              required
              autoComplete="off"
              placeholder="Naam van je partner"
              value={partner}
              onChange={(e) => setPartner(e.target.value)}
              className="field pl-12"
            />
          </div>
        </div>

        <div>
          <label htmlFor="email" className="mb-2 block text-sm font-medium">
            E-mailadres
          </label>
          <div className="relative">
            <MailIcon className="pointer-events-none absolute top-1/2 left-4 -translate-y-1/2 text-muted" />
            <input
              id="email"
              type="email"
              required
              autoComplete="email"
              placeholder="naam@voorbeeld.nl"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="field pl-12"
            />
          </div>
        </div>

        <p className="text-sm leading-relaxed text-muted">
          Je hebt geen wachtwoord nodig. We sturen je een link waarmee je direct inlogt, nu en bij elke volgende keer.
        </p>

        {error && (
          <p role="alert" className="rounded-xl bg-blush px-4 py-3 text-sm text-[#7a3f2c]">
            {error}
          </p>
        )}

        <div className="pt-2">
          <button type="submit" className="btn-primary" disabled={status === "saving"}>
            {status === "saving" ? "Account wordt aangemaakt…" : "Account aanmaken"}
          </button>
        </div>
      </form>

      <p className="mt-10 text-center text-sm text-muted">
        Al een account?{" "}
        <Link href="/inloggen" className="font-semibold text-ink hover:text-forest">
          Inloggen
        </Link>
      </p>
    </div>
  );
}
