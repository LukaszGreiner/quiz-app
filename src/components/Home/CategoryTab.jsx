import { memo } from 'react';

const CategoryTab = memo(({ category, isActive, onClick }) => {
  const baseClasses = "rounded-lg px-6 py-3 font-medium transition-all duration-200";
  const activeClasses = "bg-primary text-text-inverse shadow-md";
  const inactiveClasses = [
    "bg-surface border-border text-text",
    "hover:bg-surface-elevated hover:border-border-focus",
    "active:bg-surface-elevated/95",
    "focus:border-border-focus focus:ring-primary/20",
    "border hover:shadow-sm focus:ring-2 focus:outline-none"
  ].join(" ");
  
  return (
    <button
      onClick={onClick}
      className={`${baseClasses} ${isActive ? activeClasses : inactiveClasses}`}
      aria-pressed={isActive}
      role="tab"
      aria-selected={isActive}
    >
      {category}
    </button>
  );
});

CategoryTab.displayName = 'CategoryTab';

export default CategoryTab;
