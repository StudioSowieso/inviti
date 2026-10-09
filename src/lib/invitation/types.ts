export type ButtonShape = "pill" | "rounded" | "square";

/**
 * Visuele stijl van een thema, boven op kleuren en lettertypes:
 * - classic: vlakke secties zoals in het basisontwerp
 * - nature: papieren textuur, gescheurde randen, botanische lijntekeningen en een scriptlettertype
 * - leaf: elegant en gelijkmatig: boogvormige foto, dunne lijnen en olijftakken als scheiding
 * - sweet: gestreept behang, witte boogkaarten met dubbele rand en een strikje
 * - lemon: blauw-geel gestreept behang, crèmekaarten met gestreepte rand en getekende citroentakken
 * - modern: editorial zwart-wit met greige, extra grote letters, handschrift en witte kaarten
 */
export type ThemeStyle = "classic" | "nature" | "leaf" | "modern" | "sweet" | "lemon";

export type ThemeColors = {
  background: string;
  surface: string;
  surfaceAlt: string;
  text: string;
  muted: string;
  line: string;
  accent: string;
  buttonBackground: string;
  buttonText: string;
  footerBackground: string;
  footerText: string;
  envelope: string;
  envelopeCard: string;
};

/** Een kleuroptie van een thema: een complete set kleuren die bij elkaar past. */
export type ThemePalette = {
  slug: string;
  title: string;
  colors: ThemeColors;
};

/** Een thema zoals het uit Sanity komt (of uit de ingebouwde fallback). */
export type InvitationTheme = {
  slug: string;
  title: string;
  description: string;
  /** Standaardkleuren; de gekozen kleuroptie (zie `palettes`) vervangt deze bij het renderen. */
  colors: ThemeColors;
  /** Drie kleuropties, de eerste is "standaard" (= `colors`). */
  palettes: ThemePalette[];
  headingFont: string;
  bodyFont: string;
  /** Sierlettertype voor namen en afsluiting (alleen zichtbaar bij style "nature" en "leaf"). */
  scriptFont: string;
  buttonShape: ButtonShape;
  style: ThemeStyle;
};

export type ProgramItem = { time: string; title: string; subtitle: string };

export type HeroBlock = { type: "hero"; enabled: boolean; eyebrow: string };
export type CountdownBlock = { type: "countdown"; enabled: boolean; eyebrow: string; title: string };
/** `photo` is de openbare URL van een geüploade foto in de bucket "invitation-photos" (leeg = geen foto). */
export type StoryBlock = { type: "story"; enabled: boolean; eyebrow: string; title: string; text: string; photo?: string };
export type ProgramBlock = {
  type: "program";
  enabled: boolean;
  eyebrow: string;
  title: string;
  items: ProgramItem[];
};
export type LocationBlock = {
  type: "location";
  enabled: boolean;
  eyebrow: string;
  title: string;
  address: string;
  /** Google Maps-link voor de knop "Bekijk route"; leeg = zoeken op naam en plaats. */
  mapsUrl?: string;
};
export type DresscodeBlock = {
  type: "dresscode";
  enabled: boolean;
  eyebrow: string;
  title: string;
  text: string;
  colors: string[];
};
export type RsvpBlock = {
  type: "rsvp";
  enabled: boolean;
  eyebrow: string;
  title: string;
  text: string;
  buttonLabel: string;
};
export type FooterBlock = { type: "footer"; enabled: boolean; closing: string; contactEmail: string };

export type Block =
  | HeroBlock
  | CountdownBlock
  | StoryBlock
  | ProgramBlock
  | LocationBlock
  | DresscodeBlock
  | RsvpBlock
  | FooterBlock;

export type BlockType = Block["type"];

/**
 * "envelope" = een envelop die opengaat; "reveal" = de doorkijk van het thema (takken, pagina's of
 * deuren); "none" opent direct.
 */
export type InvitationAnimation = "envelope" | "reveal" | "none";

export type InvitationConfig = {
  version: 1;
  partner1: string;
  partner2: string;
  /** YYYY-MM-DD */
  date: string;
  /** HH:mm, gebruikt voor het aftellen */
  time: string;
  city: string;
  animation: InvitationAnimation;
  /** Gekozen kleuroptie van het thema; "standaard" of onbekend geeft de basiskleuren. */
  palette: string;
  /** Volgorde van de blokken; hero staat altijd eerst en footer altijd laatst. */
  blocks: Block[];
};
