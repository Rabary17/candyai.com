import type { MetadataRoute } from "next";
import { allDocs } from "@/lib/content";
import { SITE_URL, TODO_POLICY } from "@/lib/site";

export default function sitemap(): MetadataRoute.Sitemap {
  return allDocs()
    .filter((d) => !(d.hasTodo && TODO_POLICY === "noindex"))
    .map((d) => {
      const langs: Record<string, string> = {};
      const alt = d.front.alternate;
      if (alt) { langs[d.lang === "en" ? "en-US" : "fr-FR"] = SITE_URL + d.route; langs[d.lang === "en" ? "fr-FR" : "en-US"] = SITE_URL + alt; }
      return { url: SITE_URL + d.route, lastModified: d.front.updated, alternates: alt ? { languages: langs } : undefined };
    });
}
