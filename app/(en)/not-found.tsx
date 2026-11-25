import Link from "next/link";
export default function NotFound() {
  return <main className="section"><div className="wrap"><h1>Page not found</h1><p style={{ marginTop: 16 }}><Link href="/">← Home</Link> · <Link href="/fr/">Version française</Link></p></div></main>;
}
