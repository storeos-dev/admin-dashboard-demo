import { formatGrowth } from "@/lib/format";

export function KpiCard({
  label,
  value,
  hint,
  growth,
}: {
  label: string;
  value: string;
  hint?: string;
  growth?: number | null;
}) {
  const growthLabel = formatGrowth(growth);
  const up = (growth ?? 0) > 0;
  const down = (growth ?? 0) < 0;

  return (
    <div className="rounded-[var(--radius)] border border-[var(--border)] bg-[var(--bg-elevated)] p-5 shadow-[var(--shadow)]">
      <p className="text-xs font-semibold tracking-[0.14em] text-[var(--muted)] uppercase">
        {label}
      </p>
      <p
        className="mt-3 text-3xl tracking-tight text-[var(--fg)]"
        style={{ fontFamily: "var(--display)" }}
      >
        {value}
      </p>
      <div className="mt-2 flex flex-wrap items-center gap-2 text-sm text-[var(--muted)]">
        {growthLabel ? (
          <span
            className={
              up ? "text-[var(--ok)]" : down ? "text-[var(--danger)]" : undefined
            }
          >
            {growthLabel}
          </span>
        ) : null}
        {hint ? <span>{hint}</span> : null}
      </div>
    </div>
  );
}
