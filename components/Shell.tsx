import Link from "next/link";
import type { ReactNode } from "react";
import { Bricolage_Grotesque, Geist, Geist_Mono } from "next/font/google";
import { allDocs } from "@/lib/content";
import { SITE_URL, SITE_NAME, T, type Lang } from "@/lib/site";
import { AgeGate } from "./AgeGate";
import { SiteHeader } from "./SiteHeader";
import { StickyCta } from "./StickyCta";
import { JsonLd } from "./JsonLd";

const display = Bricolage_Grotesque({ subsets: ["latin"], weight: ["500", "700", "800"], variable: "--font-display", display: "swap" });
const body = Geist({ subsets: ["latin"], weight: ["400", "500", "600"], variable: "--font-body", display: "swap" });
const mono = Geist_Mono({ subsets: ["latin"], weight: ["400", "500"], variable: "--font-mono", display: "swap" });

function alternatesMap() {
  const m: Record<string, string> = {};
  for (const d of allDocs()) if (d.front.alternate) m[d.route] = d.front.alternate;
  return m;
}

export function Shell({ lang, children }: { lang: Lang; children: ReactNode }) {
  const t = T[lang];
  return (
    <html lang={lang} className={`${display.variable} ${body.variable} ${mono.variable}`}>
      <body>
        <JsonLd data={[{ "@context": "https://schema.org", "@type": "Organization", name: SITE_NAME, url: SITE_URL + "/", logo: SITE_URL + "/brand/logo.svg" }, { "@context": "https://schema.org", "@type": "WebSite", name: SITE_NAME, url: SITE_URL + (lang === "fr" ? "/fr/" : "/"), inLanguage: lang }]} />
        <AgeGate title={t.gateTitle} text={t.gateText} ok={t.gateOk} leave={t.gateLeave} />
        <SiteHeader lang={lang} nav={t.nav} tagline={t.tagline} cta={t.cta} alternates={alternatesMap()} />
        {children}
        <footer className="footer"><div className="wrap">
          <div className="footer__cols">{t.footer.map((c) => (
            <div className="footer__col" key={c.title}><span className="footer__title">{c.title}</span>{c.links.map(([h, l]) => <Link key={h} href={h}>{l}</Link>)}</div>
          ))}</div>
          <div className="footer__bottom"><span><span className="badge18">18+</span>{t.footerNote}</span><span>© {new Date().getFullYear()} {SITE_NAME}</span></div>
        </div></footer>
        <StickyCta text={t.sticky} cta={t.cta} />
      </body>
    </html>
  );
}
