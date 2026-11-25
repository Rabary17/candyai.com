import Link from "next/link";
import Image from "next/image";
import type { ReactNode } from "react";
import { AffiliateLink } from "./AffiliateLink";
import { PriceCalculator } from "./PriceCalculator";
import { Todo, rich } from "./Rich";
import { TABLES } from "@/data/tables";
import prices from "@/data/prices.json";
import { byRoute } from "@/lib/content";
import { T, type Lang } from "@/lib/site";
import type { ProgramId } from "@/lib/affiliates";

type Item = { q: string; a: string };

export function faqItemsFromBody(body: string): Item[] {
  // Extrait les Q/R de <Faq items={[...]} /> pour le JSON-LD (FAQ visible sur la page).
  const m = body.match(/<Faq items=\{(\[[\s\S]*?\])\}\s*\/>/);
  if (!m) return [];
  const out: Item[] = [];
  const re = /\{\s*q:\s*"((?:[^"\\]|\\.)*)",\s*a:\s*"((?:[^"\\]|\\.)*)"\s*\}/g;
  let x;
  while ((x = re.exec(m[1]))) {
    const clean = (s: string) => s.replace(/\\"/g, '"').replace(/<Todo>.*?<\/Todo>/g, "").trim();
    if (!/<Todo>/.test(x[1] + x[2])) out.push({ q: clean(x[1]), a: clean(x[2]) });
  }
  return out;
}

export function getMdxComponents(lang: Lang) {
  const t = T[lang];
  const fr = lang === "fr";

  const Section = ({ children, deep }: { children: ReactNode; deep?: boolean }) => (
    <div className={`block${deep ? " block--deep" : ""}`}>{children}</div>
  );

  return {
    Todo,
    a: ({ href = "", children }: { href?: string; children: ReactNode }) =>
      href.startsWith("/") ? <Link href={href}>{children}</Link> : <a href={href} rel="nofollow noopener" target="_blank">{children}</a>,
    table: (p: { children: ReactNode }) => <div className="table-wrap"><table>{p.children}</table></div>,
    blockquote: (p: { children: ReactNode }) => <div className="callout callout--answer">{p.children}</div>,
    AffiliateLink,
    DisclosureStrip: () => null,

    TldrBox: ({ title, items }: { title: string; items: string[] }) => (
      <div className="tldr"><span className="eyebrow">{t.tldr}</span><p className="tldr__lead">{rich(title)}</p><ol>{items.map((i, k) => <li key={k}><span>{rich(i)}</span></li>)}</ol></div>
    ),

    VerdictBox: (p: {
      variant?: "duel"; score?: ReactNode; bestFor?: string; skipIf?: string; price?: string; pros?: string[]; cons?: string[];
      a?: { name: string; score?: string; price?: string; pros: string[]; cons: string[] }; b?: { name: string; score?: string; price?: string; pros: string[]; cons: string[] };
    }) => {
      if (p.variant === "duel" && p.a && p.b) {
        return (
          <div className="duel">
            {[p.a, p.b].map((s, i) => (
              <aside className="verdict" key={i}>
                <div className="verdict__top"><div style={{ font: "800 22px var(--f-display)" }}>{s.name}</div>{s.score && <div className="score"><span>{rich(s.score)}<small>/10</small></span></div>}</div>
                {s.price && <div className="verdict__price">{rich(s.price)}</div>}
                <div className="proscons"><ul>{s.pros.map((x, k) => <li className="p" key={k}>{rich(x)}</li>)}</ul><ul>{s.cons.map((x, k) => <li className="c" key={k}>{rich(x)}</li>)}</ul></div>
                {/candy/i.test(s.name) && <AffiliateLink placement={`duel-${i}`} className="btn btn--primary btn--block">{t.cta} →</AffiliateLink>}
              </aside>
            ))}
          </div>
        );
      }
      return (
        <aside className="verdict" aria-label="verdict">
          <div className="verdict__top"><div><div className="eyebrow" style={{ color: "var(--muted)" }}>{t.score}</div></div><div className="score"><span>{p.score}<small>/10</small></span></div></div>
          <div className="verdict__who">
            {p.bestFor && <div><b className="good">{t.bestFor} : </b>{rich(p.bestFor)}</div>}
            {p.skipIf && <div><b className="bad">{t.skipIf} : </b>{rich(p.skipIf)}</div>}
          </div>
          <div className="proscons"><ul>{(p.pros ?? []).map((x, k) => <li className="p" key={k}>{rich(x)}</li>)}</ul><ul>{(p.cons ?? []).map((x, k) => <li className="c" key={k}>{rich(x)}</li>)}</ul></div>
          {p.price && <div className="verdict__price">{rich(p.price)}</div>}
          <AffiliateLink placement="verdict" className="btn btn--primary btn--lg btn--block">{t.cta} →</AffiliateLink>
        </aside>
      );
    },

    PriceCards: () => (
      <div>
        <div className="plans">
          {prices.candyAi.plans.map((pl) => {
            const best = "best" in pl && pl.best;
            const price = "pricePerMonth" in pl ? `${pl.pricePerMonth}` : `${pl.pricePerMonthMin!.toFixed(2)}–${pl.pricePerMonthMax!.toFixed(2)}`;
            return (
              <div className={`plan${best ? " plan--best" : ""}`} key={pl.id}>
                {best && <span className="plan__badge">{fr ? "Meilleur prix" : "Best value"}</span>}
                <span className="plan__name">{pl.label[lang]}</span>
                <span className="plan__price">{fr ? `~${price.replace(/\./g, ",")} $` : `~$${price}`}<small style={{ font: "500 15px var(--f-body)", color: "var(--muted)" }}>{fr ? " /mois" : " /mo"}</small></span>
                <span className="plan__meta">{pl.tokens} {fr ? "jetons/mois" : "tokens/mo"}</span>
                <AffiliateLink target="pricing" placement={`plan-${pl.id}`} className={`btn btn--block${best ? " btn--primary" : ""}`}>{t.cta}</AffiliateLink>
              </div>
            );
          })}
        </div>
        <p className="plans__note">{fr ? `Mêmes fonctions sur les trois formules. Prix relevés le ${prices.checked}, à revérifier.` : `Same features on all three. Prices checked on ${prices.checked}.`}</p>
      </div>
    ),

    PriceCalculator: () => <PriceCalculator lang={lang} />,

    ComparisonTable: ({ rows, columns }: { rows: string; columns?: string[]; extraColumn?: string }) => {
      const tb = TABLES[rows];
      if (!tb) return <Todo>table {rows}</Todo>;
      const head = columns ?? tb[lang];
      return (
        <div className="table-wrap"><table>
          <thead><tr>{head.map((h) => <th key={h}>{h}</th>)}<th /></tr></thead>
          <tbody>{tb.rows.map((r, i) => (
            <tr key={i}><td>{rich(r.app)}</td>{r.cells.map((c, k) => <td key={k}>{rich(c)}</td>)}
              <td>{r.program ? <AffiliateLink program={r.program as ProgramId} placement={`table-${rows}`} className="btn">{fr ? "Voir" : "Try"}</AffiliateLink> : null}</td></tr>
          ))}</tbody>
        </table></div>
      );
    },

    QuickPicks: ({ items }: { items: { label: string; app: string; reason?: string }[] }) => (
      <div className="picks">{items.map((it, i) => (
        <div className="pick" key={i}><span className="pick__label">{it.label}</span><span className="pick__name">{rich(it.app)}</span>{it.reason && <span className="muted" style={{ fontSize: 14 }}>{rich(it.reason)}</span>}</div>
      ))}</div>
    ),

    SafetyTiles: ({ items }: { items: { label: string; status: "good" | "warn" | "bad"; text: string }[] }) => (
      <div className="tiles">{items.map((it, i) => (
        <div className="tile" key={i}><span className={`tile__dot ${{ good: "g", warn: "o", bad: "r" }[it.status]}`} /><span className="tile__label">{it.label}</span><span className="tile__value">{rich(it.text)}</span></div>
      ))}</div>
    ),

    Steps: ({ items }: { items: string[] }) => <ol className="steps">{items.map((s, i) => <li key={i}>{rich(s)}</li>)}</ol>,

    Faq: ({ items }: { items: Item[] }) => (
      <section className="faq-block"><h2>{t.faq}</h2>
        <div className="faq">{items.map((it, i) => <details key={i} open={i === 0}><summary>{rich(it.q)}</summary><p>{rich(it.a)}</p></details>)}</div>
      </section>
    ),

    CtaBand: ({ title, text, program, label }: { title: string; text: string; program?: string; label?: string }) => (
      <div className="band"><div style={{ display: "flex", flexDirection: "column", gap: 14 }}><h2>{title}</h2><p>{text}</p></div>
        <div className="band__actions"><AffiliateLink program={(program ?? "candy-ai") as ProgramId} placement="band" className="btn btn--dark btn--lg">{label ?? t.cta} →</AffiliateLink></div></div>
    ),

    ReadNext: ({ items }: { items: string[]; variant?: string }) => <ReadNextGrid items={items} lang={lang} />,

    OffersBox: ({ checked, items }: { checked: string; items: { label: string; detail: string; status: string }[] }) => (
      <div className="callout"><span className="eyebrow">{fr ? "Offres vérifiées le " : "Offers checked on "}{rich(checked)}</span>
        <ul>{items.map((o, i) => <li key={i}><b>{rich(o.label)}</b> — {rich(o.detail)} <span className="pill">{rich(o.status)}</span></li>)}</ul>
        <AffiliateLink target="pricing" placement="offers" className="btn btn--primary">{t.cta}</AffiliateLink></div>
    ),

    AppReview: ({ id }: { id: string }) => <div className="brief">{fr ? "Fiche application à compléter après test : " : "App card to complete after testing: "}{rich(id)}</div>,

    ContactForm: () => {
      const action = process.env.NEXT_PUBLIC_CONTACT_ENDPOINT;
      if (!action) return <div className="brief">{fr ? "Formulaire : définir NEXT_PUBLIC_CONTACT_ENDPOINT (ex. Formspree) dans Vercel." : "Form: set NEXT_PUBLIC_CONTACT_ENDPOINT (e.g. Formspree) in Vercel."}</div>;
      return (
        <form className="form" action={action} method="POST">
          <label>{fr ? "Nom" : "Name"}<input name="name" required /></label>
          <label>Email<input name="email" type="email" required /></label>
          <label>{fr ? "Objet" : "Subject"}<select name="subject"><option>{fr ? "Correction" : "Correction"}</option><option>{fr ? "Partenariat" : "Partnership"}</option><option>{fr ? "Autre" : "Other"}</option></select></label>
          <label>Message<textarea name="message" rows={6} required /></label>
          <button className="btn btn--primary" type="submit">{fr ? "Envoyer" : "Send"}</button>
        </form>
      );
    },
    Section,
  };
}

export function ReadNextGrid({ items, lang }: { items: string[]; lang: Lang }) {
  const t = T[lang];
  return (
    <div className="related">{items.map((r) => {
      const d = byRoute(r);
      if (!d) return null;
      return (
        <Link className="card" href={r} key={r}>
          {d.front.image ? <Image src={d.front.image} alt="" width={400} height={225} style={{ width: "100%", height: "auto", aspectRatio: "16/9", objectFit: "cover", borderRadius: 12 }} /> : <div className="ph" />}
          <span className="card__title">{d.front.h1}</span><span className="card__more">{t.read}</span>
        </Link>
      );
    })}</div>
  );
}
