"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useRef, useState, useTransition } from "react";
import { DownloadIcon } from "@/components/icons";
import { importGuests, type ImportRow } from "../../actions";

const COLUMNS = [
  { name: "Voornaam", required: true, text: "Verplicht. De voornaam van de gast." },
  { name: "Achternaam", required: false, text: "De achternaam van de gast." },
  { name: "Email", required: false, text: "Het e-mailadres, nodig om de uitnodiging te mailen." },
  { name: "Telefoonnummer", required: false, text: "Het mobiele nummer, nodig voor WhatsApp. Bijvoorbeeld 06 12345678." },
  { name: "Invitee", required: false, text: "De naam van degene die de gast mag meenemen. Leeg laten als de gast alleen komt." },
  { name: "Dieetwensen", required: false, text: "Bijvoorbeeld vegetarisch, glutenvrij of een allergie." },
];

const ALIASES: Record<keyof ImportRow, string[]> = {
  first_name: ["voornaam", "firstname", "naam"],
  last_name: ["achternaam", "lastname"],
  email: ["email", "emailadres", "mail"],
  phone: ["telefoonnummer", "telefoon", "mobiel", "mobielnummer", "gsm", "phone"],
  plus_one_name: ["invitee", "introducee", "plusone", "plus1", "partner"],
  dietary: ["dieetwensen", "dieetwens", "dieet", "dietary"],
  group: ["groep", "gastengroep", "group"],
};

const norm = (s: string) =>
  s
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[^a-z0-9]/g, "");

/** Eenvoudige CSV-lezer: ondersteunt ; , of tab als scheiding, aanhalingstekens en een BOM. */
function parseCsv(text: string): string[][] {
  const src = text.replace(/^﻿/, "");
  const firstLine = src.split(/\r?\n/, 1)[0] ?? "";
  const delim = [";", ",", "\t"].map((d) => [d, firstLine.split(d).length] as const).sort((a, b) => b[1] - a[1])[0][0];
  const rows: string[][] = [];
  let row: string[] = [];
  let cell = "";
  let quoted = false;
  for (let i = 0; i < src.length; i++) {
    const c = src[i];
    if (quoted) {
      if (c === '"' && src[i + 1] === '"') {
        cell += '"';
        i++;
      } else if (c === '"') quoted = false;
      else cell += c;
    } else if (c === '"') quoted = true;
    else if (c === delim) {
      row.push(cell);
      cell = "";
    } else if (c === "\n" || c === "\r") {
      if (c === "\r" && src[i + 1] === "\n") i++;
      row.push(cell);
      cell = "";
      rows.push(row);
      row = [];
    } else cell += c;
  }
  row.push(cell);
  rows.push(row);
  return rows.filter((r) => r.some((c) => c.trim() !== ""));
}

type Parsed = { rows: ImportRow[]; problems: string[]; skippedColumns: string[] };

function parseGuests(text: string): Parsed | { fatal: string } {
  const table = parseCsv(text);
  if (table.length < 2) return { fatal: "Het bestand bevat geen gasten. Zet de kolomnamen in de eerste rij en de gasten eronder." };

  const headers = table[0].map(norm);
  const index = {} as Record<keyof ImportRow, number>;
  (Object.keys(ALIASES) as (keyof ImportRow)[]).forEach((k) => {
    index[k] = headers.findIndex((h) => ALIASES[k].includes(h));
  });
  if (index.first_name < 0) return { fatal: "We vinden geen kolom ‘Voornaam’. Controleer of die in de eerste rij staat." };

  const known = new Set(Object.values(ALIASES).flat());
  const skippedColumns = table[0].filter((h, i) => h.trim() && !known.has(headers[i]));

  const rows: ImportRow[] = [];
  const problems: string[] = [];
  table.slice(1).forEach((cells, i) => {
    const get = (k: keyof ImportRow) => (index[k] >= 0 ? (cells[index[k]] ?? "").trim() : "");
    const row: ImportRow = {
      first_name: get("first_name"),
      last_name: get("last_name"),
      email: get("email"),
      phone: get("phone"),
      plus_one_name: get("plus_one_name"),
      dietary: get("dietary"),
      group: get("group"),
    };
    const line = i + 2;
    if (!row.first_name) problems.push(`Rij ${line}: voornaam ontbreekt.`);
    else if (row.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(row.email)) problems.push(`Rij ${line} (${row.first_name}): het e-mailadres klopt niet.`);
    else rows.push(row);
  });
  return { rows, problems, skippedColumns };
}

