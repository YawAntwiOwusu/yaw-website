import Link from "next/link";
import { desc, eq } from "drizzle-orm";
import { db, winners } from "@/lib/firstdomain/db";
import { landingContent } from "@/lib/firstdomain/content/landing";

export async function WinnersTeaser() {
  const { previousRecipients } = landingContent;

  let recentWinners: Array<{
    slug: string;
    projectName: string;
    founderName: string;
    domain: string;
  }> = [];

  if (db) {
    try {
      recentWinners = await db
        .select({
          slug: winners.slug,
          projectName: winners.projectName,
          founderName: winners.founderName,
          domain: winners.domain,
        })
        .from(winners)
        .where(eq(winners.published, true))
        .orderBy(desc(winners.createdAt))
        .limit(3);
    } catch {
      // DB not available yet
    }
  }

  return (
    <section className="px-6 py-20 md:py-28">
      <div className="mx-auto max-w-6xl">
        <div className="flex items-end justify-between">
          <h2 className="text-3xl font-normal tracking-tight text-neutral-950 md:text-4xl">
            {previousRecipients.title}
          </h2>
          {recentWinners.length > 0 && (
            <Link
              href="/firstdomain/winners"
              className="text-[13px] font-medium text-neutral-500 transition-colors hover:text-neutral-900"
            >
              View all →
            </Link>
          )}
        </div>
        {recentWinners.length > 0 ? (
          <div className="mt-10 grid gap-4 md:grid-cols-3">
            {recentWinners.map((winner) => (
              <Link
                key={winner.slug}
                href={`/firstdomain/winners/${winner.slug}`}
                className="rounded-2xl border border-neutral-200/70 bg-neutral-50 p-6 transition-colors hover:bg-neutral-100"
              >
                <p className="text-xs text-neutral-400">{winner.domain}</p>
                <h3 className="mt-2 text-[15px] font-medium text-neutral-950">
                  {winner.projectName}
                </h3>
                <p className="mt-1 text-sm text-neutral-500">
                  {winner.founderName}
                </p>
              </Link>
            ))}
          </div>
        ) : (
          <div className="mt-10 rounded-[30px] border border-dashed border-neutral-200 bg-neutral-50 p-12 text-center">
            <p className="text-[15px] font-medium text-neutral-950">
              {previousRecipients.comingSoon}
            </p>
            <div className="mx-auto mt-4 max-w-xl space-y-2 text-sm leading-relaxed text-neutral-500">
              {previousRecipients.description.map((line) => (
                <p key={line}>{line}</p>
              ))}
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
