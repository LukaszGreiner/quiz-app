export default function InfoItem({ icon = "x", text = "x", label = "x" }) {
  return (
    <div className="group relative flex items-center justify-start gap-1 sm:gap-2">
      <div className="w-5 flex-shrink-0 sm:w-6">{icon}</div>
      <span className="max-w-[80px] cursor-default truncate sm:max-w-[100px] md:max-w-[120px]">
        {text}
      </span>
      <div className="absolute top-full z-50 mt-2 hidden rounded bg-gray-800 px-2 py-1 text-xs text-nowrap text-white group-hover:block">
        {label}
      </div>
    </div>
  );
}
