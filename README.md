# AI Girlfriend Rated (aigirlfriendrated.com) — Next.js 16 · App Router · Vercel

Guide indépendant EN (racine) + FR (`/fr/`) sur Candy AI et les compagnons IA.

## Démarrer

```bash
npm install
cp .env.example .env.local   # renseigner SITE_URL et les liens affiliés
npm run dev                  # http://localhost:3000
npm run build && npm start   # build de production
```

## Structure

| Dossier | Rôle |
|---|---|
| `content/en/**.mdx`, `content/fr/**.mdx` | Pages (1 fichier = 1 URL, `index.mdx` = page racine du dossier) |
| `data/prices.json` | Prix Candy AI (source unique : cartes prix, calculateur) |
| `data/tables.ts` | Tableaux comparatifs (`<ComparisonTable rows="…"/>`) |
| `lib/affiliates.ts` + `app/go/[program]/[[...target]]/route.ts` | Liens affiliés pilotés par variables d'environnement |
| `components/` | Composants de la maquette (VerdictBox, PriceCards, Faq…) |
| `public/images/hero/` | Visuels CC0 (crédits : `public/images/credits.json`) |

## Variables d'environnement (Vercel → Settings → Environment Variables)

| Variable | Rôle |
|---|---|
| `SITE_URL` | Hôte canonique final, ex. `https://www.candyai.com` (canonical, hreflang, sitemap, JSON-LD). **Obligatoire avant le premier build de prod.** |
| `TODO_POLICY` | `noindex` (défaut) : les pages contenant encore des `<Todo>` sont en `noindex` et absentes du sitemap. `allow` pour les indexer quand même. |
| `AFF_*` | Liens affiliés (voir `.env.example`). Variable vide = programme inactif → redirection vers la page d'avis. |
| `NEXT_PUBLIC_CONTACT_ENDPOINT` | URL du formulaire de contact (ex. Formspree). |

## Éditer le contenu

- Ajouter une page : créer `content/en/<silo>/<page>.mdx` avec le frontmatter (voir une page existante).
- Lien affilié dans le texte : `<AffiliateLink program="candy-ai" target="pricing" placement="body">Try Candy AI</AffiliateLink>`.
- Donnée à compléter après test : `<Todo>…</Todo>` (affichée en pointillés violets, page en noindex tant qu'il en reste).

## Contrôles

`npm run lint` (TypeScript) · `npm run build` (0 erreur) · URLs générées : `/sitemap.xml`, `/robots.txt`, `/llms.txt`.

## Blog et autopilote (même chaîne que techno-play.com)

- Articles : `content/blog/en/*.md` → `/blog/<slug>/`, `content/blog/fr/*.md` → `/fr/blog/<slug>/`.
- Un article daté d'un jour futur reste invisible jusqu'au build de ce jour (`lib/posts.ts`, `estPublie`).
- `/blog/` et `/fr/blog/` sont en `noindex, follow` (règle des pages de thème de techno-play) ; les articles sont indexés, avec `BlogPosting`, `BreadcrumbList` et `FAQPage` (FAQ visible).

### Chaîne de l'autopilote (`npm run pipeline -- --en 1 --fr 1 [--dry-run] [--push]`)

1. **Sujets** (`scripts/seo/select-keyword-topics.js`) : volumes réels DataForSEO (US pour EN, France pour FR) à partir des graines de `scripts/seo/config.js`. Exclus : têtes de gondole, mots-clés déjà ciblés par une page (`data/mots-cles-pages.json`) ou un article (anti-cannibalisation), sujets hors thème et **termes interdits** (explicite, mineurs, contournement).
2. **Premier jet** sous garde-fou « date de coupure » (`scripts/generation/llm.js`, CLI Claude Code par abonnement), voix de `scripts/generation/voix.js`, règles de sécurité, prix Candy AI injectés depuis `data/prices.json`.
3. **Relecture qualité** (forme uniquement).
4. **Maillage** : 2-3 liens vers les pages du site, toute autre URL est retirée.
5. **Image** libre de droit (Unsplash → Pexels → Pixabay), sans doublon, crédit affiché.
6. **Contrôles** : `verifier-contenu.js` (bloquant, aussi en `prebuild`) et `verifier-lisibilite.js` (avertissements). Échec → articles retirés, rien n'est commité.
7. **Commit + push** sur `main` → déploiement Vercel. Rapport JSON en artefact GitHub (rien dans Google Drive).

### Mise en route

| Où | Quoi |
|---|---|
| GitHub → Settings → Secrets → Actions | `DATAFORSEO_LOGIN`, `DATAFORSEO_PASSWORD`, `CLAUDE_CODE_OAUTH_TOKEN` (`claude setup-token`), `UNSPLASH_ACCESS_KEY`, `PEXELS_API_KEY`, `PIXABAY_API_KEY`, `VERCEL_DEPLOY_HOOK` |
| GitHub → Settings → Actions → General | « Workflow permissions » : Read and write |
| Vercel → Settings → Git → Deploy Hooks | créer un hook sur `main`, URL → secret `VERCEL_DEPLOY_HOOK` |
| Onglet Actions | lancer « Autopilote blog » à la main avec `dry_run = true` pour le premier test |

Workflows : `autopilote-blog.yml` (tous les jours 09:11 Tana, 1 EN + 1 FR) · `publication-quotidienne.yml` (rebuild 08:23 Tana).
