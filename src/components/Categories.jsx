import { useState } from "react";

function Categories() {
  const categories = [
    {
      name: "Matematyka",
      bg: "bg-primary",
      hover: "hover:bg-purple-600",
      text: "text-white",
    },
    {
      name: "Historia",
      bg: "bg-accent",
      hover: "hover:bg-purple-300",
      text: "text-dark",
    },
    {
      name: "Przyroda",
      bg: "bg-success",
      hover: "hover:bg-blue-400",
      text: "text-white",
    },
    {
      name: "Geografia",
      bg: "bg-secondary",
      hover: "hover:bg-orange-600",
      text: "text-white",
    },
    {
      name: "Języki",
      bg: "bg-primary",
      hover: "hover:bg-purple-600",
      text: "text-white",
    },
    {
      name: "Kultura",
      bg: "bg-accent",
      hover: "hover:bg-purple-300",
      text: "text-dark",
    },
    {
      name: "Nauka",
      bg: "bg-success",
      hover: "hover:bg-blue-400",
      text: "text-white",
    },
    {
      name: "Sztuka",
      bg: "bg-secondary",
      hover: "hover:bg-orange-600",
      text: "text-white",
    },
  ];

  // Dodajemy stan dla wybranej kategorii
  const [selectedCategory, setSelectedCategory] = useState("Wszystkie");

  // Handle category selection
  const handleCategoryChange = (event) => {
    const selectedCategory = event.target.value;
    setSelectedCategory(selectedCategory); // Aktualizujemy stan
    console.log("Selected category:", selectedCategory);
    // Add navigation logic here, e.g., redirect to a category page
  };

  const handleLinkClick = (categoryName) => {
    setSelectedCategory(categoryName);
    console.log("Selected category:", categoryName);
    // Add navigation logic here
  };

  return (
    <div className="px-4 md:w-1/4">
      {/* Mobile Dropdown */}
      <div className="relative md:hidden">
        <p className="mb-4 text-xl font-bold">Kategorie</p>

        <select
          value={selectedCategory} // Używamy value zamiast selected
          onChange={handleCategoryChange}
          className="text-dark focus:border-primary focus:ring-primary/20 w-full appearance-none rounded-lg border border-gray-300 bg-white p-3 font-medium transition duration-300 focus:ring-2 focus:outline-none"
        >
          <option value="Wszystkie" className="text-gray-500">
            Wszystkie
          </option>
          {categories.map((category, index) => (
            <option
              key={index}
              value={category.name}
              className="py-2 font-medium"
            >
              {category.name}
            </option>
          ))}
        </select>
        {/* Custom Arrow */}
        <span className="pointer-events-none absolute top-1/2 right-3 -translate-y-1/2 transform">
          <svg
            className="h-4 w-4 text-gray-500"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M19 9l-7 7-7-7"
            />
          </svg>
        </span>
      </div>

      {/* Desktop Vertical List */}
      <div className="hidden md:sticky md:top-30 md:flex md:flex-col md:space-y-4 md:self-start">
        <p className="mb-4 text-center text-xl font-bold">Kategorie</p>

        {categories.map((category, index) => (
          <a
            key={index}
            href="#"
            onClick={() => handleLinkClick(category.name)}
            className={`${category.bg} ${category.text} block rounded-full px-4 py-3 text-center transition duration-300 ${category.hover}`}
          >
            {category.name}
          </a>
        ))}
      </div>
    </div>
  );
}

export default Categories;
