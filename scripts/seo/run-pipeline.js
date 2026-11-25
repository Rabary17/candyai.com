#!/usr/bin/env node
// Autopilote du blog candyai.com — même chaîne que techno-play.com :
// sélection des sujets (DataForSEO) → premier jet sous garde-fou « date de coupure »
// → relecture qualité (forme uniquement) → image libre de droit → contrôles →
// commit (+ push) → déploiement Vercel par l'intégration Git.
//
// Usage : node scripts/seo/run-pipeline.js --en 1 --fr 1 [--dry-run] [--push]
"use strict";
const fs = require("fs");
const path = require("path");
const { execSync } = require("child_process");
require("dotenv").config({ path: path.join(__dirname, "..", "..", ".env.local") });

const { generer, appelBrut, MODELE_PAR_DEFAUT } = require("../generation/llm");
const { reinitialiser: reinitialiserUsage, resumer: resumerUsage } = require("../generation/usage-tracker");
const { choisirParmi, entier } = require("../generation/variation");
const { voixPour } = require("../generation/voix");
const { selectionnerSujetsSeo } = require("./select-keyword-topics");
const { findImage } = require("./image-client");
const { ROOT, LANGS, estInterdit, pagesInternes } = require("./config");

const PRIX = JSON.parse(fs.readFileSync(path.join(ROOT, "data", "prices.json"), "utf8"));
const RAPPORTS_DIR = path.join(ROOT, "_strategie", "rapports-pipeline");
const dirBlog = (lang) => path.join(ROOT, "content", "blog", lang);

const slugify = (s) => s.toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "").replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "").slice(0, 80);

// Variation structurelle (anti « contenu produit en série »), comme techno-play.
function tirerVariation(lang) {
  const ouvertures = {
    en: ["a concrete situation the reader is in right now", "a direct question to the reader", "what changed recently on this topic"],
    fr: ["une situation concrète que le lecteur vit en ce moment", "une question directe posée au lecteur", "ce qui a changé récemment sur ce sujet"],
  }[lang];
  return { nbFaq: entier(3, 5), etEnsuite: Math.random() < 0.7, ouverture: choisirParmi(ouvertures) };
}

const REGLES_SECURITE = {
  en: `Safety rules (non-negotiable): this is an adults-only niche, but the article stays strictly
non-explicit. No sexual descriptions, no erotic role-play examples. Never mention or imply minors.
Never explain how to bypass filters, age checks or payments, and never promote cracked apps or "mod APKs".
Never claim we personally tested something or give scores: describe how things work, not invented results.
Do not invent prices: only use the price facts given in the BRIEF.`,
  fr: `Règles de sécurité (non négociables) : la niche est réservée aux adultes, mais l'article reste
strictement non explicite. Aucune description sexuelle, aucun exemple de jeu de rôle érotique. Ne jamais
mentionner ni sous-entendre des mineurs. Ne jamais expliquer comment contourner des filtres, un contrôle
d'âge ou un paiement, ni promouvoir des applis piratées ou des « APK mod ». Ne jamais affirmer avoir testé
quelque chose ni donner de note : expliquer le fonctionnement, pas des résultats inventés.
Ne pas inventer de prix : n'utiliser que les prix fournis dans le BRIEF.`,
};

