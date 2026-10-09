"use client";

import { useMemo, type CSSProperties, type ReactNode } from "react";
import { monogram } from "@/lib/invitation/format";
import type { InvitationConfig, InvitationTheme, ThemeColors } from "@/lib/invitation/types";
import { BranchArt, makeBranch } from "./leaf";
import { LemonReveal } from "./lemon-envelope";
import { SweetReveal } from "./sweet-envelope";
import { AbstractCouple } from "./modern";
import { PAPER_NOISE, tearPaths } from "./nature";

/**
 * "Doorkijk": de animatie waarmee de uitnodiging opent. Elk thema heeft zijn eigen doorkijk:
 * - Leaf: je gaat door de takken heen.
 * - Nature: gescheurde pagina's gaan open.
 * - Lemon: je gaat door de citroentakken heen.
 * - Sweet: de strepen van het behang schuiven open.
 * - Overige thema's: deuren in de kleuren van het thema slaan open.
 * De echte uitnodiging staat de hele tijd achter de animatie, dus je ziet hem verschijnen.
 */

const col = (key: keyof ThemeColors) => `var(--inv-${key})`;
const heading = { fontFamily: "var(--inv-heading)" } satisfies CSSProperties;
const script = { fontFamily: "var(--inv-script)" } satisfies CSSProperties;

/** Totale duur van de doorkijk; daarna wordt de overlay weggehaald. */
export const REVEAL_MS = 1800;

type RevealProps = { config: InvitationConfig; opening: boolean; onOpen: () => void };

export function RevealOverlay({ theme, ...props }: RevealProps & { theme: InvitationTheme }) {
  if (theme.style === "leaf") return <LeafReveal {...props} />;
  if (theme.style === "nature") return <PagesReveal {...props} />;
  if (theme.style === "modern") return <PhotoReveal {...props} />;
  if (theme.style === "lemon") return <LemonReveal {...props} />;
  if (theme.style === "sweet") return <SweetReveal {...props} />;
  return <DoorsReveal {...props} />;
}

function Root({ opening, onOpen, children }: { opening: boolean; onOpen: () => void; children: ReactNode }) {
  return (
    <div className="absolute inset-0 z-30 overflow-hidden" style={{ pointerEvents: opening ? "none" : "auto" }}>
      {children}
      <button
        type="button"
        onClick={onOpen}
        aria-label="Open de uitnodiging"
        className="absolute inset-0 z-[5] cursor-pointer"
        tabIndex={opening ? -1 : 0}
      />
    </div>
  );
}

function OpenHint({
  opening,
  label = "Tik om te openen",
  light = false,
}: {
  opening: boolean;
  label?: string;
  light?: boolean;
}) {
  return (
    <span
      className="inline-flex items-center gap-2 px-6 py-3 text-[0.6rem] font-medium tracking-[0.18em] whitespace-nowrap uppercase"
      style={{
        background: light ? col("envelopeCard") : col("buttonBackground"),
        color: light ? col("text") : col("buttonText"),
        borderRadius: "var(--inv-radius)",
        boxShadow: light ? "0 6px 16px -6px rgb(0 0 0 / .45)" : undefined,
        opacity: opening ? 0 : 1,
        transition: "opacity 350ms ease",
      }}
    >
      {label}
    </span>
  );
}

// ---------- Leaf: door de takken heen ----------

type FoliageSpec = { seed: number; y: number; rot: number; len: number; bow: number; leaves: number; leafLen: number };

function foliage(offset: number, leafLen: number, ys: number[]): FoliageSpec[] {
  return ys.map((y, i) => ({
    seed: offset + i * 7,
    y,
    rot: (i % 2 === 0 ? 1 : -1) * (6 + ((i * 5) % 9)),
    len: 150 + ((i * 17) % 34),
    bow: (i % 2 === 0 ? 1 : -1) * (18 + ((i * 7) % 12)),
    leaves: 11 + (i % 3),
    leafLen: leafLen + ((i * 3) % 7),
  }));
}

const FOLIAGE = {
  nearLeft: foliage(41, 40, [40, 175, 310, 445, 575]),
  nearRight: foliage(141, 40, [100, 235, 370, 505]),
  farLeft: foliage(241, 24, [110, 245, 380, 510]),
  farRight: foliage(341, 24, [45, 180, 315, 450, 585]),
};

function buildFoliage(specs: FoliageSpec[]) {
  return specs.map((s) => ({
    ...s,
    data: makeBranch(s.seed, { len: s.len, bow: s.bow, leaves: s.leaves, leafLen: s.leafLen }),
  }));
}

