export default function InfoItem({ icon = "x", text = "x", label = "x" }) {
  return (
    <div className="group relative flex items-center gap-2">
      <div className="flex-shrink-0">{icon}</div>
      <span className="text-text flex-1 truncate text-sm" title={text}>
        {text}
      </span>
      <div className="bg-surface-elevated border-border text-text absolute bottom-full left-1/2 z-50 mb-2 hidden -translate-x-1/2 transform rounded border px-2 py-1 text-xs whitespace-nowrap shadow-md group-hover:block">
        {label}
      </div>
    </div>
  );
}
