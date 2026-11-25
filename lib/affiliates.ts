// lib/affiliates.ts
// Source unique de vérité pour tous les liens affiliés.
// Les URL et identifiants viennent des variables d'environnement (Vercel), jamais du contenu.

export type ProgramId = "candy-ai" | "ourdream-ai" | "kupid-ai" | "nectar-ai" | "replika" | "crushon-ai" | "nomi-ai" | "secrets-ai" | "joi-ai";

type Program = {
  name: string;
  /** URL de base : lien direct (option A) ou lien réseau complet (option B). */
  url?: string;
  /** Option A : nom du paramètre d'identifiant affilié (ref, via, aff…) et sa valeur. */
  idParam?: string;
  idValue?: string;
  /** Nom du paramètre de sous-ID (aff_sub chez CrakRevenue, sub1 / subid ailleurs). */
  subParam?: string;
  /** Chemins de deep links pour un lien direct (ignorés pour un lien réseau). */
  deepLinks?: Record<string, string>;
  /** Code promo actif, affiché par <OffersBox>. */
  promoCode?: string;
  /** Page interne de repli si le programme n'est pas configuré. */
  fallback: { en: string; fr: string };
};

const env = (key: string) => {
  const v = process.env[key]?.trim();
  return v ? v : undefined;
};

export const PROGRAMS: Record<ProgramId, Program> = {
  "candy-ai": {
    name: "Candy AI",
    url: env("AFF_CANDY_AI_URL"),
    idParam: env("AFF_CANDY_AI_ID_PARAM"),
    idValue: env("AFF_CANDY_AI_ID"),
    subParam: env("AFF_CANDY_AI_SUB_PARAM") ?? "aff_sub",
    deepLinks: { pricing: "/pricing", signup: "/signup", create: "/create" }, // à vérifier sur le site officiel
    promoCode: env("AFF_CANDY_AI_PROMO"),
    fallback: { en: "/", fr: "/fr/" },
  },
  "ourdream-ai": {
    name: "OurDream AI",
    url: env("AFF_OURDREAM_AI_URL"),
    subParam: env("AFF_OURDREAM_AI_SUB_PARAM") ?? "aff_sub",
    fallback: { en: "/ourdream-ai/", fr: "/fr/ourdream-ai/" },
  },
  "kupid-ai": {
    name: "Kupid AI",
    url: env("AFF_KUPID_AI_URL"),
    subParam: env("AFF_KUPID_AI_SUB_PARAM") ?? "sub1",
    fallback: { en: "/alternatives/", fr: "/fr/alternatives/" },
  },
  "nectar-ai": {
    name: "Nectar AI",
    url: env("AFF_NECTAR_AI_URL"),
    subParam: env("AFF_NECTAR_AI_SUB_PARAM") ?? "sub1",
    fallback: { en: "/alternatives/", fr: "/fr/alternatives/" },
  },
  "crushon-ai": {
    name: "CrushOn AI",
    url: env("AFF_CRUSHON_AI_URL"),
    subParam: env("AFF_CRUSHON_AI_SUB_PARAM") ?? "sub1",
    fallback: { en: "/crushon-ai/", fr: "/fr/crushon-ai/" },
  },
  "nomi-ai": {
    name: "Nomi AI",
    url: env("AFF_NOMI_AI_URL"),
    subParam: env("AFF_NOMI_AI_SUB_PARAM") ?? "sub1",
    fallback: { en: "/nomi-ai/", fr: "/fr/compagnon-ia/" },
  },
  "secrets-ai": {
    name: "Secrets AI",
    url: env("AFF_SECRETS_AI_URL"),
    subParam: env("AFF_SECRETS_AI_SUB_PARAM") ?? "aff_sub",
    fallback: { en: "/ai-girlfriend/", fr: "/fr/petite-amie-ia/" },
  },
  "joi-ai": {
    name: "Joi AI",
    url: env("AFF_JOI_AI_URL"),
    subParam: env("AFF_JOI_AI_SUB_PARAM") ?? "aff_sub",
    fallback: { en: "/ai-roleplay/", fr: "/fr/ia-roleplay/" },
  },
  replika: {
    name: "Replika",
    url: env("AFF_REPLIKA_URL"),
    fallback: { en: "/ai-companion/replika-review/", fr: "/fr/compagnon-ia/replika-avis/" },
  },
};

export function isProgramId(v: string): v is ProgramId {
  return v in PROGRAMS;
}

/** Sous-ID lisible et court : en_candy-ai-pricing_price-cards (max 64 car., caractères sûrs). */
export function buildSubId(parts: { lang?: string; page?: string; placement?: string }) {
  return [parts.lang, parts.page, parts.placement]
    .filter(Boolean)
    .join("_")
    .toLowerCase()
    .replace(/[^a-z0-9_-]/g, "-")
    .slice(0, 64);
}

/**
 * Construit l'URL de destination finale.
 * Renvoie null si le programme n'est pas configuré (→ la route redirige vers la page de repli).
 */
export function buildAffiliateUrl(
  program: ProgramId,
  opts: { target?: string; subId?: string } = {}
): string | null {
  const p = PROGRAMS[program];
  if (!p.url) return null;

  const url = new URL(p.url);
  const isDirect = Boolean(p.idParam && p.idValue);

  // Deep link : seulement pour un lien direct (un lien réseau haché ne se modifie pas).
  if (isDirect && opts.target && p.deepLinks?.[opts.target]) {
    url.pathname = p.deepLinks[opts.target];
  }
  if (isDirect) url.searchParams.set(p.idParam!, p.idValue!);
  if (p.subParam && opts.subId) url.searchParams.set(p.subParam, opts.subId);

  return url.toString();
}
