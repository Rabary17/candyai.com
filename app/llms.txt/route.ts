import { allDocs } from "@/lib/content";
import { SITE_URL } from "@/lib/site";

export const dynamic = "force-static";
export function GET() {
  const pick = (t: string[]) => allDocs().filter((d) => t.includes(d.front.template));
  const line = (d: ReturnType<typeof allDocs>[number]) => `- [${d.front.h1}](${SITE_URL}${d.route}): ${d.front.description}`;
  const body = [
    "# nocturne — independent guide to AI companion apps (EN / FR)",
    "",
    "> Tested reviews of Candy AI and other AI companion apps for adults: pricing with tokens, safety, free plans and alternatives.",
    "",
    "## Main pages (EN)", ...pick(["home", "pillar"]).filter((d) => d.lang === "en").map(line),
    "", "## Pages principales (FR)", ...pick(["home", "pillar"]).filter((d) => d.lang === "fr").map(line),
    "", "## Guides", ...pick(["money", "support"]).map(line), "",
  ].join("\n");
  return new Response(body, { headers: { "Content-Type": "text/plain; charset=utf-8" } });
}
