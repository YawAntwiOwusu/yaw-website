import { landingContent } from "@/lib/firstdomain/content/landing";

export function SelectionCriteria() {
  const { selectionCriteria } = landingContent;
  return (
    <section className="px-6 py-10">
      <div className="mx-auto max-w-6xl rounded-[30px] bg-neutral-50 p-8 md:p-12">
        <div className="grid gap-10 lg:grid-cols-2 lg:gap-16">
          <div>
            <h2 className="text-3xl font-normal tracking-tight text-neutral-950 md:text-4xl">
              {selectionCriteria.title}
            </h2>
            <p className="mt-4 whitespace-pre-line text-sm leading-relaxed text-neutral-500">
              {selectionCriteria.intro}
            </p>
            <div className="mt-8 space-y-1">
              {selectionCriteria.closing.map((line, i) => (
                <p
                  key={line}
                  className={
                    i === selectionCriteria.closing.length - 1
                      ? "text-sm font-medium text-neutral-900"
                      : "text-sm text-neutral-500"
                  }
                >
                  {line}
                </p>
              ))}
            </div>
          </div>
          <ul className="grid gap-3 sm:grid-cols-2">
            {selectionCriteria.criteria.map((item, index) => (
              <li
                key={item.title}
                className="rounded-2xl border border-neutral-200 bg-white p-5 shadow-[0_1px_2px_rgba(0,0,0,0.03)]"
              >
                <span className="text-xs text-neutral-400">
                  {String(index + 1).padStart(2, "0")}
                </span>
                <p className="mt-2 text-sm font-medium text-neutral-900">
                  {item.title}
                </p>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
