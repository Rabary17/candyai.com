import { BlogIndex, blogIndexMetadata } from "@/components/Blog";
export const metadata = blogIndexMetadata("fr");
export default function Page() { return <BlogIndex lang="fr" />; }
