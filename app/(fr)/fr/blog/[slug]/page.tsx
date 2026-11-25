import { PostPage, postMetadata, getAllPosts } from "@/components/Blog";
export const dynamicParams = false;
export function generateStaticParams() { return getAllPosts("fr").map((p) => ({ slug: p.slug })); }
export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) { return postMetadata("fr", (await params).slug); }
export default async function Page({ params }: { params: Promise<{ slug: string }> }) { return <PostPage lang="fr" slug={(await params).slug} />; }
