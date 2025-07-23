// src/components/QuizCard/QuizCard.js
import { useNavigate } from "react-router-dom";
import { auth } from "../../firebase";
import { useUserData } from "../../hooks/useUserData";
import QuizActions from "../Home/QuizActions";
import MetadataGrid from "./MetadataGrid";
import { useState } from "react";

const QuizCard = ({ quiz }) => {
  const currentUserId = auth.currentUser?.uid || null;
  const {
    creatorName,
    isAdmin,
    isOwner,
    loading: userLoading,
  } = useUserData(quiz.authorId, currentUserId);

  const [visibility, setVisibility] = useState(quiz.visibility || "public");
  const navigate = useNavigate();
  const [isActionsOpen, setIsActionsOpen] = useState(false);
  if (!quiz || !quiz.quizId) {
    return (
      <div className="bg-surface border-border w-full max-w-sm rounded-lg border p-4 text-center">
        <p className="text-text-muted">
          Błąd: Brak danych quizu lub nieprawidłowy identyfikator
        </p>
      </div>
    );
  }
  const handleImageError = (e) => {
    e.target.src = "https://placehold.co/400x300.png?text=Brak%20obrazu";
  };

  const handleCardClick = (e) => {
    // Prevent navigation if clicking on QuizActions
    if (e.target.closest(".quiz-actions")) return;
    navigate(`/quiz/${quiz.quizId}`);
  };
  
  return (
    <div
      className={`group bg-surface border-border hover:bg-surface-elevated hover:border-border-focus active:bg-surface-elevated/95 focus:border-border-focus focus:ring-primary/20 relative h-80 cursor-pointer overflow-hidden rounded-xl border transition-all duration-300 hover:shadow-lg focus:ring-2 focus:outline-none ${
        isActionsOpen ? "z-40" : ""
      }`}
      onClick={handleCardClick}
      tabIndex="0"
      role="button"
      aria-label={`Otwórz quiz: ${quiz.title || "Bez nazwy"}`}
    >
      {/* Image Section - 3/4 height */}
      <div className="relative h-3/4 w-full">
        <img
          src={
            quiz.imageUrl ||
            `https://placehold.co/400x300.png?text=${encodeURIComponent(quiz.title || "Quiz")}`
          }
          alt={`Obraz quizu ${quiz.title || "Bez nazwy"}`}
          className="h-full w-full object-cover"
          onError={handleImageError}
        />

        {/* Overlay gradient for better text readability */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-transparent to-black/60"></div>

        {/* Category label - top left */}
        <div className="absolute top-3 left-3">
          <span className="bg-primary/90 rounded-full px-2 py-1 text-xs font-medium text-white backdrop-blur-sm">
            {quiz.category || "Bez kategorii"}
          </span>
        </div>

        {/* Quiz Actions - top right */}
        <div className="quiz-actions absolute top-2 right-2 z-10 opacity-0 transition-all duration-200 group-hover:opacity-100">
          <QuizActions
            quizId={quiz.quizId}
            quiz={quiz}
            isOwner={isOwner || false}
            isAdmin={isAdmin || false}
            visibility={visibility}
            setVisibility={setVisibility}
            setIsActionsOpen={setIsActionsOpen}
          />
        </div>

        {/* Rating and popularity - bottom right */}
        <div className="absolute right-3 bottom-3 flex items-center gap-2">
          <MetadataGrid quiz={quiz} visibility={visibility} overlay={true} />
        </div>

        {/* Privacy indicator - bottom left */}
        {visibility === "private" && (
          <div className="absolute bottom-3 left-3">
            <span className="bg-warning/90 rounded-full px-2 py-1 text-xs font-medium text-white backdrop-blur-sm">
              Prywatny
            </span>
          </div>
        )}
      </div>

      {/* Content Section - 1/4 height */}
      <div className="flex h-1/4 flex-col justify-center p-3">
        <h3 className="text-text group-hover:text-primary mb-1 line-clamp-2 text-lg leading-tight font-semibold transition-colors duration-200">
          {quiz.title || "Bez nazwy"}
        </h3>
        <div className="text-text-muted flex items-center justify-between text-sm">
          {/* <span>{creatorName || "Nieznany autor"}</span> */}
          <span className="font-medium">
            {quiz.questions?.length || 0} pytań
          </span>
        </div>
      </div>
    </div>
  );
};

export default QuizCard;
