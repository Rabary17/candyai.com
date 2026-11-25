// Sélection des sujets SEO du jour (volumes réels DataForSEO), par langue.
// Exclut : têtes de gondole, mots-clés déjà ciblés par une page ou un article
// (cannibalisation), sujets interdits (voir config.js).
// Usage : node scripts/seo/select-keyword-topics.js --lang en --n 3
"use strict";
const { keywordsForKeywords } = require("./dataforseo-client");
const { LANGS, estInterdit, motsClesCouverts } = require("./config");

const VOLUME_MIN = { en: 100, fr: 30 };
const VOLUME_MAX = 15000;
const estLongueTraine = (k) => k.trim().split(/\s+/).length >= 3;

// Le mot-clé doit parler du sujet du site (évite « john candy… », « candy crush »…).
const PERTINENT = {
  en: /\b(companion|girlfriend|boyfriend|candy ai|character ai|ai character|roleplay|role play|replika|ourdream|crushon|nomi ai|janitor ai|talkie|polybuzz|virtual (partner|wife|husband))\b/i,
  fr: /\b(compagn(on|e) (ia|virtuel(le)?)|copine (ia|virtuelle)|petite amie|petit ami|petit copain|candy ai|candy ia|personnages? ia|roleplay|jeu de r[ôo]le|character ai|replika|ourdream|crushon)\b/i,
};
// Forme canonique pour comparer les variantes (« talking » = « talk », « artificial intelligence » = « ai »).
const VIDES = new Set(["to", "with", "a", "an", "the", "for", "de", "la", "le", "les", "avec", "une", "un", "pour", "en"]);
const canon = (k) => k.toLowerCase().replace(/artificial intelligence|intelligence artificielle/g, "ai").replace(/\b(\w{3,}?)(ing|s)\b/g, "$1").replace(/\bgf\b/g, "girlfriend").replace(/\bbf\b/g, "boyfriend").replace(/\btalk\b/g, "chat").replace(/\bdiscuter\b/g, "discussion").split(/\s+/).filter((w) => !VIDES.has(w)).sort().join(" ");

function dejaCouvert(motCle, couverts) {
  const mc = canon(motCle);
  if (couverts.some((c) => canon(c) === mc)) return true;
  // Tous les mots du candidat déjà présents dans un mot-clé ciblé → même intention (cannibalisation).
  const mots = mc.split(" ");
  if (mots.length >= 2 && couverts.some((c) => { const cc = new Set(canon(c).split(" ")); return mots.every((w) => cc.has(w)); })) return true;
  return couverts.some((c) => c.toLowerCase().includes(motCle.toLowerCase()) || (motCle.toLowerCase().includes(c) && c.split(" ").length >= 3));
}

async function selectionnerSujetsSeo({ lang = "en", n = 2 } = {}) {
  const cfg = LANGS[lang];
  const couverts = motsClesCouverts(lang);
  const candidats = [];
  for (const [theme, graines] of Object.entries(cfg.graines)) {
    try {
      const res = await keywordsForKeywords(graines, { locationCode: cfg.locationCode, languageCode: cfg.languageCode, limit: 100 });
      for (const r of res) {
        const v = r.search_volume || 0;
        if (v < VOLUME_MIN[lang] || v > VOLUME_MAX) continue;
        if (!estLongueTraine(r.keyword) || !PERTINENT[lang].test(r.keyword) || estInterdit(r.keyword) || dejaCouvert(r.keyword, couverts)) continue;
        candidats.push({ lang, theme, keyword: r.keyword, volume: v, cpc: r.cpc, competition: r.competition });
      }
    } catch (err) {
      console.error(`DataForSEO (${lang}/${theme}) : ${err.message}`);
    }
  }
  // Dédoublonnage (variantes proches) puis 1 sujet par thème d'abord, comme techno-play.
  const vus = new Set();
  const uniques = candidats.sort((a, b) => b.volume - a.volume).filter((c) => {
    const cle = canon(c.keyword);
    if (vus.has(cle)) return false;
    vus.add(cle);
    return true;
  });
  const selection = [];
  const themes = new Set();
  for (const s of uniques) if (selection.length < n && !themes.has(s.theme)) { themes.add(s.theme); selection.push(s); }
  for (const s of uniques) if (selection.length < n && !selection.includes(s)) selection.push(s);
  return selection;
}

module.exports = { selectionnerSujetsSeo };

if (require.main === module) {
  const a = process.argv.slice(2);
  const lang = a.includes("--lang") ? a[a.indexOf("--lang") + 1] : "en";
  const n = a.includes("--n") ? Number(a[a.indexOf("--n") + 1]) : 3;
  selectionnerSujetsSeo({ lang, n }).then((s) => s.forEach((x) => console.log(`- [${x.lang}/${x.theme}] "${x.keyword}" ${x.volume}/mois`))).catch((e) => { console.error(e.message); process.exit(1); });
}
