// src/components/Home/Home.js
import QuizCard from "../components/QuizCard/QuizCard";
import QuizCardSkeleton from "../components/QuizCard/QuizCardSkeleton";
import Btn from "../components/common/Btn";
import { useQuizzes } from "../hooks/useQuizzes";
import { useCategory } from "../hooks/useCategory";
import { useAuth } from "../context/AuthContext";
import { useStreak } from "../hooks/useStreak";
import StreakReviveModal from "../components/Header/StreakReviveModal";
import { Heart, Clock, RotateCcw } from "lucide-react";
import { useState, useEffect } from "react";

const Home = () => {
  const { quizzes, loading } = useQuizzes();
  const { currentUser } = useAuth();
  const { streakData } = useStreak();
  const [showReviveModal, setShowReviveModal] = useState(false);
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

  // Show revive modal when streak data loads and user can revive
  useEffect(() => {
    if (streakData?.canRevive && !showReviveModal) {
      // Check if modal was already shown today
      const today = new Date().toDateString();
      const lastShown = localStorage.getItem('reviveModalShownHome');
      
      if (lastShown !== today) {
        // Add a small delay to ensure page has loaded
        const timer = setTimeout(() => {
          setShowReviveModal(true);
          localStorage.setItem('reviveModalShownHome', today);
        }, 1000); // Longer delay on home page to not interrupt browsing
        
        return () => clearTimeout(timer);
      }
    }
  }, [streakData, showReviveModal]);

  // Filter quizzes based on normalized category from URL
  const filteredQuizzes =
    normalizedCategory === "Wszystkie"
      ? quizzes
      : quizzes.filter((quiz) => quiz.category === normalizedCategory);

  // Helper function to calculate time remaining for revive
  const getTimeRemaining = () => {
    if (!streakData?.reviveExpiresAt) return null;
    
    const now = new Date();
    const expiry = new Date(streakData.reviveExpiresAt);
    const diffMs = expiry - now;
    
    if (diffMs <= 0) return null;
    
    const hours = Math.floor(diffMs / (1000 * 60 * 60));
    const minutes = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));
    
    if (hours > 0) {
      return `${hours}h ${minutes}min`;
    } else {
      return `${minutes}min`;
    }
  };

  return (
    <div>
      {/* Streak Revive Banner - Show prominently at top if user can revive */}
      {streakData?.canRevive && (
        <div className="mb-6 rounded-xl border-2 border-red-500/30 bg-gradient-to-r from-red-500/10 to-pink-500/10 p-4">
          <div className="flex items-center gap-3">
            <div className="bg-gradient-to-r from-red-500 to-pink-500 rounded-full p-2 ">
              <RotateCcw className="h-5 w-5 text-white" />
            </div>
            <div className="flex-1">
              <h3 className="font-bold text-red-600 dark:text-red-400 mb-1">
              Przywróć swoją {streakData.lostStreakLength}-dniową passę!
              </h3>
              <p className="text-sm text-text-muted">
                {getTimeRemaining() ? (
                  <>Pozostało: {getTimeRemaining()} na przywrócenie passy</>
                ) : (
                  <>Przywróć swoją passę zanim będzie za późno!</>
                )}
              </p>
            </div>
            <Btn
              variant="primary"
              size="sm"
              onClick={() => setShowReviveModal(true)}
              className="bg-gradient-to-r from-red-500 to-pink-500 hover:from-red-600 hover:to-pink-600"
            >
              <Heart className="mr-2 h-4 w-4" />
              Przywróć
            </Btn>
          </div>
        </div>
      )}
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

      {/* Streak Revive Modal - Full screen overlay */}
      <StreakReviveModal 
        isOpen={showReviveModal} 
        onClose={() => setShowReviveModal(false)} 
      />
    </div>
  );
};

export default Home;
