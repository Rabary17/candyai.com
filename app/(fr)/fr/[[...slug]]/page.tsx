import { DocPage, pageMetadata, staticParams } from "@/components/Page";

export const dynamicParams = false;
export function generateStaticParams() { return staticParams("fr"); }
export async function generateMetadata({ params }: { params: Promise<{ slug?: string[] }> }) {
  return pageMetadata("fr", (await params).slug);
}
export default async function Page({ params }: { params: Promise<{ slug?: string[] }> }) {
  return <DocPage lang="fr" slug={(await params).slug} />;
}
