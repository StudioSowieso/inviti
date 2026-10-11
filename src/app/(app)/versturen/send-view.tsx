"use client";

import Link from "next/link";
import { useEffect, useState, useTransition } from "react";
import { LinkIcon, MailIcon, Sparkle } from "@/components/icons";
import { saveInviteMessage, setInviteSent } from "./actions";

export type SendGuest = {
  id: string;
  firstName: string;
  lastName: string;
  email: string | null;
  phone: string | null;
  plusOne: string;
  sent: boolean;
  token: string;
  group: string | null;
};
export type SendGroup = { id: string; name: string; token: string; members: string[] };
type Couple = { partner1: string; partner2: string; date: string };

const MONTHS = ["januari", "februari", "maart", "april", "mei", "juni", "juli", "augustus", "september", "oktober", "november", "december"];

function longDate(iso: string) {
  const [y, m, d] = iso.split("-").map(Number);
  return m >= 1 && m <= 12 ? `${d} ${MONTHS[m - 1]} ${y}` : iso;
}

/** 06 12345678 → 31612345678 (formaat voor WhatsApp); +31… en 0031… blijven werken. */
function whatsappNumber(phone: string) {
  let digits = phone.replace(/[^\d+]/g, "");
  if (digits.startsWith("+")) return digits.slice(1).replace(/\D/g, "");
  digits = digits.replace(/\D/g, "");
  if (digits.startsWith("00")) return digits.slice(2);
  if (digits.startsWith("0")) return `31${digits.slice(1)}`;
  return digits;
}

export const DEFAULT_MESSAGE =
  "Hoi {voornaam},\n\nWe gaan trouwen op {datum}! Wij nodigen {je/jullie} graag uit voor onze bruiloft. Bekijk hier {je/jullie} persoonlijke uitnodiging:\n{link}\n\nLiefs,\n{namen}";

const PLACEHOLDERS = ["{voornaam}", "{je/jullie}", "{jou/jullie}", "{namen}", "{datum}", "{link}"] as const;

/** Vult de invulvelden in. Staat {link} er niet in, dan wordt de link onderaan toegevoegd. */
/** "Anna" of, met invitee, "Anna en Piet". */
function addressee(first: string, plusOne: string) {
  const p = plusOne.trim().split(/\s+/)[0];
  return p ? `${first} en ${p}` : first;
}

type Part = { text: string; auto: boolean };

/** Het bericht in stukjes: `auto` zijn de delen die per gast automatisch worden ingevuld. */
function messageParts(template: string, first: string, link: string, couple: Couple | null, plural: boolean): Part[] {
  const names = couple ? `${couple.partner1} & ${couple.partner2}` : "wij";
  const date = couple?.date ? longDate(couple.date) : "binnenkort";
  const values: Record<string, string> = {
    voornaam: first,
    "je/jullie": plural ? "jullie" : "je",
    "jou/jullie": plural ? "jullie" : "jou",
    namen: names,
    datum: date,
    link,
  };
  const parts: Part[] = [];
  let last = 0;
  for (const m of template.matchAll(/\{(voornaam|je\/jullie|jou\/jullie|namen|datum|link)\}/g)) {
    if (m.index > last) parts.push({ text: template.slice(last, m.index), auto: false });
    parts.push({ text: values[m[1]], auto: true });
    last = m.index + m[0].length;
  }
  if (last < template.length) parts.push({ text: template.slice(last), auto: false });
  // Staat {link} er niet in, dan wordt de link onderaan toegevoegd.
  if (!template.includes("{link}")) parts.push({ text: "\n\n", auto: false }, { text: link, auto: true });
  return parts;
}

/** Platte tekst voor WhatsApp en mail. */
function message(template: string, first: string, link: string, couple: Couple | null, plural: boolean) {
  return messageParts(template, first, link, couple, plural)
    .map((p) => p.text)
    .join("");
}

function WhatsAppIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M12.04 2C6.58 2 2.13 6.45 2.13 11.91c0 1.75.46 3.45 1.32 4.95L2.05 22l5.25-1.38a9.9 9.9 0 0 0 4.74 1.21h.01c5.46 0 9.91-4.45 9.91-9.91 0-2.65-1.03-5.14-2.9-7.01A9.82 9.82 0 0 0 12.04 2Zm0 18.15h-.01a8.2 8.2 0 0 1-4.19-1.15l-.3-.18-3.12.82.83-3.04-.2-.31a8.2 8.2 0 0 1-1.26-4.38c0-4.54 3.7-8.24 8.25-8.24 2.2 0 4.27.86 5.82 2.42a8.18 8.18 0 0 1 2.41 5.83c0 4.55-3.7 8.23-8.23 8.23Zm4.52-6.16c-.25-.12-1.47-.72-1.69-.81-.23-.08-.39-.12-.56.12-.17.25-.64.81-.78.97-.14.17-.29.19-.54.06-.25-.12-1.05-.39-2-1.23-.74-.66-1.24-1.47-1.38-1.72-.15-.25-.02-.38.11-.5.11-.11.25-.29.37-.43.12-.15.17-.25.25-.41.08-.17.04-.31-.02-.43-.06-.12-.56-1.34-.76-1.84-.2-.48-.4-.42-.56-.42h-.48c-.17 0-.43.06-.66.31-.22.25-.86.85-.86 2.07 0 1.22.89 2.4 1.01 2.56.12.17 1.75 2.67 4.23 3.74.59.26 1.05.41 1.41.52.59.19 1.13.16 1.56.1.48-.07 1.47-.6 1.67-1.18.21-.58.21-1.07.14-1.18-.06-.1-.23-.16-.48-.29Z" />
    </svg>
  );
}

const ACTION =
  "inline-flex items-center gap-1.5 rounded-full border border-line bg-paper px-3.5 py-2 text-xs font-medium transition hover:bg-sage/60";
const DISABLED = "pointer-events-none opacity-40";

function CopyButton({ text, label = "Link kopiëren", className = "", onCopied }: { text: string; label?: string; className?: string; onCopied?: () => void }) {
  const [done, setDone] = useState(false);
  async function copy() {
    try {
      await navigator.clipboard.writeText(text);
    } catch {
      const el = document.createElement("textarea");
      el.value = text;
      document.body.appendChild(el);
      el.select();
      document.execCommand("copy");
      el.remove();
    }
    setDone(true);
    setTimeout(() => setDone(false), 1800);
    onCopied?.();
  }
  return (
    <button type="button" onClick={copy} className={`${ACTION} ${done ? "border-forest/30 bg-sage text-forest" : ""} ${className}`}>
      <LinkIcon width={15} height={15} />
      {done ? "Gekopieerd" : label}
    </button>
  );
}

