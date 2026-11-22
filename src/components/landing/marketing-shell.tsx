import { LandingNav } from "./landing-nav";
import { MarketingFooter } from "./marketing-footer";
import { ScrollFx } from "./scroll-fx";
import { SmoothScroll } from "./smooth-scroll";

/** Gedeelde omlijsting van alle publieke pagina's: menu, scrolleffecten en footer. */
export function MarketingShell({
  children,
  brand = "wine",
}: {
  children: React.ReactNode;
  brand?: "classic" | "wine";
}) {
  return (
    <div className={`min-h-dvh overflow-x-clip ${brand === "wine" ? "brand-wine" : ""}`}>
      <SmoothScroll />
      <ScrollFx />
      <LandingNav brand={brand} />
      <main>{children}</main>
      <MarketingFooter brand={brand} />
    </div>
  );
}
