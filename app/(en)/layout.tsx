import "../globals.css";
import type { Metadata } from "next";
import { Shell } from "@/components/Shell";
import { SITE_URL } from "@/lib/site";

export const metadata: Metadata = { metadataBase: new URL(SITE_URL), icons: { icon: "/brand/favicon.svg" } };
export default function Layout({ children }: { children: React.ReactNode }) {
  return <Shell lang="en">{children}</Shell>;
}
