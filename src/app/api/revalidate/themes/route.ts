import { revalidateTag } from "next/cache";
import { NextResponse, type NextRequest } from "next/server";
import { THEMES_TAG } from "@/lib/invitation/themes";

/**
 * Webhook voor Sanity: roep deze aan bij publiceren van een thema, zodat productie
 * direct de nieuwe versie toont. Zie sanity/README.md voor de instellingen.
 */
export async function POST(request: NextRequest) {
  const secret = process.env.SANITY_REVALIDATE_SECRET;
  if (!secret || request.headers.get("x-revalidate-secret") !== secret) {
    return NextResponse.json({ ok: false }, { status: 401 });
  }
  revalidateTag(THEMES_TAG);
  return NextResponse.json({ ok: true, revalidated: THEMES_TAG });
}
