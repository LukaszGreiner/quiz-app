import { FaAngleDown } from "react-icons/fa";

const CollapsibleSection = ({ isOpen, onToggle, summary, children, label }) => (
  <div className="rounded-md border border-gray-200 bg-gray-50 p-4">
    {isOpen ? children : summary}
    <div className="mt-2 flex justify-center">
      <FaAngleDown
        size={16}
        className={`cursor-pointer text-gray-400 transition-transform ${isOpen ? "rotate-180" : ""}`}
        onClick={onToggle}
        onKeyDown={(e) => (e.key === "Enter" || e.key === " ") && onToggle()}
        tabIndex={0}
        role="button"
        aria-expanded={isOpen}
        aria-label={label || (isOpen ? "Zwiń" : "Rozwiń")}
      />
    </div>
  </div>
);

export default CollapsibleSection;
