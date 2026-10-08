"use client";

import { useEffect, useMemo, useRef, useState, useTransition, type ReactNode } from "react";
import { CheckIcon, ChevronDownIcon, PlusIcon, TrashIcon, XIcon } from "@/components/icons";
import { InvitationView } from "@/components/invitation/invitation-view";
import { ThemeThumb } from "@/components/invitation/theme-thumb";
import type {
  Block,
  BlockType,
  InvitationAnimation,
  InvitationConfig,
  InvitationTheme,
  ProgramItem,
} from "@/lib/invitation/types";
import { saveInvitation } from "./actions";

type Tab = "thema" | "details" | "blokken" | "animatie";

const TABS: { id: Tab; label: string }[] = [
  { id: "thema", label: "Thema" },
  { id: "details", label: "Details" },
  { id: "blokken", label: "Blokken" },
  { id: "animatie", label: "Animatie" },
];

const BLOCK_META: Record<BlockType, { label: string; hint: string }> = {
  hero: { label: "Welkom", hint: "Namen, datum en plaats" },
  countdown: { label: "Aftellen", hint: "Teller tot de grote dag" },
  story: { label: "Ons verhaal", hint: "Jullie verhaal in een paar zinnen" },
  program: { label: "Programma", hint: "Tijden en onderdelen van de dag" },
  location: { label: "Locatie", hint: "Waar en hoe kom je er" },
  dresscode: { label: "Dresscode", hint: "Kledingwens met kleurenpalet" },
  rsvp: { label: "RSVP", hint: "Oproep om te reageren" },
  footer: { label: "Afsluiting", hint: "Groet en contactgegevens" },
};

const FIXED: BlockType[] = ["hero", "footer"];