function FoliageSide({
  side,
  specs,
  depth,
  opening,
}: {
  side: "left" | "right";
  specs: FoliageSpec[];
  depth: "near" | "far";
  opening: boolean;
}) {
  const branches = useMemo(() => buildFoliage(specs), [specs]);
  const near = depth === "near";
  const dir = side === "left" ? -1 : 1;
  const move = near ? 95 : 55;
  const scale = near ? 1.9 : 1.4;
  return (
    <div
      aria-hidden="true"
      className="pointer-events-none absolute top-0 h-full w-[66%]"
      style={{
        [side]: 0,
        transformOrigin: `${side === "left" ? "0%" : "100%"} 50%`,
        transform: opening ? `translateX(${dir * move}%) scale(${scale}) rotate(${dir * (near ? 5 : 2)}deg)` : "none",
        opacity: opening ? 0 : 1,
        transition: `transform ${near ? 1250 : 1450}ms cubic-bezier(.55,0,.25,1), opacity 480ms ease ${near ? 780 : 950}ms`,
        zIndex: near ? 3 : 2,
      }}
    >
      <svg
        viewBox="0 0 240 620"
        preserveAspectRatio={side === "left" ? "xMinYMid slice" : "xMaxYMid slice"}
        className="h-full w-full"
        style={{
          transform: side === "right" ? "scaleX(-1)" : undefined,
          color: `color-mix(in srgb, var(--inv-accent) ${near ? 78 : 60}%, ${near ? "black" : "white"})`,
          opacity: near ? 1 : 0.75,
        }}
      >
        {branches.map((b) => (
          <g key={b.seed} transform={`translate(-12 ${b.y}) rotate(${b.rot})`}>
            <BranchArt
              data={b.data}
              stemWidth={near ? 1.6 : 1.1}
              leafWidth={near ? 0.9 : 0.7}
              leafFill={near ? 46 : 30}
              oliveSize={6}
            />
          </g>
        ))}
      </svg>
    </div>
  );
}

function LeafReveal({ config, opening, onOpen }: RevealProps) {
  return (
    <Root opening={opening} onOpen={onOpen}>
      <div
        className="absolute inset-0"
        style={{
          background: `radial-gradient(circle at 50% 45%, color-mix(in srgb, ${col("surface")} 100%, white), ${col("surface")} 70%)`,
          opacity: opening ? 0 : 1,
          transition: `opacity 900ms ease ${opening ? "380ms" : "0ms"}`,
        }}
      />
      <FoliageSide side="left" specs={FOLIAGE.farLeft} depth="far" opening={opening} />
      <FoliageSide side="right" specs={FOLIAGE.farRight} depth="far" opening={opening} />
      <FoliageSide side="left" specs={FOLIAGE.nearLeft} depth="near" opening={opening} />
      <FoliageSide side="right" specs={FOLIAGE.nearRight} depth="near" opening={opening} />
      <div
        className="pointer-events-none absolute inset-0 z-[4] flex flex-col items-center justify-center px-8 text-center"
        style={{
          opacity: opening ? 0 : 1,
          transform: opening ? "scale(1.12)" : "none",
          transition: "opacity 450ms ease, transform 700ms ease",
        }}
      >
        <div
          className="px-12 py-14"
          style={{
            background: `radial-gradient(closest-side, ${col("surface")} 62%, color-mix(in srgb, ${col("surface")} 0%, transparent))`,
          }}
        >
          <p className="text-[0.55rem] tracking-[0.3em] uppercase" style={{ color: col("muted") }}>
            Wij gaan trouwen
          </p>
          <p className="mt-3 text-[2.5rem] leading-[1.15]" style={script}>
            {config.partner1}
          </p>
          <p className="text-[1.2rem] italic" style={{ ...heading, color: col("accent") }}>
            &amp;
          </p>
          <p className="text-[2.5rem] leading-[1.15]" style={script}>
            {config.partner2}
          </p>
          <div className="mt-6">
            <OpenHint opening={opening} label="Ga naar binnen" />
          </div>
        </div>
      </div>
    </Root>
  );
}

// ---------- Nature: gescheurde pagina's ----------

function VerticalTear({ fill, seed, side }: { fill: string; seed: number; side: "left" | "right" }) {
  const { main, rim } = useMemo(() => tearPaths(seed), [seed]);
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 28 400"
      preserveAspectRatio="none"
      className="pointer-events-none absolute top-0 h-full"
      style={{
        width: "1.2rem",
        [side === "left" ? "left" : "right"]: "calc(100% - 1px)",
        transform: side === "right" ? "scaleX(-1)" : undefined,
      }}
    >
      <g transform="translate(28 0) rotate(90)">
        <path d={rim} style={{ fill: `color-mix(in srgb, ${fill} 40%, white)` }} />
        <path d={main} style={{ fill }} />
      </g>
    </svg>
  );
}

