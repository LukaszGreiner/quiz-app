// src/components/Home/Home.js
import QuizCard from "../Components/QuizCard/QuizCard";
import { useQuizzes } from "../hooks/useQuizzes";
import { useCategory } from "../hooks/useCategory";

const Home = () => {
  const { quizzes, loading } = useQuizzes();
  const {
    categoryNames,
    normalizedCategory,
    navigateToCategory,
    validateCategory,
  } = useCategory();

  // Validate category on load; redirect to /not-found if invalid
  if (!validateCategory()) {
    return null; // Rendering will be handled by the router's redirect
  }

  // Filter quizzes based on normalized category from URL
  const filteredQuizzes =
    normalizedCategory === "Wszystkie"
      ? quizzes
      : quizzes.filter((quiz) => quiz.category === normalizedCategory);

  const handleEdit = (quizId) => {
    console.log("Edit quiz:", quizId); // Placeholder for edit logic
  };

  const handleDelete = (quizId) => {
    console.log("Delete quiz:", quizId); // Placeholder for delete logic
  };

  if (loading) return null; // Toast handles loading feedback

  return (
    <div className="p-6">
      {/* Category Filter */}
      <div className="mb-6">
        {/* Mobile: Dropdown */}
        <div className="sm:hidden">
          <select
            value={normalizedCategory}
            onChange={(e) => navigateToCategory(e.target.value)}
            className="w-full rounded-md border border-gray-300 p-2 text-gray-800 focus:ring-2 focus:ring-blue-500 focus:outline-none"
          >
            {categoryNames.map((category) => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
          </select>
        </div>

        {/* Desktop: Tabs */}
        <div className="hidden flex-wrap gap-2 sm:flex">
          {categoryNames.map((category) => (
            <button
              key={category}
              onClick={() => navigateToCategory(category)}
              className={`rounded-md px-4 py-2 transition-colors duration-200 ${
                normalizedCategory === category
                  ? "bg-blue-600 text-white"
                  : "bg-gray-200 text-gray-800 hover:bg-gray-300"
              }`}
            >
              {category}
            </button>
          ))}
        </div>
      </div>

      {/* Quiz Grid */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {filteredQuizzes.length === 0 ? (
          <p className="col-span-full text-center text-gray-600">
            {normalizedCategory === "Wszystkie"
              ? "Brak quizów do wyświetlenia"
              : "Brak quizów w wybranej kategorii"}
          </p>
        ) : (
          filteredQuizzes.map((quiz) => (
            <QuizCard
              key={quiz.quizId}
              quiz={quiz}
              onEdit={handleEdit}
              onDelete={handleDelete}
            />
          ))
        )}
      </div>
    </div>
  );
};

export default Home;
