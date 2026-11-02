const TONES: Record<string, { bg: string; fg: string }> = {
  paid: { bg: "var(--ok-soft)", fg: "var(--ok)" },
  completed: { bg: "var(--ok-soft)", fg: "var(--ok)" },
  delivered: { bg: "var(--ok-soft)", fg: "var(--ok)" },
  active: { bg: "var(--ok-soft)", fg: "var(--ok)" },
  published: { bg: "var(--ok-soft)", fg: "var(--ok)" },
  pending: { bg: "var(--warn-soft)", fg: "var(--warn)" },
  processing: { bg: "var(--warn-soft)", fg: "var(--warn)" },
  draft: { bg: "var(--warn-soft)", fg: "var(--warn)" },
  cancelled: { bg: "var(--danger-soft)", fg: "var(--danger)" },
  unpaid: { bg: "var(--danger-soft)", fg: "var(--danger)" },
  archived: { bg: "#eef1ef", fg: "var(--muted)" },
};

export function StatusBadge({ value }: { value: string }) {
  const tone = TONES[value.toLowerCase()] ?? {
    bg: "#eef1ef",
    fg: "var(--muted)",
  };

  return (
    <span
      className="inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium capitalize"
      style={{ background: tone.bg, color: tone.fg }}
    >
      {value.replaceAll("_", " ").toLowerCase()}
    </span>
  );
}
