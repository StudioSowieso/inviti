"use client";

import { useEffect, useRef, useState } from "react";

// Minimale typen voor Stripe.js, zodat we geen extra pakket nodig hebben.
type EmbeddedCheckoutInstance = { mount: (el: HTMLElement) => void; destroy: () => void };
type StripeInstance = {
  initEmbeddedCheckout: (opts: { fetchClientSecret: () => Promise<string> }) => Promise<EmbeddedCheckoutInstance>;
};
declare global {
  interface Window {
    Stripe?: (publishableKey: string) => StripeInstance;
  }
}

const STRIPE_JS = "https://js.stripe.com/v3/";

function loadStripeJs(): Promise<void> {
  if (window.Stripe) return Promise.resolve();
  return new Promise((resolve, reject) => {
    let script = document.querySelector<HTMLScriptElement>(`script[src="${STRIPE_JS}"]`);
    if (!script) {
      script = document.createElement("script");
      script.src = STRIPE_JS;
      script.async = true;
      document.head.appendChild(script);
    }
    script.addEventListener("load", () => resolve(), { once: true });
    script.addEventListener("error", () => reject(new Error("Stripe.js kon niet worden geladen")), { once: true });
  });
}

/** Toont het Stripe-betaalformulier op onze eigen pagina. */
export function EmbeddedCheckoutForm({ publishableKey, clientSecret }: { publishableKey: string; clientSecret: string }) {
  const container = useRef<HTMLDivElement>(null);
  const [ready, setReady] = useState(false);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    let cancelled = false;
    let checkout: EmbeddedCheckoutInstance | null = null;

    loadStripeJs()
      .then(async () => {
        if (cancelled || !window.Stripe || !container.current) return;
        const stripe = window.Stripe(publishableKey);
        const instance = await stripe.initEmbeddedCheckout({ fetchClientSecret: async () => clientSecret });
        if (cancelled) {
          instance.destroy();
          return;
        }
        checkout = instance;
        instance.mount(container.current);
        setReady(true);
      })
      .catch(() => {
        if (!cancelled) setFailed(true);
      });

    return () => {
      cancelled = true;
      checkout?.destroy();
    };
  }, [publishableKey, clientSecret]);

  if (failed) {
    return (
      <div className="rounded-2xl border border-line p-6 text-center text-sm text-muted">
        <p>Het betaalformulier kon niet worden geladen. Controleer je verbinding en probeer het opnieuw.</p>
        <a href="/afrekenen" className="btn-primary mt-4 inline-flex">Opnieuw proberen</a>
      </div>
    );
  }

  return (
    <div>
      {!ready && <p className="py-10 text-center text-sm text-muted">Betaalformulier laden…</p>}
      <div ref={container} />
    </div>
  );
}
