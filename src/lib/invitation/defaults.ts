import { SUPABASE_URL } from "@/lib/supabase/config";
import { normalizeMapsUrl } from "./format";
import type {
  Block,
  DresscodeBlock,
  InvitationConfig,
  ProgramItem,
} from "./types";

export const PHOTO_BUCKET = "invitation-photos";
const PHOTO_PREFIX = `${SUPABASE_URL}/storage/v1/object/public/${PHOTO_BUCKET}/`;

/** Alleen foto's uit onze eigen bucket worden geaccepteerd; al het andere wordt leeg. */
export function photoUrl(value: unknown): string {
  return typeof value === "string" && value.startsWith(PHOTO_PREFIX) && value.length < 400 && !/[\s"'<>]/.test(value) ? value : "";
}

export const MOVABLE_TYPES = ["countdown", "story", "program", "location", "dresscode", "rsvp"] as const;

export type Prefill = { partner1?: string; partner2?: string; date?: string };

const DEFAULT_PROGRAM: ProgramItem[] = [
  { time: "14:30", title: "Ontvangst", subtitle: "Welkom met bubbels" },
  { time: "15:00", title: "Ceremonie", subtitle: "Wij zeggen ja" },
  { time: "17:00", title: "Diner", subtitle: "Samen aan tafel" },
  { time: "20:30", title: "Feest", subtitle: "Dansen tot laat" },
];

export function defaultBlocks(): Block[] {
  return [
    { type: "hero", enabled: true, eyebrow: "Wij gaan trouwen" },
    { type: "countdown", enabled: true, eyebrow: "Nog even", title: "Aftellen tot de grote dag" },
    {
      type: "story",
      enabled: true,
      eyebrow: "Ons verhaal",
      title: "Van eerste koffie tot voor altijd",
      text: "Wat begon met een spontane koffie groeide uit tot reizen, lange diners en een thuis samen. Nu vieren we het volgende hoofdstuk graag met jullie.",
    },
    { type: "program", enabled: true, eyebrow: "De dag", title: "Programma & feest", items: DEFAULT_PROGRAM },
    {
      type: "location",
      enabled: true,
      eyebrow: "Waar",
      title: "Landgoed de Liefde",
      address:
        "Liefdeslaan 1\n1234 JA Hartenburg",
    },
    {
      type: "dresscode",
      enabled: true,
      eyebrow: "Wat trek je aan",
      title: "Summer formal",
      text: "Luchtige pakken, lange jurken en zachte natuurtinten. Laat wit en denim deze dag liever thuis.",
      colors: ["#c9b9a3", "#a39a84", "#7a8a73", "#e2d3c4", "#3d4a40"],
    },
    {
      type: "rsvp",
      enabled: true,
      eyebrow: "Laat je het weten",
      title: "Ben je erbij?",
      text: "We horen graag vóór 1 juni 2027 of je samen met ons proost, dineert en danst.",
      buttonLabel: "RSVP invullen",
    },
    { type: "footer", enabled: true, closing: "Liefs,", contactEmail: "" },
  ];
}

export function defaultConfig(prefill: Prefill = {}): InvitationConfig {
  return {
    version: 1,
    partner1: prefill.partner1?.trim() || "Emma",
    partner2: prefill.partner2?.trim() || "Mats",
    date: prefill.date || "2027-09-12",
    time: "15:00",
    city: "Hartenburg",
    animation: "envelope",
    palette: "standaard",
    blocks: defaultBlocks(),
  };
}

// ---------- Normaliseren van opgeslagen / ingestuurde configuratie ----------

const MAX_TEXT = 2000;
const MAX_ITEMS = 20;
const HEX = /^#(?:[0-9a-f]{3}|[0-9a-f]{6})$/i;

function str(v: unknown, fallback: string, max = MAX_TEXT) {
  return typeof v === "string" ? v.slice(0, max) : fallback;
}

function isRecord(v: unknown): v is Record<string, unknown> {
  return typeof v === "object" && v !== null && !Array.isArray(v);
}

function normalizeBlock(base: Block, raw: Record<string, unknown>): Block {
  const enabled =
    base.type === "hero" || base.type === "footer" ? true : typeof raw.enabled === "boolean" ? raw.enabled : base.enabled;

  switch (base.type) {
    case "hero":
      return { ...base, enabled, eyebrow: str(raw.eyebrow, base.eyebrow, 80) };
    case "countdown":
      return { ...base, enabled, eyebrow: str(raw.eyebrow, base.eyebrow, 80), title: str(raw.title, base.title, 120) };
    case "story":
      return {
        ...base,
        enabled,
        eyebrow: str(raw.eyebrow, base.eyebrow, 80),
        title: str(raw.title, base.title, 120),
        text: str(raw.text, base.text),
        photo: photoUrl(raw.photo),
      };
    case "program": {
      const items = Array.isArray(raw.items)
        ? raw.items
            .filter(isRecord)
            .slice(0, MAX_ITEMS)
            .map((i) => ({
              time: str(i.time, "", 12),
              title: str(i.title, "", 120),
              subtitle: str(i.subtitle, "", 160),
            }))
        : base.items;
      return { ...base, enabled, eyebrow: str(raw.eyebrow, base.eyebrow, 80), title: str(raw.title, base.title, 120), items };
    }
    case "location":
      return {
        ...base,
        enabled,
        eyebrow: str(raw.eyebrow, base.eyebrow, 80),
        title: str(raw.title, base.title, 120),
        address: str(raw.address, base.address),
        mapsUrl: normalizeMapsUrl(raw.mapsUrl),
      };
    case "dresscode": {
      const colors = Array.isArray(raw.colors)
        ? raw.colors.filter((c): c is string => typeof c === "string" && HEX.test(c)).slice(0, 8)
        : (base as DresscodeBlock).colors;
      return {
        ...base,
        enabled,
        eyebrow: str(raw.eyebrow, base.eyebrow, 80),
        title: str(raw.title, base.title, 120),
        text: str(raw.text, base.text),
        colors,
      };
    }
    case "rsvp":
      return {
        ...base,
        enabled,
        eyebrow: str(raw.eyebrow, base.eyebrow, 80),
        title: str(raw.title, base.title, 120),
        text: str(raw.text, base.text),
        buttonLabel: str(raw.buttonLabel, base.buttonLabel, 40),
      };
    case "footer":
      return { ...base, enabled, closing: str(raw.closing, base.closing, 40), contactEmail: str(raw.contactEmail, base.contactEmail, 120) };
  }
}

/**
 * Maakt van onbekende JSON altijd een geldige configuratie. Ontbrekende of ongeldige velden
 * krijgen de standaardwaarde, zodat oudere uitnodigingen blijven werken als er blokken bijkomen.
 */
export function normalizeConfig(raw: unknown, prefill: Prefill = {}): InvitationConfig {
  const base = defaultConfig(prefill);
  if (!isRecord(raw)) return base;

  const date = typeof raw.date === "string" && /^\d{4}-\d{2}-\d{2}$/.test(raw.date) ? raw.date : base.date;
  const time = typeof raw.time === "string" && /^\d{2}:\d{2}$/.test(raw.time) ? raw.time : base.time;

  const rawBlocks = Array.isArray(raw.blocks) ? raw.blocks.filter(isRecord) : [];
  const defaults = new Map(base.blocks.map((b) => [b.type, b] as const));
  const seen = new Set<string>();
  const ordered: Block[] = [];

  for (const rb of rawBlocks) {
    const def = typeof rb.type === "string" ? defaults.get(rb.type as Block["type"]) : undefined;
    if (!def || seen.has(def.type)) continue;
    seen.add(def.type);
    ordered.push(normalizeBlock(def, rb));
  }
  for (const def of base.blocks) {
    if (!seen.has(def.type)) ordered.push(normalizeBlock(def, {}));
  }

  // hero altijd eerst, footer altijd laatst
  const hero = ordered.filter((b) => b.type === "hero");
  const footer = ordered.filter((b) => b.type === "footer");
  const middle = ordered.filter((b) => b.type !== "hero" && b.type !== "footer");

  return {
    version: 1,
    partner1: str(raw.partner1, base.partner1, 60),
    partner2: str(raw.partner2, base.partner2, 60),
    date,
    time,
    city: str(raw.city, base.city, 80),
    animation: raw.animation === "none" || raw.animation === "reveal" ? raw.animation : "envelope",
    palette: typeof raw.palette === "string" && /^[a-z0-9-]{1,30}$/.test(raw.palette) ? raw.palette : "standaard",
    blocks: [...hero, ...middle, ...footer],
  };
}
