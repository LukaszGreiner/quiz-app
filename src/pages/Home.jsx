// src/components/Home/Home.js
import QuizCard from "../components/QuizCard/QuizCard";
import QuizCardSkeleton from "../components/QuizCard/QuizCardSkeleton";
import Btn from "../components/common/Btn";
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

  return (
    <div>
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
            <Btn
              key={category}
              variant={normalizedCategory === category ? "primary" : "outline"}
              size="md"
              onClick={() => navigateToCategory(category)}
              className={
                normalizedCategory === category
                  ? "shadow-md"
                  : "bg-surface hover:bg-surface-elevated active:bg-surface-elevated/95"
              }
            >
              {category}
            </Btn>
          ))}
        </div>
      </div>{" "}
      {/* Quiz Grid */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-3">
        {loading ? (
          // Show multiple skeleton cards while loading
          <>
            {Array.from({ length: 6 }).map((_, index) => (
              <QuizCardSkeleton key={`skeleton-${index}`} />
            ))}
          </>
        ) : filteredQuizzes.length === 0 ? (
          <div className="col-span-full py-12 text-center">
            <p className="text-text-muted mb-4 text-lg">
              {normalizedCategory === "Wszystkie"
                ? "Brak quizów do wyświetlenia"
                : "Brak quizów w wybranej kategorii"}
            </p>
          </div>
        ) : (
          filteredQuizzes.map((quiz, index) => (
            <div 
              key={quiz.quizId} 
              className="animate-fadeIn"
              style={{ 
                animationDelay: `${index * 100}ms`,
                animationFillMode: 'both'
              }}
            >
              <QuizCard quiz={quiz} />
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default Home;