function downloadTemplate() {
  const esc = (v: string) => (/[;"\n]/.test(v) ? `"${v.replace(/"/g, '""')}"` : v);
  const lines = [
    ["Voornaam", "Achternaam", "Email", "Telefoonnummer", "Invitee", "Dieetwensen"],
    ["Jasmijn", "Smit", "jasmijn@voorbeeld.nl", "06 12345678", "Joost", "Vegetarisch"],
    ["Daan", "de Vries", "daan@voorbeeld.nl", "06 87654321", "", ""],
  ].map((r) => r.map(esc).join(";"));
  const blob = new Blob(["﻿" + lines.join("\n")], { type: "text/csv;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = "gasten-importeren-voorbeeld.csv";
  a.click();
  URL.revokeObjectURL(url);
}

export function ImportView() {
  const router = useRouter();
  const input = useRef<HTMLInputElement>(null);
  const [fileName, setFileName] = useState("");
  const [parsed, setParsed] = useState<Parsed | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();

  async function onFile(file: File | undefined) {
    setParsed(null);
    setError(null);
    if (!file) return;
    setFileName(file.name);
    if (!/\.(csv|txt)$/i.test(file.name)) {
      setError("Sla je spreadsheet eerst op als CSV (zie stap 2) en kies dat bestand.");
      return;
    }
    const result = parseGuests(await file.text());
    if ("fatal" in result) setError(result.fatal);
    else setParsed(result);
  }

  function submit() {
    if (!parsed?.rows.length) return;
    setError(null);
    startTransition(async () => {
      const res = await importGuests(parsed.rows);
      if ("error" in res) setError(res.error);
      else router.push(`/gasten?geimporteerd=${res.count}`);
    });
  }

  return (
    <div className="space-y-6">
      <section className="card p-5 sm:p-6">
        <h2 className="font-serif text-2xl font-medium">Zo werkt importeren</h2>
        <p className="mt-1 text-sm leading-relaxed text-muted">
          Heb je je gasten al in een spreadsheet staan? Dan zet je ze in één keer in je gastenlijst.
        </p>

        <ol className="mt-5 space-y-5 text-sm leading-relaxed">
          <li className="flex gap-3">
            <span className="grid size-6 shrink-0 place-items-center rounded-full bg-forest text-xs font-semibold text-paper">1</span>
            <div>
              <p className="font-medium">Maak een spreadsheet aan</p>
              <p className="text-muted">
                Gebruik Excel, Numbers of Google Sheets. Zet in de eerste rij deze kolomnamen en vul eronder per rij één gast in:
              </p>
              <div className="mt-3 overflow-hidden rounded-xl border border-line">
                <table className="w-full text-left text-xs sm:text-sm">
                  <tbody>
                    {COLUMNS.map((c) => (
                      <tr key={c.name} className="border-b border-line last:border-0">
                        <th className="w-36 bg-cream px-3 py-2 font-semibold whitespace-nowrap sm:w-44">
                          {c.name}
                          {c.required && <span className="ml-1 text-clay">*</span>}
                        </th>
                        <td className="px-3 py-2 text-muted">{c.text}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <p className="mt-2 text-xs text-muted">
                Een kolom ‘Groep’ mag er ook bij, dan worden de gasten meteen in die groep gezet. Andere kolommen worden genegeerd.
              </p>
            </div>
          </li>
          <li className="flex gap-3">
            <span className="grid size-6 shrink-0 place-items-center rounded-full bg-forest text-xs font-semibold text-paper">2</span>
            <div>
              <p className="font-medium">Sla op als CSV</p>
              <p className="text-muted">
                Kies Bestand → Opslaan als (of Downloaden) → <strong className="text-ink">CSV</strong>. Niet zeker hoe het eruit moet zien? Download het voorbeeld en vul dat in.
              </p>
              <button
                type="button"
                onClick={downloadTemplate}
                className="mt-3 inline-flex items-center gap-2 rounded-full border border-line bg-paper px-4 py-2 text-sm font-medium transition hover:bg-cream"
              >
                <DownloadIcon width={16} height={16} /> Voorbeeldbestand downloaden
              </button>
            </div>
          </li>
          <li className="flex gap-3">
            <span className="grid size-6 shrink-0 place-items-center rounded-full bg-forest text-xs font-semibold text-paper">3</span>
            <div>
              <p className="font-medium">Kies het bestand en controleer</p>
              <p className="text-muted">Je ziet eerst een controle van wat er wordt geïmporteerd. Pas daarna worden de gasten toegevoegd.</p>
            </div>
          </li>
        </ol>
      </section>

      <section className="card p-5 sm:p-6">
        <h2 className="font-serif text-2xl font-medium">Bestand kiezen</h2>
        <input
          ref={input}
          type="file"
          accept=".csv,.txt,text/csv"
          className="sr-only"
          onChange={(e) => onFile(e.target.files?.[0])}
        />
        <button
          type="button"
          onClick={() => input.current?.click()}
          className="mt-4 flex w-full flex-col items-center gap-1 rounded-2xl border border-dashed border-line bg-cream px-4 py-8 text-center transition hover:bg-sage/40"
        >
          <span className="font-medium">{fileName || "Kies je CSV-bestand"}</span>
          <span className="text-xs text-muted">Maximaal 500 gasten per keer</span>
        </button>

        {error && (
          <p role="alert" className="mt-4 rounded-xl bg-blush px-4 py-3 text-sm text-[#7a3f2c]">
            {error}
          </p>
        )}

        {parsed && (
          <div className="mt-5 space-y-4">
            <p className="text-sm">
              <strong>{parsed.rows.length}</strong> {parsed.rows.length === 1 ? "gast" : "gasten"} klaar om te importeren
              {parsed.problems.length > 0 && <span className="text-clay">, {parsed.problems.length} rij(en) worden overgeslagen</span>}.
            </p>

            {parsed.problems.length > 0 && (
              <ul className="space-y-1 rounded-xl bg-blush px-4 py-3 text-xs text-[#7a3f2c]">
                {parsed.problems.slice(0, 8).map((p) => (
                  <li key={p}>{p}</li>
                ))}
                {parsed.problems.length > 8 && <li>… en {parsed.problems.length - 8} meer.</li>}
              </ul>
            )}
            {parsed.skippedColumns.length > 0 && (
              <p className="text-xs text-muted">Genegeerde kolommen: {parsed.skippedColumns.join(", ")}.</p>
            )}

            {parsed.rows.length > 0 && (
              <div className="overflow-x-auto rounded-xl border border-line">
                <table className="w-full min-w-[34rem] text-left text-xs">
                  <thead className="bg-cream text-muted">
                    <tr>
                      {["Naam", "Email", "Telefoon", "Invitee", "Dieetwensen"].map((h) => (
                        <th key={h} className="px-3 py-2 font-medium">
                          {h}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {parsed.rows.slice(0, 6).map((r, i) => (
                      <tr key={i} className="border-t border-line">
                        <td className="px-3 py-2 font-medium">{`${r.first_name} ${r.last_name}`.trim()}</td>
                        <td className="px-3 py-2">{r.email || "—"}</td>
                        <td className="px-3 py-2">{r.phone || "—"}</td>
                        <td className="px-3 py-2">{r.plus_one_name || "—"}</td>
                        <td className="px-3 py-2">{r.dietary || "—"}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                {parsed.rows.length > 6 && (
                  <p className="border-t border-line bg-cream px-3 py-2 text-xs text-muted">… en nog {parsed.rows.length - 6} gasten.</p>
                )}
              </div>
            )}

            <div className="flex flex-col-reverse gap-3 sm:flex-row">
              <Link
                href="/gasten"
                className="inline-flex flex-1 items-center justify-center rounded-full border border-line bg-paper px-6 py-3.5 font-medium hover:bg-cream"
              >
                Annuleren
              </Link>
              <button type="button" onClick={submit} disabled={pending || parsed.rows.length === 0} className="btn-primary flex-1">
                {pending ? "Importeren…" : `${parsed.rows.length} ${parsed.rows.length === 1 ? "gast" : "gasten"} importeren`}
              </button>
            </div>
          </div>
        )}
      </section>
    </div>
  );
}
