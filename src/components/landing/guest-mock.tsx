import { CheckIcon, PenIcon, UsersIcon } from "@/components/icons";

const GROUPS = ["Alle", "Dag-gast", "Avond-gast", "Inner Circle"];

const GUESTS = [
  { name: "Lotte de Vries", group: "Inner Circle", status: "Aanwezig", tone: "bg-forest", plus: "+1" },
  { name: "Daan Bakker", group: "Dag-gast", status: "Aanwezig", tone: "bg-forest", plus: "" },
  { name: "Marga Zeilen", group: "Avond-gast", status: "Nog open", tone: "bg-clay", plus: "+1" },
  { name: "Sam Jansen", group: "Dag-gast", status: "Afwezig", tone: "bg-muted", plus: "" },
];

const initials = (n: string) => n.split(" ").map((p) => p[0]).slice(0, 2).join("");

/** Statisch voorbeeld van het gastenlijst-scherm, voor in de telefoon op de landingspagina. */
export function GuestMock() {
  return (
    <div className="flex h-full flex-col bg-cream px-4 pt-12 pb-4 text-ink">
      <p className="eyebrow text-clay">Gastenlijst</p>
      <div className="mt-1 flex items-end justify-between">
        <h3 className="font-serif text-3xl leading-none font-medium">24 gasten</h3>
        <span className="rounded-full bg-forest px-3 py-1.5 text-[11px] font-medium text-paper">+ Gast</span>
      </div>

      <div className="mt-4 flex gap-1.5 overflow-hidden">
        {GROUPS.map((g, i) => (
          <span
            key={g}
            className={`shrink-0 rounded-full px-3 py-1 text-[11px] ${i === 0 ? "bg-forest text-paper" : "border border-line bg-paper text-ink/70"}`}
          >
            {g}
          </span>
        ))}
      </div>

      <div className="mt-3 space-y-2">
        {GUESTS.slice(0, 2).map((g) => (
          <Row key={g.name} g={g} />
        ))}

        {/* Geopende gast met bewerkformulier */}
        <div className="rounded-2xl border border-clay/50 bg-paper p-3 shadow-sm">
          <Row g={GUESTS[2]} bare />
          <div className="mt-3 grid grid-cols-2 gap-2 text-[11px]">
            <Field label="Voornaam" value="Marga" />
            <Field label="Achternaam" value="Zeilen" />
            <Field label="E-mail" value="marga@mail.nl" />
            <Field label="Groep" value="Avond-gast" />
          </div>
          <div className="mt-2 flex items-center gap-1.5 text-[10px]">
            {["Aanwezig", "Afwezig", "Nog open"].map((s) => (
              <span key={s} className="flex items-center gap-1 text-ink/70">
                <span className={`size-2 rounded-full ${s === "Nog open" ? "bg-clay" : "border border-line bg-paper"}`} />
                {s}
              </span>
            ))}
          </div>
          <div className="mt-3 flex items-center justify-between">
            <span className="flex items-center gap-1 text-[10px] text-ink/60">
              <UsersIcon width={12} height={12} /> Dieetwens: vegetarisch
            </span>
            <span className="flex items-center gap-1 rounded-full bg-forest px-3 py-1.5 text-[11px] font-medium text-paper">
              <CheckIcon width={11} height={11} /> Opslaan
            </span>
          </div>
        </div>

        <Row g={GUESTS[3]} />
      </div>
    </div>
  );
}

function Field({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-[9px] tracking-wide text-ink/55 uppercase">{label}</p>
      <p className="mt-0.5 rounded-lg border border-line bg-cream px-2 py-1.5 text-ink">{value}</p>
    </div>
  );
}

function Row({ g, bare = false }: { g: (typeof GUESTS)[number]; bare?: boolean }) {
  return (
    <div className={`flex items-center gap-2.5 ${bare ? "" : "rounded-2xl border border-line bg-paper p-3"}`}>
      <span className="grid size-9 shrink-0 place-items-center rounded-full bg-blush text-xs font-medium text-clay">{initials(g.name)}</span>
      <span className="min-w-0 flex-1 leading-tight">
        <span className="block truncate text-[13px] font-medium">
          {g.name} {g.plus && <span className="ml-1 rounded-full bg-sage px-1.5 py-0.5 text-[9px] text-forest">{g.plus}</span>}
        </span>
        <span className="block text-[11px] text-ink/60">{g.group}</span>
      </span>
      {bare ? (
        <PenIcon width={14} height={14} className="text-clay" />
      ) : (
        <span className="flex items-center gap-1.5 text-[10px] text-ink/70">
          <span className={`size-2 rounded-full ${g.tone}`} /> {g.status}
        </span>
      )}
    </div>
  );
}
