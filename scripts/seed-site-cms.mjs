// Run with: node --env-file=.env.local --experimental-strip-types scripts/seed-site-cms.mjs
import { neon } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";
import { eq } from "drizzle-orm";
import * as schema from "../lib/db/schema.ts";
import { notes } from "../lib/notes.ts";
import { projects } from "../lib/projects.ts";

async function seed() {
  if (!process.env.DATABASE_URL) {
    console.error("DATABASE_URL is required");
    process.exit(1);
  }

  const sql = neon(process.env.DATABASE_URL);
  const db = drizzle(sql, { schema });

  let postsUpserted = 0;
  for (const note of notes) {
    const publishedAt = new Date(`${note.datePublished}T12:00:00.000Z`);
    const existing = await db
      .select({ id: schema.posts.id })
      .from(schema.posts)
      .where(eq(schema.posts.slug, note.slug))
      .limit(1);

    if (existing[0]) {
      await db
        .update(schema.posts)
        .set({
          title: note.title,
          category: note.category,
          excerpt: note.excerpt ?? null,
          content: note.content,
          featuredImageUrl: note.featuredImage,
          author: note.author ?? null,
          status: "published",
          publishedAt,
          updatedAt: new Date(),
        })
        .where(eq(schema.posts.id, existing[0].id));
    } else {
      await db.insert(schema.posts).values({
        slug: note.slug,
        title: note.title,
        category: note.category,
        excerpt: note.excerpt ?? null,
        content: note.content,
        featuredImageUrl: note.featuredImage,
        author: note.author ?? null,
        status: "published",
        publishedAt,
      });
    }
    postsUpserted += 1;
  }

  let projectsUpserted = 0;
  for (const [index, project] of projects.entries()) {
    const existing = await db
      .select({ id: schema.projects.id })
      .from(schema.projects)
      .where(eq(schema.projects.slug, project.slug))
      .limit(1);

    if (existing[0]) {
      await db
        .update(schema.projects)
        .set({
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
        })
        .where(eq(schema.projects.id, existing[0].id));
    } else {
      await db.insert(schema.projects).values({
        slug: project.slug,
        title: project.title,
        category: project.category,
        year: project.year,
        description: project.description ?? null,
        image: project.image,
        href: project.href,
        internal: project.internal ?? false,
        sortOrder: index,
        published: true,
      });
    }
    projectsUpserted += 1;
  }

  console.log(`Upserted ${postsUpserted} posts and ${projectsUpserted} projects`);
}

seed().catch((err) => {
  console.error(err);
  process.exit(1);
});
