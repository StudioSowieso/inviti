"use client";

import { useEffect, useRef } from "react";

/**
 * Rustige muisvolger: een klein stipje dat bijna direct meebeweegt en een zachte ring die er net achteraan
 * zweeft. Boven klikbare dingen zwelt de ring op. Alleen met een echte muis en zonder "minder beweging";
 * de gewone cursor blijft zichtbaar, dus niets wordt onduidelijk.
 */
export function CursorFollow() {
  const ring = useRef<HTMLDivElement>(null);
  const dot = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fine = window.matchMedia("(hover: hover) and (pointer: fine)").matches;
    const calm = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const r = ring.current;
    const d = dot.current;
    if (!fine || calm || !r || !d) return;

    let tx = 0;
    let ty = 0;
    let rx = 0;
    let ry = 0;
    let scale = 1;
    let target = 1;
    let shown = false;
    let raf = 0;

    const onMove = (e: PointerEvent) => {
      tx = e.clientX;
      ty = e.clientY;
      if (!shown) {
        rx = tx;
        ry = ty;
        shown = true;
        r.style.opacity = "1";
        d.style.opacity = "1";
      }
      const el = e.target instanceof Element ? e.target : null;
      const hot = el?.closest("a, button, [role='button'], summary, [data-card]");
      const text = el?.closest("input, textarea, select");
      target = text ? 0.4 : hot ? 1.9 : 1;
      r.dataset.hot = hot && !text ? "1" : "0";
      d.style.transform = `translate3d(${tx}px, ${ty}px, 0) translate(-50%, -50%)`;
    };
    const onLeave = () => {
      shown = false;
      r.style.opacity = "0";
      d.style.opacity = "0";
    };

    const tick = () => {
      rx += (tx - rx) * 0.14;
      ry += (ty - ry) * 0.14;
      scale += (target - scale) * 0.16;
      r.style.transform = `translate3d(${rx}px, ${ry}px, 0) translate(-50%, -50%) scale(${scale})`;
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
        ref={ring}
        aria-hidden
        className="cursor-ring pointer-events-none fixed top-0 left-0 z-[70] size-9 rounded-full border border-clay/60 opacity-0 transition-[opacity,background-color,border-color] duration-300"
      />
      <div
        ref={dot}
        aria-hidden
        className="pointer-events-none fixed top-0 left-0 z-[70] size-1.5 rounded-full bg-clay opacity-0 transition-opacity duration-300"
      />
    </>
  );
}
