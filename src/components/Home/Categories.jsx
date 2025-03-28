import { useNavigate } from "react-router-dom";
import { categoriesConfig } from "../../config/categoriesConfig";
import { FaChevronDown } from "react-icons/fa"; // Import the desired icon

const STYLE_OPTIONS = [
  { bg: "bg-primary", hover: "hover:bg-primary/80", text: "text-white" },
  { bg: "bg-secondary", hover: "hover:bg-secondary/80", text: "text-white" },
  { bg: "bg-accent", hover: "hover:bg-accent/80", text: "text-white" },
  { bg: "bg-success", hover: "hover:bg-success/80", text: "text-white" },
];

function Categories({ selectedCategory = "wszystkie" }) {
  const navigate = useNavigate();
  const categoryNames = categoriesConfig.QUIZ_CATEGORIES;

  // Normalize selectedCategory with a safeguard
  const normalizedSelectedCategory = selectedCategory
    ? selectedCategory.charAt(0).toUpperCase() +
      selectedCategory.slice(1).toLowerCase()
    : "Wszystkie";

  const getStyles = (index) => STYLE_OPTIONS[index % STYLE_OPTIONS.length];

  const navigateToCategory = (category) => {
    navigate(category === "Wszystkie" ? "/" : `/${category.toLowerCase()}`);
  };

  const handleCategoryChange = (event) =>
    navigateToCategory(event.target.value);
  const handleLinkClick = (categoryName) => navigateToCategory(categoryName);

  return (
    <div className="md:w-1/4">
      {/* Mobile Dropdown */}
      <div className="relative md:hidden">
        <p className="mb-4 text-xl font-bold">Kategorie</p>
        <select
          value={normalizedSelectedCategory}
          onChange={handleCategoryChange}
          className="text-dark focus:border-primary focus:ring-primary/20 w-full appearance-none rounded-lg border border-gray-300 bg-white p-3 font-medium transition duration-300 focus:ring-2 focus:outline-none"
          aria-label="Wybierz kategorię quizu"
        >
          {categoryNames.map((name, index) => (
            <option key={index} value={name} className="py-2 font-medium">
              {name}
            </option>
          ))}
        </select>
        <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-500">
          <FaChevronDown className="absolute top-1/2 right-3 h-5 w-5 translate-y-1/2" />
        </span>
      </div>

      {/* Desktop Vertical List */}
      <div className="hidden md:sticky md:top-30 md:flex md:flex-col md:space-y-4 md:self-start">
        <p className="mb-4 text-center text-xl font-bold">Kategorie</p>
        {categoryNames.map((name, index) => {
          const { bg, hover, text } = getStyles(index);
          const isSelected = normalizedSelectedCategory === name;
          return (
            <button
              key={index}
              type="button"
              onClick={() => handleLinkClick(name)}
              className={`${bg} ${text} block cursor-pointer rounded-full px-4 py-3 text-center transition duration-300 ${
                isSelected
                  ? "ring-primary bg-opacity-90 shadow-md ring-2 ring-offset-2"
                  : hover
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
