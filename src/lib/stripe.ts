import { createHmac, timingSafeEqual } from "node:crypto";

/** Eenmalige aankoop van de volledige versie, in eurocenten. */
export const PRICE_CENTS = 9900;
export const PRICE_LABEL = "€99";

const API = "https://api.stripe.com/v1";

/**
 * Is betalen veilig beschikbaar? We vragen alleen geld als we de betaling ook kunnen verwerken
 * (service role) en nooit met een testsleutel op productie of een livesleutel op preview.
 */
export function billingAvailable(): boolean {
  const key = process.env.STRIPE_SECRET_KEY;
  if (!key || !process.env.SUPABASE_SERVICE_ROLE_KEY) return false;
  const isProd = process.env.VERCEL_ENV === "production";
  if (isProd && key.startsWith("sk_test")) return false;
  if (!isProd && key.startsWith("sk_live")) return false;
  return true;
}

export type StripeSession = {
  id: string;
  url: string | null;
  status: string | null;
  payment_status: string;
  mode: string;
  amount_total: number | null;
  currency: string | null;
  client_reference_id: string | null;
  payment_intent: string | null;
  livemode: boolean;
};

async function stripe<T>(path: string, init?: { method?: string; body?: URLSearchParams }): Promise<T> {
  const res = await fetch(`${API}${path}`, {
    method: init?.method ?? "GET",
    headers: {
      Authorization: `Bearer ${process.env.STRIPE_SECRET_KEY}`,
      ...(init?.body ? { "Content-Type": "application/x-www-form-urlencoded" } : {}),
    },
    body: init?.body,
    cache: "no-store",
  });
  const json = (await res.json()) as T & { error?: { message?: string } };
  if (!res.ok) throw new Error(json.error?.message ?? `Stripe-fout ${res.status}`);
  return json;
}

export async function createCheckoutSession(opts: { userId: string; email: string | null; origin: string }) {
  const p = new URLSearchParams();
  p.set("mode", "payment");
  p.set("client_reference_id", opts.userId);
  if (opts.email) p.set("customer_email", opts.email);
  p.set("locale", "nl");
  p.set("line_items[0][quantity]", "1");
  p.set("line_items[0][price_data][currency]", "eur");
  p.set("line_items[0][price_data][unit_amount]", String(PRICE_CENTS));
  p.set("line_items[0][price_data][product_data][name]", "Inviti — volledige versie");
  p.set(
    "line_items[0][price_data][product_data][description]",
    "Eenmalig. Verstuur de persoonlijke uitnodiging aan al je gasten.",
  );
  p.set("metadata[user_id]", opts.userId);
  p.set("payment_intent_data[metadata][user_id]", opts.userId);
  p.set("success_url", `${opts.origin}/betaald?session_id={CHECKOUT_SESSION_ID}`);
  p.set("cancel_url", `${opts.origin}/upgrade`);
  return stripe<StripeSession>("/checkout/sessions", { method: "POST", body: p });
}

export function retrieveSession(id: string) {
  return stripe<StripeSession>(`/checkout/sessions/${encodeURIComponent(id)}`);
}

/** Controleert de Stripe-Signature van een webhook (HMAC-SHA256, met 5 minuten tolerantie). */
export function verifyWebhook(payload: string, header: string | null, secret: string): boolean {
  if (!header) return false;
  const parts = header.split(",").map((s) => s.trim().split("="));
  const t = parts.find(([k]) => k === "t")?.[1];
  const sigs = parts.filter(([k]) => k === "v1").map(([, v]) => v);
  if (!t || sigs.length === 0) return false;
  if (Math.abs(Date.now() / 1000 - Number(t)) > 300) return false;
  const expected = createHmac("sha256", secret).update(`${t}.${payload}`).digest();
  return sigs.some((s) => {
    const got = Buffer.from(s, "hex");
    return got.length === expected.length && timingSafeEqual(got, expected);
  });
}
