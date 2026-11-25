"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { AffiliateLink } from "./AffiliateLink";

type Props = { lang: "en" | "fr"; nav: readonly { href: string; label: string }[]; tagline: string; cta: string; alternates: Record<string, string> };

export function SiteHeader({ lang, nav, tagline, cta, alternates }: Props) {
  const [open, setOpen] = useState(false);
  const path = usePathname() || "/";
  const other = alternates[path] ?? (lang === "en" ? "/fr/" : "/");
  return (
    <header className="header">
      <div className="wrap header__in">
        <Link className="logo" href={lang === "fr" ? "/fr/" : "/"} aria-label="AI Girlfriend Rated">
          <img src="/brand/favicon.svg" width={34} height={34} alt="" />
          <span><span className="logo__name">AI Girlfriend Rated</span><span className="logo__tag">{tagline}</span></span>
        </Link>
        <button className="burger" aria-label="Menu" aria-expanded={open} onClick={() => setOpen(!open)}>☰</button>
        <nav className={`nav${open ? " is-open" : ""}`}>
          {nav.map((n) => (
            <Link key={n.href} href={n.href} aria-current={path.startsWith(n.href) ? "page" : undefined} onClick={() => setOpen(false)}>{n.label}</Link>
          ))}
        </nav>
        <div className="header__right">
          <div className="lang">
            {lang === "en" ? <><span>EN</span><Link href={other} hrefLang="fr">FR</Link></> : <><Link href={other} hrefLang="en">EN</Link><span>FR</span></>}
          </div>
          <AffiliateLink placement="header" className="btn btn--primary header__cta">{cta}</AffiliateLink>
        </div>
      </div>
    </header>
  );
}
