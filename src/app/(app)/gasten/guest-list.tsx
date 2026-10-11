"use client";

import Link from "next/link";
import { useEffect, useMemo, useRef, useState, useTransition } from "react";
import { ChevronDownIcon, DownloadIcon, PenIcon, SlidersIcon, Sparkle, TrashIcon, UploadIcon } from "@/components/icons";
import { RSVP_LABEL, type RsvpStatus } from "@/lib/format";
import { useRouter } from "next/navigation";
import { createGroup, deleteGroup, deleteGuest, renameGroup, setGuestStatus } from "../actions";

export type Guest = {
  id: string;
  firstName: string;
  lastName: string;
  email: string | null;
  phone: string | null;
  plusOne: string | null;
  dietary: string | null;
  status: RsvpStatus;
  /** Wat de gast zelf via het RSVP-formulier heeft ingevuld (null = nog niet gereageerd). */
  response: "attending" | "declined" | null;
  respondedAt: string | null;
  group: string | null;
};

export type GroupInfo = { id: string; name: string; count: number; hasInvitation: boolean };

function GroupManager({ groups }: { groups: GroupInfo[] }) {
  const router = useRouter();
  const box = useRef<HTMLDivElement>(null);
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<string | null>(null);
  const [confirming, setConfirming] = useState<string | null>(null);
  const [adding, setAdding] = useState(false);
  const [newName, setNewName] = useState("");
  const [value, setValue] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [busy, startTransition] = useTransition();

  useEffect(() => {
    if (!open) return;
    const onDown = (e: MouseEvent) => !box.current?.contains(e.target as Node) && setOpen(false);
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    document.addEventListener("mousedown", onDown);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onDown);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  function run(action: () => Promise<{ ok: true } | { ok: false; error: string }>) {
    startTransition(async () => {
      const res = await action();
      if (!res.ok) return setError(res.error);
      setError(null);
      setEditing(null);
      setConfirming(null);
      setAdding(false);
      setNewName("");
      router.refresh();
    });
  }

  return (
    <div ref={box} className="relative">
      <button
        type="button"
        aria-expanded={open}
        aria-haspopup="true"
        onClick={() => setOpen((v) => !v)}
        className={`flex items-center gap-2 rounded-full border px-4 py-2 text-sm font-medium transition ${
          open ? "border-forest/30 bg-sage/60" : "border-line bg-paper hover:bg-cream"
        }`}
      >
        Groepen beheren
        <ChevronDownIcon width={14} height={14} className={open ? "rotate-180" : ""} />
      </button>

      {open && (
        <div className="absolute right-0 z-20 mt-2 w-[min(21rem,calc(100vw-2rem))] rounded-2xl border border-line bg-paper p-2 shadow-[0_20px_50px_-20px_rgb(31_36_32/0.35)]">
          {groups.length === 0 ? (
            <p className="px-3 py-4 text-sm text-muted">Er zijn nog geen groepen. Geef een gast een groep om er een aan te maken.</p>
          ) : (
            <ul className="max-h-80 overflow-y-auto">
              {groups.map((g) => (
                <li key={g.id} className="rounded-xl px-3 py-2.5 hover:bg-cream/70">
                  {editing === g.id ? (
                    <form
                      onSubmit={(e) => {
                        e.preventDefault();
                        run(() => renameGroup(g.id, value));
                      }}
                      className="flex items-center gap-2"
                    >
                      <input
                        autoFocus
                        value={value}
                        onChange={(e) => setValue(e.target.value)}
                        maxLength={60}
                        aria-label={`Nieuwe naam voor ${g.name}`}
                        className="field min-w-0 flex-1 !py-1.5"
                      />
                      <button type="submit" disabled={busy || !value.trim()} className="text-sm font-medium text-forest underline-offset-4 hover:underline">
                        Opslaan
                      </button>
                      <button type="button" onClick={() => setEditing(null)} className="text-sm text-muted underline-offset-4 hover:underline">
                        Annuleren
                      </button>
                    </form>
                  ) : confirming === g.id ? (
                    <div className="text-sm">
                      <p>
                        &ldquo;{g.name}&rdquo; verwijderen?
                        {g.count > 0 && ` De ${g.count} ${g.count === 1 ? "gast blijft" : "gasten blijven"} staan, zonder groep.`}
                        {g.hasInvitation && " De uitnodiging voor deze groep wordt ook verwijderd."}
                      </p>
                      <div className="mt-2 flex gap-4">
                        <button type="button" disabled={busy} onClick={() => run(() => deleteGroup(g.id))} className="font-medium text-clay underline-offset-4 hover:underline">
                          Ja, verwijderen
                        </button>
                        <button type="button" onClick={() => setConfirming(null)} className="text-muted underline-offset-4 hover:underline">
                          Annuleren
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="flex items-center gap-2">
                      <span className="min-w-0 flex-1">
                        <span className="block truncate text-sm font-medium">{g.name}</span>
                        <span className="block text-xs text-muted">
                          {g.count} {g.count === 1 ? "gast" : "gasten"}
                        </span>
                      </span>
                      <button
                        type="button"
                        aria-label={`Naam van ${g.name} wijzigen`}
                        onClick={() => {
                          setEditing(g.id);
                          setValue(g.name);
                          setError(null);
                        }}
                        className="grid size-8 place-items-center rounded-full text-muted transition hover:bg-cream hover:text-ink"
                      >
                        <PenIcon width={15} height={15} />
                      </button>
                      <button
                        type="button"
                        aria-label={`${g.name} verwijderen`}
                        onClick={() => {
                          setConfirming(g.id);
                          setError(null);
                        }}
                        className="grid size-8 place-items-center rounded-full text-muted transition hover:bg-blush hover:text-clay"
                      >
                        <TrashIcon width={15} height={15} />
                      </button>
                    </div>
                  )}
                </li>
              ))}
            </ul>
          )}
          <div className="mt-1 border-t border-line px-3 pt-2.5 pb-1.5">
            {adding ? (
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  run(() => createGroup(newName));
                }}
                className="flex items-center gap-2"
              >
                <input
                  autoFocus
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  maxLength={60}
                  placeholder="Naam van de nieuwe groep"
                  aria-label="Naam van de nieuwe groep"
                  className="field min-w-0 flex-1 !py-1.5"
                />
                <button type="submit" disabled={busy || !newName.trim()} className="text-sm font-medium text-forest underline-offset-4 hover:underline">
                  Toevoegen
                </button>
                <button type="button" onClick={() => setAdding(false)} className="text-sm text-muted underline-offset-4 hover:underline">
                  Annuleren
                </button>
              </form>
            ) : (
              <button
                type="button"
                onClick={() => {
                  setAdding(true);
                  setError(null);
                }}
                className="text-sm font-medium text-clay underline-offset-4 hover:underline"
              >
                + Nieuwe groep toevoegen
              </button>
            )}
          </div>
          {error && (
            <p role="alert" className="px-3 pt-1 pb-2 text-sm text-clay">
              {error}
            </p>
          )}
        </div>
      )}
    </div>
  );
}

