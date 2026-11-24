"use client";
import { useState } from "react";
import { AffiliateLink } from "./AffiliateLink";
import prices from "@/data/prices.json";

const IMG = prices.candyAi.tokenCosts.image;
const MIN = prices.candyAi.tokenCosts.callPerMinute;
const INCLUDED = 100;
const PACK = prices.candyAi.tokenPacks.fromPrice;
const EUR = 0.86; // taux indicatif, à ajuster
const PLANS = { monthly: 13.99, quarterly: 8.99, annual: (3.99 + 6.3) / 2 } as const;
type Plan = keyof typeof PLANS;

const L = {
  en: { title: "Estimate your real bill", sub: "1 image ≈ 4 tokens · 1 call minute ≈ 3 tokens · pack ≈ $9.99 per 100 tokens", presets: [["Chatter · text only", 0, 0, "annual"], ["Regular · 25 images + 20 min", 25, 20, "annual"], ["Power user · 100 images + 60 min", 100, 60, "monthly"]], images: "Images per month", minutes: "Call minutes per month", plan: "Plan", plans: { monthly: "Monthly", quarterly: "Quarterly", annual: "Annual" }, out: "ESTIMATED MONTHLY COST", sub2: "Subscription", tok: "Tokens used", packs: "Extra packs", note: "Indicative estimate, approximate € rate.", cta: "Try Candy AI →" },
  fr: { title: "Estimez votre vraie facture", sub: "1 image ≈ 4 jetons · 1 minute d'appel ≈ 3 jetons · pack ≈ 9,99 $ les 100 jetons", presets: [["Bavard · texte seul", 0, 0, "annual"], ["Régulier · 25 images + 20 min", 25, 20, "annual"], ["Intensif · 100 images + 60 min", 100, 60, "monthly"]], images: "Images par mois", minutes: "Minutes d'appel par mois", plan: "Formule", plans: { monthly: "Mensuel", quarterly: "Trimestriel", annual: "Annuel" }, out: "COÛT MENSUEL ESTIMÉ", sub2: "Abonnement", tok: "Jetons utilisés", packs: "Packs en plus", note: "Estimation indicative, taux € approximatif.", cta: "Essayer Candy AI →" },
} as const;

export function PriceCalculator({ lang = "en" }: { lang?: "en" | "fr" }) {
  const t = L[lang];
  const [img, setImg] = useState(25);
  const [min, setMin] = useState(20);
  const [plan, setPlan] = useState<Plan>("annual");
  const fmt = (n: number, cur: string) => (lang === "fr" ? `${n.toFixed(2).replace(".", ",")} ${cur}` : cur === "$" ? `$${n.toFixed(2)}` : `${n.toFixed(2)} ${cur}`);
  const tokens = img * IMG + min * MIN;
  const packs = Math.ceil(Math.max(0, tokens - INCLUDED) / 100);
  const base = PLANS[plan];
  const total = base + packs * PACK;
  return (
    <div className="calc">
      <div className="calc__in">
        <div><h3>{t.title}</h3><p className="muted" style={{ fontSize: 14, marginTop: 6 }}>{t.sub}</p></div>
        <div className="calc__presets">
          {t.presets.map(([label, i, m, p]) => (
            <button key={label} className="chip" type="button" onClick={() => { setImg(i); setMin(m); setPlan(p as Plan); }}>{label}</button>
          ))}
        </div>
        <label><span>{t.images}<output>{img}</output></span><input type="range" min={0} max={150} step={5} value={img} onChange={(e) => setImg(+e.target.value)} /></label>
        <label><span>{t.minutes}<output>{min}</output></span><input type="range" min={0} max={120} step={5} value={min} onChange={(e) => setMin(+e.target.value)} /></label>
        <label>{t.plan}<select value={plan} onChange={(e) => setPlan(e.target.value as Plan)}>{(Object.keys(t.plans) as Plan[]).map((k) => <option key={k} value={k}>{t.plans[k]}</option>)}</select></label>
      </div>
      <div className="calc__out">
        <span className="eyebrow">{t.out}</span>
        <div style={{ display: "flex", gap: 14, alignItems: "baseline", flexWrap: "wrap" }}>
          <span className="calc__total">{fmt(total, "$")}</span><span className="calc__eur">≈ {fmt(total * EUR, "€")}</span>
        </div>
        <div className="calc__rows">
          <div><span>{t.sub2}</span><span>{fmt(base, "$")}</span></div>
          <div><span>{t.tok}</span><span>{tokens} / {INCLUDED}</span></div>
          <div><span>{t.packs}</span><span>{packs} × {fmt(PACK, "$")}</span></div>
        </div>
        <small>{t.note}</small>
        <AffiliateLink placement="calculator" className="btn btn--dark">{t.cta}</AffiliateLink>
      </div>
    </div>
  );
}
