// src/components/Home/Categories.js
import { FaChevronDown } from "react-icons/fa";
import { useCategory } from "../../hooks/useCategory";

function Categories() {
  const { categoryNames, normalizedCategory, navigateToCategory } =
    useCategory();

  const handleCategoryChange = (event) =>
    navigateToCategory(event.target.value);
  const handleLinkClick = (categoryName) => navigateToCategory(categoryName);

  return (
    <div className="md:w-1/4">
      {/* Mobile Dropdown */}
      <div className="relative md:hidden">
        <h2 className="text-text mb-4 text-xl font-semibold">Kategorie</h2>
        <div className="relative">
          <select
            value={normalizedCategory}
            onChange={handleCategoryChange}
            className="border-border bg-surface text-text hover:bg-surface-elevated focus:border-border-focus focus:ring-primary/20 w-full appearance-none rounded-lg border p-3 font-medium transition-all duration-200 focus:ring-2 focus:outline-none"
            aria-label="Wybierz kategorię quizu"
          >
            {categoryNames.map((name, index) => (
              <option key={index} value={name} className="py-2 font-medium">
                {name}
              </option>
            ))}
          </select>
          <FaChevronDown className="text-text-muted pointer-events-none absolute top-1/2 right-3 -translate-y-1/2 transform" />
        </div>
      </div>

      {/* Desktop Vertical List */}
      <div className="hidden md:sticky md:top-30 md:flex md:flex-col md:space-y-3 md:self-start">
        <h2 className="text-text mb-4 text-center text-xl font-semibold">
          Kategorie
        </h2>
        {categoryNames.map((name, index) => {
          const isSelected = normalizedCategory === name;
          return (
            <button
              key={index}
              type="button"
              onClick={() => handleLinkClick(name)}
              className={`rounded-lg px-4 py-3 text-center font-medium transition-all duration-200 ${
                isSelected
                  ? "bg-primary text-text-inverse shadow-md"
                  : "bg-surface border-border text-text hover:bg-surface-elevated hover:border-border-focus active:bg-surface-elevated/95 focus:border-border-focus focus:ring-primary/20 border focus:ring-2 focus:outline-none"
              }`}
              aria-pressed={isSelected}
            >
              {name}
            </button>
          );
        })}
      </div>
    </div>
  );
}

export default Categories;