export function Configurator({
  themes,
  initialThemeSlug,
  initialConfig,
}: {
  themes: InvitationTheme[];
  initialThemeSlug: string;
  initialConfig: InvitationConfig;
}) {
  const [themeSlug, setThemeSlug] = useState(initialThemeSlug);
  const [config, setConfig] = useState(initialConfig);
  const [tab, setTab] = useState<Tab>("thema");
  const [openBlock, setOpenBlock] = useState<BlockType | null>(null);
  const [mobileView, setMobileView] = useState<"edit" | "preview">("edit");
  const [replayKey, setReplayKey] = useState(0);
  const [fullPreview, setFullPreview] = useState(false);
  const [pending, startTransition] = useTransition();
  const [status, setStatus] = useState<{ kind: "idle" | "saved" | "error"; message?: string }>({ kind: "idle" });

  const snapshot = (slug: string, c: InvitationConfig) => JSON.stringify([slug, c]);
  const savedSnapshot = useRef(snapshot(initialThemeSlug, initialConfig));
  const dirty = snapshot(themeSlug, config) !== savedSnapshot.current;

  const theme = useMemo(() => themes.find((t) => t.slug === themeSlug) ?? themes[0], [themes, themeSlug]);

  useEffect(() => {
    if (!dirty) return;
    const warn = (e: BeforeUnloadEvent) => {
      e.preventDefault();
    };
    window.addEventListener("beforeunload", warn);
    return () => window.removeEventListener("beforeunload", warn);
  }, [dirty]);

  useEffect(() => {
    if (!fullPreview) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setFullPreview(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [fullPreview]);

  function patch(p: Partial<InvitationConfig>) {
    setConfig((c) => ({ ...c, ...p }));
    setStatus({ kind: "idle" });
  }

  function patchBlock(type: BlockType, p: Record<string, unknown>) {
    setConfig((c) => ({ ...c, blocks: c.blocks.map((b) => (b.type === type ? ({ ...b, ...p } as Block) : b)) }));
    setStatus({ kind: "idle" });
  }

  function move(type: BlockType, dir: -1 | 1) {
    setConfig((c) => {
      const i = c.blocks.findIndex((b) => b.type === type);
      const j = i + dir;
      const other = c.blocks[j];
      if (i < 0 || !other || FIXED.includes(other.type)) return c;
      const blocks = [...c.blocks];
      [blocks[i], blocks[j]] = [blocks[j], blocks[i]];
      return { ...c, blocks };
    });
    setStatus({ kind: "idle" });
  }

  function save() {
    startTransition(async () => {
      const res = await saveInvitation(themeSlug, config);
      if (res.ok) {
        savedSnapshot.current = snapshot(themeSlug, config);
        setStatus({ kind: "saved" });
      } else {
        setStatus({ kind: "error", message: res.error });
      }
    });
  }

  const statusText = pending
    ? "Opslaan…"
    : status.kind === "error"
      ? status.message
      : dirty
        ? "Niet-opgeslagen wijzigingen"
        : "Alles is opgeslagen";

  return (
    <>
      {/* Mobiel: wisselen tussen bewerken en voorbeeld */}
      <div className="flex rounded-full border border-line bg-paper p-1 text-sm lg:hidden" role="tablist">
        {(["edit", "preview"] as const).map((v) => (
          <button
            key={v}
            type="button"
            role="tab"
            aria-selected={mobileView === v}
            onClick={() => setMobileView(v)}
            className={`flex-1 rounded-full py-2 font-medium transition ${
              mobileView === v ? "bg-forest text-paper" : "text-muted"
            }`}
          >
            {v === "edit" ? "Bewerken" : "Voorbeeld"}
          </button>
        ))}
      </div>

      <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_23rem] xl:grid-cols-[minmax(0,1fr)_26rem] 2xl:gap-12">
        {/* ---------- Bewerken ---------- */}
        <div className={`min-w-0 space-y-6 ${mobileView === "preview" ? "hidden lg:block" : ""}`}>
          <div className="flex flex-wrap gap-2" role="tablist">
            {TABS.map((t) => (
              <button
                key={t.id}
                type="button"
                role="tab"
                aria-selected={tab === t.id}
                onClick={() => setTab(t.id)}
                className={`rounded-full px-4 py-2 text-sm font-medium transition ${
                  tab === t.id ? "bg-forest text-paper" : "border border-line bg-paper text-ink hover:bg-sage/60"
                }`}
              >
                {t.label}
              </button>
            ))}
          </div>

          {tab === "thema" && (
            <section>
              <h2 className="font-serif text-2xl font-medium">Thema</h2>
              <p className="mt-1 text-sm text-muted">Je teksten en blokken blijven staan als je wisselt.</p>
              <div className="mt-5 grid gap-4 sm:grid-cols-2">
                {themes.map((t) => {
                  const selected = t.slug === themeSlug;
                  return (
                    <button
                      key={t.slug}
                      type="button"
                      aria-pressed={selected}
                      onClick={() => {
                        setThemeSlug(t.slug);
                        setStatus({ kind: "idle" });
                      }}
                      className={`card relative p-3 text-left transition ${
                        selected ? "ring-2 ring-forest" : "hover:border-clay/50"
                      }`}
                    >
                      {selected && (
                        <span className="absolute top-5 right-5 z-10 grid size-6 place-items-center rounded-full bg-forest text-paper">
                          <CheckIcon width={14} height={14} />
                        </span>
                      )}
                      <ThemeThumb theme={t} />
                      <span className="mt-3 block px-1 font-serif text-xl font-medium">{t.title}</span>
                      {t.description && <span className="block px-1 pb-1 text-sm text-muted">{t.description}</span>}
                    </button>
                  );
                })}
              </div>
            </section>
          )}

          {tab === "details" && (
            <section className="card space-y-5 p-5 sm:p-6">
              <div>
                <h2 className="font-serif text-2xl font-medium">Details</h2>
                <p className="mt-1 text-sm text-muted">Deze gegevens gebruiken we door de hele uitnodiging heen.</p>
              </div>
              <div className="grid gap-5 sm:grid-cols-2">
                <Input label="Naam 1" value={config.partner1} onChange={(v) => patch({ partner1: v })} />
                <Input label="Naam 2" value={config.partner2} onChange={(v) => patch({ partner2: v })} />
              </div>
              <div className="grid gap-5 sm:grid-cols-2">
                <Input label="Datum" type="date" value={config.date} onChange={(v) => v && patch({ date: v })} />
                <Input
                  label="Starttijd"
                  hint="Voor het aftellen"
                  type="time"
                  value={config.time}
                  onChange={(v) => v && patch({ time: v })}
                />
              </div>
              <Input label="Plaats" value={config.city} onChange={(v) => patch({ city: v })} />
            </section>
          )}

          {tab === "blokken" && (
            <section>
              <h2 className="font-serif text-2xl font-medium">Blokken</h2>
              <p className="mt-1 text-sm text-muted">
                Zet blokken aan of uit, wijzig de volgorde en pas de teksten aan.
              </p>
              <ul className="mt-5 space-y-3">
                {config.blocks.map((b, i) => {
                  const fixed = FIXED.includes(b.type);
                  const open = openBlock === b.type;
                  const prev = config.blocks[i - 1];
                  const next = config.blocks[i + 1];
                  return (
                    <li key={b.type} className={`card overflow-hidden ${b.enabled ? "" : "opacity-70"}`}>
                      <div className="flex items-center gap-3 p-3 sm:p-4">
                        {fixed ? (
                          <span className="w-11 shrink-0" aria-hidden="true" />
                        ) : (
                          <Switch
                            checked={b.enabled}
                            label={`${BLOCK_META[b.type].label} tonen`}
                            onChange={(v) => patchBlock(b.type, { enabled: v })}
                          />
                        )}
                        <button
                          type="button"
                          onClick={() => setOpenBlock(open ? null : b.type)}
                          aria-expanded={open}
                          className="flex min-w-0 flex-1 items-center gap-2 text-left"
                        >
                          <span className="min-w-0 flex-1">
                            <span className="block font-medium">{BLOCK_META[b.type].label}</span>
                            <span className="block truncate text-sm text-muted">{BLOCK_META[b.type].hint}</span>
                          </span>
                          <ChevronDownIcon
                            width={16}
                            height={16}
                            className={`shrink-0 text-muted transition ${open ? "rotate-180" : ""}`}
                          />
                        </button>
                        {!fixed && (
                          <span className="flex shrink-0 flex-col">
                            <MoveButton dir={-1} disabled={!prev || FIXED.includes(prev.type)} onClick={() => move(b.type, -1)} />
                            <MoveButton dir={1} disabled={!next || FIXED.includes(next.type)} onClick={() => move(b.type, 1)} />
                          </span>
                        )}
                      </div>
                      {open && (
                        <div className="space-y-4 border-t border-line bg-cream/50 p-4 sm:p-5">
                          <BlockFields block={b} onChange={(p) => patchBlock(b.type, p)} />
                        </div>
                      )}
                    </li>
                  );
                })}
              </ul>
            </section>
          )}

          {tab === "animatie" && (
            <section>
              <h2 className="font-serif text-2xl font-medium">Animatie bij openen</h2>
              <p className="mt-1 text-sm text-muted">Zo begint de uitnodiging voor je gasten.</p>
              <div className="mt-5 grid gap-4 sm:grid-cols-2">
                {(
                  [
                    { id: "envelope", title: "Envelop", text: "Gasten tikken om de envelop te openen." },
                    { id: "none", title: "Direct openen", text: "De uitnodiging staat meteen open." },
                  ] as { id: InvitationAnimation; title: string; text: string }[]
                ).map((o) => {
                  const selected = config.animation === o.id;
                  return (
                    <button
                      key={o.id}
                      type="button"
                      aria-pressed={selected}
                      onClick={() => {
                        patch({ animation: o.id });
                        if (o.id === "envelope") {
                          setReplayKey((k) => k + 1);
                          setMobileView("preview");
                        }
                      }}
                      className={`card p-5 text-left transition ${selected ? "ring-2 ring-forest" : "hover:border-clay/50"}`}
                    >
                      <span className="block font-serif text-xl font-medium">{o.title}</span>
                      <span className="mt-1 block text-sm text-muted">{o.text}</span>
                    </button>
                  );
                })}
              </div>
              <button
                type="button"
                disabled={config.animation !== "envelope"}
                onClick={() => {
                  setReplayKey((k) => k + 1);
                  setMobileView("preview");
                }}
                className="mt-4 rounded-full border border-line bg-paper px-5 py-2.5 text-sm font-medium transition hover:bg-cream disabled:opacity-50"
              >
                Animatie afspelen in voorbeeld
              </button>
            </section>
          )}

          {/* Opslaan */}
          <div className="sticky bottom-3 z-10 flex items-center justify-between gap-4 rounded-full border border-line bg-paper/95 py-2.5 pr-2.5 pl-5 shadow-[0_8px_30px_-12px_rgb(31_36_32/0.3)] backdrop-blur">
            <p
              role="status"
              className={`min-w-0 truncate text-sm ${status.kind === "error" ? "text-[#7a3f2c]" : dirty ? "text-clay" : "text-muted"}`}
            >
              {statusText}
            </p>
            <button
              type="button"
              onClick={save}
              disabled={pending || !dirty}
              className="btn-primary w-auto shrink-0 px-6 py-2.5"
            >
              {pending ? "Opslaan…" : "Opslaan"}
            </button>
          </div>
        </div>

        {/* ---------- Voorbeeld ---------- */}
        <aside className={`${mobileView === "edit" ? "hidden lg:block" : ""}`}>
          <div className="lg:sticky lg:top-4">
            <div className="mx-auto h-[min(44rem,calc(100dvh-9rem))] w-full max-w-[22rem] overflow-hidden rounded-[2.2rem] border-[9px] border-ink/90 shadow-[0_24px_60px_-24px_rgb(31_36_32/0.5)]">
              <InvitationView
                config={config}
                theme={theme}
                startOpen
                replayKey={replayKey}
                focusBlock={tab === "blokken" ? openBlock : null}
                className="h-full"
              />
            </div>
            <div className="mt-4 flex justify-center gap-2">
              <button
                type="button"
                disabled={config.animation !== "envelope"}
                onClick={() => setReplayKey((k) => k + 1)}
                className="rounded-full border border-line bg-paper px-4 py-2 text-sm font-medium transition hover:bg-cream disabled:opacity-50"
              >
                Envelop afspelen
              </button>
              <button
                type="button"
                onClick={() => setFullPreview(true)}
                className="rounded-full border border-line bg-paper px-4 py-2 text-sm font-medium transition hover:bg-cream"
              >
                Volledig voorbeeld
              </button>
            </div>
          </div>
        </aside>
      </div>

      {fullPreview && (
        <div
          className="fixed inset-0 z-50 grid place-items-center bg-ink/70 backdrop-blur-sm"
          role="dialog"
          aria-modal="true"
          aria-label="Volledig voorbeeld van de uitnodiging"
        >
          <button
            type="button"
            onClick={() => setFullPreview(false)}
            aria-label="Voorbeeld sluiten"
            className="absolute top-4 right-4 z-[60] grid size-11 place-items-center rounded-full bg-paper text-ink shadow-lg"
          >
            <XIcon />
          </button>
          <div className="h-dvh w-full overflow-hidden sm:h-[min(52rem,92dvh)] sm:max-w-[26rem] sm:rounded-[2rem]">
            <InvitationView config={config} theme={theme} className="h-full" />
          </div>
        </div>
      )}
    </>
  );
}

// ---------- Formulierdelen ----------

function Input({
  label,
  value,
  onChange,
  type = "text",
  hint,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  type?: string;
  hint?: string;
}) {
  return (
    <label className="block">
      <span className="mb-2 flex items-baseline justify-between text-sm font-medium">
        {label}
        {hint && <span className="text-xs font-normal text-muted">{hint}</span>}
      </span>
      <input type={type} value={value} onChange={(e) => onChange(e.target.value)} className="field" />
    </label>
  );
}

function TextArea({
  label,
  value,
  onChange,
  rows = 4,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  rows?: number;
}) {
  return (
    <label className="block">
      <span className="mb-2 block text-sm font-medium">{label}</span>
      <textarea value={value} rows={rows} onChange={(e) => onChange(e.target.value)} className="field resize-y" />
    </label>
  );
}

function Switch({ checked, onChange, label }: { checked: boolean; onChange: (v: boolean) => void; label: string }) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      aria-label={label}
      onClick={() => onChange(!checked)}
      className={`relative h-6 w-11 shrink-0 rounded-full transition ${checked ? "bg-forest" : "bg-line"}`}
    >
      <span
        className={`absolute top-0.5 left-0.5 size-5 rounded-full bg-paper shadow transition ${
          checked ? "translate-x-5" : ""
        }`}
      />
    </button>
  );
}

