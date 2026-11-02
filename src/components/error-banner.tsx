export function ErrorBanner({
  title = "Something went wrong",
  message,
}: {
  title?: string;
  message: string;
}) {
  return (
    <div
      role="alert"
      className="rounded-[var(--radius)] border border-[color-mix(in_oklab,var(--danger)_30%,var(--border))] bg-[var(--danger-soft)] px-4 py-3 text-sm text-[var(--danger)]"
    >
      <p className="font-semibold">{title}</p>
      <p className="mt-1 opacity-90">{message}</p>
    </div>
  );
}
