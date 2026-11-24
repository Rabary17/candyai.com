import { DocPage, pageMetadata, staticParams } from "@/components/Page";

export const dynamicParams = false;
export function generateStaticParams() { return staticParams("en"); }
export async function generateMetadata({ params }: { params: Promise<{ slug?: string[] }> }) {
  return pageMetadata("en", (await params).slug);
}
export default async function Page({ params }: { params: Promise<{ slug?: string[] }> }) {
  return <DocPage lang="en" slug={(await params).slug} />;
}
