// Liste les pages qui contiennent encore des <Todo> (à compléter après test réel).
import fs from "node:fs"; import path from "node:path";
const walk = (d) => fs.readdirSync(d, { withFileTypes: true }).flatMap((e) => e.isDirectory() ? walk(path.join(d, e.name)) : e.name.endsWith(".mdx") ? [path.join(d, e.name)] : []);
let total = 0;
for (const f of walk("content")) { const n = (fs.readFileSync(f, "utf8").match(/<Todo/g) || []).length; if (n) { total += n; console.log(String(n).padStart(3), f); } }
console.log(`\n${total} repères <Todo> restants.`);
