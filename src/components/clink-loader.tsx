"use client";

import { useLayoutEffect, useRef } from "react";
import { ClinkMark } from "./brand-logo";

/**
 * Laadanimatie: de twee glazen uit het logo klinken tegen elkaar. Speelt één keer per sessie per onderdeel
 * (`name`), dus niet bij elke pagina. De animatie is puur CSS en ruimt zichzelf op; zonder JavaScript
 * verdwijnt hij ook vanzelf.
 */
export function ClinkLoader({ name }: { name: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const key = `pm-loader-${name}`;

  // Bij navigatie binnen de app (geen volledige paginalading) voorkomt dit dat hij opnieuw verschijnt
  useLayoutEffect(() => {
    try {
      if (sessionStorage.getItem(key)) {
        if (ref.current) ref.current.style.display = "none";
      } else {
        sessionStorage.setItem(key, "1");
      }
    } catch {}
  }, [key]);

  return (
    <>
      <div ref={ref} id={`clink-${name}`} aria-hidden suppressHydrationWarning className="clink-overlay">
        <div className="clink-stage">
          <ClinkMark className="clink-mark" />
        </div>
      </div>
      {/* Vóór de eerste paint: bij een herlaad in dezelfde sessie niet opnieuw tonen */}
      <script
        dangerouslySetInnerHTML={{
          __html: `try{var e=document.getElementById("clink-${name}");if(e&&sessionStorage.getItem("${key}"))e.style.display="none"}catch(_){}`,
        }}
      />
    </>
  );
}

/** Wist de markering, zodat de animatie weer speelt na (opnieuw) inloggen. */
export function ResetClinkLoader({ name }: { name: string }) {
  useLayoutEffect(() => {
    try {
      sessionStorage.removeItem(`pm-loader-${name}`);
    } catch {}
  }, [name]);
  return null;
}
