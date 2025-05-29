export default function InfoItem({
  icon = "x",
  text = "x",
  label = "x",
  compact = false,
}) {
  return (
    <div className="group relative flex items-center gap-1.5">
      <div className="flex-shrink-0">{icon}</div>
      <span
        className={`text-text flex-1 truncate ${compact ? "text-xs" : "text-sm"}`}
        title={`${label}: ${text}`}
      >
        {text}
      </span>
      {/* Tooltip only shows on hover */}
      <div className="bg-surface-elevated border-border text-text pointer-events-none absolute bottom-full left-1/2 z-50 mb-2 hidden -translate-x-1/2 transform rounded border px-2 py-1 text-xs whitespace-nowrap opacity-0 shadow-lg transition-opacity duration-200 group-hover:block group-hover:opacity-100">
        {label}
      </div>
    </div>
  );
}
