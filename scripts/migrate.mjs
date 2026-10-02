// Runs db/migrate.sql against DATABASE_URL.
// Usage: node --env-file=.env.local scripts/migrate.mjs
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";
import pg from "pg";

const url = process.env.DATABASE_URL;
if (!url || url.includes("[YOUR-PASSWORD]")) {
  console.error("DATABASE_URL is missing or still contains the [YOUR-PASSWORD] placeholder.");
  process.exit(1);
}

const sql = readFileSync(join(dirname(fileURLToPath(import.meta.url)), "../db/migrate.sql"), "utf8");
const client = new pg.Client({ connectionString: url });

await client.connect();
try {
  await client.query(sql);
  console.log("Migration completed.");
} finally {
  await client.end();
}
