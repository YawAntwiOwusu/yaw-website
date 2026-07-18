// Full site CMS bootstrap: schema → content → media
// Run: npm run db:bootstrap:site
import { spawnSync } from "node:child_process";

function run(label, args) {
  console.log(`\n=== ${label} ===`);
  const result = spawnSync(process.execPath, args, {
    stdio: "inherit",
    env: process.env,
  });
  if (result.status !== 0) {
    process.exit(result.status ?? 1);
  }
}

const strip = "--experimental-strip-types";

run("Ensure schema", [strip, "scripts/ensure-site-schema.mjs"]);
run("Seed content", [strip, "scripts/seed-site-cms.mjs"]);

if (process.env.BLOB_READ_WRITE_TOKEN) {
  run("Seed media", [strip, "scripts/seed-site-media.mjs"]);
} else {
  console.log(
    "\n=== Seed media SKIPPED (BLOB_READ_WRITE_TOKEN not set) ==="
  );
}

console.log("\nBootstrap complete.");
