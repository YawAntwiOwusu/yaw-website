export function FwdPageHeader({
  eyebrow = "Overview",
  title,
  description,
  actions,
}: {
  eyebrow?: string;
  title: string;
  description?: string;
  actions?: React.ReactNode;
}) {
  return (
    <div className="mb-8 flex flex-wrap items-start justify-between gap-4">
      <div>
        <p className="text-xs font-medium uppercase tracking-[0.14em] text-neutral-500">
          {eyebrow}
        </p>
        <h1 className="mt-1 text-3xl font-semibold tracking-tight text-neutral-950">
          {title}
        </h1>
        {description && (
          <p className="mt-2 max-w-2xl text-sm text-neutral-500">{description}</p>
        )}
      </div>
      {actions ? <div className="flex flex-wrap gap-2">{actions}</div> : null}
    </div>
  );
}
