"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { tryTestLogin } from "./actions";
import { MailIcon, Sparkle } from "@/components/icons";

export function LoginForm({ linkError }: { linkError: boolean }) {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [usePassword, setUsePassword] = useState(false);
  const [password, setPassword] = useState("");
  const [status, setStatus] = useState<"idle" | "sending" | "sent">("idle");
  const [error, setError] = useState<string | null>(
    linkError ? "Deze inloglink is verlopen of al gebruikt. Vraag een nieuwe aan." : null,
  );

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setStatus("sending");

    // Testomgeving: het testadres logt direct in (alleen als dat server-side is ingesteld).
    const test = await tryTestLogin(email);
    if (test.ok) {
      router.replace("/dashboard");
      router.refresh();
      return;
    }

    const supabase = createClient();

    if (usePassword) {
      const { error } = await supabase.auth.signInWithPassword({ email: email.trim(), password });
      if (error) {
        setStatus("idle");
        setError(
          /invalid login|credentials/i.test(error.message)
            ? "E-mailadres of wachtwoord klopt niet. Heb je nog geen wachtwoord ingesteld? Log dan met een link in."
            : "Inloggen is niet gelukt. Probeer het opnieuw.",
        );
        return;
      }
      router.replace("/dashboard");
      router.refresh();
      return;
    }
    const { error } = await supabase.auth.signInWithOtp({
      email: email.trim(),
      options: {
        shouldCreateUser: false,
        emailRedirectTo: `${window.location.origin}/auth/callback?next=/dashboard`,
      },
    });

    if (error) {
      setStatus("idle");
      if (/signups not allowed|not found/i.test(error.message)) {
        setError("We kennen dit e-mailadres nog niet. Maak eerst een account aan.");
      } else if (/rate limit|security purposes/i.test(error.message)) {
        setError("Je hebt net al een link aangevraagd. Probeer het over een minuutje opnieuw.");
      } else {
        setError("Er ging iets mis bij het versturen. Probeer het opnieuw.");
      }
      return;
    }
    setStatus("sent");
  }

  if (status === "sent") {
    return (
      <div>
        <p className="eyebrow flex items-center gap-2 text-clay">
          Bijna binnen <Sparkle width={9} height={9} />
        </p>
        <h1 className="mt-4 font-serif text-5xl leading-none font-medium">Check je inbox</h1>
        <p className="mt-4 text-[0.95rem] leading-relaxed text-muted">
          We hebben een inloglink gestuurd naar <strong className="text-ink">{email}</strong>.
          Klik op de link in de e-mail om direct in te loggen.
        </p>
        <button
          type="button"
          onClick={() => setStatus("idle")}
          className="mt-8 text-sm font-medium text-forest underline-offset-4 hover:underline"
        >
          Ander e-mailadres gebruiken
        </button>
      </div>
    );
  }

  return (
    <div className="flex min-h-[calc(100dvh-20rem)] flex-col lg:min-h-0">
      <p className="eyebrow flex items-center gap-2 text-clay">
        Inloggen <Sparkle width={9} height={9} />
      </p>
      <h1 className="mt-4 font-serif text-5xl leading-none font-medium">Welkom terug</h1>
      <p className="mt-4 text-[0.95rem] leading-relaxed text-muted">
        Log in om je gastenlijst, RSVP&apos;s en bruiloftsagenda veilig te beheren.
      </p>

      <form onSubmit={onSubmit} className="mt-8 space-y-5">
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

        {usePassword ? (
          <div>
            <label htmlFor="password" className="mb-2 block text-sm font-medium">
              Wachtwoord
            </label>
            <input
              id="password"
              type="password"
              required
              autoComplete="current-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="field"
            />
          </div>
        ) : (
          <p className="text-sm leading-relaxed text-muted">
            We sturen een veilige inloglink naar je e-mailadres. Je hebt geen wachtwoord nodig.
          </p>
        )}

        {error && (
          <p role="alert" className="rounded-xl bg-blush px-4 py-3 text-sm text-[#7a3f2c]">
            {error}
          </p>
        )}

        <button type="submit" className="btn-primary" disabled={status === "sending"}>
          {status === "sending"
            ? usePassword
              ? "Bezig met inloggen…"
              : "Bezig met versturen…"
            : usePassword
              ? "Inloggen"
              : "Stuur mij een inloglink"}
        </button>
        <button
          type="button"
          onClick={() => {
            setUsePassword((v) => !v);
            setError(null);
          }}
          className="block w-full text-center text-sm font-medium text-forest underline-offset-4 hover:underline"
        >
          {usePassword ? "Liever een inloglink per e-mail" : "Liever inloggen met wachtwoord"}
        </button>
      </form>

      <p className="mt-auto pt-12 text-center text-sm text-muted lg:mt-12">
        Nog geen account?{" "}
        <Link href="/account-aanmaken" className="font-semibold text-ink hover:text-forest">
          Maak een account aan
        </Link>
      </p>
    </div>
  );
}
