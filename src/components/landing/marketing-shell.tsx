import { LandingNav } from "./landing-nav";
import { MarketingFooter } from "./marketing-footer";
import { ScrollFx } from "./scroll-fx";
import { SmoothScroll } from "./smooth-scroll";

/** Gedeelde omlijsting van alle publieke pagina's: menu, scrolleffecten en footer. */
export function MarketingShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-dvh overflow-x-clip">
      <SmoothScroll />
      <ScrollFx />
      <LandingNav />
      <main>{children}</main>
      <MarketingFooter />
    </div>
  );
}
