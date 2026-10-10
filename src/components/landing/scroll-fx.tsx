"use client";

import { useEffect } from "react";
import { gsap, ScrollTrigger, SplitText } from "./gsap";

/**
 * Rustige scrollanimaties voor de secties onder de hero. Elementen sturen we aan met data-attributen:
 * data-reveal, data-card, data-words, data-split, data-line, data-parallax, data-marquee, data-arch.
 */
export function ScrollFx() {
  useEffect(() => {
    const mm = gsap.matchMedia();

    mm.add("(prefers-reduced-motion: no-preference)", () => {
      const all = <T extends HTMLElement>(sel: string) => gsap.utils.toArray<T>(sel);

      // Zacht omhoog schuiven
      all("[data-reveal]").forEach((el) => {
        gsap.from(el, {
          y: 36,
          autoAlpha: 0,
          duration: 1.1,
          ease: "power3.out",
          delay: Number(el.dataset.reveal) || 0,
          scrollTrigger: { trigger: el, start: "top 88%", once: true },
        });
      });

      // Thema's schuiven vanzelf zijwaarts terwijl je naar beneden scrolt
      all("[data-hscroll]").forEach((box) => {
        const track = box.querySelector<HTMLElement>("[data-hscroll-track]");
        if (!track) return;
        gsap.set(box, { overflowX: "hidden" });
        const dist = () => Math.max(0, track.scrollWidth - box.clientWidth);
        gsap.to(track, {
          x: () => -dist(),
          ease: "none",
          scrollTrigger: {
            trigger: box,
            start: "top 14%",
            end: () => `+=${dist()}`,
            pin: true,
            scrub: 0.6,
            anticipatePin: 1,
            invalidateOnRefresh: true,
          },
        });
      });

      // Kaarten verschijnen in groepjes
      const cards = all("[data-card]");
      if (cards.length) {
        gsap.set(cards, { autoAlpha: 0, y: 44 });
        ScrollTrigger.batch(cards, {
          start: "top 90%",
          once: true,
          onEnter: (batch) => gsap.to(batch, { autoAlpha: 1, y: 0, stagger: 0.12, duration: 1, ease: "power3.out" }),
        });
      }

      // Tekst kleurt woord voor woord in terwijl je scrollt
      all("[data-words]").forEach((el) => {
        const split = SplitText.create(el, { type: "words" });
        gsap.fromTo(
          split.words,
          { opacity: 0.16 },
          {
            opacity: 1,
            stagger: 0.12,
            ease: "none",
            scrollTrigger: { trigger: el, start: "top 82%", end: "bottom 55%", scrub: true },
          },
        );
      });

      // Koppen komen regel voor regel omhoog uit een masker
      all("[data-split]").forEach((el) => {
        SplitText.create(el, {
          type: "lines",
          mask: "lines",
          autoSplit: true,
          onSplit: (self) =>
            gsap.from(self.lines, {
              yPercent: 105,
              duration: 1.15,
              stagger: 0.1,
              ease: "power4.out",
              scrollTrigger: { trigger: el, start: "top 86%", once: true },
            }),
        });
      });

      // Tijdlijn die zich tekent
      all("[data-line]").forEach((line) => {
        gsap.fromTo(
          line,
          { scaleY: 0 },
          {
            scaleY: 1,
            ease: "none",
            transformOrigin: "top",
            scrollTrigger: { trigger: line.parentElement, start: "top 70%", end: "bottom 70%", scrub: true },
          },
        );
      });

      // Zachte parallax
      all("[data-parallax]").forEach((el) => {
        const d = Number(el.dataset.parallax) || 0.15;
        gsap.fromTo(
          el,
          { yPercent: -d * 100 },
          { yPercent: d * 100, ease: "none", scrollTrigger: { trigger: el.parentElement, start: "top bottom", end: "bottom top", scrub: true } },
        );
      });

      // Lopende band met thema's
      all("[data-marquee]").forEach((el) => {
        gsap.to(el, { xPercent: -50, duration: 45, ease: "none", repeat: -1 });
      });

      // Boogvenster dat opengaat tot de slotsectie
      all("[data-arch]").forEach((el) => {
        const inner = el.querySelector("[data-arch-content]");
        gsap.fromTo(
          el,
          { clipPath: "inset(16% 20% 0% 20% round 999px 999px 0px 0px)" },
          {
            clipPath: "inset(0% 0% 0% 0% round 0px 0px 0px 0px)",
            ease: "none",
            scrollTrigger: { trigger: el, start: "top 95%", end: "top 20%", scrub: true },
          },
        );
        if (inner) {
          gsap.from(inner, {
            y: 50,
            autoAlpha: 0,
            duration: 1.1,
            ease: "power3.out",
            scrollTrigger: { trigger: el, start: "top 40%", once: true },
          });
        }
      });

      requestAnimationFrame(() => ScrollTrigger.refresh());
    });

    return () => mm.revert();
  }, []);

  return null;
}
