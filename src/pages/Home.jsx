// src/components/Home/Home.js
import QuizCard from "../components/QuizCard/QuizCard";
import { useQuizzes } from "../hooks/useQuizzes";
import { useCategory } from "../hooks/useCategory";
import { useAuth } from "../context/AuthContext";

const Home = () => {
  const { quizzes, loading } = useQuizzes();
  const { currentUser } = useAuth();
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

  if (loading) {
    return (
      <div className="bg-background flex min-h-screen items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          {/* Spinning loader */}
          <div className="border-primary/20 border-t-primary h-12 w-12 animate-spin rounded-full border-4"></div>
          <p className="text-text-muted text-lg">Ładowanie quizów...</p>
        </div>
      </div>
    );
  }
  return (
    <div className="bg-background min-h-screen p-6">
      {/* Category Filter */}
      <div className="mb-8">
        {/* Mobile: Dropdown */}
        <div className="sm:hidden">
          <select
            value={normalizedCategory}
            onChange={(e) => navigateToCategory(e.target.value)}
            className="border-border bg-surface text-text focus:border-border-focus focus:ring-primary/20 hover:bg-surface-elevated w-full rounded-lg border p-3 transition-all duration-200 focus:ring-2 focus:outline-none"
          >
            {categoryNames.map((category) => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
          </select>
        </div>

        {/* Desktop: Tabs */}
        <div className="hidden flex-wrap gap-3 sm:flex">
          {categoryNames.map((category) => (
            <button
              key={category}
              onClick={() => navigateToCategory(category)}
              className={`rounded-lg px-6 py-3 font-medium transition-all duration-200 ${
                normalizedCategory === category
                  ? "bg-primary text-text-inverse shadow-md"
                  : "bg-surface border-border text-text hover:bg-surface-elevated hover:border-border-focus active:bg-surface-elevated/95 focus:border-border-focus focus:ring-primary/20 border hover:shadow-sm focus:ring-2 focus:outline-none"
              }`}
            >
              {category}
            </button>
          ))}
        </div>
      </div>{" "}
      {/* Quiz Grid */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {filteredQuizzes.length === 0 ? (
          <div className="col-span-full py-12 text-center">
            <p className="text-text-muted mb-4 text-lg">
              {normalizedCategory === "Wszystkie"
                ? "Brak quizów do wyświetlenia"
                : "Brak quizów w wybranej kategorii"}
            </p>
          </div>
        ) : (
          filteredQuizzes.map((quiz) => (
            <QuizCard key={quiz.quizId} quiz={quiz} />
          ))
        )}
      </div>
    </div>
  );
};

export default Home;
