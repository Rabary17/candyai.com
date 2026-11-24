import type { ReactNode } from "react";

/** Affiche un repère « à compléter » (après test réel). */
export function Todo({ children }: { children?: ReactNode }) {
  return <mark className="todo">{children ?? "TODO"}</mark>;
}

/** Transforme une chaîne contenant <Todo>…</Todo> ou "TODO" en nœuds React. */
export function rich(v: ReactNode): ReactNode {
  if (typeof v !== "string") return v;
  if (v === "TODO") return <Todo />;
  const parts = v.split(/<Todo>(.*?)<\/Todo>/g);
  if (parts.length === 1) return v;
  return parts.map((p, i) => (i % 2 ? <Todo key={i}>{p || "TODO"}</Todo> : p));
}
