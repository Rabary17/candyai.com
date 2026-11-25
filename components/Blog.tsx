import Image from "next/image";
import Link from "next/link";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getAllPosts, getPost, postUrl, blogBase, type Post } from "@/lib/posts";
import { SITE_URL, SITE_NAME, T, type Lang } from "@/lib/site";
import { JsonLd } from "./JsonLd";
import { AffiliateLink } from "./AffiliateLink";

const L = {
  en: { blog: "Blog", h1: "AI companion blog", lede: "Guides, explainers and answers to the questions people ask about AI companions, AI girlfriend apps and Candy AI.", read: "Read →", by: "By", updated: "Updated", sources: "Sources consulted", photo: "Photo", cta: "Try Candy AI", ctaText: "Compare it with the free plan first, then decide.", more: "More from the blog", empty: "First articles coming soon." },
  fr: { blog: "Blog", h1: "Le blog des compagnons IA", lede: "Guides, explications et réponses aux questions que l'on se pose sur les compagnons IA, les petites amies IA et Candy AI.", read: "Lire →", by: "Par", updated: "Mis à jour le", sources: "Sources consultées", photo: "Photo", cta: "Essayer Candy AI", ctaText: "Testez d'abord l'offre gratuite, puis décidez.", more: "Autres articles du blog", empty: "Premiers articles très bientôt." },
} as const;

const date = (lang: Lang, d: string) => new Date(d + "T12:00:00Z").toLocaleDateString(lang === "fr" ? "fr-FR" : "en-US", { day: "numeric", month: "long", year: "numeric" });

function Card({ p, lang }: { p: Post; lang: Lang }) {
  return (
    <Link className="card" href={postUrl(p)}>
      {p.image ? <Image src={p.image} alt={p.imageAlt || ""} width={640} height={360} style={{ width: "100%", height: "auto", aspectRatio: "16/9", objectFit: "cover", borderRadius: 12 }} /> : <div className="ph" />}
      <span className="muted" style={{ fontSize: 13 }}>{date(lang, p.date)}</span>
      <span className="card__title">{p.title}</span>
      <span className="card__more">{L[lang].read}</span>
    </Link>
  );
}

export function blogIndexMetadata(lang: Lang): Metadata {
  const l = L[lang];
  return {
    title: `${l.h1} | ${SITE_NAME}`,
    description: l.lede,
    alternates: { canonical: blogBase(lang), languages: { "en-US": "/blog/", "fr-FR": "/fr/blog/", "x-default": "/blog/" } },
    // Même règle que les pages de thème de techno-play : la liste sert à naviguer,
    // seuls les articles sont indexés.
    robots: { index: false, follow: true },
  };
}

export function BlogIndex({ lang }: { lang: Lang }) {
  const l = L[lang];
  const posts = getAllPosts(lang);
  return (
    <main>
      <nav className="crumbs wrap" aria-label="breadcrumb"><ol><li><Link href={lang === "fr" ? "/fr/" : "/"}>{T[lang].home}</Link></li><li aria-current="page">{l.blog}</li></ol></nav>
      <section className="hero hero--solo"><div className="wrap hero__grid"><div className="hero__text"><h1>{l.h1}</h1><p className="chapo">{l.lede}</p></div></div></section>
      <section className="section"><div className="wrap">{posts.length ? <div className="related related--blog">{posts.map((p) => <Card key={p.slug} p={p} lang={lang} />)}</div> : <p className="muted">{l.empty}</p>}</div></section>
    </main>
  );
}

export function postMetadata(lang: Lang, slug: string): Metadata {
  const p = getPost(lang, slug);
  if (!p) return {};
  const other = lang === "en" ? "fr" : "en";
  const languages: Record<string, string> = { [lang === "en" ? "en-US" : "fr-FR"]: postUrl(p) };
  if (p.alternate && getPost(other, p.alternate)) languages[other === "en" ? "en-US" : "fr-FR"] = postUrl({ lang: other, slug: p.alternate });
  return {
    title: p.seoTitle || p.title,
    description: p.description,
    alternates: { canonical: postUrl(p), languages },
    openGraph: { type: "article", title: p.seoTitle || p.title, description: p.description, url: postUrl(p), publishedTime: p.date, modifiedTime: p.updated || p.date, images: p.image ? [{ url: p.image }] : undefined, locale: lang === "fr" ? "fr_FR" : "en_US" },
    twitter: { card: "summary_large_image" },
    other: { rating: "adult" },
  };
}