function consigneStructure(lang, v, liens) {
  const listeLiens = liens.map((l) => `- ${l.url} : ${l.titre}`).join("\n");
  if (lang === "fr") {
    return `Rédige un article complet en Markdown (sans frontmatter). Ta réponse commence PAR LE TITRE,
seul sur la première ligne, sans dièse ni guillemets ni gras, suivi d'une ligne vide puis du corps.
Le titre est la question du lecteur (« Comment… ? », « Pourquoi… ? », « Lequel choisir… ? »), jamais le mot-clé brut.
Aucun bloc de code autour de la réponse, aucun commentaire avant ou après.
Corps, dans cet ordre :
1. Encadré <div class="essentiel"> (ligne vide après la balise ouvrante et avant la fermante) : **L'essentiel en 30 secondes**, la réponse en 2 phrases.
2. Introduction (2-3 phrases) qui part de ${v.ouverture}.
3. "## C'est quoi, concrètement ?" : définition en une phrase qui répond tout de suite, puis un encadré <div class="exemple"> (scène réaliste, non explicite).
4. "## Comment faire, pas à pas" (liste numérotée) OU "## Lequel choisir selon votre cas ?" si comparatif.
5. Si une étape est risquée (données, paiement, abonnement) : <div class="attention">.
6. "## Les erreurs à éviter" (liste à puces).
7. "## Les mots à connaître" : <div class="lexique"> (une définition = une phrase).
8. "## Questions fréquentes" : ${v.nbFaq} questions en ###, réponses de 50 mots maximum.
${v.etEnsuite ? '9. "## Et ensuite ?" : la suite logique, avec un lien interne.' : ""}
Maillage interne : insère 2 à 3 liens Markdown, dans des phrases naturelles, UNIQUEMENT vers ces URL exactes
(jamais une autre URL interne, jamais de lien externe) :
${listeLiens}
Règles : vouvoiement, phrases courtes, gras sur 2 à 4 groupes de 1 à 4 mots par section ## (jamais une phrase entière,
jamais le même terme deux fois), tableau Markdown pour toute comparaison chiffrée, jamais de tiret cadratin (—),
aucune formule creuse (« il est important de », « n'hésitez pas », « en conclusion », « dans un monde où »).`;
  }
  return `Write a complete Markdown article (no frontmatter). Your answer starts WITH THE TITLE alone on the
first line, no hash, quotes or bold, then an empty line, then the body. The title is the reader's question
("How…?", "Why…?", "Which… should you pick?"), never the raw keyword. No code fences, no comments before or after.
Body, in this order:
1. <div class="essentiel"> box (empty line after the opening tag and before the closing one): **The 30-second answer**, the answer in 2 sentences.
2. Introduction (2-3 sentences) starting from ${v.ouverture}.
3. "## What is it, exactly?": a one-sentence definition that answers right away, then a <div class="exemple"> box (realistic, non-explicit scene).
4. "## How to do it, step by step" (numbered list) OR "## Which one should you pick?" for comparisons.
5. If a step is risky (data, payment, subscription): <div class="attention">.
6. "## Mistakes to avoid" (bullet list).
7. "## Key terms": <div class="lexique"> (one definition = one sentence).
8. "## Frequently asked questions": ${v.nbFaq} questions as ###, answers of 50 words max.
${v.etEnsuite ? '9. "## What next?": the logical next step, with an internal link.' : ""}
Internal links: insert 2 to 3 Markdown links in natural sentences, ONLY to these exact URLs
(never any other internal URL, never an external link):
${listeLiens}
Rules: "you", short sentences, bold 2 to 4 groups of 1-4 words per ## section (never a whole sentence, never the
same term twice), a Markdown table for any numeric comparison, no em dash (—), no filler ("it is important to",
"in today's world", "in conclusion", "let's dive in", "game-changer").`;
}

const CONSIGNE_RELECTURE = {
  en: `You are the copy editor of an English consumer-tech site. Fix ONLY grammar, spelling, awkward sentences,
the tone rules (short sentences, no em dash, no filler), and the Markdown structure if broken. Do NOT change facts,
numbers, dates or links. Keep the author's voice. Reply ONLY with strict JSON: {"ok": true} or {"ok": false, "titre": "...", "corps": "..."}`,
  fr: `Tu es relecteur d'un site francophone. Corrige UNIQUEMENT grammaire, orthographe, phrases mal formées, règles de ton
(vouvoiement, phrases courtes, pas de tiret cadratin, pas de formules creuses) et la structure Markdown si elle est cassée.
Ne change AUCUN fait, chiffre, date ou lien. Garde la voix de l'auteur. Réponds UNIQUEMENT par un JSON strict :
{"ok": true} ou {"ok": false, "titre": "...", "corps": "..."}`,
};

async function relire(lang, titre, corps) {
  try {
    const t = await appelBrut({ model: MODELE_PAR_DEFAUT, system: CONSIGNE_RELECTURE[lang], messages: [{ role: "user", content: `TITRE :\n${titre}\n\nCORPS :\n${corps}` }], max_tokens: 7000, phase: "relecture-qualite" });
    const m = t.match(/\{[\s\S]*\}/);
    const v = m ? JSON.parse(m[0]) : { ok: true };
    return v.ok || typeof v.corps !== "string" ? { titre, corps } : { titre: v.titre || titre, corps: v.corps };
  } catch (e) {
    console.error(`Relecture indisponible (${e.message}) — texte conservé.`);
    return { titre, corps };
  }
}

