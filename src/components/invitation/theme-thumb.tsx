import type { CSSProperties } from "react";
import { fontStack, googleFontsHref, themeFonts } from "@/lib/invitation/fonts";
import type { InvitationTheme } from "@/lib/invitation/types";
import { Branch, BranchPair, HeroBranch } from "./leaf";
import { CornerSprigs } from "./flowers";
import { BourgStripes, Doodle, WOBBLE } from "./bourgondisch-art";
import { Paperclip } from "./sunset";
import { LemonBranch, LemonSprig } from "./lemon";
import { NaturePhoto, SprigDivider, TornEdge } from "./nature";

/** Kleine vooruitblik van een thema: kleuren, lettertypes, knopvorm en (bij "nature") decor. */
/** Alle thumbnails krijgen dezelfde hoogte; wat niet past wordt aan de onderkant afgesneden. */
export function ThemeThumb({ theme }: { theme: InvitationTheme }) {
  return (
    <div className="h-56 overflow-hidden rounded-xl [&>div]:h-full">
      <ThemeThumbInner theme={theme} />
    </div>
  );
}

function ThemeThumbInner({ theme }: { theme: InvitationTheme }) {
  const c = theme.colors;
  const radius = theme.buttonShape === "pill" ? "999px" : theme.buttonShape === "rounded" ? "0.6rem" : "0.1rem";

  if (theme.style === "bourgondisch") {
    const vars = {
      "--inv-background": c.background,
      "--inv-surface": c.surface,
      "--inv-surfaceAlt": c.surfaceAlt,
      "--inv-accent": c.accent,
    } as CSSProperties;
    return (
      <div className="relative flex flex-col items-center justify-center overflow-hidden rounded-xl" style={vars}>
        <link rel="stylesheet" href={googleFontsHref(...themeFonts(theme))} precedence="inviti-fonts" />
        <BourgStripes className="absolute inset-0" />
        <Doodle kind="grapes" w="2.1rem" style={{ position: "absolute", left: "0.6rem", top: "0.5rem", transform: "rotate(-10deg)" }} />
        <Doodle kind="glass" w="1.3rem" style={{ position: "absolute", right: "0.9rem", top: "0.5rem", transform: "rotate(8deg)" }} />
        <Doodle kind="oyster" w="2rem" style={{ position: "absolute", left: "0.9rem", bottom: "0.6rem", transform: "rotate(-6deg)" }} />
        <Doodle kind="bottle" w="1rem" style={{ position: "absolute", right: "1.1rem", bottom: "0.3rem", transform: "rotate(14deg)" }} />
        <div
          className="relative w-[76%] px-3 py-5 text-center"
          style={{ background: c.surface, border: `2px solid ${c.accent}`, borderRadius: WOBBLE, boxShadow: `0 0 0 0.3rem ${c.surface}` }}
        >
          <p className="text-[0.4rem] tracking-[0.24em]" style={{ fontFamily: fontStack(theme.headingFont), color: c.text }}>
            12.09.2027
          </p>
          <p className="mt-1 text-[1.35rem] leading-[1.05]" style={{ fontFamily: fontStack(theme.scriptFont), color: c.text }}>
            Emma <span style={{ color: c.accent }}>&amp;</span> Mats
          </p>
          <p className="mt-1.5 text-[0.36rem] tracking-[0.26em] uppercase" style={{ fontFamily: fontStack(theme.headingFont), color: c.text }}>
            Vier met ons de liefde
          </p>
        </div>
      </div>
    );
  }

  if (theme.style === "sunset") {
    const vars = { "--inv-accent": c.accent, "--inv-text": c.text, "--inv-surfaceAlt": c.surfaceAlt, "--inv-surface": c.surface } as CSSProperties;
    return (
      <div className="relative flex flex-col items-center justify-center overflow-hidden rounded-xl px-5" style={{ ...vars, background: c.background }}>
        <link rel="stylesheet" href={googleFontsHref(...themeFonts(theme))} precedence="inviti-fonts" />
        <div className="relative w-full rounded-2xl px-4 pt-4 pb-11 text-center" style={{ background: c.surface, transform: "rotate(-1.5deg)" }}>
          <p className="text-[1.25rem] leading-[0.95] tracking-tight uppercase" style={{ fontFamily: fontStack(theme.headingFont), color: c.accent }}>
            Emma
            <span className="block text-[0.95rem] normal-case" style={{ fontFamily: fontStack(theme.scriptFont), color: c.text }}>
              &amp;
            </span>
            Mats
          </p>
        </div>
        <div className="relative -mt-8 w-[62%] px-2 pt-6 pb-2 text-center" style={{ background: c.surfaceAlt, borderRadius: "999px 999px 0.3rem 0.3rem / 100% 100% 0.3rem 0.3rem" }}>
          <p className="text-[0.9rem] leading-none" style={{ fontFamily: fontStack(theme.scriptFont), color: c.accent }}>
            12 september
          </p>
          <Paperclip className="absolute -bottom-1.5 left-[62%] scale-[0.55]" />
        </div>
      </div>
    );
  }

  if (theme.style === "flowers") {
    const vars = {
      "--inv-accent": c.accent,
      "--inv-envelope": c.envelope,
      "--inv-text": c.text,
    } as CSSProperties;
    return (
      <div
        className="relative flex flex-col items-center justify-center overflow-hidden rounded-xl border px-4 text-center"
        style={{ ...vars, background: c.background, borderColor: c.line, color: c.text }}
      >
        <link rel="stylesheet" href={googleFontsHref(...themeFonts(theme))} precedence="inviti-fonts" />
        <CornerSprigs corner="tl" seed={7} size="6.5rem" />
        <CornerSprigs corner="br" seed={13} size="6.5rem" />
        <p className="relative text-[0.4rem] tracking-[0.2em] uppercase" style={{ fontFamily: fontStack(theme.bodyFont), color: c.muted }}>
          Wij gaan trouwen
        </p>
        <p className="relative mt-2 text-[1.05rem] leading-[1.15] tracking-[0.16em] uppercase" style={{ fontFamily: fontStack(theme.headingFont) }}>
          Emma
          <span className="block text-[1rem] tracking-normal normal-case italic" style={{ fontFamily: fontStack(theme.scriptFont), color: c.accent }}>
            en
          </span>
          Mats
        </p>
        <div className="relative mt-3 flex items-center gap-2 text-[0.4rem] tracking-[0.2em] uppercase" style={{ fontFamily: fontStack(theme.bodyFont) }}>
          <span>Sep</span>
          <span className="h-4 w-px" style={{ background: c.line }} />
          <span className="text-[1.1rem] tracking-normal" style={{ fontFamily: fontStack(theme.headingFont) }}>
            12
          </span>
          <span className="h-4 w-px" style={{ background: c.line }} />
          <span>2027</span>
        </div>
      </div>
    );
  }

  if (theme.style === "lemon") {
    const blue = `color-mix(in srgb, ${c.buttonBackground} 78%, white)`;
    return (
      <div
        className="flex flex-col overflow-hidden rounded-xl border"
        style={{
          background: `repeating-linear-gradient(90deg, ${blue} 0 0.5rem, ${c.surface} 0.5rem 0.54rem, ${c.background} 0.54rem 1.06rem, ${c.surface} 1.06rem 1.1rem)`,
          borderColor: c.line,
          color: c.text,
        }}
      >
        <link rel="stylesheet" href={googleFontsHref(...themeFonts(theme))} precedence="inviti-fonts" />
        <div className="flex flex-1 flex-col px-5 pt-3 pb-2">
          <div className="relative flex flex-1 flex-col justify-center overflow-hidden text-center" style={{ background: c.surface }}>
            <span
              aria-hidden="true"
              className="absolute inset-x-0 top-0 h-1"
              style={{ backgroundImage: `repeating-linear-gradient(90deg, ${blue} 0 0.16rem, ${c.surface} 0.16rem 0.26rem)` }}
            />
            <LemonBranch className="absolute -top-1 -left-2 w-[36%]" />
            <div className="relative px-3 pt-8 pb-6">
              <p className="text-[0.95rem] leading-none tracking-[0.14em]" style={{ fontFamily: fontStack(theme.headingFont) }}>
                LUCIA
              </p>
              <p className="text-[1.1rem] leading-none" style={{ fontFamily: fontStack(theme.scriptFont), color: c.accent }}>
                &amp;
              </p>
              <p className="text-[0.95rem] leading-none tracking-[0.14em]" style={{ fontFamily: fontStack(theme.headingFont) }}>
                JUAN
              </p>
              <LemonSprig width={34} className="mx-auto mt-1.5" />
            </div>
            <span
              aria-hidden="true"
              className="absolute inset-x-0 bottom-0 h-1"
              style={{ backgroundImage: `repeating-linear-gradient(90deg, ${blue} 0 0.16rem, ${c.surface} 0.16rem 0.26rem)` }}
            />
          </div>
        </div>
        <div className="px-4 pb-3 text-center">
          <span
            className="inline-block px-4 py-1.5 text-[0.45rem] tracking-[0.14em]"
            style={{ background: c.buttonBackground, color: c.buttonText, borderRadius: radius, fontFamily: fontStack(theme.bodyFont) }}
          >
            RSVP invullen
          </span>
        </div>
      </div>
    );
  }

  if (theme.style === "sweet") {
    const gradient = {
      backgroundImage: `linear-gradient(180deg, ${c.accent}, color-mix(in srgb, ${c.accent} 55%, ${c.background}))`,
      WebkitBackgroundClip: "text",
      backgroundClip: "text",
      color: "transparent",
      WebkitTextFillColor: "transparent",
    } as const;
    return (
      <div
        className="flex flex-col overflow-hidden rounded-xl border"
        style={{
          background: `repeating-linear-gradient(90deg, ${c.background} 0 0.45rem, ${c.surface} 0.45rem 0.5rem, ${c.accent} 0.5rem 0.62rem, ${c.surface} 0.62rem 0.67rem, ${c.accent} 0.67rem 0.84rem, ${c.surface} 0.84rem 0.89rem, ${c.accent} 0.89rem 1.01rem, ${c.surface} 1.01rem 1.06rem, ${c.background} 1.06rem 1.9rem)`,
          borderColor: c.line,
          color: c.text,
        }}
      >
        <link rel="stylesheet" href={googleFontsHref(...themeFonts(theme))} precedence="inviti-fonts" />
        <div className="flex flex-1 flex-col px-6 pt-3 pb-2">
          <div
            className="mx-auto flex w-[78%] flex-1 flex-col p-[0.2rem]"
            style={{ background: c.surface, borderRadius: "50% 50% 0.4rem 0.4rem / 3.4rem 3.4rem 0.4rem 0.4rem" }}
          >
            <div
              className="flex flex-1 flex-col justify-center px-2 pt-4 pb-2.5 text-center"
              style={{
                border: `0.12rem solid ${c.surfaceAlt}`,
                borderRadius: "50% 50% 0.3rem 0.3rem / 3.2rem 3.2rem 0.3rem 0.3rem",
              }}
            >
              <p className="text-[1.15rem] leading-[0.95]" style={{ fontFamily: fontStack(theme.headingFont), ...gradient }}>
                27
                <br />
                JUN
              </p>
              <p className="mt-1 text-[0.4rem] tracking-[0.25em]" style={{ fontFamily: fontStack(theme.bodyFont) }}>
                EMMA &amp; MATS
              </p>
              <p className="text-[0.85rem] leading-none" style={{ fontFamily: fontStack(theme.scriptFont) }}>
                Wij gaan trouwen
              </p>
            </div>
          </div>
        </div>
        <div className="px-4 pb-3 text-center">
          <span
            className="inline-block px-4 py-1.5 text-[0.45rem] tracking-[0.14em]"
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
      </div>
    );
  }

  if (theme.style === "modern") {
    return (
      <div
        className="flex flex-col overflow-hidden rounded-xl border"
        style={{ background: c.background, borderColor: c.line, color: c.text }}
      >
        <link rel="stylesheet" href={googleFontsHref(...themeFonts(theme))} precedence="inviti-fonts" />
        <div className="flex flex-1 flex-col p-1.5">
          <div className="relative flex flex-1 flex-col justify-center overflow-hidden rounded-lg px-3.5 pt-3 pb-3 text-center" style={{ background: c.surface }}>
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
