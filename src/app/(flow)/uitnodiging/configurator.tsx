"use client";

import { useEffect, useMemo, useRef, useState, useTransition, type ReactNode } from "react";
import {
  CheckIcon,
  ChevronDownIcon,
  ChevronLeftIcon,
  ClockIcon,
  CopyIcon,
  ExpandIcon,
  ExternalIcon,
  GripIcon,
  HomeIcon,
  ListIcon,
  MailIcon,
  PenIcon,
  PlusIcon,
  RefreshIcon,
  SendIcon,
  SlidersIcon,
  Sparkle,
  TrashIcon,
  XIcon,
} from "@/components/icons";
import Link from "next/link";
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

type Tab = "thema" | "animatie" | "details" | "blokken";

const BLOCK_META: Record<BlockType, { label: string; hint: string; icon: (p: { width?: number; height?: number }) => ReactNode }> = {
  hero: { label: "Welkom", hint: "Namen, datum en plaats", icon: (p) => <Sparkle {...p} /> },
  countdown: { label: "Aftellen", hint: "Teller tot de grote dag", icon: (p) => <ClockIcon {...p} /> },
  story: { label: "Ons verhaal", hint: "Jullie verhaal in een paar zinnen", icon: (p) => <PenIcon {...p} /> },
  program: { label: "Programma", hint: "Tijden en onderdelen van de dag", icon: (p) => <ListIcon {...p} /> },
  location: { label: "Locatie", hint: "Waar en hoe kom je er", icon: (p) => <HomeIcon {...p} /> },
  dresscode: { label: "Dresscode", hint: "Kledingwens met kleurenpalet", icon: (p) => <SlidersIcon {...p} /> },
  rsvp: { label: "RSVP", hint: "Oproep om te reageren", icon: (p) => <SendIcon {...p} /> },
  footer: { label: "Afsluiting", hint: "Groet en contactgegevens", icon: (p) => <MailIcon {...p} /> },
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
  const [dragging, setDragging] = useState<BlockType | null>(null);
  const [mobileView, setMobileView] = useState<"edit" | "preview">("edit");
  const [replayKey, setReplayKey] = useState(0);
  const [fullPreview, setFullPreview] = useState(false);
  const [pending, startTransition] = useTransition();
  const [status, setStatus] = useState<{ kind: "idle" | "saved" | "error"; message?: string }>({ kind: "idle" });

  const snapshot = (slug: string, c: InvitationConfig) => JSON.stringify([slug, c]);
  const savedSnapshot = useRef(snapshot(initialThemeSlug, initialConfig));
  const dirty = snapshot(themeSlug, config) !== savedSnapshot.current;

  const theme = useMemo(() => themes.find((t) => t.slug === themeSlug) ?? themes[0], [themes, themeSlug]);
  const activeBlocks = config.blocks.filter((b) => b.enabled);
  const inactiveBlocks = config.blocks.filter((b) => !b.enabled);

  const TABS: { id: Tab; label: string; badge?: number }[] = [
    { id: "thema", label: "Thema" },
    { id: "animatie", label: "Animatie" },
    { id: "details", label: "Details" },
    { id: "blokken", label: "Blokken", badge: activeBlocks.length },
  ];

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

  /** Zet `type` op de plek van `target`; hero blijft eerst en afsluiting laatst. */
  function moveTo(type: BlockType, target: BlockType) {
    setConfig((c) => {
      if (type === target || FIXED.includes(type) || FIXED.includes(target)) return c;
      const from = c.blocks.findIndex((b) => b.type === type);
      const to = c.blocks.findIndex((b) => b.type === target);
      if (from < 0 || to < 0) return c;
      const blocks = [...c.blocks];
      const [item] = blocks.splice(from, 1);
      blocks.splice(to, 0, item);
      return { ...c, blocks };
    });
    setStatus({ kind: "idle" });
  }

  function nudge(type: BlockType, dir: -1 | 1) {
    const movable = activeBlocks.filter((b) => !FIXED.includes(b.type));
    const i = movable.findIndex((b) => b.type === type);
    const other = movable[i + dir];
    if (other) moveTo(type, other.type);
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

  function replay() {
    setReplayKey((k) => k + 1);
    setMobileView("preview");
  }

  const stepNumber = TABS.findIndex((t) => t.id === tab) + 1;
  const sectionTitle: Record<Tab, { title: string; text: string }> = {
    thema: { title: "Kies je thema", text: "Je teksten en blokken blijven staan als je wisselt." },
    animatie: { title: "Animatie bij openen", text: "Zo begint de uitnodiging voor je gasten." },
    details: { title: "Jullie gegevens", text: "Deze gegevens gebruiken we door de hele uitnodiging heen." },
    blokken: { title: "Blokken", text: "Bepaal welke onderdelen er in de uitnodiging staan en in welke volgorde." },
  };

  return (
    <>
      {/* ---------- Eigen flow-header ---------- */}
      <header className="sticky top-0 z-30 border-b border-line bg-cream/90 backdrop-blur">
        <div className="mx-auto flex h-16 w-full max-w-[90rem] items-center gap-3 px-4 sm:px-6 lg:px-8">
          <Link
            href="/dashboard"
            className="inline-flex items-center gap-1.5 rounded-full border border-line bg-paper py-2 pr-4 pl-2.5 text-sm font-medium hover:bg-sage/60"
          >
            <ChevronLeftIcon width={18} height={18} />
            <span className="hidden sm:inline">Dashboard</span>
            <span className="sm:hidden">Terug</span>
          </Link>
          <div className="flex min-w-0 flex-1 items-center gap-2.5 pl-1">
            <span className="hidden items-center gap-1.5 font-serif text-xl sm:flex">
              Inviti <Sparkle className="text-clay" width={8} height={8} />
            </span>
            <span className="hidden h-5 w-px bg-line sm:block" />
            <h1 className="truncate font-serif text-xl font-medium">Uitnodiging maken</h1>
          </div>
          <p
            role="status"
            className={`hidden min-w-0 truncate text-sm md:block ${status.kind === "error" ? "text-[#7a3f2c]" : dirty ? "text-clay" : "text-muted"}`}
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
        {status.kind === "error" && <p className="bg-blush/60 px-4 py-2 text-center text-sm text-[#7a3f2c] md:hidden">{status.message}</p>}
      </header>

      <main className="mx-auto w-full max-w-[90rem] px-4 pt-5 pb-12 sm:px-6 lg:px-8">
        {/* Tabbalk */}
        <div className="rounded-full bg-sage/70 p-1.5">
          <div className="flex gap-1 overflow-x-auto" role="tablist" aria-label="Onderdelen van de uitnodiging">
            {TABS.map((t) => (
              <button
                key={t.id}
                type="button"
                role="tab"
                aria-selected={tab === t.id}
                onClick={() => {
                  setTab(t.id);
                  setMobileView("edit");
                }}
                className={`flex min-w-fit flex-1 items-center justify-center gap-2 rounded-full px-5 py-2.5 text-sm font-medium whitespace-nowrap transition ${
                  tab === t.id ? "bg-paper text-ink shadow-sm" : "text-muted hover:text-ink"
                }`}
              >
                {t.label}
                {t.badge !== undefined && (
                  <span className="rounded-full bg-forest px-1.5 text-xs leading-5 text-paper">{t.badge}</span>
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Mobiel: wisselen tussen bewerken en voorbeeld */}
        <div className="mt-4 flex rounded-full border border-line bg-paper p-1 text-sm lg:hidden" role="tablist">
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

        <div className="mt-5 grid items-start gap-6 lg:grid-cols-[minmax(0,1fr)_24rem] xl:grid-cols-[minmax(0,1fr)_27rem] 2xl:gap-8">
          {/* ---------- Instellingen ---------- */}
          <div className={`card min-w-0 p-5 sm:p-8 ${mobileView === "preview" ? "hidden lg:block" : ""}`}>
            <div className="flex items-start gap-4">
              <span className="grid size-9 shrink-0 place-items-center rounded-full bg-blush font-serif text-lg font-semibold text-clay">
                {stepNumber}
              </span>
              <div>
                <h2 className="font-serif text-3xl leading-tight font-medium">{sectionTitle[tab].title}</h2>
                <p className="mt-1 text-sm text-muted">{sectionTitle[tab].text}</p>
              </div>
            </div>

            <div className="mt-7">
              {tab === "thema" && (
                <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
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
                        className={`relative rounded-[1.4rem] border bg-paper p-3 text-left transition ${
                          selected ? "border-forest ring-2 ring-forest" : "border-line hover:border-clay/50"
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
              )}

              {tab === "animatie" && (
                <div>
                  <div className="grid gap-4 sm:grid-cols-2">
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
                            if (o.id === "envelope") replay();
                          }}
                          className={`relative rounded-[1.4rem] border bg-paper p-5 text-left transition ${
                            selected ? "border-forest ring-2 ring-forest" : "border-line hover:border-clay/50"
                          }`}
                        >
                          {selected && (
                            <span className="absolute top-4 right-4 grid size-6 place-items-center rounded-full bg-forest text-paper">
                              <CheckIcon width={14} height={14} />
                            </span>
                          )}
                          <span className="block font-serif text-xl font-medium">{o.title}</span>
                          <span className="mt-1 block text-sm text-muted">{o.text}</span>
                        </button>
                      );
                    })}
                  </div>
                  <button
                    type="button"
                    disabled={config.animation !== "envelope"}
                    onClick={replay}
                    className="mt-5 inline-flex items-center gap-2 rounded-full border border-line bg-paper px-5 py-2.5 text-sm font-medium transition hover:bg-cream disabled:opacity-50"
                  >
                    <RefreshIcon width={16} height={16} /> Animatie afspelen in voorbeeld
                  </button>
                </div>
              )}

              {tab === "details" && (
                <div className="space-y-5">
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
                </div>
              )}

              {tab === "blokken" && (
                <div className="space-y-8">
                  <div>
                    <p className="eyebrow text-clay">Actieve blokken ({activeBlocks.length})</p>
                    <ul className="mt-3 space-y-2.5">
                      {activeBlocks.map((b) => {
                        const fixed = FIXED.includes(b.type);
                        const open = openBlock === b.type;
                        const meta = BLOCK_META[b.type];
                        const movable = activeBlocks.filter((x) => !FIXED.includes(x.type));
                        const idx = movable.findIndex((x) => x.type === b.type);
                        return (
                          <li
                            key={b.type}
                            draggable={!fixed && !open}
                            onDragStart={() => !fixed && setDragging(b.type)}
                            onDragOver={(e) => {
                              if (dragging && !fixed) e.preventDefault();
                            }}
                            onDrop={(e) => {
                              e.preventDefault();
                              if (dragging) moveTo(dragging, b.type);
                              setDragging(null);
                            }}
                            onDragEnd={() => setDragging(null)}
                            className={`overflow-hidden rounded-2xl border bg-paper transition ${
                              dragging === b.type ? "border-clay opacity-50" : "border-line"
                            }`}
                          >
                            <div className="flex items-center gap-2 p-2.5 pr-3 sm:gap-3">
                              <span
                                className={`grid size-8 shrink-0 place-items-center ${fixed ? "text-line" : "cursor-grab text-muted"}`}
                                aria-hidden="true"
                              >
                                <GripIcon width={18} height={18} />
                              </span>
                              <span className="grid size-10 shrink-0 place-items-center rounded-full bg-blush text-clay">
                                {meta.icon({ width: 18, height: 18 })}
                              </span>
                              <button
                                type="button"
                                onClick={() => setOpenBlock(open ? null : b.type)}
                                aria-expanded={open}
                                className="flex min-w-0 flex-1 items-center gap-2 py-1 text-left"
                              >
                                <span className="min-w-0 flex-1">
                                  <span className="block font-medium">{meta.label}</span>
                                  <span className="block truncate text-sm text-muted">{meta.hint}</span>
                                </span>
                                <ChevronDownIcon
                                  width={16}
                                  height={16}
                                  className={`shrink-0 text-muted transition ${open ? "rotate-180" : ""}`}
                                />
                              </button>
                              {!fixed && (
                                <>
                                  <span className="flex shrink-0 flex-col">
                                    <MoveButton dir={-1} disabled={idx <= 0} onClick={() => nudge(b.type, -1)} />
                                    <MoveButton dir={1} disabled={idx >= movable.length - 1} onClick={() => nudge(b.type, 1)} />
                                  </span>
                                  <button
                                    type="button"
                                    onClick={() => {
                                      patchBlock(b.type, { enabled: false });
                                      if (open) setOpenBlock(null);
                                    }}
                                    aria-label={`${meta.label} verwijderen`}
                                    className="grid size-9 shrink-0 place-items-center rounded-full text-clay hover:bg-blush/60"
                                  >
                                    <TrashIcon width={17} height={17} />
                                  </button>
                                </>
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
                  </div>

                  {inactiveBlocks.length > 0 && (
                    <div>
                      <p className="eyebrow text-clay">Beschikbare blokken</p>
                      <ul className="mt-3 grid gap-2.5 sm:grid-cols-2">
                        {inactiveBlocks.map((b) => {
                          const meta = BLOCK_META[b.type];
                          return (
                            <li key={b.type}>
                              <button
                                type="button"
                                onClick={() => {
                                  patchBlock(b.type, { enabled: true });
                                  setOpenBlock(b.type);
                                }}
                                className="flex w-full items-center gap-3 rounded-2xl border border-dashed border-muted/60 bg-cream/40 p-2.5 text-left transition hover:bg-cream"
                              >
                                <span className="grid size-10 shrink-0 place-items-center rounded-full bg-sage text-forest">
                                  {meta.icon({ width: 18, height: 18 })}
                                </span>
                                <span className="min-w-0 flex-1">
                                  <span className="block font-medium">{meta.label}</span>
                                  <span className="block truncate text-sm text-muted">{meta.hint}</span>
                                </span>
                                <PlusIcon width={18} height={18} className="mr-1 shrink-0 text-forest" />
                              </button>
                            </li>
                          );
                        })}
                      </ul>
                    </div>
                  )}
                </div>
              )}
            </div>

            <div className="mt-8 flex items-center justify-between gap-3 border-t border-line pt-5">
              <button
                type="button"
                disabled={stepNumber === 1}
                onClick={() => setTab(TABS[stepNumber - 2].id)}
                className="rounded-full border border-line bg-paper px-5 py-2.5 text-sm font-medium transition hover:bg-cream disabled:opacity-40"
              >
                Vorige
              </button>
              <button
                type="button"
                disabled={stepNumber === TABS.length}
                onClick={() => setTab(TABS[stepNumber].id)}
                className="rounded-full bg-forest px-6 py-2.5 text-sm font-medium text-paper transition hover:bg-forest-deep disabled:opacity-40"
              >
                Volgende
              </button>
            </div>
          </div>

          {/* ---------- Live voorbeeld ---------- */}
          <aside className={`${mobileView === "edit" ? "hidden lg:block" : ""}`}>
            <div className="card overflow-hidden lg:sticky lg:top-[5.25rem]">
              <div className="flex items-center justify-between border-b border-line px-5 py-3">
                <p className="eyebrow text-clay">Live voorbeeld</p>
                <div className="flex items-center gap-0.5">
                  <ToolButton label="Envelop opnieuw afspelen" disabled={config.animation !== "envelope"} onClick={() => setReplayKey((k) => k + 1)}>
                    <RefreshIcon width={17} height={17} />
                  </ToolButton>
                  <ToolButton label="Volledig voorbeeld" onClick={() => setFullPreview(true)}>
                    <ExpandIcon width={17} height={17} />
                  </ToolButton>
                  <ToolButton label="Link kopiëren (beschikbaar na publiceren)" disabled onClick={() => {}}>
                    <CopyIcon width={17} height={17} />
                  </ToolButton>
                  <ToolButton label="Openen in nieuw tabblad (beschikbaar na publiceren)" disabled onClick={() => {}}>
                    <ExternalIcon width={17} height={17} />
                  </ToolButton>
                </div>
              </div>
              <div className="bg-sage/40 p-5">
                <div className="mx-auto h-[min(42rem,calc(100dvh-14rem))] min-h-[28rem] w-full max-w-[21rem] overflow-hidden rounded-[2rem] border-[7px] border-ink/90 shadow-[0_24px_60px_-24px_rgb(31_36_32/0.5)]">
                  <InvitationView
                    config={config}
                    theme={theme}
                    startOpen
                    replayKey={replayKey}
                    focusBlock={tab === "blokken" ? openBlock : null}
                    className="h-full"
                  />
                </div>
              </div>
            </div>
          </aside>
        </div>
      </main>

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

function ToolButton({
  label,
  onClick,
  disabled,
  children,
}: {
  label: string;
  onClick: () => void;
  disabled?: boolean;
  children: ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      aria-label={label}
      title={label}
      className="grid size-9 place-items-center rounded-full text-muted transition hover:bg-cream hover:text-ink disabled:opacity-30 disabled:hover:bg-transparent"
    >
      {children}
    </button>
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
