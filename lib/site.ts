export type Lang = "en" | "fr";

/** Hôte canonique final (sans slash). À définir dans Vercel : SITE_URL=https://www.<domaine> */
export const SITE_URL = (process.env.SITE_URL || "https://example.com").replace(/\/$/, "");
export const SITE_NAME = "nocturne";

/** Pages qui contiennent encore des <Todo> : noindex tant que TODO_POLICY !== "allow". */
export const TODO_POLICY = process.env.TODO_POLICY === "allow" ? "allow" : "noindex";

export const T = {
  en: {
    tagline: "AI COMPANIONS · TESTED",
    nav: [
      { href: "/candy-ai/", label: "Candy AI Guide" },
      { href: "/alternatives/", label: "Alternatives" },
      { href: "/ai-girlfriend/", label: "AI Girlfriend" },
      { href: "/ai-companion/", label: "AI Companion" },
    ],
    cta: "Try Candy AI",
    disclosure: "We may earn a commission if you subscribe through our links. It never changes our score.",
    disclosureLink: { href: "/affiliate-disclosure/", label: "Learn more" },
    gateTitle: "Adults only",
    gateText: "This guide covers AI companion apps for people aged 18 and over. We never publish explicit images.",
    gateOk: "I'm 18 or older",
    gateLeave: "Leave",
    home: "Home",
    by: "By",
    lastChecked: "Last checked",
    tldr: "TL;DR",
    faq: "Frequently asked questions",
    readNext: "Read next",
    read: "Read →",
    score: "OUR SCORE",
    bestFor: "Best for",
    skipIf: "Skip it if",
    sticky: "Candy AI · from ~$3.99/mo",
    footerNote: "Independent site, not affiliated with EverAI Limited.",
    footer: [
      { title: "Candy AI Guide", links: [["/candy-ai/pricing/", "Pricing"], ["/candy-ai/free/", "Is it free?"], ["/candy-ai/is-it-safe/", "Is it safe?"], ["/candy-ai/cancel-subscription/", "Cancel"]] },
      { title: "Alternatives", links: [["/alternatives/", "Candy AI alternatives"], ["/alternatives/free/", "Free alternatives"], ["/alternatives/candy-ai-vs-replika/", "Candy AI vs Replika"]] },
      { title: "AI Girlfriend", links: [["/ai-girlfriend/", "Best AI girlfriend apps"], ["/ai-girlfriend/free/", "Free AI girlfriend"], ["/ai-companion/", "AI companion apps"]] },
      { title: "About", links: [["/about/", "About us"], ["/how-we-test/", "How we test"], ["/affiliate-disclosure/", "Affiliate disclosure"], ["/legal/", "Legal"], ["/privacy/", "Privacy"], ["/contact/", "Contact"]] },
    ],
    notFound: "Page not found",
  },
  fr: {
    tagline: "COMPAGNONS IA · TESTÉS",
    nav: [
      { href: "/fr/candy-ai/", label: "Guide Candy AI" },
      { href: "/fr/alternatives/", label: "Alternatives" },
      { href: "/fr/petite-amie-ia/", label: "Petite amie IA" },
      { href: "/fr/compagnon-ia/", label: "Compagnon IA" },
    ],
    cta: "Essayer Candy AI",
    disclosure: "Nous pouvons toucher une commission si vous vous abonnez via nos liens. Elle ne modifie jamais notre note.",
    disclosureLink: { href: "/fr/affiliation/", label: "En savoir plus" },
    gateTitle: "Réservé aux adultes",
    gateText: "Ce guide traite d'applications de compagnons IA pour les personnes de 18 ans et plus. Nous ne publions jamais d'image explicite.",
    gateOk: "J'ai 18 ans ou plus",
    gateLeave: "Quitter",
    home: "Accueil",
    by: "Par",
    lastChecked: "Vérifié le",
    tldr: "L'essentiel",
    faq: "Questions fréquentes",
    readNext: "À lire aussi",
    read: "Lire →",
    score: "NOTRE NOTE",
    bestFor: "Pour qui",
    skipIf: "À éviter si",
    sticky: "Candy AI · dès ~3,99 $/mois",
    footerNote: "Site indépendant, non affilié à EverAI Limited.",
    footer: [
      { title: "Guide Candy AI", links: [["/fr/candy-ai/prix/", "Prix"], ["/fr/candy-ai/gratuit/", "Gratuit ?"], ["/fr/candy-ai/fiable/", "Fiable ?"], ["/fr/candy-ai/resilier/", "Résilier"]] },
      { title: "Alternatives", links: [["/fr/alternatives/", "Alternatives à Candy AI"], ["/fr/alternatives/gratuites/", "Alternatives gratuites"], ["/fr/alternatives/candy-ai-vs-replika/", "Candy AI ou Replika"]] },
      { title: "Petite amie IA", links: [["/fr/petite-amie-ia/", "Meilleures applis"], ["/fr/petite-amie-ia/gratuite/", "Petite amie IA gratuite"], ["/fr/compagnon-ia/", "Compagnon IA"]] },
      { title: "À propos", links: [["/fr/a-propos/", "Qui sommes-nous"], ["/fr/methode-de-test/", "Méthode de test"], ["/fr/affiliation/", "Affiliation"], ["/fr/mentions-legales/", "Mentions légales"], ["/fr/confidentialite/", "Confidentialité"], ["/fr/contact/", "Contact"]] },
    ],
    notFound: "Page introuvable",
  },
} as const;
