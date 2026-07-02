import Link from "next/link";
import { notFound } from "next/navigation";
import { eq } from "drizzle-orm";
import { db, winners, winnerUpdates } from "@/lib/firstdomain/db";

export const dynamic = "force-dynamic";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  if (!db) return { title: "Winner" };

  const [winner] = await db
    .select()
    .from(winners)
    .where(eq(winners.slug, slug))
    .limit(1);

  if (!winner) return { title: "Winner Not Found" };

  return {
    title: `${winner.projectName} — ${winner.founderName}`,
    description: winner.story?.slice(0, 160),
  };
}

export default async function WinnerDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  if (!db) notFound();

  const [winner] = await db
    .select()
    .from(winners)
    .where(eq(winners.slug, slug))
    .limit(1);

  if (!winner || !winner.published) notFound();

  const updates = await db
    .select()
    .from(winnerUpdates)
    .where(eq(winnerUpdates.winnerId, winner.id))
    .orderBy(winnerUpdates.publishedAt);

  return (
    <article className="mx-auto max-w-3xl px-6 py-12">
      <Link
        href="/firstdomain/winners"
        className="text-sm text-indigo-600 hover:text-indigo-700"
      >
        ← All Winners
      </Link>

      <header className="mt-6">
        <p className="font-mono text-indigo-600">{winner.domain}</p>
        <h1 className="mt-2 text-4xl font-bold text-slate-900">
          {winner.projectName}
        </h1>
        <p className="mt-2 text-lg text-slate-600">{winner.founderName}</p>
        {winner.launchDate && (
          <p className="mt-2 text-sm text-slate-400">
            Launched{" "}
            {winner.launchDate.toLocaleDateString("en-US", {
              month: "long",
              day: "numeric",
              year: "numeric",
            })}
          </p>
        )}
      </header>

      {winner.story && (
        <div className="prose prose-slate mt-10 max-w-none">
          {winner.story.split("\n\n").map((paragraph, i) => (
            <p key={i}>{paragraph}</p>
          ))}
        </div>
      )}

      {winner.website && (
        <p className="mt-8">
          <a
            href={winner.website}
            target="_blank"
            rel="noopener noreferrer"
            className="text-indigo-600 hover:text-indigo-700"
          >
            Visit {winner.projectName} →
          </a>
        </p>
      )}

      {updates.length > 0 && (
        <section className="mt-16">
          <h2 className="text-2xl font-bold text-slate-900">
            Progress Updates
          </h2>
          <div className="mt-6 space-y-8">
            {updates.map((update) => (
              <div
                key={update.id}
                className="border-l-2 border-indigo-200 pl-6"
              >
                <p className="text-xs text-slate-400">
                  {update.publishedAt.toLocaleDateString("en-US", {
                    month: "long",
                    day: "numeric",
                    year: "numeric",
                  })}
                </p>
                <h3 className="mt-1 font-semibold text-slate-900">
                  {update.title}
                </h3>
                <p className="mt-2 text-slate-600">{update.body}</p>
              </div>
            ))}
          </div>
        </section>
      )}
    </article>
  );
}