export function PostPage({ lang, slug }: { lang: Lang; slug: string }) {
  const p = getPost(lang, slug);
  if (!p) notFound();
  const l = L[lang];
  const home = lang === "fr" ? "/fr/" : "/";
  const autres = getAllPosts(lang).filter((x) => x.slug !== slug).slice(0, 3);
  const schema: object[] = [
    { "@context": "https://schema.org", "@type": "BreadcrumbList", itemListElement: [
      { "@type": "ListItem", position: 1, name: T[lang].home, item: SITE_URL + home },
      { "@type": "ListItem", position: 2, name: l.blog, item: SITE_URL + blogBase(lang) },
      { "@type": "ListItem", position: 3, name: p.title, item: SITE_URL + postUrl(p) },
    ] },
    { "@context": "https://schema.org", "@type": "BlogPosting", headline: p.title, description: p.description, inLanguage: lang, datePublished: p.date, dateModified: p.updated || p.date,
      image: p.image, mainEntityOfPage: SITE_URL + postUrl(p), author: { "@type": "Organization", name: SITE_NAME, url: SITE_URL + "/" }, publisher: { "@type": "Organization", name: SITE_NAME, logo: { "@type": "ImageObject", url: SITE_URL + "/brand/logo.svg" } } },
  ];
  if (p.faq.length) schema.push({ "@context": "https://schema.org", "@type": "FAQPage", mainEntity: p.faq.map((f) => ({ "@type": "Question", name: f.q, acceptedAnswer: { "@type": "Answer", text: f.a } })) });
  return (
    <>
      <JsonLd data={schema} />
      <div className="disclosure">{T[lang].disclosure} <Link href={T[lang].disclosureLink.href}>{T[lang].disclosureLink.label}</Link></div>
      <main>
        <nav className="crumbs wrap" aria-label="breadcrumb"><ol><li><Link href={home}>{T[lang].home}</Link></li><li><Link href={blogBase(lang)}>{l.blog}</Link></li><li aria-current="page">{p.title}</li></ol></nav>
        <section className={`hero${p.image ? "" : " hero--solo"}`}><div className="wrap hero__grid">
          <div className="hero__text">
            <h1>{p.title}</h1>
            <p className="chapo">{p.description}</p>
            <div className="author"><span className="author__img" aria-hidden /><span>{l.by} {p.author || SITE_NAME} · {date(lang, p.date)}{p.updated ? ` · ${l.updated} ${date(lang, p.updated)}` : ""}</span></div>
          </div>
          {p.image && <figure className="hero__media"><Image src={p.image} alt={p.imageAlt || ""} width={960} height={640} priority sizes="(max-width: 900px) 100vw, 560px" />
            {p.imageCredit && <figcaption className="muted" style={{ fontSize: 12, marginTop: 6 }}>{l.photo} : <a href={p.imageCredit.url} rel="nofollow noopener" target="_blank">{p.imageCredit.author}</a> / {p.imageCredit.source}</figcaption>}</figure>}
        </div></section>
        <section className="section"><div className="wrap"><article className="prose post" dangerouslySetInnerHTML={{ __html: p.contentHtml }} /></div></section>
        {p.sources?.length ? <section className="section"><div className="wrap prose"><h2>{l.sources}</h2><ul>{p.sources.map((s) => <li key={s.url}><a href={s.url} rel="nofollow noopener" target="_blank">{s.titre}</a></li>)}</ul></div></section> : null}
        <section className="section"><div className="wrap"><div className="band"><div style={{ display: "flex", flexDirection: "column", gap: 14 }}><h2>{l.cta}</h2><p>{l.ctaText}</p></div><div className="band__actions"><AffiliateLink placement="blog-band" className="btn btn--dark btn--lg">{l.cta} →</AffiliateLink></div></div></div></section>
        {autres.length ? <section className="section"><div className="wrap"><div className="section__head"><span className="eyebrow">{l.more}</span></div><div className="related">{autres.map((x) => <Card key={x.slug} p={x} lang={lang} />)}</div></div></section> : null}
      </main>
    </>
  );
}

export { getAllPosts };