export function SendView({
  origin,
  guests,
  groups,
  hasInvitation,
  couple,
  savedMessage,
}: {
  origin: string;
  guests: SendGuest[];
  groups: SendGroup[];
  hasInvitation: boolean;
  couple: Couple | null;
  savedMessage: string | null;
}) {
  const [template, setTemplate] = useState(savedMessage ?? DEFAULT_MESSAGE);
  const [view, setView] = useState<"personal" | "groups">("personal");
  const [tipOpen, setTipOpen] = useState(false);
  const [sent, setSent] = useState<Record<string, boolean>>(() => Object.fromEntries(guests.map((g) => [g.id, g.sent])));
  const sentCount = guests.filter((g) => sent[g.id]).length;
  async function toggleSent(id: string, value: boolean) {
    setSent((s) => ({ ...s, [id]: value }));
    const res = await setInviteSent(id, value);
    if (!res.ok) setSent((s) => ({ ...s, [id]: !value }));
  }
  const url = (token: string) => `${origin}/u/${token}`;

  return (
    <div className="space-y-5">
      {tipOpen && <BroadcastTip onClose={() => setTipOpen(false)} />}
      <MessageEditor
        template={template}
        onChange={setTemplate}
        saved={savedMessage ?? DEFAULT_MESSAGE}
        sampleFirst={guests[0]?.firstName ?? "Emma"}
        samplePlusOne={guests[0]?.plusOne ?? ""}
        sampleLink={url(guests[0]?.token ?? "voorbeeld")}
        couple={couple}
      />

      <div className="flex rounded-full border border-line bg-paper p-1 text-sm sm:max-w-xl" role="tablist">
        {(
          [
            ["personal", "Persoonlijke uitnodiging links"],
            ["groups", "Uitnodiging links per groep"],
          ] as const
        ).map(([v, label]) => (
          <button
            key={v}
            type="button"
            role="tab"
            aria-selected={view === v}
            onClick={() => setView(v)}
            className={`flex-1 rounded-full px-3 py-2 font-medium transition ${view === v ? "bg-forest text-paper" : "text-muted"}`}
          >
            {label}
          </button>
        ))}
      </div>

      {!hasInvitation && (
        <p className="rounded-xl bg-blush px-4 py-3 text-sm text-[#7a3f2c]">
          Je hebt nog geen uitnodiging gemaakt, dus de links tonen nog niets.{" "}
          <Link href="/uitnodiging" className="font-semibold underline underline-offset-4">
            Maak eerst je uitnodiging
          </Link>
          .
        </p>
      )}

      {view === "personal" ? (
        guests.length === 0 ? (
          <Empty text="Nog geen gasten" hint="Voeg eerst gasten toe aan je gastenlijst." />
        ) : (
          <>
          <p className="text-sm text-muted">
            <strong className="font-medium text-ink">{sentCount} van {guests.length} verstuurd.</strong> Inviti kan niet zien of je een uitnodiging echt hebt verstuurd, dus vink dit zelf handmatig af per gast.
          </p>
          <ul className="grid gap-3 xl:grid-cols-2">
            {guests.map((g) => {
              const link = url(g.token);
              const text = message(template, addressee(g.firstName, g.plusOne), link, couple, !!g.plusOne.trim());
              const subject = couple ? `Uitnodiging bruiloft ${couple.partner1} & ${couple.partner2}` : "Uitnodiging bruiloft";
              const wa = g.phone ? `https://wa.me/${whatsappNumber(g.phone)}?text=${encodeURIComponent(text)}` : null;
              const mail = g.email ? `mailto:${g.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(text)}` : null;
              return (
                <li key={g.id} className={`card p-4 transition ${sent[g.id] ? "bg-sage/40" : ""}`}>
                  <div className="flex items-baseline justify-between gap-3">
                    <p className="min-w-0 truncate font-medium">
                      {`${g.firstName} ${g.lastName}`.trim()}
                      {g.plusOne && <span className="font-normal text-muted"> &amp; {g.plusOne}</span>}
                    </p>
                    {g.group && <span className="shrink-0 rounded-full bg-cream px-2.5 py-0.5 text-xs text-muted">{g.group}</span>}
                  </div>
                  <p className="mt-0.5 truncate text-sm text-muted">{[g.phone, g.email].filter(Boolean).join(" · ") || "Geen telefoonnummer of e-mailadres"}</p>
                  <div className="mt-3 flex flex-wrap gap-2">
                    <a
                      href={wa ?? undefined}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-disabled={!wa}
                      title={wa ? undefined : "Geen telefoonnummer ingevuld"}
                      className={`${ACTION} ${wa ? "" : DISABLED}`}
                    >
                      <WhatsAppIcon /> WhatsApp
                    </a>
                    <a
                      href={mail ?? undefined}
                      aria-disabled={!mail}
                      title={mail ? undefined : "Geen e-mailadres ingevuld"}
                      className={`${ACTION} ${mail ? "" : DISABLED}`}
                    >
                      <MailIcon width={15} height={15} /> Mail
                    </a>
                    <CopyButton text={link} label="Link" />
                    <label title="Handmatige checkbox: vink af zodra je de uitnodiging zelf hebt verstuurd" className="ml-auto inline-flex cursor-pointer items-center gap-2 text-xs font-medium">
                      <input
                        type="checkbox"
                        checked={!!sent[g.id]}
                        onChange={(e) => toggleSent(g.id, e.target.checked)}
                        className="size-4 accent-[var(--color-forest)]"
                      />
                      Verstuurd
                      <span className="font-normal text-muted">(zelf afvinken)</span>
                    </label>
                  </div>
                </li>
              );
            })}
          </ul>
          </>
        )
      ) : groups.length === 0 ? (
        <Empty text="Nog geen groepen" hint="Groepen maak je aan bij het toevoegen of bewerken van een gast." />
      ) : (
        <ul className="grid gap-3 xl:grid-cols-2">
          {groups.map((gr) => {
            const link = url(gr.token);
            return (
              <li key={gr.id} className="card p-4">
                <div className="flex items-baseline justify-between gap-3">
                  <h3 className="font-serif text-xl font-medium">{gr.name}</h3>
                  <span className="text-sm text-muted">
                    {gr.members.length} {gr.members.length === 1 ? "gast" : "gasten"}
                  </span>
                </div>
                <div className="mt-3 flex flex-wrap gap-1.5">
                  {gr.members.length === 0 ? (
                    <span className="text-sm text-muted">Nog geen gasten in deze groep.</span>
                  ) : (
                    gr.members.map((m, i) => (
                      <span key={`${m}-${i}`} className="rounded-full bg-cream px-3 py-1 text-xs">
                        {m}
                      </span>
                    ))
                  )}
                </div>
                <div className="mt-4 rounded-xl bg-cream px-3.5 py-2.5 text-xs break-all text-muted">{link}</div>
                <div className="mt-3 flex flex-wrap gap-2">
                  <CopyButton text={link} label="Groepslink kopiëren" onCopied={() => setTipOpen(true)} />
                  <a href={link} target="_blank" rel="noopener noreferrer" className={ACTION}>
                    Bekijk uitnodiging
                  </a>
                </div>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}

function MessageEditor({
  template,
  onChange,
  saved,
  sampleFirst,
  samplePlusOne,
  sampleLink,
  couple,
}: {
  template: string;
  onChange: (v: string) => void;
  saved: string;
  sampleFirst: string;
  samplePlusOne: string;
  sampleLink: string;
  couple: Couple | null;
}) {
  const [editing, setEditing] = useState(false);
  const [pending, start] = useTransition();
  const [status, setStatus] = useState<{ kind: "ok" | "error"; text: string } | null>(null);
  const shownPlusOne = samplePlusOne.trim();
  const dirty = template !== saved;

  function save() {
    setStatus(null);
    start(async () => {
      const res = await saveInviteMessage(template === DEFAULT_MESSAGE ? "" : template);
      setStatus(res.ok ? { kind: "ok", text: "Opgeslagen" } : { kind: "error", text: res.error });
      if (res.ok) setEditing(false);
    });
  }

  function insert(tag: string) {
    const el = document.getElementById("invite-message") as HTMLTextAreaElement | null;
    if (!el) return onChange(template + tag);
    const { selectionStart: a, selectionEnd: b } = el;
    onChange(template.slice(0, a) + tag + template.slice(b));
    requestAnimationFrame(() => {
      el.focus();
      el.setSelectionRange(a + tag.length, a + tag.length);
    });
  }

  return (
    <section className="card p-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="font-serif text-2xl font-medium">Voorbeeldbericht</h2>
          <p className="mt-0.5 text-sm text-muted">Dit bericht gaat mee met elke WhatsApp en mail. Per gast vullen we de naam en link in. Met {"{je/jullie}"} wordt het &ldquo;je&rdquo; bij een enkele gast en &ldquo;jullie&rdquo; bij een gast met invitee.</p>
        </div>
        {!editing && (
          <button type="button" onClick={() => setEditing(true)} className={ACTION}>
            Bericht aanpassen
          </button>
        )}
      </div>

      <div className="mt-4 grid gap-4 lg:grid-cols-2">
        <div>
          <div className="rounded-2xl rounded-tl-md bg-blush/70 px-4 py-3 text-sm leading-relaxed whitespace-pre-wrap">
            {messageParts(template, addressee(sampleFirst, shownPlusOne), sampleLink, couple, !!shownPlusOne).map((p, i) =>
              p.auto ? (
                <span key={i} className="rounded bg-clay/20 px-1 break-all">
                  {p.text}
                </span>
              ) : (
                <span key={i}>{p.text}</span>
              ),
            )}
          </div>
          <p className="mt-2 text-xs text-muted">De woorden in een blokje worden per gast automatisch ingevuld.</p>
        </div>

        {editing && (
          <div>
            <label htmlFor="invite-message" className="sr-only">
              Bericht
            </label>
            <textarea
              id="invite-message"
              value={template}
              onChange={(e) => onChange(e.target.value)}
              rows={9}
              maxLength={2000}
              className="field w-full resize-y text-sm leading-relaxed"
            />
            <div className="mt-2 flex flex-wrap items-center gap-1.5 text-xs text-muted">
              Voeg toe:
              {PLACEHOLDERS.map((p) => (
                <button key={p} type="button" onClick={() => insert(p)} className="rounded-full bg-cream px-2.5 py-1 font-medium text-ink transition hover:bg-sage">
                  {p}
                </button>
              ))}
            </div>
            <div className="mt-3 flex flex-wrap items-center gap-2">
              <button type="button" onClick={save} disabled={pending || !dirty} className="btn-primary w-auto! px-5 py-2 text-sm disabled:opacity-50">
                {pending ? "Opslaan…" : "Opslaan"}
              </button>
              <button type="button" onClick={() => onChange(DEFAULT_MESSAGE)} className={ACTION}>
                Voorbeeldtekst herstellen
              </button>
              <button
                type="button"
                onClick={() => {
                  onChange(saved);
                  setEditing(false);
                  setStatus(null);
                }}
                className="text-xs text-muted underline-offset-4 hover:underline"
              >
                Annuleren
              </button>
            </div>
          </div>
        )}
      </div>
      {status && (
        <p role="status" className={`mt-3 text-sm ${status.kind === "ok" ? "text-forest" : "text-[#7a3f2c]"}`}>
          {status.text}
        </p>
      )}
    </section>
  );
}

/** Korte tip na het kopiëren van een groepslink: zo maak je een verzendlijst in WhatsApp. */
function BroadcastTip({ onClose }: { onClose: () => void }) {
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  return (
    <div className="fixed inset-0 z-50 grid place-items-center bg-ink/45 px-5" onClick={onClose}>
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="tip-title"
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-md rounded-3xl bg-paper p-6 shadow-[0_30px_80px_-30px_rgb(0_0_0/0.5)]"
      >
        <p className="eyebrow flex items-center gap-2 text-clay">
          Link gekopieerd <Sparkle width={9} height={9} />
        </p>
        <h2 id="tip-title" className="mt-3 font-serif text-5xl leading-none font-medium text-clay">
          Tip!
        </h2>
        <p className="mt-3 font-serif text-xl leading-snug font-medium">Stuur de link in één keer naar de hele groep</p>
        <p className="mt-2 text-sm leading-relaxed text-muted">Maak in WhatsApp een verzendlijst. Iedereen krijgt de link als persoonlijk bericht, zonder dat ze elkaar zien.</p>
        <ol className="mt-4 list-decimal space-y-1.5 pl-5 text-sm leading-relaxed">
          <li>
            iPhone: ga naar het tabblad <strong>Chats</strong> en kies <strong>Verzendlijsten</strong>. Android: tik op <strong>⋮</strong> en kies <strong>Nieuwe verzendlijst</strong>.
          </li>
          <li>Tik op <strong>Nieuwe lijst</strong> en selecteer de gasten uit deze groep.</li>
          <li>Geef de lijst een naam, plak de gekopieerde link en verstuur.</li>
        </ol>
        <p className="mt-4 rounded-xl bg-cream px-3.5 py-2.5 text-xs leading-relaxed text-muted">
          Let op: gasten ontvangen een bericht uit een verzendlijst alleen als zij jouw nummer in hun contacten hebben.
        </p>
        <button type="button" autoFocus onClick={onClose} className="btn-primary mt-5">
          Begrepen
        </button>
      </div>
    </div>
  );
}

function Empty({ text, hint }: { text: string; hint: string }) {
  return (
    <div className="card flex flex-col items-center px-6 py-12 text-center">
      <Sparkle className="text-clay" />
      <p className="mt-3 font-serif text-2xl">{text}</p>
      <p className="mt-1 max-w-xs text-sm text-muted">{hint}</p>
    </div>
  );
}
