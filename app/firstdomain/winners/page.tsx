import Link from "next/link";
import { desc, eq } from "drizzle-orm";
import { db, winners, applicationCycles } from "@/lib/firstdomain/db";

export const metadata = {
  title: "Previous Winners",
};

export const dynamic = "force-dynamic";

export default async function WinnersPage() {
  let winnerList: Array<{
    slug: string;
    projectName: string;
    founderName: string;
    domain: string;
    cycleId: string | null;
    launchDate: Date | null;
  }> = [];

  if (db) {
    try {
      winnerList = await db
        .select({
          slug: winners.slug,
          projectName: winners.projectName,
          founderName: winners.founderName,
          domain: winners.domain,
          cycleId: winners.cycleId,
          launchDate: winners.launchDate,
        })
        .from(winners)
        .where(eq(winners.published, true))
        .orderBy(desc(winners.createdAt));
    } catch {
      // DB unavailable
    }
  }

  return (
    <div className="mx-auto max-w-6xl px-6 py-12">
      <h1 className="text-3xl font-bold text-slate-900">Previous Winners</h1>
      <p className="mt-2 text-slate-600">
        Founders who launched with First Domain
      </p>

      {winnerList.length === 0 ? (
        <div className="mt-12 rounded-xl border border-dashed border-slate-200 bg-slate-50 p-16 text-center">
          <p className="text-slate-600">
            No winners published yet. Be the first!
          </p>
          <Link
            href="/firstdomain/apply"
            className="mt-4 inline-block text-indigo-600 hover:text-indigo-700"
          >
            Apply now →
          </Link>
        </div>
      ) : (
        <div className="mt-10 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {winnerList.map((winner) => (
            <Link
              key={winner.slug}
              href={`/firstdomain/winners/${winner.slug}`}
              className="group rounded-xl border border-slate-200 bg-white p-6 transition-shadow hover:shadow-lg"
            >
              <p className="font-mono text-sm text-indigo-600">
                {winner.domain}
              </p>
              <h2 className="mt-2 text-xl font-semibold text-slate-900 group-hover:text-indigo-600">
                {winner.projectName}
              </h2>
              <p className="mt-1 text-slate-500">{winner.founderName}</p>
              {winner.launchDate && (
                <p className="mt-3 text-xs text-slate-400">
                  Launched{" "}
                  {winner.launchDate.toLocaleDateString("en-US", {
                    month: "long",
                    year: "numeric",
                  })}
                </p>
              )}
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
