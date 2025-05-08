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
      <div className="w-full max-w-[400px] min-w-[280px] p-3 text-center text-gray-600">
        Błąd: Brak danych quizu lub nieprawidłowy identyfikator
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
      <div className="w-full max-w-[400px] min-w-[280px] p-3 text-center text-gray-600">
        Ładowanie danych użytkownika...
      </div>
    );
  }

  return (
    <div
      className={`relative z-0 flex w-full max-w-[400px] min-w-[280px] cursor-pointer flex-col rounded-xl bg-white p-3 shadow-md transition-all duration-300 hover:scale-105 hover:bg-gray-50 hover:shadow-xl sm:p-4 ${
        isActionsOpen ? "z-40" : ""
      }`}
      onClick={handleCardClick}
    >
      <div className="quiz-actions absolute top-2 right-2">
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
      <div className="flex flex-col items-center sm:flex-row sm:items-start">
        <img
          src={
            quiz.imageUrl ||
            `https://placehold.co/128x128.png?text=${quiz.title || "Quiz"}`
          }
          alt={`Obraz quizu ${quiz.title || "Bez nazwy"}`}
          className="mb-3 h-24 w-24 rounded-lg object-cover sm:mr-4 sm:mb-0 sm:h-32 sm:w-32"
          onError={handleImageError}
        />
        <div className="flex w-full flex-col">
          <h3 className="mb-2 text-center text-lg font-semibold sm:text-left">
            {quiz.title || "Bez nazwy"}
          </h3>
          <MetadataGrid
            creatorName={creatorName}
            quiz={quiz}
            visibility={visibility}
          />
        </div>
      </div>
    </div>
  );
};

export default QuizCard;
