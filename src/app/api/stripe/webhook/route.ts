import { NextResponse } from "next/server";
import { fulfilSession } from "@/lib/billing";
import { logError } from "@/lib/log-error";
import { verifyWebhook, type StripeSession } from "@/lib/stripe";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/** Stripe meldt hier een geslaagde betaling, ook als de klant zijn tabblad al had gesloten. */
export async function POST(request: Request) {
  const secret = process.env.STRIPE_WEBHOOK_SECRET;
  if (!secret) return NextResponse.json({ error: "webhook niet ingesteld" }, { status: 503 });

  const payload = await request.text();
  if (!verifyWebhook(payload, request.headers.get("stripe-signature"), secret)) {
    return NextResponse.json({ error: "ongeldige handtekening" }, { status: 400 });
  }

  let event: { type: string; data: { object: StripeSession } };
  try {
    event = JSON.parse(payload);
  } catch {
    return NextResponse.json({ error: "ongeldige invoer" }, { status: 400 });
  }

  if (event.type === "checkout.session.completed" || event.type === "checkout.session.async_payment_succeeded") {
    const result = await fulfilSession(event.data.object);
    if (!result.ok && result.reason !== "niet betaald") {
      await logError("stripe-webhook", `Betaling niet verwerkt: ${result.reason}`, {
        detail: { session: event.data.object.id },
      });
      return NextResponse.json({ error: "niet verwerkt" }, { status: 500 }); // Stripe probeert het opnieuw
    }
  }
  return NextResponse.json({ received: true });
}
