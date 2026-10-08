import { fontStack, googleFontsHref } from "@/lib/invitation/fonts";
import type { InvitationTheme } from "@/lib/invitation/types";

/** Kleine vooruitblik van een thema: kleuren, lettertypes en knopvorm. */
export function ThemeThumb({ theme }: { theme: InvitationTheme }) {
  const c = theme.colors;
  const radius = theme.buttonShape === "pill" ? "999px" : theme.buttonShape === "rounded" ? "0.6rem" : "0.1rem";

  return (
    <div
      className="overflow-hidden rounded-xl border"
      style={{ background: c.background, borderColor: c.line, color: c.text }}
    >
      <link rel="stylesheet" href={googleFontsHref(theme.headingFont, theme.bodyFont)} precedence="inviti-fonts" />
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
