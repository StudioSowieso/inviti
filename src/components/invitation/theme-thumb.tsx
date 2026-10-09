import { fontStack, googleFontsHref, themeFonts } from "@/lib/invitation/fonts";
import type { InvitationTheme } from "@/lib/invitation/types";
import { Branch, BranchPair, HeroBranch } from "./leaf";
import { NaturePhoto, SprigDivider, TornEdge } from "./nature";

/** Kleine vooruitblik van een thema: kleuren, lettertypes, knopvorm en (bij "nature") decor. */
export function ThemeThumb({ theme }: { theme: InvitationTheme }) {
  const c = theme.colors;
  const radius = theme.buttonShape === "pill" ? "999px" : theme.buttonShape === "rounded" ? "0.6rem" : "0.1rem";

  if (theme.style === "modern") {
    return (
      <div
        className="overflow-hidden rounded-xl border"
        style={{ background: c.background, borderColor: c.line, color: c.text }}
      >
        <link rel="stylesheet" href={googleFontsHref(...themeFonts(theme))} precedence="inviti-fonts" />
        <div className="p-1.5">
          <div className="relative overflow-hidden rounded-lg px-3.5 pt-3 pb-3 text-center" style={{ background: c.surface }}>
            <p className="text-right text-[0.5rem] tracking-[0.05em]" style={{ fontFamily: fontStack(theme.headingFont) }}>
              EMMA&amp;MATS
            </p>
            <p className="mt-0.5 text-[2.3rem] leading-[0.95] tracking-[0.02em]" style={{ fontFamily: fontStack(theme.headingFont) }}>
              12.09
            </p>
            <p className="text-[1.15rem] leading-none" style={{ fontFamily: fontStack(theme.scriptFont) }}>
              Wij gaan trouwen
            </p>
          </div>
        </div>
        <div className="px-4 py-3 text-center">
          <span
            className="inline-block px-4 py-1.5 text-[0.45rem] tracking-[0.12em]"
            style={{
              background: c.buttonBackground,
              color: c.buttonText,
              borderRadius: radius,
              fontFamily: fontStack(theme.bodyFont),
            }}
          >
            RSVP invullen
          </span>
        </div>
        <div className="h-3" style={{ background: c.footerBackground }} />
      </div>
    );
  }

  if (theme.style === "leaf") {
    return (
      <div
        className="overflow-hidden rounded-xl border"
        style={{
          background: c.background,
          borderColor: c.line,
          color: c.text,
          ["--inv-accent" as string]: c.accent,
          ["--inv-background" as string]: c.background,
        }}
      >
        <link rel="stylesheet" href={googleFontsHref(...themeFonts(theme))} precedence="inviti-fonts" />
        <div className="px-4 pt-3.5 pb-3 text-center" style={{ background: c.surface }}>
          <div className="mx-auto flex items-center justify-center gap-1.5">
            <Branch size={22} flip />
            <p className="text-[0.4rem] tracking-[0.28em] uppercase" style={{ color: c.muted, fontFamily: fontStack(theme.bodyFont) }}>
              Wij gaan trouwen
            </p>
            <Branch size={22} />
          </div>
          <HeroBranch className="mx-auto mt-1" style={{ width: "50%", color: c.accent }} />
          <p className="-mt-1 text-[1.45rem] leading-none" style={{ fontFamily: fontStack(theme.scriptFont) }}>
            Emma &amp; Mats
          </p>
          <BranchPair size={70} className="mt-1" />
        </div>
        <div className="px-4 py-3 text-center" style={{ background: c.surfaceAlt }}>
          <span
            className="inline-block px-4 py-1.5 text-[0.45rem] tracking-[0.2em] uppercase"
            style={{
              background: c.buttonBackground,
              color: c.buttonText,
              borderRadius: radius,
              fontFamily: fontStack(theme.bodyFont),
            }}
          >
            RSVP invullen
          </span>
        </div>
        <div className="h-3" style={{ background: c.footerBackground }} />
      </div>
    );
  }

  if (theme.style === "nature") {
    return (
      <div
        className="overflow-hidden rounded-xl border"
        style={{
          background: c.background,
          borderColor: c.line,
          color: c.text,
          ["--inv-accent" as string]: c.accent,
          ["--inv-background" as string]: c.background,
        }}
      >
        <link rel="stylesheet" href={googleFontsHref(...themeFonts(theme))} precedence="inviti-fonts" />
        <div className="relative flex h-[5.75rem] flex-col items-center justify-end overflow-hidden pb-5 text-center text-white">
          <NaturePhoto tone="warm" />
          <div
            className="absolute inset-0"
            style={{ background: "linear-gradient(to top, rgb(34 38 22 / .6), transparent 70%)" }}
          />
          <p
            className="relative text-[0.45rem] tracking-[0.3em] uppercase opacity-90"
            style={{ fontFamily: fontStack(theme.bodyFont) }}
          >
            Wij gaan trouwen
          </p>
          <p className="relative text-[1.9rem] leading-none" style={{ fontFamily: fontStack(theme.scriptFont) }}>
            Emma &amp; Mats
          </p>
        </div>
        <div className="relative px-4 pt-5 pb-3 text-center" style={{ background: c.background }}>
          <TornEdge fill={c.background} seed={4} style={{ bottom: "calc(100% - 1px)" }} />
          <p className="text-[1rem] leading-tight italic" style={{ fontFamily: fontStack(theme.headingFont) }}>
            Ben je erbij?
          </p>
          <SprigDivider className="mt-1.5" />
          <span
            className="mt-1.5 inline-block px-4 py-1.5 text-[0.45rem] tracking-[0.2em] uppercase"
            style={{
              background: c.buttonBackground,
              color: c.buttonText,
              borderRadius: radius,
              fontFamily: fontStack(theme.bodyFont),
            }}
          >
            RSVP invullen
          </span>
        </div>
        <div className="relative h-3" style={{ background: c.footerBackground }}>
          <TornEdge fill={c.footerBackground} seed={9} style={{ bottom: "calc(100% - 1px)" }} />
        </div>
      </div>
    );
  }

  return (
    <div
      className="overflow-hidden rounded-xl border"
      style={{ background: c.background, borderColor: c.line, color: c.text }}
    >
      <link rel="stylesheet" href={googleFontsHref(...themeFonts(theme))} precedence="inviti-fonts" />
      <div className="px-4 pt-5 pb-4 text-center">
        <p
          className="text-[0.5rem] tracking-[0.2em] uppercase"
          style={{ color: c.muted, fontFamily: fontStack(theme.bodyFont) }}
        >
          Wij gaan trouwen
        </p>
        <p className="mt-1 text-[1.7rem] leading-tight" style={{ fontFamily: fontStack(theme.headingFont) }}>
          Emma &amp; Mats
        </p>
        <span className="mx-auto mt-2 block h-px w-6" style={{ background: c.accent }} />
        <div className="mt-3 h-9 rounded-sm" style={{ background: c.line }} />
      </div>
      <div className="px-4 py-3 text-center" style={{ background: c.surfaceAlt }}>
        <span
          className="inline-block px-4 py-1.5 text-[0.5rem] tracking-[0.14em] uppercase"
          style={{
            background: c.buttonBackground,
            color: c.buttonText,
            borderRadius: radius,
            fontFamily: fontStack(theme.bodyFont),
          }}
        >
          RSVP invullen
        </span>
      </div>
      <div className="h-4" style={{ background: c.footerBackground }} />
    </div>
  );
}
