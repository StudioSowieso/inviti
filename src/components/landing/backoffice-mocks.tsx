import { CheckIcon, ChevronRightIcon, ClockIcon, PenIcon, SendIcon, UsersIcon, XIcon } from "@/components/icons";

/*
 * Statische voorbeelden van schermen uit de backoffice, voor de hero op de landingspagina.
 * Ze zijn gemaakt voor een breedte van 340px en worden daarna geschaald. Het koppel is Emma & Mats,
 * net als in de voorbeelduitnodigingen.
 */

/** Dashboard met het RSVP-overzicht en de snelkoppelingen. */
export function DashboardMock() {
  const stats = [
    { label: "Ja", value: 14, hint: "gasten komen", icon: CheckIcon, tone: "bg-sage text-forest" },
    { label: "Nog niet", value: 7, hint: "wachten nog", icon: ClockIcon, tone: "bg-paper/15 text-paper" },
    { label: "Nee", value: 3, hint: "komen niet", icon: XIcon, tone: "bg-blush text-clay" },
  ];
  const quick = [
    { title: "Maak jouw bruiloftsuitnodiging", text: "Configureer helemaal naar jouw smaak", icon: PenIcon },
    { title: "Gastenlijst beheren", text: "Voeg gasten toe en maak groepen", icon: UsersIcon },
    { title: "Uitnodigingen versturen", text: "Stuur via mail, link of WhatsApp", icon: SendIcon },
  ];
  return (
    <div className="flex h-full flex-col gap-4 bg-cream px-4 pt-7 pb-4 text-ink">
      <div>
        <p className="text-[11px] text-ink/60">Goedemorgen, Emma</p>
        <h3 className="font-serif text-3xl leading-none font-medium">Welkom terug</h3>
      </div>

      <section className="rounded-2xl bg-forest p-4 text-paper">
        <div className="flex items-baseline justify-between">
          <span className="text-[10px] tracking-[0.2em] text-paper/80 uppercase">RSVP-overzicht</span>
          <span className="text-[11px] text-paper/90">24 gasten</span>
        </div>
        <div className="mt-4 grid grid-cols-3 gap-2">
          {stats.map(({ label, value, hint, icon: Icon, tone }) => (
            <div key={label}>
              <div className="flex items-center gap-1.5">
                <span className={`grid size-5 place-items-center rounded-full ${tone}`}>
                  <Icon width={11} height={11} />
                </span>
                <span className="text-[11px] font-medium">{label}</span>
              </div>
              <p className="mt-2 font-serif text-4xl leading-none">{value}</p>
              <p className="mt-1 text-[10px] text-paper/55">{hint}</p>
            </div>
          ))}
        </div>
        <div className="mt-4 flex h-1.5 overflow-hidden rounded-full bg-paper/15">
          <span className="bg-sage" style={{ width: "58%" }} />
          <span className="bg-blush" style={{ width: "13%" }} />
        </div>
      </section>

      <section>
        <h4 className="font-serif text-xl font-medium">Snel starten</h4>
        <ul className="mt-2 space-y-2">
          {quick.map(({ title, text, icon: Icon }) => (
            <li key={title} className="flex items-center gap-3 rounded-2xl border border-line bg-paper p-3">
              <span className="grid size-9 shrink-0 place-items-center rounded-xl bg-cream text-forest">
                <Icon width={17} height={17} />
              </span>
              <span className="min-w-0 flex-1 leading-tight">
                <span className="block truncate text-[12px] font-medium">{title}</span>
                <span className="block truncate text-[10px] text-ink/60">{text}</span>
              </span>
              <ChevronRightIcon width={14} height={14} className="text-ink/40" />
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}

/** Versturen: kies het moment en zie per gast wat er is verstuurd. */
export function VersturenMock() {
  const tabs = ["Uitnodiging", "Save the Date", "Nabericht"];
  const rows = [
    { name: "Lotte de Vries", via: "WhatsApp", state: "Beantwoord", tone: "bg-forest" },
    { name: "Daan Bakker", via: "E-mail", state: "Verstuurd", tone: "bg-sage" },
    { name: "Marga Zeilen", via: "WhatsApp", state: "Verstuurd", tone: "bg-sage" },
    { name: "Sam Jansen", via: "Link per groep", state: "Nog niet", tone: "bg-clay" },
  ];
  return (
    <div className="flex h-full flex-col bg-cream px-4 pt-7 pb-4 text-ink">
      <p className="text-[10px] tracking-[0.2em] text-clay uppercase">Versturen</p>
      <h3 className="mt-1 font-serif text-3xl leading-none font-medium">Uitnodigingen</h3>

      <div className="mt-4 flex gap-1 rounded-full bg-paper p-1 text-[10px]">
        {tabs.map((t, i) => (
          <span
            key={t}
            className={`flex-1 rounded-full px-2 py-1.5 text-center whitespace-nowrap ${i === 0 ? "bg-forest text-paper" : "text-ink/65"}`}
          >
            {t}
          </span>
        ))}
      </div>

      <div className="mt-4 rounded-2xl bg-forest p-4 text-paper">
        <p className="text-[11px] text-paper/80">Verstuurd</p>
        <p className="mt-1 font-serif text-4xl leading-none">
          18 <span className="text-xl text-paper/60">van 24</span>
        </p>
        <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-paper/15">
          <span className="block h-full bg-sage" style={{ width: "75%" }} />
        </div>
      </div>

      <ul className="mt-3 space-y-2">
        {rows.map((r) => (
          <li key={r.name} className="flex items-center gap-2.5 rounded-2xl border border-line bg-paper p-3">
            <span className="min-w-0 flex-1 leading-tight">
              <span className="block truncate text-[12px] font-medium">{r.name}</span>
              <span className="block text-[10px] text-ink/60">{r.via}</span>
            </span>
            <span className="flex items-center gap-1.5 text-[10px] text-ink/70">
              <span className={`size-2 rounded-full ${r.tone}`} /> {r.state}
            </span>
          </li>
        ))}
      </ul>

      <span className="mt-3 flex items-center justify-center gap-1.5 rounded-full bg-forest py-2.5 text-[12px] font-medium text-paper">
        <SendIcon width={13} height={13} /> Verstuur naar 6 gasten
      </span>
    </div>
  );
}

/** To-do lijst met deadlines en een persoon per taak. */
export function TodoMock() {
  const items = [
    { title: "Gastenlijst aangemaakt", meta: "Gedaan door Proost Mee", done: true },
    { title: "Uitnodiging ontworpen", meta: "Emma", done: true },
    { title: "Save the Date versturen", meta: "1 dec · Emma", done: false },
    { title: "Fotograaf bevestigen", meta: "15 dec · Mats", done: false },
    { title: "Uitnodigingen versturen", meta: "15 jan · Emma", done: false },
    { title: "Dieetwensen doorgeven", meta: "1 mrt · Mats", done: false },
  ];
  return (
    <div className="flex h-full flex-col bg-cream px-4 pt-7 pb-4 text-ink">
      <p className="text-[10px] tracking-[0.2em] text-clay uppercase">To-do lijst</p>
      <div className="mt-1 flex items-end justify-between">
        <h3 className="font-serif text-3xl leading-none font-medium">2 van 6</h3>
        <span className="rounded-full bg-forest px-3 py-1.5 text-[11px] font-medium text-paper">+ To-do</span>
      </div>
      <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-line">
        <span className="block h-full bg-clay" style={{ width: "33%" }} />
      </div>

      <ul className="mt-4 space-y-2">
        {items.map((it) => (
          <li key={it.title} className="flex items-center gap-3 rounded-2xl border border-line bg-paper p-3">
            <span
              className={`grid size-5 shrink-0 place-items-center rounded-full border ${
                it.done ? "border-forest bg-forest text-paper" : "border-line bg-cream"
              }`}
            >
              {it.done && <CheckIcon width={11} height={11} />}
            </span>
            <span className="min-w-0 flex-1 leading-tight">
              <span className={`block truncate text-[12px] font-medium ${it.done ? "text-ink/50 line-through" : ""}`}>{it.title}</span>
              <span className="block text-[10px] text-ink/60">{it.meta}</span>
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}
