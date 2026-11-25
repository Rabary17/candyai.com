import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { MDXRemote } from "next-mdx-remote/rsc";
import remarkGfm from "remark-gfm";
import { allDocs, getDoc, type Doc } from "@/lib/content";
import { SITE_URL, SITE_NAME, TODO_POLICY, T, type Lang } from "@/lib/site";
import { getMdxComponents, faqItemsFromBody, ReadNextGrid } from "./mdx";
import { JsonLd } from "./JsonLd";

export function staticParams(lang: Lang) {
  return allDocs().filter((d) => d.lang === lang).map((d) => ({ slug: d.slug }));
}

function alternatesOf(d: Doc) {
  const langs: Record<string, string> = {};
  const en = d.lang === "en" ? d.route : d.front.alternate;
  const fr = d.lang === "fr" ? d.route : d.front.alternate;
  if (en) langs["en-US"] = en;
  if (fr) langs["fr-FR"] = fr;
  if (en) langs["x-default"] = en;
  return langs;
}

export function pageMetadata(lang: Lang, slug?: string[]): Metadata {
  const d = getDoc(lang, slug);
  if (!d) return {};
  const noindex = d.hasTodo && TODO_POLICY === "noindex";
  return {
    title: d.front.title,
    description: d.front.description,
    alternates: { canonical: d.route, languages: alternatesOf(d) },
    robots: noindex ? { index: false, follow: true } : { index: true, follow: true },
    openGraph: {
      type: "article", siteName: SITE_NAME, title: d.front.title, description: d.front.description, url: d.route,
      locale: lang === "fr" ? "fr_FR" : "en_US", images: d.front.image ? [{ url: d.front.image }] : undefined,
    },
    twitter: { card: "summary_large_image", title: d.front.title, description: d.front.description },
    other: { rating: "adult" },
  };
}

function crumbs(d: Doc) {
  const t = T[d.lang];
  const items: { name: string; url: string }[] = [{ name: t.home, url: d.lang === "fr" ? "/fr/" : "/" }];
  let acc: string[] = [];
  for (const s of d.slug) {
    acc = [...acc, s];
    const p = getDoc(d.lang, acc);
    if (p) items.push({ name: p.front.h1, url: p.route });
  }
  return items;
}

export async function DocPage({ lang, slug }: { lang: Lang; slug?: string[] }) {
  const d = getDoc(lang, slug);
  if (!d) notFound();
  const t = T[lang];
  const f = d.front;
  const bc = crumbs(d);
  const faq = faqItemsFromBody(d.body);
  const schema: object[] = [];
  if (bc.length > 1) schema.push({ "@context": "https://schema.org", "@type": "BreadcrumbList", itemListElement: bc.map((c, i) => ({ "@type": "ListItem", position: i + 1, name: c.name, item: SITE_URL + c.url })) });
  if (f.template !== "page") schema.push({ "@context": "https://schema.org", "@type": "Article", headline: f.h1, description: f.description, inLanguage: lang, dateModified: f.updated, image: f.image ? SITE_URL + f.image : undefined, publisher: { "@type": "Organization", name: SITE_NAME, url: SITE_URL } });
  if (faq.length) schema.push({ "@context": "https://schema.org", "@type": "FAQPage", mainEntity: faq.map((x) => ({ "@type": "Question", name: x.q, acceptedAnswer: { "@type": "Answer", text: x.a } })) });

  const showDisclosure = f.template === "money" || f.template === "home" || f.template === "pillar";
  return (
    <>
      <JsonLd data={schema} />
      {showDisclosure && <div className="disclosure">{t.disclosure} <Link href={t.disclosureLink.href}>{t.disclosureLink.label}</Link></div>}
      <main>
        {bc.length > 1 && (
          <nav className="crumbs wrap" aria-label="breadcrumb"><ol>{bc.map((c, i) => <li key={c.url} aria-current={i === bc.length - 1 ? "page" : undefined}>{i === bc.length - 1 ? c.name : <Link href={c.url}>{c.name}</Link>}</li>)}</ol></nav>
        )}
        <section className={`hero${f.image ? "" : " hero--solo"}`}>
          <div className="wrap hero__grid">
            <div className="hero__text">
              <h1>{f.h1}</h1>
              {f.lede && <p className="chapo"><strong><em>{f.lede}</em></strong></p>}
              {f.template !== "page" && (
                <div className="author"><span className="author__img" role="img" aria-label="author" /><span>{t.by} <a href={lang === "fr" ? "/fr/a-propos/" : "/about/"}>{lang === "fr" ? "la rédaction AI Girlfriend Rated" : "the AI Girlfriend Rated team"}</a> · {t.lastChecked} {f.updated}</span></div>
              )}
            </div>
            {f.image && (
              <div className="hero__media"><Image src={f.image} alt={f.imageAlt || ""} width={960} height={640} priority sizes="(max-width: 900px) 100vw, 560px" /></div>
            )}
          </div>
        </section>
        <section className="section"><div className="wrap"><article className="prose">
          <MDXRemote source={d.body} components={getMdxComponents(lang)} options={{ blockJS: false, blockDangerousJS: true, mdxOptions: { remarkPlugins: [remarkGfm] } }} />
        </article></div></section>
        {f.readNext?.length ? (
          <section className="section"><div className="wrap"><div className="section__head"><span className="eyebrow">{t.readNext}</span></div><ReadNextGrid items={f.readNext} lang={lang} /></div></section>
        ) : null}
      </main>
    </>
  );
}
