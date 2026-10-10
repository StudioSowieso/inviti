"use client";

import Link from "next/link";
import { useMemo, useState, useTransition } from "react";
import { ChevronDownIcon, DownloadIcon, SlidersIcon, Sparkle, TrashIcon } from "@/components/icons";
import { RSVP_LABEL, type RsvpStatus } from "@/lib/format";
import { deleteGuest, setGuestStatus } from "../actions";

export type Guest = {
  id: string;
  firstName: string;
  lastName: string;
  email: string | null;
  phone: string | null;
  plusOne: string | null;
  dietary: string | null;
  status: RsvpStatus;
  group: string | null;
};

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

export function GuestList({ guests }: { guests: Guest[] }) {
  const [openId, setOpenId] = useState<string | null>(guests[0]?.id ?? null);
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
        <button
          type="button"
          onClick={() => exportCsv(filtered)}
          disabled={filtered.length === 0}
          className="flex items-center gap-2 rounded-full border border-line bg-paper px-4 py-2 text-sm font-medium transition hover:bg-cream disabled:opacity-50"
        >
          <DownloadIcon width={16} height={16} />
          Exporteren
        </button>
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
                      <button
                        type="button"
                        disabled={pending}
                        onClick={() => {
                          if (window.confirm(`${fullName(g)} verwijderen van de gastenlijst?`)) {
                            startTransition(() => deleteGuest(g.id));
                          }
                        }}
                        className="ml-auto flex items-center gap-1.5 rounded-full px-3 py-1 text-xs text-clay hover:bg-blush/60"
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
