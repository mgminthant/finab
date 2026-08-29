import { execSync } from "node:child_process";
import { mkdirSync, writeFileSync, copyFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const name = process.argv[2];

if (!name) {
  console.error("Usage: npm run db:migrate <name>  (e.g. add_category_table)");
  process.exit(1);
}

const baseline = join(root, "prisma", "baseline.prisma");
const schema = join(root, "prisma", "schema.prisma");

const raw = execSync(
  `npx prisma migrate diff --from-schema "${baseline}" --to-schema "${schema}" --script`,
  { cwd: root, encoding: "utf8", stdio: ["ignore", "pipe", "inherit"] },
);

// Prisma writes log lines (◇ …, "Loaded Prisma config") to stdout when piped.
// Keep only lines that look like SQL.
const sql = raw
  .split("\n")
  .filter((line) => {
    const t = line.trim();
    if (!t) return false;
    if (t.includes("◇")) return false;
    if (/^(loaded|injected|prisma|datasource|error)\b/i.test(t)) return false;
    return true;
  })
  .join("\n")
  .trim();

if (!sql) {
  console.error("No schema changes detected — nothing to generate.");
  process.exit(0);
}

const d = new Date();
const pad = (n) => String(n).padStart(2, "0");
const ts = `${d.getFullYear()}${pad(d.getMonth() + 1)}${pad(d.getDate())}${pad(
  d.getHours(),
)}${pad(d.getMinutes())}${pad(d.getSeconds())}`;

const dir = join(root, "prisma", "migrations", `${ts}_${name}`);
mkdirSync(dir, { recursive: true });
writeFileSync(join(dir, "migration.sql"), sql);
copyFileSync(schema, baseline);

console.log(`\nCreated ${dir}/migration.sql`);
console.log("Review the SQL, then run: npm run db:deploy");
