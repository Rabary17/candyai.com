import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";
import type { Lang } from "./site";

const ROOT = path.join(process.cwd(), "content");

export type Front = {
  title: string;
  description: string;
  h1: string;
  lede?: string;
  template: "home" | "pillar" | "money" | "support" | "page";
  alternate?: string | null;
  image?: string | null;
  imageAlt?: string;
  schema?: string[];
  updated?: string;
  readNext?: string[];
};

export type Doc = { lang: Lang; route: string; slug: string[]; file: string; front: Front; body: string; hasTodo: boolean };

function walk(dir: string): string[] {
  return fs.readdirSync(dir, { withFileTypes: true }).flatMap((e) =>
    e.isDirectory() ? walk(path.join(dir, e.name)) : e.name.endsWith(".mdx") ? [path.join(dir, e.name)] : []
  );
}

function toSlug(lang: Lang, file: string): string[] {
  const rel = path.relative(path.join(ROOT, lang), file).replace(/\.mdx$/, "");
  const parts = rel.split(path.sep);
  if (parts[parts.length - 1] === "index") parts.pop();
  return parts;
}

export function routeOf(lang: Lang, slug: string[]) {
  const p = slug.length ? `/${slug.join("/")}/` : "/";
  return lang === "fr" ? `/fr${p === "/" ? "/" : p}` : p;
}

let cache: Doc[] | null = null;
export function allDocs(): Doc[] {
  if (cache) return cache;
  const docs: Doc[] = [];
  for (const lang of ["en", "fr"] as Lang[]) {
    for (const file of walk(path.join(ROOT, lang))) {
      const raw = fs.readFileSync(file, "utf8");
      const { data, content } = matter(raw);
      const slug = toSlug(lang, file);
      docs.push({ lang, slug, file, route: routeOf(lang, slug), front: data as Front, body: content, hasTodo: content.includes("<Todo") });
    }
  }
  cache = docs;
  return docs;
}

export function getDoc(lang: Lang, slug: string[] = []) {
  const route = routeOf(lang, slug);
  return allDocs().find((d) => d.route === route) ?? null;
}

export function byRoute(route: string) {
  return allDocs().find((d) => d.route === route) ?? null;
}
