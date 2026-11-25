// Configuration de l'autopilote blog — candyai.com (EN racine + FR /fr/).
// Équivalent des constantes de techno-play (graines par thème, synonymes d'image),
// adapté à une niche adulte : AUCUN sujet explicite, AUCUN sujet lié aux mineurs.
"use strict";
const fs = require("fs");
const path = require("path");
const matter = require("gray-matter");

const ROOT = path.join(__dirname, "..", "..");

const LANGS = {
  en: {
    locationCode: 2840, // États-Unis
    languageCode: "en",
    // Graines par thème : DataForSEO renvoie les variantes réelles et leur volume.
    graines: {
      "ai-girlfriend": ["ai girlfriend", "virtual girlfriend", "ai girlfriend app"],
      "ai-companion": ["ai companion", "ai chatbot friend", "ai character chat"],
      "candy-ai": ["candy ai", "candy ai tokens", "candy ai features"],
      "ai-safety": ["ai chatbot privacy", "ai companion safety", "ai relationship"],
    },
    images: {
      "ai-girlfriend": ["person texting at night", "smartphone chat app", "neon heart"],
      "ai-companion": ["person using smartphone", "chatbot conversation phone", "headphones smartphone"],
      "candy-ai": ["smartphone screen dark", "mobile app subscription", "phone in hand night"],
      "ai-safety": ["padlock smartphone", "data privacy phone", "online security laptop"],
    },
  },
  fr: {
    locationCode: 2250, // France
    languageCode: "fr",
    graines: {
      "ai-girlfriend": ["petite amie ia", "copine virtuelle", "application petite amie virtuelle"],
      "ai-companion": ["compagnon ia", "chatbot ami", "ia conversation"],
      "candy-ai": ["candy ai", "candy ia"],
      "ai-safety": ["ia vie privée", "chatbot données personnelles", "relation avec une ia"],
    },
    images: {
      "ai-girlfriend": ["person texting at night", "smartphone chat app", "neon heart"],
      "ai-companion": ["person using smartphone", "chatbot conversation phone", "headphones smartphone"],
      "candy-ai": ["smartphone screen dark", "mobile app subscription", "phone in hand night"],
      "ai-safety": ["padlock smartphone", "data privacy phone", "online security laptop"],
    },
  },
};

// Sujets interdits (filtre dur, sélection ET contrôle avant build) :
// contenu sexuel explicite, mineurs, contournement de règles, piratage.
const TERMES_INTERDITS = [
  /\bporn/i, /\bxxx\b/i, /\bnsfw\b/i, /\bnude/i, /\bnaked/i, /\bsex/i, /\bhentai\b/i, /\berotic/i, /\bnu(e|es|s)?\b/i, /\bporno/i, /\bsexe/i,
  /\bteen/i, /\bkid/i, /\bchild/i, /\bminor/i, /\bschool/i, /\bloli/i, /\bschoolgirl/i, /\bado(lescent)?s?\b/i, /\benfant/i, /\bmineur/i, /\bcollège/i, /\blycée/i,
  /\bmod apk\b/i, /\bcrack/i, /\bjailbreak/i, /\bbypass/i, /\bhack/i, /\bfree tokens? generator/i, /\bdeepfake/i, /\bundress/i,
  /\bhot\b/i, /\bsexy\b/i, /\bspicy\b/i, /\bdirty\b/i, /\buncensored\b/i, /\bsans censure\b/i, /\bcoquin/i, /\bchaud(e)?\b/i,
];
const estInterdit = (s) => TERMES_INTERDITS.some((re) => re.test(s));

// Mots-clés déjà ciblés par les pages du site (anti-cannibalisation) + articles existants.
function motsClesCouverts(lang) {
  const pages = JSON.parse(fs.readFileSync(path.join(ROOT, "data", "mots-cles-pages.json"), "utf8"))[lang] || [];
  const dir = path.join(ROOT, "content", "blog", lang);
  const articles = fs.existsSync(dir)
    ? fs.readdirSync(dir).filter((f) => f.endsWith(".md")).map((f) => {
        const { data } = matter(fs.readFileSync(path.join(dir, f), "utf8"));
        return [data.keyword, data.title].filter(Boolean).join(" ");
      })
    : [];
  return [...pages, ...articles].map((s) => s.toLowerCase());
}

// Pages du site que l'article peut citer en lien interne (maillage vers les pages money/piliers).
function pagesInternes(lang) {
  const base = path.join(ROOT, "content", lang);
  const out = [];
  const walk = (d) => {
    for (const e of fs.readdirSync(d, { withFileTypes: true })) {
      const p = path.join(d, e.name);
      if (e.isDirectory()) walk(p);
      else if (e.name.endsWith(".mdx")) {
        const { data } = matter(fs.readFileSync(p, "utf8"));
        if (!["home", "pillar", "money", "support"].includes(data.template)) continue;
        let rel = path.relative(base, p).replace(/\.mdx$/, "").split(path.sep);
        if (rel[rel.length - 1] === "index") rel.pop();
        const url = (lang === "fr" ? "/fr" : "") + "/" + (rel.length ? rel.join("/") + "/" : "");
        out.push({ url, titre: data.h1 });
      }
    }
  };
  walk(base);
  return out;
}

module.exports = { ROOT, LANGS, estInterdit, motsClesCouverts, pagesInternes };