function Page({
  side,
  fill,
  seed,
  opening,
  delay,
  travel,
  z,
  width = 51,
  children,
}: {
  side: "left" | "right";
  fill: string;
  seed: number;
  opening: boolean;
  delay: number;
  travel: number;
  z: number;
  width?: number;
  children?: ReactNode;
}) {
  const dir = side === "left" ? -1 : 1;
  return (
    <div
      className="absolute top-0 h-full"
      style={{
        [side]: 0,
        width: `${width}%`,
        zIndex: z,
        backgroundColor: fill,
        backgroundImage: PAPER_NOISE,
        filter: "drop-shadow(0 0 10px rgb(40 36 20 / .22))",
        transformOrigin: `${side === "left" ? "0%" : "100%"} 60%`,
        transform: opening ? `translateX(${dir * travel}%) rotate(${dir * 2.5}deg)` : "none",
        transition: `transform 1150ms cubic-bezier(.6,0,.25,1) ${delay}ms`,
      }}
    >
      <VerticalTear fill={fill} seed={seed} side={side} />
      {children}
    </div>
  );
}

function PagesReveal({ config, opening, onOpen }: RevealProps) {
  const label = (side: "left" | "right") => ({ fill: col(side === "left" ? "surface" : "surface") });
  return (
    <Root opening={opening} onOpen={onOpen}>
      <div
        className="absolute inset-0"
        style={{ opacity: opening ? 0 : 1, transition: `opacity 500ms ease ${opening ? "1250ms" : "0ms"}`, pointerEvents: "none" }}
      >
        <Page side="left" fill={`color-mix(in srgb, ${col("surfaceAlt")} 80%, ${col("surface")})`} seed={11} opening={opening} delay={140} travel={90} z={1} width={52} />
        <Page side="right" fill={`color-mix(in srgb, ${col("surfaceAlt")} 80%, ${col("surface")})`} seed={17} opening={opening} delay={140} travel={90} z={1} width={52} />
        <Page side="left" fill={label("left").fill} seed={5} opening={opening} delay={0} travel={104} z={2} />
        <Page side="right" fill={label("right").fill} seed={9} opening={opening} delay={0} travel={104} z={2} />
        <div
          className="absolute inset-0 z-[3] flex flex-col items-center justify-center px-6 text-center"
          style={{ opacity: opening ? 0 : 1, transition: "opacity 380ms ease" }}
        >
          <p className="text-[0.55rem] tracking-[0.3em] uppercase" style={{ color: col("muted") }}>
            Wij gaan trouwen
          </p>
          <div className="mt-3 flex flex-wrap items-baseline justify-center gap-x-2">
            <span className="text-[2.8rem] leading-[1.15]" style={script}>
              {config.partner1}
            </span>
            <span className="text-[1.3rem] italic" style={{ ...heading, color: col("accent") }}>
              &amp;
            </span>
            <span className="text-[2.8rem] leading-[1.15]" style={script}>
              {config.partner2}
            </span>
          </div>
          <div className="mt-7">
            <OpenHint opening={opening} />
          </div>
        </div>
      </div>
    </Root>
  );
}

// ---------- Overige thema's: deuren ----------

function Door({ side, opening }: { side: "left" | "right"; opening: boolean }) {
  const left = side === "left";
  const base = col("envelope");
  const line = `color-mix(in srgb, ${col("accent")} 70%, transparent)`;
  const panel: CSSProperties = {
    position: "absolute",
    left: left ? "11%" : "3.5%",
    right: left ? "3.5%" : "11%",
    border: `1px solid ${line}`,
    boxShadow: `inset 0 0 0 5px color-mix(in srgb, ${base} 92%, black), inset 0 2px 10px rgb(0 0 0 / .14)`,
    background: `linear-gradient(${left ? "100deg" : "260deg"}, color-mix(in srgb, ${base} 94%, white), color-mix(in srgb, ${base} 92%, black))`,
  };
  return (
    <div
      className="absolute top-0 h-full w-1/2"
      style={{
        [side]: 0,
        transformOrigin: left ? "0% 50%" : "100% 50%",
        transform: opening ? `rotateY(${left ? -96 : 96}deg)` : "rotateY(0deg)",
        transition: "transform 1250ms cubic-bezier(.62,0,.22,1)",
        background: `linear-gradient(${left ? "90deg" : "270deg"}, color-mix(in srgb, ${base} 88%, black), ${base} 40%, color-mix(in srgb, ${base} 94%, white))`,
        boxShadow: "inset 0 0 40px rgb(0 0 0 / .18)",
        backfaceVisibility: "hidden",
      }}
    >
      {/* Boogpaneel boven, twee vlakken eronder; samen vormen de deuren één boog. */}
      <div
        style={{
          ...panel,
          top: "6%",
          height: "50%",
          [left ? "borderTopLeftRadius" : "borderTopRightRadius"]: "100% 22%",
        }}
      />
      <div style={{ ...panel, top: "60%", height: "15%" }} />
      <div style={{ ...panel, top: "78%", height: "16%" }} />
      <span
        aria-hidden="true"
        className="absolute size-[1.15rem] rounded-full"
        style={{
          top: "56%",
          [left ? "right" : "left"]: "5%",
          background: `radial-gradient(circle at 35% 30%, color-mix(in srgb, ${col("accent")} 40%, white), ${col("accent")} 60%, color-mix(in srgb, ${col("accent")} 70%, black))`,
          boxShadow: "0 2px 5px rgb(0 0 0 / .35)",
        }}
      />
    </div>
  );
}

