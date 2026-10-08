export type ButtonShape = "pill" | "rounded" | "square";

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

/** Een thema zoals het uit Sanity komt (of uit de ingebouwde fallback). */
export type InvitationTheme = {
  slug: string;
  title: string;
  description: string;
  colors: ThemeColors;
  headingFont: string;
  bodyFont: string;
  buttonShape: ButtonShape;
};

export type ProgramItem = { time: string; title: string; subtitle: string };

export type HeroBlock = { type: "hero"; enabled: boolean; eyebrow: string };
export type CountdownBlock = { type: "countdown"; enabled: boolean; eyebrow: string; title: string };
export type StoryBlock = { type: "story"; enabled: boolean; eyebrow: string; title: string; text: string };
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

export type InvitationAnimation = "envelope" | "none";

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
  /** Volgorde van de blokken; hero staat altijd eerst en footer altijd laatst. */
  blocks: Block[];
};
