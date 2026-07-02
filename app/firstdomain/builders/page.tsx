import Link from "next/link";
import { and, eq } from "drizzle-orm";
import { db, applications } from "@/lib/firstdomain/db";

export const metadata = {
  title: "Builder Wall",
};

export const dynamic = "force-dynamic";

export default async function BuildersPage() {
  let builders: Array<{
    fullName: string;
    projectName: string;
    description: string;
    country: string;
    demoUrl: string | null;
    website: string | null;
    category: string;
    launchStage: string;
  }> = [];

  if (db) {
    try {
      builders = await db
        .select({
          fullName: applications.fullName,
          projectName: applications.projectName,
          description: applications.description,
          country: applications.country,
          demoUrl: applications.demoUrl,
          website: applications.website,
          category: applications.category,
          launchStage: applications.launchStage,
        })
        .from(applications)
        .where(
          and(
            eq(applications.optIntoBuilderWall, true),
            eq(applications.builderWallPublic, true)
          )
        );
    } catch {
      // DB unavailable
    }
  }

  return (
    <div className="mx-auto max-w-6xl px-6 py-12">
      <h1 className="text-3xl font-bold text-slate-900">Builder Wall</h1>
      <p className="mt-2 max-w-2xl text-slate-600">
        Founders building in public. Opt in when you apply to showcase your
        project here.
      </p>

      {builders.length === 0 ? (
        <div className="mt-12 rounded-xl border border-dashed border-slate-200 bg-slate-50 p-16 text-center">
          <p className="text-slate-600">
            No builders on the wall yet. Be the first to opt in when you apply!
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
          {builders.map((builder) => (
            <div
              key={`${builder.fullName}-${builder.projectName}`}
              className="rounded-xl border border-slate-200 bg-white p-6"
            >
              <div className="flex items-start justify-between">
                <div>
                  <h2 className="text-lg font-semibold text-slate-900">
                    {builder.projectName}
                  </h2>
                  <p className="text-sm text-slate-500">{builder.fullName}</p>
                </div>
                <span className="rounded-full bg-slate-100 px-2 py-1 text-xs text-slate-600">
                  {builder.launchStage}
                </span>
              </div>
              <p className="mt-3 line-clamp-3 text-sm text-slate-600">
                {builder.description}
              </p>
              <div className="mt-4 flex items-center gap-3 text-xs text-slate-400">
                <span>{builder.country}</span>
                <span>·</span>
                <span>{builder.category}</span>
              </div>
              {(builder.demoUrl || builder.website) && (
                <div className="mt-4 flex gap-3">
                  {builder.demoUrl && (
                    <a
                      href={builder.demoUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm text-indigo-600 hover:text-indigo-700"
                    >
                      Demo →
                    </a>
                  )}
                  {builder.website && (
                    <a
                      href={builder.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm text-indigo-600 hover:text-indigo-700"
                    >
                      Website →
                    </a>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
