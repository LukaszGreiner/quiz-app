import { useState } from "react";
import { FaAngleDown } from "react-icons/fa";

const CollapsibleSection = ({
  children,
  summary,
  defaultOpen = true,
  onToggle,
}) => {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  const handleToggle = () => {
    if (onToggle) {
      onToggle(isOpen, setIsOpen); // Pass current state and setter to custom handler
    } else {
      setIsOpen((prev) => !prev); // Default toggle behavior
    }
  };

  return (
    <div>
      {summary}
      <div
        className={`overflow-hidden transition-all duration-300 ease-in-out ${
          isOpen ? "max-h-[500px]" : "max-h-0"
        }`}
      >
        {children}
      </div>
      <div className="mt-2 flex justify-center">
        <FaAngleDown
          size={16}
          className={`cursor-pointer text-gray-400 transition-transform ${
            isOpen ? "rotate-180" : ""
          }`}
          onClick={handleToggle}
          onKeyDown={(e) =>
            (e.key === "Enter" || e.key === " ") && handleToggle()
          }
          tabIndex={0}
          role="button"
          aria-expanded={isOpen}
          aria-label={isOpen ? "Pokaż mniej" : "Pokaż więcej"}
          title={isOpen ? "Pokaż mniej" : "Pokaż więcej"}
        />
      </div>
    </div>
  );
};

export default CollapsibleSection;