const BADGE: Record<RsvpStatus, string> = {
  attending: "bg-sage text-forest",
  pending: "bg-cream text-muted",
  declined: "bg-blush text-clay",
};

const STATUSES: RsvpStatus[] = ["attending", "pending", "declined"];

function fullName(g: Guest) {
  return `${g.firstName} ${g.lastName}`.trim();
}

function exportCsv(guests: Guest[]) {
  const header = ["Voornaam", "Achternaam", "E-mailadres", "Telefoonnummer", "Introducée", "Groep", "Dieetwensen", "Status"];
  const esc = (v: string | null) => `"${(v ?? "").replace(/"/g, '""')}"`;
  const lines = guests.map((g) =>
    [g.firstName, g.lastName, g.email, g.phone, g.plusOne, g.group, g.dietary, RSVP_LABEL[g.status]]
      .map(esc)
      .join(";"),
  );
  const blob = new Blob(["﻿" + [header.join(";"), ...lines].join("\n")], {
    type: "text/csv;charset=utf-8",
  });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = "gastenlijst.csv";
  a.click();
  URL.revokeObjectURL(url);
}

export function GuestList({ guests, groups: allGroups }: { guests: Guest[]; groups: GroupInfo[] }) {
  const [openId, setOpenId] = useState<string | null>(null);
  const [showFilters, setShowFilters] = useState(false);
  const [status, setStatus] = useState<RsvpStatus | "all">("all");
  const [group, setGroup] = useState<string>("all");
  const [query, setQuery] = useState("");
  const [pending, startTransition] = useTransition();

  const groups = useMemo(
    () => Array.from(new Set(guests.map((g) => g.group).filter((g): g is string => !!g))).sort(),
    [guests],
  );

  const filtered = guests.filter((g) => {
    if (status !== "all" && g.status !== status) return false;
    if (group !== "all" && g.group !== group) return false;
    if (query) {
      const q = query.toLowerCase();
      const hay = [fullName(g), g.plusOne, g.email].join(" ").toLowerCase();
      if (!hay.includes(q)) return false;
    }
    return true;
  });

  const activeFilters = (status !== "all" ? 1 : 0) + (group !== "all" ? 1 : 0);

  return (
    <section>
      <div className="flex items-baseline justify-between">
        <h2 className="font-serif text-2xl font-medium">Gastenlijst</h2>
        <span className="text-sm text-muted">
          {filtered.length === guests.length
            ? `${guests.length} ${guests.length === 1 ? "gast" : "gasten"}`
            : `${filtered.length} van ${guests.length}`}
        </span>
      </div>

      <div className="mt-3 flex justify-end gap-2">
        <button
          type="button"
          onClick={() => setShowFilters((v) => !v)}
          className={`flex items-center gap-2 rounded-full border px-4 py-2 text-sm font-medium transition ${
            showFilters || activeFilters ? "border-forest/30 bg-sage/60" : "border-line bg-paper hover:bg-cream"
          }`}
        >
          <SlidersIcon width={16} height={16} />
          Filters{activeFilters ? ` (${activeFilters})` : ""}
        </button>
        <Link
          href="/gasten/importeren"
          className="flex items-center gap-2 rounded-full border border-line bg-paper px-4 py-2 text-sm font-medium transition hover:bg-cream"
        >
          <UploadIcon width={16} height={16} />
          Importeren
        </Link>
        <button
          type="button"
          onClick={() => exportCsv(filtered)}
          disabled={filtered.length === 0}
          className="flex items-center gap-2 rounded-full border border-line bg-paper px-4 py-2 text-sm font-medium transition hover:bg-cream disabled:opacity-50"
        >
          <DownloadIcon width={16} height={16} />
          Exporteren
        </button>
        <GroupManager groups={allGroups} />
      </div>

      {showFilters && (
        <div className="card mt-3 space-y-4 p-4">
          <input
            type="search"
            placeholder="Zoek op naam of e-mail"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="field"
          />
          <div>
            <p className="eyebrow mb-2 text-muted">Status</p>
            <div className="flex flex-wrap gap-2">
              {(["all", ...STATUSES] as const).map((s) => (
                <button
                  key={s}
                  type="button"
                  onClick={() => setStatus(s)}
                  className={`rounded-full px-3.5 py-1.5 text-sm transition ${
                    status === s ? "bg-forest text-paper" : "bg-cream text-ink hover:bg-sage/60"
                  }`}
                >
                  {s === "all" ? "Alle" : RSVP_LABEL[s]}
                </button>
              ))}
            </div>
          </div>
          {groups.length > 0 && (
            <div>
              <p className="eyebrow mb-2 text-muted">Groep</p>
              <div className="flex flex-wrap gap-2">
                {["all", ...groups].map((gr) => (
                  <button
                    key={gr}
                    type="button"
                    onClick={() => setGroup(gr)}
                    className={`rounded-full px-3.5 py-1.5 text-sm transition ${
                      group === gr ? "bg-forest text-paper" : "bg-cream text-ink hover:bg-sage/60"
                    }`}
                  >
                    {gr === "all" ? "Alle groepen" : gr}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {guests.length === 0 ? (
        <div className="card mt-4 flex flex-col items-center px-6 py-12 text-center">
          <Sparkle className="text-clay" />
          <p className="mt-3 font-serif text-2xl">Nog geen gasten</p>
          <p className="mt-1 max-w-xs text-sm text-muted">
            Begin met de mensen die je zeker wilt uitnodigen. Groepen maak je onderweg aan.
          </p>
          <Link href="/gasten/nieuw" className="btn-primary mt-6 w-auto px-6">
            Eerste gast toevoegen
          </Link>
        </div>
      ) : filtered.length === 0 ? (
        <p className="card mt-4 p-6 text-center text-sm text-muted">Geen gasten gevonden met deze filters.</p>
      ) : (
        <ul className={`mt-4 grid items-start gap-3 xl:grid-cols-2 2xl:grid-cols-3 ${pending ? "opacity-70" : ""}`}>
          {filtered.map((g) => {
            const open = openId === g.id;
            return (
              <li key={g.id} className="card overflow-hidden">
                <button
                  type="button"
                  onClick={() => setOpenId(open ? null : g.id)}
                  aria-expanded={open}
                  className="flex h-[4.75rem] w-full items-center gap-3 px-4 text-left"
                >
                  <span className="min-w-0 flex-1">
                    <span className="block truncate font-medium">{fullName(g)}</span>
                    <span className="block truncate text-sm text-muted">{g.plusOne ? `+ ${g.plusOne}` : "Zonder introducée"}</span>
                  </span>
                  <span className={`shrink-0 rounded-full px-3 py-1 text-xs font-medium ${BADGE[g.status]}`}>
                    {RSVP_LABEL[g.status]}
                  </span>
                  <ChevronDownIcon
                    width={16}
                    height={16}
                    className={`shrink-0 text-muted transition ${open ? "rotate-180" : ""}`}
                  />
                </button>

                {open && (
                  <div className="px-4 pb-4">
                    <dl className="space-y-2.5 rounded-2xl bg-cream p-4 text-sm">
                      {[
                        ["Telefoonnummer", g.phone],
                        ["E-mailadres", g.email],
                        ["Groep", g.group],
                        ["Dieetwensen", g.dietary],
                      ].map(([label, value]) => (
                        <div key={label} className="flex justify-between gap-4">
                          <dt className="text-muted">{label}</dt>
                          <dd className="truncate text-right font-medium">{value || "—"}</dd>
                        </div>
                      ))}
                    </dl>

                    {g.response && (
                      <p className="mt-3 rounded-xl bg-cream px-3.5 py-2.5 text-xs leading-relaxed text-muted">
                        <span className="font-medium text-ink">
                          Via RSVP-formulier: {g.response === "attending" ? "aangemeld" : "afgemeld"}
                        </span>
                        {g.respondedAt ? ` op ${g.respondedAt}` : ""}
                        {g.status !== g.response && (
                          <span className="text-clay"> · status is handmatig aangepast naar {RSVP_LABEL[g.status].toLowerCase()}</span>
                        )}
                      </p>
                    )}

                    <div className="mt-3 flex flex-wrap items-center gap-2">
                      <span className="mr-1 text-xs text-muted">RSVP:</span>
                      {STATUSES.map((s) => (
                        <button
                          key={s}
                          type="button"
                          disabled={pending}
                          onClick={() => startTransition(() => setGuestStatus(g.id, s))}
                          className={`rounded-full px-3 py-1 text-xs font-medium transition ${
                            g.status === s ? BADGE[s] + " ring-1 ring-current/20" : "text-muted hover:bg-cream"
                          }`}
                        >
                          {RSVP_LABEL[s]}
                        </button>
                      ))}
                      <Link
                        href={`/gasten/${g.id}/bewerken`}
                        className="ml-auto flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-medium text-ink hover:bg-sage/60"
                      >
                        <PenIcon width={14} height={14} /> Bewerken
                      </Link>
                      <button
                        type="button"
                        disabled={pending}
                        onClick={() => {
                          if (window.confirm(`${fullName(g)} verwijderen van de gastenlijst?`)) {
                            startTransition(() => deleteGuest(g.id));
                          }
                        }}
                        className="flex items-center gap-1.5 rounded-full px-3 py-1 text-xs text-clay hover:bg-blush/60"
                      >
                        <TrashIcon width={14} height={14} /> Verwijderen
                      </button>
                    </div>
                  </div>
                )}
              </li>
            );
          })}
        </ul>
      )}
    </section>
  );
}
