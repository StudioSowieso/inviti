import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";
import { SUPABASE_KEY, SUPABASE_URL } from "@/lib/supabase/config";

const PROTECTED = ["/dashboard", "/gasten", "/uitnodiging", "/todo", "/instellingen", "/versturen", "/admin", "/afrekenen", "/betaald", "/upgrade"];
const AUTH_PAGES = ["/inloggen", "/account-aanmaken"];

// Paden die ook tijdens "binnenkort online" gewoon moeten werken (betaalmeldingen, themavernieuwing,
// en de juridische pagina's die Stripe en bezoekers moeten kunnen lezen).
const COMING_SOON_OPEN = ["/binnenkort", "/api/stripe/webhook", "/api/revalidate", "/voorwaarden", "/privacy"];

export async function middleware(request: NextRequest) {
  // Staat COMING_SOON=1 (bijvoorbeeld alleen bij Production), dan toont elke pagina alleen de coming-soon-pagina.
  if (process.env.COMING_SOON === "1" && !COMING_SOON_OPEN.some((p) => request.nextUrl.pathname.startsWith(p))) {
    const url = request.nextUrl.clone();
    url.pathname = "/binnenkort";
    url.search = "";
    return NextResponse.rewrite(url);
  }

  let response = NextResponse.next({ request });

  const supabase = createServerClient(SUPABASE_URL, SUPABASE_KEY, {
    cookies: {
      getAll() {
        return request.cookies.getAll();
      },
      setAll(cookiesToSet) {
        cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value));
        response = NextResponse.next({ request });
        cookiesToSet.forEach(({ name, value, options }) =>
          response.cookies.set(name, value, options),
        );
      },
    },
  });

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const path = request.nextUrl.pathname;

  if (!user && PROTECTED.some((p) => path.startsWith(p))) {
    const url = request.nextUrl.clone();
    url.pathname = "/inloggen";
    url.search = "";
    return NextResponse.redirect(url);
  }

  // Ingelogde klanten mogen alle pagina's bekijken, ook de homepage. Alleen inlog- en aanmaakpagina's sturen door.
  if (user && AUTH_PAGES.some((p) => path.startsWith(p))) {
    const url = request.nextUrl.clone();
    url.pathname = "/dashboard";
    url.search = "";
    return NextResponse.redirect(url);
  }

  return response;
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)"],
};
