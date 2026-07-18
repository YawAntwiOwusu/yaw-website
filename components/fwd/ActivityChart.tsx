export function ActivityChart({
  days,
  points,
}: {
  days: number;
  points: { day: string; count: number }[];
}) {
  const map = new Map(points.map((p) => [p.day, p.count]));
  const series: { day: string; count: number; label: string }[] = [];
  const now = new Date();
  for (let i = days - 1; i >= 0; i--) {
    const d = new Date(now);
    d.setUTCDate(d.getUTCDate() - i);
    const key = d.toISOString().slice(0, 10);
    series.push({
      day: key,
      count: map.get(key) ?? 0,
      label: d.toLocaleDateString("en-US", { month: "short", day: "numeric" }),
    });
  }

  const max = Math.max(1, ...series.map((s) => s.count));
  const start = series[0]?.label ?? "";
  const end = series[series.length - 1]?.label ?? "";

  return (
    <div className="rounded-xl border border-neutral-200 bg-white p-5 shadow-sm">
      <div className="flex items-center justify-between gap-3">
        <h2 className="text-sm font-semibold text-neutral-900">
          {start} – {end}
        </h2>
        <p className="text-xs text-neutral-500">Pageviews · last {days} days</p>
      </div>
      <div className="mt-6 flex h-48 items-end gap-1 md:gap-1.5">
        {series.map((point) => {
          const height = Math.max(2, Math.round((point.count / max) * 100));
          return (
            <div
              key={point.day}
              className="group relative flex flex-1 flex-col items-center justify-end"
              title={`${point.label}: ${point.count}`}
            >
              <div
                className="w-full rounded-sm bg-emerald-500/90 transition-opacity group-hover:opacity-80"
                style={{ height: `${height}%` }}
              />
            </div>
          );
        })}
      </div>
      <div className="mt-3 flex justify-between text-[11px] text-neutral-400">
        <span>{start}</span>
        <span>{end}</span>
      </div>
    </div>
  );
}
