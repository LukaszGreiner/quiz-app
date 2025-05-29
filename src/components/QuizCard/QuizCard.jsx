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
    e.target.src = "https://placehold.co/128x128.png?text=Brak%20obrazu";
  };

  const handleCardClick = (e) => {
    // Prevent navigation if clicking on QuizActions
    if (e.target.closest(".quiz-actions")) return;
    navigate(`/quiz/${quiz.quizId}`);
  };
  if (userLoading) {
    return (
      <div className="bg-surface border-border w-full max-w-sm rounded-lg border p-4 text-center">
        <p className="text-text-muted">Ładowanie danych użytkownika...</p>
      </div>
    );
  }
  return (
    <div
      className={`group bg-surface border-border hover:bg-surface-elevated hover:border-border-focus active:bg-surface-elevated/95 focus:border-border-focus focus:ring-primary/20 relative cursor-pointer rounded-xl border p-4 transition-all duration-300 hover:shadow-lg focus:ring-2 focus:outline-none ${
        isActionsOpen ? "z-40" : ""
      }`}
      onClick={handleCardClick}
      tabIndex="0"
      role="button"
      aria-label={`Otwórz quiz: ${quiz.title || "Bez nazwy"}`}
    >
      {" "}
      <div className="quiz-actions absolute top-3 right-3">
        <QuizActions
          quizId={quiz.quizId}
          quiz={quiz}
          isOwner={isOwner}
          isAdmin={isAdmin}
          visibility={visibility}
          setVisibility={setVisibility}
          setIsActionsOpen={setIsActionsOpen}
        />
      </div>
      <div className="flex flex-col">
        <div className="mb-4 flex items-start gap-4">
          <img
            src={
              quiz.imageUrl ||
              `https://placehold.co/96x96.png?text=${encodeURIComponent(quiz.title || "Bez nazwy")}`
            }
            alt={`Obraz quizu ${quiz.title || "Bez nazwy"}`}
            className="border-border h-24 w-24 flex-shrink-0 rounded-lg border object-cover"
            onError={handleImageError}
          />
          <div className="min-w-0 flex-1">
            <h3 className="text-text mb-2 line-clamp-2 text-lg leading-tight font-semibold">
              {quiz.title || "Bez nazwy"}
            </h3>
          </div>
        </div>

        <MetadataGrid
          creatorName={creatorName}
          quiz={quiz}
          visibility={visibility}
        />
      </div>
    </div>
  );
};

export default QuizCard;
