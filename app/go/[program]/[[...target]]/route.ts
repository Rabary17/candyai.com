// app/go/[program]/[[...target]]/route.ts
// /go/candy-ai/            → lien affilié principal
// /go/candy-ai/pricing/    → deep link "pricing" si le programme le permet
// Query : ?p=<page>&pl=<emplacement>&l=<en|fr>  → transformés en sous-ID

import { NextRequest, NextResponse } from "next/server";
import { PROGRAMS, buildAffiliateUrl, buildSubId, isProgramId } from "@/lib/affiliates";

export const dynamic = "force-dynamic"; // les variables d'env sont lues à chaque requête

const HEADERS = {
  "X-Robots-Tag": "noindex, nofollow",
  "Cache-Control": "no-store",
  "Referrer-Policy": "no-referrer-when-downgrade",
};

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ program: string; target?: string[] }> }
) {
  const { program, target } = await params;
  const sp = req.nextUrl.searchParams;
  const lang = sp.get("l") === "fr" ? "fr" : "en";

  if (!isProgramId(program)) {
    return NextResponse.redirect(new URL(lang === "fr" ? "/fr/" : "/", req.url), { status: 302, headers: HEADERS });
  }

  const subId = buildSubId({ lang, page: sp.get("p") ?? undefined, placement: sp.get("pl") ?? undefined });
  const dest = buildAffiliateUrl(program, { target: target?.[0], subId });

  // Journal de clic minimal (visible dans les logs Vercel). Remplaçable par Vercel Analytics / une base.
  console.log(JSON.stringify({ evt: "aff_click", program, target: target?.[0] ?? null, subId, ok: Boolean(dest) }));

  if (!dest) {
    // Programme non configuré : on renvoie vers notre page d'avis plutôt qu'un lien cassé.
    return NextResponse.redirect(new URL(PROGRAMS[program].fallback[lang], req.url), { status: 302, headers: HEADERS });
  }
  return NextResponse.redirect(dest, { status: 302, headers: HEADERS });
}
