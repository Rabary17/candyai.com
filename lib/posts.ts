// Blog : articles Markdown versionnés dans content/blog/<lang>/*.md,
// alimentés par l'autopilote (scripts/seo/run-pipeline.js) ou écrits à la main.
// Même principe que techno-play.com : un article daté d'un jour futur reste
// dans le dépôt mais n'apparaît sur le site qu'au build de son jour
// (workflow « Publication quotidienne » → Deploy Hook Vercel).
import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";
import { marked } from "marked";
import type { Lang } from "./site";

export type Post = {
  slug: string;
  lang: Lang;
  title: string;
  seoTitle?: string;
  description: string;
  date: string;
  updated?: string;
  keyword?: string;
  author?: string;
  image?: string;
  imageAlt?: string;
  imageCredit?: { author: string; url: string; source: string };
  sources?: { titre: string; url: string }[];
  alternate?: string; // slug de la version dans l'autre langue, si elle existe
  contentHtml: string;
  faq: { q: string; a: string }[];
};

const dir = (lang: Lang) => path.join(process.cwd(), "content", "blog", lang);

/** Date du jour "AAAA-MM-JJ" en heure de Madagascar (UTC+3), comme techno-play. */
export function aujourdhui(): string {
  return new Date(Date.now() + 3 * 3600 * 1000).toISOString().slice(0, 10);
}
export const estPublie = (p: { date: string }, jour = aujourdhui()) => p.date <= jour;

/** Liens externes en nofollow + nouvel onglet ; tableaux dans .table-wrap (défilement mobile). */
marked.use({
  renderer: {
    link(href: string, title: string | null | undefined, text: string) {
      const t = title ? ` title="${title}"` : "";
      return /^https?:\/\//.test(href) ? `<a href="${href}"${t} rel="nofollow noopener" target="_blank">${text}</a>` : `<a href="${href}"${t}>${text}</a>`;
    },
    table(header: string, body: string) {
      return `<div class="table-wrap"><table><thead>${header}</thead><tbody>${body}</tbody></table></div>`;
    },
  },
});

/** FAQ visible → JSON-LD : les ### sous « ## Questions fréquentes » / « ## Frequently asked questions ». */
function extraireFaq(md: string) {
  const sections = md.split(/^## /m);
  const faq = sections.find((x) => /^(Questions fréquentes|Frequently asked questions|FAQ)\s*$/im.test(x.split("\n")[0]));
  if (!faq) return [];
  return faq.split(/^### /m).slice(1).map((bloc) => {
    const [q, ...r] = bloc.split("\n");
    return { q: q.trim(), a: r.join(" ").replace(/\s+/g, " ").replace(/[*_`]/g, "").trim() };
  }).filter((x) => x.q && x.a);
}

function lire(lang: Lang, slug: string): Post {
  const { data, content } = matter(fs.readFileSync(path.join(dir(lang), `${slug}.md`), "utf8"));
  return { ...(data as Omit<Post, "slug" | "lang" | "contentHtml" | "faq">), slug, lang, contentHtml: marked.parse(content, { async: false }) as string, faq: extraireFaq(content) };
}

function slugs(lang: Lang) {
  return fs.existsSync(dir(lang)) ? fs.readdirSync(dir(lang)).filter((f) => f.endsWith(".md")).map((f) => f.replace(/\.md$/, "")) : [];
}

export function getAllPosts(lang: Lang): Post[] {
  const jour = aujourdhui();
  return slugs(lang).map((s) => lire(lang, s)).filter((p) => estPublie(p, jour)).sort((a, b) => (a.date < b.date ? 1 : -1));
}
export function getPost(lang: Lang, slug: string) {
  return slugs(lang).includes(slug) ? (estPublie(lire(lang, slug)) ? lire(lang, slug) : undefined) : undefined;
}
export const blogBase = (lang: Lang) => (lang === "fr" ? "/fr/blog/" : "/blog/");
export const postUrl = (p: Pick<Post, "lang" | "slug">) => `${blogBase(p.lang)}${p.slug}/`;
