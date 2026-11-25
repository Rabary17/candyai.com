// Contrôle de lisibilité — AVERTISSEMENTS, jamais bloquant (sauf --strict), comme techno-play :
// encadré « essentiel », phrases ≤ 25 mots (moyenne ≤ 20), tirets cadratins, formules creuses.
"use strict";
const fs = require("fs");
const path = require("path");
const matter = require("gray-matter");
const ROOT = path.join(__dirname, "..", "..");
const CREUX = {
  en: [/\bin today'?s world\b/i, /\blet'?s dive\b/i, /\bgame[- ]changer\b/i, /\bit is important to\b/i, /\bin conclusion\b/i, /\bunlock the\b/i, /\bdelve\b/i],
  fr: [/\bdans un monde où\b/i, /\bil est important de\b/i, /\bn'hésitez pas\b/i, /\ben conclusion\b/i, /\bplongeons\b/i, /\bil suffit de\b/i, /\bévidemment\b/i, /\bincontournable/i],
};
let alertes = 0;
for (const lang of ["en", "fr"]) {
  const dir = path.join(ROOT, "content", "blog", lang);
  if (!fs.existsSync(dir)) continue;
  for (const f of fs.readdirSync(dir).filter((x) => x.endsWith(".md"))) {
    const { content } = matter(fs.readFileSync(path.join(dir, f), "utf8"));
    const a = [];
    if (!content.includes('class="essentiel"')) a.push("encadré « essentiel » manquant");
    if (content.includes("—")) a.push("tiret cadratin");
    for (const re of CREUX[lang]) if (re.test(content)) a.push(`formule creuse ${re}`);
    const texte = content.replace(/<[^>]+>/g, " ").replace(/^#.*$/gm, "").replace(/\|.*\|/g, "");
    const phrases = texte.split(/(?<=[.!?])\s+/).map((p) => p.trim().split(/\s+/).filter(Boolean).length).filter((n) => n > 2);
    const longues = phrases.filter((n) => n > 25).length;
    const moy = phrases.length ? phrases.reduce((x, y) => x + y, 0) / phrases.length : 0;
    if (longues) a.push(`${longues} phrase(s) > 25 mots`);
    if (moy > 20) a.push(`moyenne ${moy.toFixed(1)} mots/phrase`);
    if (a.length) { alertes += a.length; console.warn(`⚠ ${lang}/${f} : ${a.join(" · ")}`); }
  }
}
console.log(`Lisibilité : ${alertes} avertissement(s).`);
if (alertes && process.argv.includes("--strict")) process.exit(1);
