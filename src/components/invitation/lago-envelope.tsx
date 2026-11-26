"use client";

import type { CSSProperties } from "react";
import type { InvitationConfig, ThemeColors } from "@/lib/invitation/types";

/**
 * Animatie voor het thema "lago": een bosgroen scherm met de namen in dunne hoofdletters. Bij het openen schuiven de
 * twee helften als gordijnen opzij en komt de uitnodiging tevoorschijn.
 */

const col = (key: keyof ThemeColors) => `var(--inv-${key})`;
const heading = { fontFamily: "var(--inv-heading)" } satisfies CSSProperties;
const script = { fontFamily: "var(--inv-script)" } satisfies CSSProperties;

type Props = { config: InvitationConfig; opening: boolean; onOpen: () => void };

export function LagoEnvelope({ config, opening, onOpen }: Props) {
  const half = (side: "left" | "right"): CSSProperties => ({
    background: col("footerBackground"),
    transform: opening ? `translateX(${side === "left" ? "-101%" : "101%"})` : "none",
    transition: `transform 1000ms cubic-bezier(.65,0,.3,1) ${opening ? "220ms" : "0ms"}`,
  });
  return (
    <div className="absolute inset-0 z-30 overflow-hidden" style={{ containerType: "inline-size", pointerEvents: opening ? "none" : "auto" }}>
      <div className="absolute inset-y-0 left-0 w-1/2" style={half("left")} />
      <div className="absolute inset-y-0 right-0 w-1/2" style={half("right")} />
      <div
        className="absolute inset-0 z-[2] flex flex-col items-center justify-center text-center"
        style={{ color: col("background"), opacity: opening ? 0 : 1, transition: "opacity 350ms ease" }}
      >
        <p className="uppercase" style={{ ...heading, fontSize: "20cqw", lineHeight: 0.98 }}>
          {config.partner1}
        </p>
        <p style={{ ...script, fontSize: "14cqw", lineHeight: 1, margin: "-2cqw 0 -3cqw" }}>en</p>
        <p className="uppercase" style={{ ...heading, fontSize: "20cqw", lineHeight: 0.98 }}>
          {config.partner2}
        </p>
        <p className="uppercase" style={{ ...heading, fontSize: "3.6cqw", letterSpacing: "0.3em", marginTop: "12cqw", opacity: 0.8 }}>
          Tik om te openen
        </p>
      </div>
      <button type="button" onClick={onOpen} aria-label="Open de uitnodiging" className="absolute inset-0 z-[6] cursor-pointer" tabIndex={opening ? -1 : 0} />
    </div>
  );
}
