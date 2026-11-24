# candyai.com — site « nocturne » (Next.js 16 · App Router · Vercel)

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
