import { memo } from 'react';

const CategoryDropdown = memo(({ categories, selectedCategory, onCategoryChange }) => {
  return (
    <select
      value={selectedCategory}
      onChange={(e) => onCategoryChange(e.target.value)}
      className="border-border bg-surface text-text focus:border-border-focus focus:ring-primary/20 hover:bg-surface-elevated w-full rounded-lg border p-3 transition-all duration-200 focus:ring-2 focus:outline-none"
      aria-label="Wybierz kategorię"
    >
      {categories.map((category) => (
        <option key={category} value={category}>
          {category}
        </option>
      ))}
    </select>
  );
});

CategoryDropdown.displayName = 'CategoryDropdown';

export default CategoryDropdown;