function MoveButton({ dir, disabled, onClick }: { dir: -1 | 1; disabled: boolean; onClick: () => void }) {
  return (
    <button
      type="button"
      disabled={disabled}
      onClick={onClick}
      aria-label={dir === -1 ? "Omhoog verplaatsen" : "Omlaag verplaatsen"}
      className="grid size-7 place-items-center rounded-full text-muted transition hover:bg-cream hover:text-ink disabled:opacity-25"
    >
      <ChevronDownIcon width={15} height={15} className={dir === -1 ? "rotate-180" : ""} />
    </button>
  );
}

function Row({ children }: { children: ReactNode }) {
  return <div className="grid gap-4 sm:grid-cols-2">{children}</div>;
}

// ---------- Velden per blok ----------

function BlockFields({ block, onChange }: { block: Block; onChange: (p: Record<string, unknown>) => void }) {
  switch (block.type) {
    case "hero":
      return <Input label="Kleine tekst boven de namen" value={block.eyebrow} onChange={(v) => onChange({ eyebrow: v })} />;

    case "countdown":
      return (
        <>
          <Input label="Kleine tekst" value={block.eyebrow} onChange={(v) => onChange({ eyebrow: v })} />
          <Input label="Titel" value={block.title} onChange={(v) => onChange({ title: v })} />
        </>
      );

    case "story":
      return (
        <>
          <Row>
            <Input label="Kleine tekst" value={block.eyebrow} onChange={(v) => onChange({ eyebrow: v })} />
            <Input label="Titel" value={block.title} onChange={(v) => onChange({ title: v })} />
          </Row>
          <TextArea label="Jullie verhaal" value={block.text} onChange={(v) => onChange({ text: v })} />
          <p className="text-xs text-muted">Foto's toevoegen volgt binnenkort.</p>
        </>
      );

    case "program": {
      const setItem = (i: number, p: Partial<ProgramItem>) =>
        onChange({ items: block.items.map((it, idx) => (idx === i ? { ...it, ...p } : it)) });
      return (
        <>
          <Row>
            <Input label="Kleine tekst" value={block.eyebrow} onChange={(v) => onChange({ eyebrow: v })} />
            <Input label="Titel" value={block.title} onChange={(v) => onChange({ title: v })} />
          </Row>
          <div className="space-y-3">
            {block.items.map((it, i) => (
              <div key={i} className="rounded-2xl border border-line bg-paper p-3">
                <div className="grid grid-cols-[8rem_1fr] gap-3">
                  <Input label="Tijd" type="time" value={it.time} onChange={(v) => setItem(i, { time: v })} />
                  <Input label="Onderdeel" value={it.title} onChange={(v) => setItem(i, { title: v })} />
                </div>
                <div className="mt-3 flex items-end gap-3">
                  <div className="min-w-0 flex-1">
                    <Input label="Toelichting" value={it.subtitle} onChange={(v) => setItem(i, { subtitle: v })} />
                  </div>
                  <button
                    type="button"
                    onClick={() => onChange({ items: block.items.filter((_, idx) => idx !== i) })}
                    aria-label="Onderdeel verwijderen"
                    className="grid size-11 shrink-0 place-items-center rounded-full text-clay hover:bg-blush/60"
                  >
                    <TrashIcon width={18} height={18} />
                  </button>
                </div>
              </div>
            ))}
          </div>
          {block.items.length < 20 && (
            <button
              type="button"
              onClick={() => onChange({ items: [...block.items, { time: "", title: "", subtitle: "" }] })}
              className="inline-flex items-center gap-2 rounded-full border border-line bg-paper px-4 py-2 text-sm font-medium hover:bg-cream"
            >
              <PlusIcon width={16} height={16} /> Onderdeel toevoegen
            </button>
          )}
        </>
      );
    }

    case "location":
      return (
        <>
          <Row>
            <Input label="Kleine tekst" value={block.eyebrow} onChange={(v) => onChange({ eyebrow: v })} />
            <Input label="Naam van de locatie" value={block.title} onChange={(v) => onChange({ title: v })} />
          </Row>
          <TextArea
            label="Adres en route-uitleg"
            value={block.address}
            onChange={(v) => onChange({ address: v })}
          />
          <p className="text-xs text-muted">De knop &ldquo;Bekijk route&rdquo; opent Google Maps met de locatienaam en plaats.</p>
        </>
      );

    case "dresscode":
      return (
        <>
          <Row>
            <Input label="Kleine tekst" value={block.eyebrow} onChange={(v) => onChange({ eyebrow: v })} />
            <Input label="Dresscode" value={block.title} onChange={(v) => onChange({ title: v })} />
          </Row>
          <TextArea label="Toelichting" value={block.text} onChange={(v) => onChange({ text: v })} rows={3} />
          <div>
            <p className="mb-2 text-sm font-medium">Kleurenpalet</p>
            <div className="flex flex-wrap items-center gap-3">
              {block.colors.map((c, i) => (
                <span key={i} className="relative">
                  <input
                    type="color"
                    value={c}
                    onChange={(e) => onChange({ colors: block.colors.map((x, idx) => (idx === i ? e.target.value : x)) })}
                    aria-label={`Kleur ${i + 1}`}
                    className="size-10 cursor-pointer rounded-full border border-line bg-transparent p-0.5"
                  />
                  <button
                    type="button"
                    onClick={() => onChange({ colors: block.colors.filter((_, idx) => idx !== i) })}
                    aria-label={`Kleur ${i + 1} verwijderen`}
                    className="absolute -top-1 -right-1 grid size-5 place-items-center rounded-full bg-ink text-paper"
                  >
                    <XIcon width={10} height={10} />
                  </button>
                </span>
              ))}
              {block.colors.length < 8 && (
                <button
                  type="button"
                  onClick={() => onChange({ colors: [...block.colors, "#c9b9a3"] })}
                  aria-label="Kleur toevoegen"
                  className="grid size-10 place-items-center rounded-full border border-dashed border-muted text-muted hover:bg-cream"
                >
                  <PlusIcon width={16} height={16} />
                </button>
              )}
            </div>
          </div>
        </>
      );

    case "rsvp":
      return (
        <>
          <Row>
            <Input label="Kleine tekst" value={block.eyebrow} onChange={(v) => onChange({ eyebrow: v })} />
            <Input label="Titel" value={block.title} onChange={(v) => onChange({ title: v })} />
          </Row>
          <TextArea label="Tekst" value={block.text} onChange={(v) => onChange({ text: v })} rows={3} />
          <Input label="Tekst op de knop" value={block.buttonLabel} onChange={(v) => onChange({ buttonLabel: v })} />
        </>
      );

    case "footer":
      return (
        <Row>
          <Input label="Groet" hint="Gevolgd door jullie namen" value={block.closing} onChange={(v) => onChange({ closing: v })} />
          <Input
            label="E-mailadres voor vragen"
            hint="Optioneel"
            type="email"
            value={block.contactEmail}
            onChange={(v) => onChange({ contactEmail: v })}
          />
        </Row>
      );
  }
}
