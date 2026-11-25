import type { MetadataRoute } from "next";
import { allDocs } from "@/lib/content";
import { getAllPosts, postUrl } from "@/lib/posts";
import { SITE_URL, TODO_POLICY } from "@/lib/site";

export default function sitemap(): MetadataRoute.Sitemap {
  const posts = (["en", "fr"] as const).flatMap((l) => getAllPosts(l)).map((p) => ({ url: SITE_URL + postUrl(p), lastModified: p.updated || p.date }));
  return [...pages(), ...posts];
}

function pages(): MetadataRoute.Sitemap {
  return allDocs()
    .filter((d) => !(d.hasTodo && TODO_POLICY === "noindex"))
    .map((d) => {
      const langs: Record<string, string> = {};
      const alt = d.front.alternate;
      if (alt) { langs[d.lang === "en" ? "en-US" : "fr-FR"] = SITE_URL + d.route; langs[d.lang === "en" ? "fr-FR" : "en-US"] = SITE_URL + alt; }
      return { url: SITE_URL + d.route, lastModified: d.front.updated, alternates: alt ? { languages: langs } : undefined };
    });
}