function DoorsReveal({ config, opening, onOpen }: RevealProps) {
  const short = monogram(config.partner1, config.partner2);
  return (
    <Root opening={opening} onOpen={onOpen}>
      <div className="absolute inset-0" style={{ perspective: "1400px", pointerEvents: "none" }}>
        <div
          className="absolute inset-0"
          style={{ opacity: opening ? 0 : 1, transition: `opacity 350ms ease ${opening ? "1200ms" : "0ms"}` }}
        >
          <Door side="left" opening={opening} />
          <Door side="right" opening={opening} />
        </div>
      </div>
      <div
        className="pointer-events-none absolute inset-x-0 z-[4] flex flex-col items-center"
        style={{ top: "30%", opacity: opening ? 0 : 1, transition: "opacity 300ms ease" }}
      >
        <span
          className="grid size-[4.4rem] place-items-center rounded-full text-[1.3rem] tracking-[0.08em]"
          style={{
            background: col("envelopeCard"),
            color: col("text"),
            boxShadow: `0 0 0 3px ${col("accent")}, 0 8px 20px -6px rgb(0 0 0 / .4)`,
            ...heading,
          }}
        >
          {short}
        </span>
        <p
          className="mt-4 px-4 py-1.5 text-[0.55rem] tracking-[0.28em] uppercase"
          style={{ background: col("envelopeCard"), color: col("text"), borderRadius: "var(--inv-radius)" }}
        >
          Wij gaan trouwen
        </p>
      </div>
      <div
        className="pointer-events-none absolute inset-x-0 z-[4] flex justify-center"
        style={{ bottom: "13%" }}
      >
        <OpenHint opening={opening} light />
      </div>
    </Root>
  );
}

// ---------- Modern: een grote foto die openklapt ----------

function PhotoReveal({ config, opening, onOpen }: RevealProps) {
  return (
    <Root opening={opening} onOpen={onOpen}>
      <div className="absolute inset-0" style={{ perspective: "1700px", pointerEvents: "none" }}>
        <div
          className="absolute inset-0"
          style={{
            transformOrigin: "0% 50%",
            transform: opening ? "rotateY(-104deg)" : "rotateY(0deg)",
            transition: "transform 1300ms cubic-bezier(.6,0,.2,1)",
            backfaceVisibility: "hidden",
            boxShadow: "0 0 40px rgb(0 0 0 / .25)",
            overflow: "hidden",
          }}
        >
          <AbstractCouple className="absolute inset-0 h-full w-full" />
          <div
            className="absolute inset-0"
            style={{ background: "linear-gradient(to top, rgb(0 0 0 / .55), rgb(0 0 0 / 0) 45%)" }}
          />
          <div
            className="absolute inset-x-0 bottom-0 flex flex-col items-center px-6 pb-14 text-center"
            style={{ color: "#fff", opacity: opening ? 0 : 1, transition: "opacity 300ms ease" }}
          >
            <p className="text-[0.6rem] tracking-[0.3em] uppercase opacity-85">Wij gaan trouwen</p>
            <div className="mt-2 flex flex-wrap items-baseline justify-center gap-x-2">
              <span className="text-[3rem] leading-[1.1]" style={script}>
                {config.partner1}
              </span>
              <span className="text-[1.4rem]" style={heading}>
                &amp;
              </span>
              <span className="text-[3rem] leading-[1.1]" style={script}>
                {config.partner2}
              </span>
            </div>
            <div className="mt-6">
              <OpenHint opening={opening} light />
            </div>
          </div>
        </div>
      </div>
    </Root>
  );
}