function separerTitre(texte, secours) {
  const t = texte.trim().replace(/^```[a-z]*\n([\s\S]*?)\n```$/i, "$1").trim();
  const [premiere, ...reste] = t.split("\n");
  return premiere && premiere.length < 120 && !/^[#<*\-]/.test(premiere) ? { titre: premiere.trim(), corps: reste.join("\n").trim() } : { titre: secours, corps: t };
}

// Supprime tout lien interne non autorisé (garde le texte) et tout lien externe.
function nettoyerLiens(corps, autorises) {
  const ok = new Set(autorises.map((l) => l.url));
  return corps.replace(/\[([^\]]+)\]\(([^)\s]+)\)/g, (m, txt, url) => (ok.has(url) ? m : txt));
}

function descriptionDepuis(corps) {
  const bloc = corps.match(/<div class="essentiel">([\s\S]*?)<\/div>/);
  const brut = (bloc ? bloc[1] : corps).replace(/\*\*[^*]+\*\*\s*/, "").replace(/[*_#>`]/g, "").replace(/\[([^\]]+)\]\([^)]+\)/g, "$1").replace(/\s+/g, " ").trim();
  if (brut.length <= 155) return brut;
  const c = brut.slice(0, 155);
  return c.slice(0, Math.max(c.lastIndexOf(". ") + 1, c.lastIndexOf(" "))).trim();
}

function imagesUtilisees() {
  const urls = new Set();
  for (const lang of Object.keys(LANGS)) {
    if (!fs.existsSync(dirBlog(lang))) continue;
    for (const f of fs.readdirSync(dirBlog(lang))) {
      const m = fs.readFileSync(path.join(dirBlog(lang), f), "utf8").match(/^image:\s*"([^"]+)"/m);
      if (m) urls.add(m[1]);
    }
  }
  return urls;
}

async function choisirImage(lang, theme) {
  const deja = imagesUtilisees();
  let premier = null;
  for (const q of LANGS[lang].images[theme] || ["smartphone night"]) {
    try {
      const r = await findImage(q);
      if (!premier && r.length) premier = r[0];
      const libre = r.find((x) => !deja.has(x.url));
      if (libre) return libre;
    } catch (e) {
      console.error(`Image « ${q} » : ${e.message}`);
    }
  }
  return premier;
}

const briefPrix = (lang) =>
  lang === "fr"
    ? `Prix Candy AI publics (relevés le ${PRIX.checked}, à citer seulement si utile) : mensuel 13,99 $, trimestriel ~8,99 $/mois, annuel ~3,99 à 6,30 $/mois, 100 jetons inclus par mois, image ~4 jetons, appel ~3 jetons/minute. Facturation sous le nom EverAI (EverAI Limited, Malte).`
    : `Public Candy AI prices (checked ${PRIX.checked}, cite only if useful): monthly $13.99, quarterly ~$8.99/mo, annual ~$3.99-$6.30/mo, 100 tokens included per month, image ~4 tokens, call ~3 tokens/minute. Billed as EverAI (EverAI Limited, Malta).`;

async function construireArticle(sujet) {
  const { lang, theme, keyword, volume } = sujet;
  const liens = pagesInternes(lang);
  const variation = tirerVariation(lang);
  const res = await generer({
    phase: "premier-jet",
    consigne: consigneStructure(lang, variation, liens),
    instructions: [voixPour(lang), REGLES_SECURITE[lang]].join("\n\n"),
    brief: `${lang === "fr" ? "Mot-clé cible" : "Target keyword"} : ${keyword} (${volume}/${lang === "fr" ? "mois" : "month"})\n${briefPrix(lang)}`,
    max_tokens: 7000,
  });
  let { titre, corps } = separerTitre(res.texte, keyword);
  corps = corps.replace(/\s?\[S\d+\]/g, "");
  if (res.audit.bloquant) return { ok: false, lang, keyword, raison: `garde-fou : ${res.audit.violations.length} violation(s)` };
  if (corps.includes("[À VÉRIFIER")) return { ok: false, lang, keyword, raison: "marqueur [À VÉRIFIER] non résolu" };

  ({ titre, corps } = await relire(lang, titre, corps));
  corps = nettoyerLiens(corps, liens);
  if (estInterdit(titre) || estInterdit(corps)) return { ok: false, lang, keyword, raison: "terme interdit détecté (sécurité)" };

  const slug = slugify(titre);
  const fichier = path.join(dirBlog(lang), `${slug}.md`);
  if (fs.existsSync(fichier)) return { ok: false, lang, keyword, raison: "fichier déjà existant" };

  const image = await choisirImage(lang, theme);
  const today = new Date(Date.now() + 3 * 3600 * 1000).toISOString().slice(0, 10);
  const fm = ["---", `title: ${JSON.stringify(titre)}`, `description: ${JSON.stringify(descriptionDepuis(corps))}`, `date: "${today}"`, `keyword: ${JSON.stringify(keyword)}`, `theme: "${theme}"`];
  if (image) {
    fm.push(`image: "${image.url}"`, `imageAlt: ${JSON.stringify(image.alt || titre)}`);
    fm.push("imageCredit:", `  author: ${JSON.stringify(image.author || "")}`, `  url: "${image.authorUrl || ""}"`, `  source: "${image.source}"`);
  }
  fm.push("---", "");
  fs.mkdirSync(dirBlog(lang), { recursive: true });
  fs.writeFileSync(fichier, fm.join("\n") + corps.trim() + "\n", "utf8");
  return { ok: true, lang, theme, keyword, titre, slug, fichier, url: `${lang === "fr" ? "/fr" : ""}/blog/${slug}/`, image: image?.url };
}

function verifier() {
  try {
    execSync("node scripts/generation/verifier-contenu.js", { cwd: ROOT, stdio: "pipe" });
    execSync("node scripts/generation/verifier-lisibilite.js", { cwd: ROOT, stdio: "pipe" });
    return { ok: true };
  } catch (e) {
    return { ok: false, sortie: (e.stdout?.toString() || "") + (e.stderr?.toString() || e.message) };
  }
}

async function main() {
  const a = process.argv.slice(2);
  const val = (n, d) => (a.includes(n) ? Number(a[a.indexOf(n) + 1]) : d);
  const nb = { en: val("--en", 1), fr: val("--fr", 1) };
  const dryRun = a.includes("--dry-run");
  const push = a.includes("--push");
  reinitialiserUsage();
  const rapport = { date: new Date().toISOString(), articles: [], echecs: [], erreurs: [] };

  const sujets = [];
  for (const lang of Object.keys(nb)) {
    if (!nb[lang]) continue;
    try {
      sujets.push(...(await selectionnerSujetsSeo({ lang, n: nb[lang] })));
    } catch (e) {
      rapport.erreurs.push(`${lang} : ${e.message}`);
    }
  }
  for (const s of sujets) {
    console.log(`Génération [${s.lang}] ${s.keyword}`);
    try {
      const r = await construireArticle(s);
      (r.ok ? rapport.articles : rapport.echecs).push(r);
    } catch (e) {
      rapport.echecs.push({ lang: s.lang, keyword: s.keyword, raison: e.message });
    }
  }

  if (rapport.articles.length && !dryRun) {
    rapport.verification = verifier();
    if (!rapport.verification.ok) {
      console.error("Vérification échouée — articles retirés, rien n'est commité :\n" + rapport.verification.sortie);
      for (const x of rapport.articles) fs.rmSync(x.fichier, { force: true });
    } else {
      execSync(`git add ${rapport.articles.map((x) => `"${x.fichier}"`).join(" ")}`, { cwd: ROOT });
      const msg = `feat(blog): ${rapport.articles.length} article(s) autopilote (${rapport.articles.map((x) => x.lang).join(", ")})`;
      execSync(`git commit -m ${JSON.stringify(msg)}`, { cwd: ROOT });
      rapport.commit = execSync("git rev-parse HEAD", { cwd: ROOT }).toString().trim();
      if (push) {
        execSync("git push", { cwd: ROOT });
        rapport.pushed = true;
      }
    }
  }
  rapport.usage = resumerUsage();
  fs.mkdirSync(RAPPORTS_DIR, { recursive: true });
  const f = path.join(RAPPORTS_DIR, `${new Date().toISOString().slice(0, 10)}.json`);
  fs.writeFileSync(f, JSON.stringify(rapport, null, 2));
  console.log(`\nPubliés : ${rapport.articles.length} · échecs : ${rapport.echecs.length}`);
  for (const x of rapport.articles) console.log(`  + [${x.lang}] ${x.titre} → ${x.url}`);
  for (const x of rapport.echecs) console.log(`  - [${x.lang}] ${x.keyword} : ${x.raison}`);
  console.log(`Rapport : ${f}`);
}

main().catch((e) => {
  console.error("Erreur pipeline :", e);
  process.exit(1);
});
