// components/AffiliateLink.tsx
// Usage MDX : <AffiliateLink program="candy-ai" target="pricing" placement="verdict">Try Candy AI</AffiliateLink>
"use client";

import { usePathname } from "next/navigation";
import type { ProgramId } from "@/lib/affiliates";
import type { ReactNode } from "react";

type Props = {
  program?: ProgramId;          // défaut : candy-ai
  target?: string;              // deep link : "pricing", "signup", "create"…
  placement?: string;           // emplacement du bouton : "hero", "verdict", "table", "band", "sticky"…
  className?: string;
  children: ReactNode;
};

export function AffiliateLink({ program = "candy-ai", target, placement = "body", className = "btn btn--primary", children }: Props) {
  const pathname = usePathname() || "/";
  const lang = pathname.startsWith("/fr") ? "fr" : "en";
  const page = pathname.replace(/^\/fr/, "").replace(/^\/|\/$/g, "").replace(/\//g, "-") || "home";

  const href =
    `/go/${program}/${target ? `${target}/` : ""}` +
    `?p=${encodeURIComponent(page)}&pl=${encodeURIComponent(placement)}&l=${lang}`;

  return (
    <a href={href} className={className} rel="sponsored nofollow noopener" target="_blank" data-aff={program} data-placement={placement}>
      {children}
    </a>
  );
}
