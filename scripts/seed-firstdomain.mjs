// Run with: node --env-file=.env.local --experimental-strip-types scripts/seed-firstdomain.mjs
import { neon } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";
import * as schema from "../lib/firstdomain/db/schema.ts";

async function seed() {
  if (!process.env.DATABASE_URL) {
    console.error("DATABASE_URL is required");
    process.exit(1);
  }

  const sql = neon(process.env.DATABASE_URL);
  const db = drizzle(sql, { schema });

  const now = new Date();
  const openAt = new Date(now.getFullYear(), now.getMonth(), 1);
  const closeAt = new Date(now.getFullYear(), now.getMonth() + 1, 0);
  const reviewAt = new Date(now.getFullYear(), now.getMonth() + 1, 1);
  const announceAt = new Date(now.getFullYear(), now.getMonth() + 1, 15);

  const monthName = now.toLocaleDateString("en-US", {
    month: "long",
    year: "numeric",
  });

  const [cycle] = await db
    .insert(schema.applicationCycles)
    .values({
      name: monthName,
      applicationsOpenAt: openAt,
      applicationsCloseAt: closeAt,
      reviewStartsAt: reviewAt,
      winnerAnnouncedAt: announceAt,
      status: "open",
    })
    .returning();

  console.log(`Created cycle: ${cycle.name} (${cycle.id})`);

  const [winner] = await db
    .insert(schema.winners)
    .values({
      cycleId: cycle.id,
      slug: "printbible-demo",
      projectName: "PrintBible",
      founderName: "Demo Founder",
      domain: "printbible.dev",
      story:
        "PrintBible started as a simple idea to make scripture accessible in print-friendly formats. With First Domain, the founder launched on printbible.dev and reached their first 1,000 users within two weeks.",
      website: "https://printbible.dev",
      published: true,
      launchDate: new Date(now.getFullYear(), now.getMonth() - 1, 1),
    })
    .returning();

  await db.insert(schema.winnerUpdates).values({
    winnerId: winner.id,
    title: "First 1,000 users",
    body: "Reached 1,000 registered users in the first two weeks after launch.",
  });

  console.log(`Created demo winner: ${winner.projectName}`);
  console.log("Seed complete!");
}

seed().catch(console.error);
