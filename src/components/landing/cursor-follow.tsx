"use client";

import { useEffect, useRef } from "react";

const STAR = "M12 0c.6 6.4 5.6 11.4 12 12-6.4.6-11.4 5.6-12 12-.6-6.4-5.6-11.4-12-12C6.4 11.4 11.4 6.4 12 0Z";

/**
 * Rustige muisvolger met dezelfde sterretjes als in het logo: een roze ster volgt de muis licht vertraagd en
 * draait zacht mee met de beweging, een kleiner sterretje zweeft er nog iets achteraan. Boven klikbare dingen
 * wordt de ster groter. Alleen met een echte muis en zonder "minder beweging"; de gewone cursor blijft zichtbaar.
 */
export function CursorFollow() {
  const big = useRef<HTMLDivElement>(null);
  const small = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fine = window.matchMedia("(hover: hover) and (pointer: fine)").matches;
    const calm = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const a = big.current;
    const b = small.current;
    if (!fine || calm || !a || !b) return;

    let tx = 0;
    let ty = 0;
    let ax = 0;
    let ay = 0;
    let bx = 0;
    let by = 0;
    let rot = 0;
    let scale = 1;
    let target = 1;
    let shown = false;
    let raf = 0;

    const onMove = (e: PointerEvent) => {
      tx = e.clientX;
      ty = e.clientY;
      if (!shown) {
        ax = bx = tx;
        ay = by = ty;
        shown = true;
        a.style.opacity = "1";
        b.style.opacity = "0.7";
      }
      const el = e.target instanceof Element ? e.target : null;
      const text = el?.closest("input, textarea, select");
      const hot = el?.closest("a, button, [role='button'], summary, [data-card]");
      target = text ? 0.4 : hot ? 1.8 : 1;
    };
    const onLeave = () => {
      shown = false;
      a.style.opacity = "0";
      b.style.opacity = "0";
    };

    const tick = () => {
      const px = ax;
      ax += (tx - ax) * 0.2;
      ay += (ty - ay) * 0.2;
      bx += (tx - bx) * 0.08;
      by += (ty - by) * 0.08;
      scale += (target - scale) * 0.14;
      // draait mee met de horizontale snelheid, en zakt rustig terug
      rot += ((ax - px) * 2.2 - rot * 0.06);
      a.style.transform = `translate3d(${ax}px, ${ay}px, 0) translate(-50%, -50%) rotate(${rot}deg) scale(${scale})`;
      b.style.transform = `translate3d(${bx + 14}px, ${by + 12}px, 0) translate(-50%, -50%) rotate(${-rot * 0.7}deg)`;
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);

    window.addEventListener("pointermove", onMove, { passive: true });
    document.documentElement.addEventListener("mouseleave", onLeave);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("pointermove", onMove);
      document.documentElement.removeEventListener("mouseleave", onLeave);
    };
  }, []);

  return (
    <>
      <div
        ref={big}
        aria-hidden
        className="pointer-events-none fixed top-0 left-0 z-[70] text-clay opacity-0 transition-opacity duration-300"
      >
        <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor">
          <path d={STAR} />
        </svg>
      </div>
      <div
        ref={small}
        aria-hidden
        className="pointer-events-none fixed top-0 left-0 z-[70] text-forest opacity-0 transition-opacity duration-300"
      >
        <svg width="10" height="10" viewBox="0 0 24 24" fill="currentColor">
          <path d={STAR} />
        </svg>
      </div>
    </>
  );
}
