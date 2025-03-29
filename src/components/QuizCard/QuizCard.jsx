// src/components/QuizCard/QuizCard.js
import { useState } from "react";
import { auth } from "../../firebase";
import { useUserData } from "../../hooks/useUserData";
import QuizActions from "../Home/QuizActions";
import MetadataGrid from "./MetadataGrid";

const QuizCard = ({ quiz, onEdit, onDelete }) => {
  const currentUserId = auth.currentUser?.uid || null;

  // If quiz is undefined or null, show loading state
  if (!quiz) {
    return (
      <div className="w-full max-w-[400px] min-w-[280px] p-3 text-center text-gray-600">
        Loading quiz...
      </div>
    );
  }

  const {
    creatorName,
    isAdmin,
    isOwner,
    loading: userLoading,
  } = useUserData(quiz.createdBy, currentUserId);
  const [visibility, setVisibility] = useState(quiz.visibility || "public");

  const quizData = {
    visibility,
    imagePath: quiz.imagePath,
    questions: quiz.questions || [],
  };

  const handleImageError = (e) => {
    e.target.src = "https://placehold.co/128x128.png?text=Brak%20obrazu";
  };

  // Show loading state while user data is being fetched
  if (userLoading) {
    return (
      <div className="w-full max-w-[400px] min-w-[280px] p-3 text-center text-gray-600">
        Loading user data...
      </div>
    );
  }

  return (
    <div className="relative flex w-full max-w-[400px] min-w-[280px] flex-col rounded-xl bg-white p-3 shadow-md transition duration-300 hover:shadow-lg sm:p-4">
      {/* Quiz Actions */}
      <div className="absolute top-2 right-2">
        <QuizActions
          quizId={quiz.id}
          quizData={quizData}
          isOwner={isOwner}
          isAdmin={isAdmin}
          visibility={visibility}
          setVisibility={setVisibility}
          onDelete={onDelete}
        />
      </div>

      {/* Quiz Content */}
      <div className="flex flex-col items-center sm:flex-row sm:items-start">
        <img
          src={
            quiz.image ||
            `https://placehold.co/128x128.png?text=${quiz.name || "Quiz"}`
          }
          alt={`Obraz quizu ${quiz.name || "Bez nazwy"}`}
          className="mb-3 h-24 w-24 rounded-lg object-cover sm:mr-4 sm:mb-0 sm:h-32 sm:w-32"
          onError={handleImageError}
        />
        <div className="flex w-full flex-col">
          <h3 className="mb-2 text-center text-lg font-semibold sm:text-left">
            {quiz.name || "Bez nazwy"}
          </h3>
          <MetadataGrid
            creatorName={creatorName}
            category={quiz.category || "Brak kategorii"}
            questionCount={quiz.questions?.length || 0}
            createdAt={quiz.createdAt}
            visibility={visibility}
          />
        </div>
      </div>
    </div>
  );
};

export default QuizCard;
