import type { CSSProperties } from "react";
import { WineLogo, WineLogoStacked } from "@/components/brand-logo";

/**
 * Het Proost Mee-logo. Standaard het beeldmerk met de tekst ernaast; `stacked` zet de tekst eronder
 * (backoffice). Volgt de tekstkleur (`currentColor`), dus gebruik `text-forest`, `text-paper`, enz.
 */
export function Logo({
  className = "",
  stacked = false,
  title = "Proost Mee",
}: {
  className?: string;
  style?: CSSProperties;
  /** Niet meer in gebruik; het logo heeft geen ondertitel. */
  tagline?: boolean;
  stacked?: boolean;
  title?: string;
}) {
  return stacked ? <WineLogoStacked className={className} title={title} /> : <WineLogo className={className} title={title} />;
}
