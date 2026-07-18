// Apply CMS tables if missing. Run: npm run db:ensure:site
import { readFileSync } from "node:fs";
import { resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { Pool } from "@neondatabase/serverless";

const __dirname = dirname(fileURLToPath(import.meta.url));

async function main() {
  if (!process.env.DATABASE_URL) {
    console.error("DATABASE_URL is required");
    process.exit(1);
  }

  const pool = new Pool({ connectionString: process.env.DATABASE_URL });
  const migrationPath = resolve(__dirname, "../drizzle/0001_fwd_site_cms.sql");
  const raw = readFileSync(migrationPath, "utf8");
  const statements = raw
    .split("--> statement-breakpoint")
    .map((s) => s.trim())
    .filter(Boolean);

  try {
    for (const statement of statements) {
      try {
        await pool.query(statement);
        console.log("OK:", statement.slice(0, 60).replace(/\s+/g, " "), "…");
      } catch (err) {
        const message = err instanceof Error ? err.message : String(err);
        if (/already exists/i.test(message) || /duplicate/i.test(message)) {
          console.log(
            "SKIP (exists):",
            statement.slice(0, 60).replace(/\s+/g, " "),
            "…"
          );
          continue;
        }
        throw err;
      }
    }

    const { rows: tables } = await pool.query(`
      SELECT table_name
      FROM information_schema.tables
      WHERE table_schema = 'public'
        AND table_name IN ('posts', 'projects', 'media_assets', 'comments', 'analytics_events')
      ORDER BY table_name
    `);
    console.log(
      "CMS tables present:",
      tables.map((t) => t.table_name).join(", ") || "(none)"
    );
    if (tables.length < 5) {
      console.error("Expected 5 CMS tables");
      process.exit(1);
    }
    console.log("Schema ready.");
  } finally {
    await pool.end();
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
