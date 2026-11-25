// Voix éditoriale de candyai.com (injectée dans le prompt, jamais affichée).
// Tant qu'aucun auteur nommé n'est en ligne, une seule voix « rédaction ».
// Ajouter un auteur = une entrée ici + sa page auteur (E-E-A-T).
"use strict";
const VOIX = {
  en: `Writing voice: calm, adult and matter-of-fact, like a consumer-tech journalist who has used these apps.
Address the reader as "you". Short sentences (18 words on average, 25 max). No hype, no moralising,
no shaming of people who use AI companions. Explain a technical term in a short clause right where it appears.
Prefer concrete situations (a late-night chat, a subscription renewal, a privacy setting) over abstractions.`,
  fr: `Style : posé, adulte et factuel, comme un journaliste conso-tech qui connaît ces applications.
Vouvoiement. Phrases courtes (18 mots en moyenne, 25 max). Pas d'emphase, pas de morale,
jamais de jugement sur les personnes qui utilisent un compagnon IA. Un terme technique s'explique en incise,
là où il apparaît. Préférer les situations concrètes (une discussion tard le soir, un renouvellement
d'abonnement, un réglage de confidentialité) aux généralités.`,
};
module.exports = { voixPour: (lang) => VOIX[lang] };
