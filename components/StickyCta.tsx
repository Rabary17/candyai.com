"use client";
import { useEffect, useState } from "react";
import { AffiliateLink } from "./AffiliateLink";

export function StickyCta({ text, cta }: { text: string; cta: string }) {
  const [show, setShow] = useState(false);
  useEffect(() => {
    const hero = document.querySelector(".hero");
    if (!hero || !("IntersectionObserver" in window)) return;
    const io = new IntersectionObserver((e) => setShow(!e[0].isIntersecting));
    io.observe(hero);
    return () => io.disconnect();
  }, []);
  return (
    <div className={`sticky-cta${show ? " is-visible" : ""}`}>
      <span>{text}</span>
      <AffiliateLink placement="sticky">{cta}</AffiliateLink>
    </div>
  );
}
