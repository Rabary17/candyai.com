// Contrôle BLOQUANT avant chaque build (prebuild, donc aussi sur Vercel) :
//   1. aucun marqueur [À VÉRIFIER] (garde-fou date de coupure, cf. techno-play) ;
//   2. date postérieure à la coupure du modèle → `sources:` obligatoires ;
//   3. aucun terme interdit (explicite, mineurs, contournement) dans le blog ;
//   4. aucun lien interne vers une URL inexistante.
"use strict";
const fs = require("fs");
const path = require("path");
const matter = require("gray-matter");
const { auditer, CUTOFFS_OFFICIELS, MARQUEUR } = require("./garde-fou-cutoff");
const { estInterdit, pagesInternes } = require("../seo/config");

const MODELE = process.env.GENERATION_MODEL || "claude-sonnet-5-5";
const CUTOFF = CUTOFFS_OFFICIELS[MODELE];
const ROOT = path.join(__dirname, "..", "..");
const erreurs = [];

for (const lang of ["en", "fr"]) {
  const dir = path.join(ROOT, "content", "blog", lang);
  if (!fs.existsSync(dir)) continue;
  const internes = new Set([...pagesInternes(lang).map((p) => p.url), lang === "fr" ? "/fr/blog/" : "/blog/"]);
  const slugsBlog = new Set(fs.readdirSync(dir).filter((f) => f.endsWith(".md")).map((f) => `${lang === "fr" ? "/fr" : ""}/blog/${f.replace(/\.md$/, "")}/`));
  for (const f of fs.readdirSync(dir).filter((x) => x.endsWith(".md"))) {
    const { data, content } = matter(fs.readFileSync(path.join(dir, f), "utf8"));
    const id = `${lang}/${f}`;
    if (content.includes(MARQUEUR.slice(0, -1))) erreurs.push(`${id} — marqueur [À VÉRIFIER] non résolu`);
    if (estInterdit(`${data.title} ${content}`)) erreurs.push(`${id} — terme interdit (contenu explicite, mineurs ou contournement)`);
    for (const [, url] of content.matchAll(/\]\((\/[^)\s]*)\)/g)) if (!internes.has(url) && !slugsBlog.has(url)) erreurs.push(`${id} — lien interne inconnu : ${url}`);
    const aSources = Array.isArray(data.sources) ? data.sources.length > 0 : Boolean(data.sources);
    if (CUTOFF && !aSources) for (const v of auditer(content, { cutoff: CUTOFF }).violations.filter((x) => x.type === "date-posterieure")) erreurs.push(`${id} — « ${v.extrait} » ${v.raison}`);
  }
}
if (erreurs.length) {
  console.error(`\n✖ Contrôle contenu blog — publication bloquée :`);
  for (const e of erreurs) console.error(`  - ${e}`);
  process.exit(1);
}
console.log("✓ Contrôle contenu blog : rien de bloquant.");
