// Upsert all notes + projects into Neon.
// Run: npm run db:seed:site
import { neon } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";
import { eq, sql } from "drizzle-orm";
import * as schema from "../lib/db/schema.ts";
import { notes } from "../lib/notes.ts";
import { projects } from "../lib/projects.ts";

async function seed() {
  if (!process.env.DATABASE_URL) {
    console.error("DATABASE_URL is required");
    process.exit(1);
  }

  if (!Array.isArray(notes) || notes.length === 0) {
    console.error("No notes found in lib/notes.ts");
    process.exit(1);
  }
  if (!Array.isArray(projects) || projects.length === 0) {
    console.error("No projects found in lib/projects.ts");
    process.exit(1);
  }

  const client = neon(process.env.DATABASE_URL);
  const db = drizzle(client, { schema });

  console.log(`Seeding ${notes.length} notes → posts…`);
  let postsInserted = 0;
  let postsUpdated = 0;

  for (const note of notes) {
    const publishedAt = new Date(`${note.datePublished}T12:00:00.000Z`);
    const values = {
      title: note.title,
      category: note.category,
      excerpt: note.excerpt ?? null,
      content: note.content,
      featuredImageUrl: note.featuredImage,
      author: note.author ?? null,
      status: "published",
      publishedAt,
      updatedAt: new Date(),
    };

    const existing = await db
      .select({ id: schema.posts.id })
      .from(schema.posts)
      .where(eq(schema.posts.slug, note.slug))
      .limit(1);

    if (existing[0]) {
      await db
        .update(schema.posts)
        .set(values)
        .where(eq(schema.posts.id, existing[0].id));
      postsUpdated += 1;
    } else {
      await db.insert(schema.posts).values({
        slug: note.slug,
        ...values,
      });
      postsInserted += 1;
    }
  }

  console.log(`Seeding ${projects.length} portfolio projects…`);
  let projectsInserted = 0;
  let projectsUpdated = 0;

  for (const [index, project] of projects.entries()) {
    const values = {
      title: project.title,
      category: project.category,
      year: project.year,
      description: project.description ?? null,
      image: project.image,
      href: project.href,
      internal: project.internal ?? false,
      sortOrder: index,
      published: true,
      updatedAt: new Date(),
    };

    const existing = await db
      .select({ id: schema.projects.id })
      .from(schema.projects)
      .where(eq(schema.projects.slug, project.slug))
      .limit(1);

    if (existing[0]) {
      await db
        .update(schema.projects)
        .set(values)
        .where(eq(schema.projects.id, existing[0].id));
      projectsUpdated += 1;
    } else {
      await db.insert(schema.projects).values({
        slug: project.slug,
        ...values,
      });
      projectsInserted += 1;
    }
  }

  const [postCount] = await db
    .select({ count: sql`count(*)::int` })
    .from(schema.posts);
  const [projectCount] = await db
    .select({ count: sql`count(*)::int` })
    .from(schema.projects);

  console.log(
    `Posts: ${postsInserted} inserted, ${postsUpdated} updated (total ${postCount?.count ?? "?"})`
  );
  console.log(
    `Projects: ${projectsInserted} inserted, ${projectsUpdated} updated (total ${projectCount?.count ?? "?"})`
  );
  console.log("Content seed complete.");
}

seed().catch((err) => {
  console.error(err);
  process.exit(1);
});
