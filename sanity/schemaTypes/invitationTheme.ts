import { defineField, defineType } from "sanity";

// Moet overeenkomen met FONT_CATALOG in src/lib/invitation/fonts.ts
const FONTS = [
  "Cormorant Garamond",
  "Playfair Display",
  "Lora",
  "DM Serif Display",
  "EB Garamond",
  "Italiana",
  "Gloock",
  "Inter",
  "Jost",
  "Josefin Sans",
  "DM Sans",
  "Manrope",
];

// Sierlettertypes voor namen en afsluiting (alleen zichtbaar bij de stijlen "Natuur", "Leaf", "Modern" en "Sweet").
const SCRIPT_FONTS = ["Great Vibes", "Pinyon Script", "Allura", "Mrs Saint Delafield"];

const colorField = (name: string, title: string, description: string) =>
  defineField({
    name,
    title,
    description,
    type: "string",
    validation: (rule) =>
      rule
        .required()
        .regex(/^#(?:[0-9a-fA-F]{3}|[0-9a-fA-F]{6})$/, { name: "hex-kleur" })
        .error("Gebruik een hex-kleur, bijvoorbeeld #f4f0ea"),
  });

export const invitationTheme = defineType({
  name: "invitationTheme",
  title: "Uitnodigingsthema",
  type: "document",
  fields: [
    defineField({
      name: "title",
      title: "Naam",
      type: "string",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "slug",
      title: "Slug",
      description:
        "Unieke sleutel van het thema. Gebruikers die dit thema kozen verwijzen hiernaar: wijzig de slug nooit meer nadat het thema in gebruik is.",
      type: "slug",
      options: { source: "title", maxLength: 60 },
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "description",
      title: "Korte beschrijving",
      description: "Verschijnt onder de naam in de themakeuze.",
      type: "text",
      rows: 2,
    }),
    defineField({
      name: "order",
      title: "Volgorde",
      description: "Lagere cijfers komen eerst in de themakeuze.",
      type: "number",
      initialValue: 10,
    }),
    defineField({
      name: "active",
      title: "Beschikbaar voor gebruikers",
      description: "Zet uit om een thema te verbergen zonder het te verwijderen. Bestaande uitnodigingen blijven werken.",
      type: "boolean",
      initialValue: true,
    }),
    defineField({
      name: "headingFont",
      title: "Lettertype koppen",
      type: "string",
      options: { list: FONTS },
      initialValue: "Cormorant Garamond",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "bodyFont",
      title: "Lettertype lopende tekst",
      type: "string",
      options: { list: FONTS },
      initialValue: "Inter",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "scriptFont",
      title: "Lettertype namen (handschrift)",
      description: "Alleen in gebruik bij de stijl 'Natuur': namen in de hero, de afsluiting en de envelop.",
      type: "string",
      options: { list: SCRIPT_FONTS },
      initialValue: "Great Vibes",
    }),
    defineField({
      name: "style",
      title: "Stijl",
      description:
        "Standaard: vlakke secties. Natuur: papieren textuur, gescheurde randen tussen de secties, botanische lijntekeningen en handschrift.",
      type: "string",
      options: {
        list: [
          { title: "Standaard", value: "classic" },
          { title: "Natuur (papier, gescheurde randen, botanisch)", value: "nature" },
          { title: "Leaf (elegant, boogfoto, olijftakken)", value: "leaf" },
          { title: "Modern (zwart-wit, grote letters, handschrift)", value: "modern" },
          { title: "Sweet (strepen, boogkaarten, strikje)", value: "sweet" },
        ],
        layout: "radio",
      },
      initialValue: "classic",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "buttonShape",
      title: "Vorm van knoppen",
      type: "string",
      options: {
        list: [
          { title: "Afgerond (pil)", value: "pill" },
          { title: "Licht afgerond", value: "rounded" },
          { title: "Rechthoekig", value: "square" },
        ],
        layout: "radio",
      },
      initialValue: "pill",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "colors",
      title: "Kleuren",
      type: "object",
      options: { collapsible: true, collapsed: false },
      fields: [
        colorField("background", "Achtergrond", "Hoofdachtergrond van de uitnodiging."),
        colorField("surface", "Vlak (licht)", "Lichter vlak, o.a. achter het programma."),
        colorField("surfaceAlt", "Vlak (accent)", "Gekleurde secties, zoals aftellen en dresscode."),
        colorField("text", "Tekst", "Kleur van titels en tekst."),
        colorField("muted", "Tekst (zacht)", "Kleur van kleine en ondersteunende tekst."),
        colorField("line", "Lijnen en fotovlakken", "Scheidingslijnen en de plek van foto's."),
        colorField("accent", "Accent", "Kleine sierlijnen en het &-teken."),
        colorField("buttonBackground", "Knop (achtergrond)", "Bijvoorbeeld de RSVP-knop."),
        colorField("buttonText", "Knop (tekst)", "Tekstkleur op de knop."),
        colorField("footerBackground", "Afsluiting (achtergrond)", "Donkere afsluiting onderaan."),
        colorField("footerText", "Afsluiting (tekst)", "Tekstkleur in de afsluiting."),
        colorField("envelope", "Doorkijk (deuren)", "Kleur van de deuren bij het openen van de uitnodiging."),
        colorField("envelopeCard", "Doorkijk (zegel)", "Kleur van het zegel op de deuren."),
      ],
    }),
  ],
  orderings: [
    { title: "Volgorde", name: "order", by: [{ field: "order", direction: "asc" }] },
  ],
  preview: {
    select: { title: "title", subtitle: "description", active: "active" },
    prepare: ({ title, subtitle, active }) => ({
      title: active === false ? `${title} (verborgen)` : title,
      subtitle,
    }),
  },
});
