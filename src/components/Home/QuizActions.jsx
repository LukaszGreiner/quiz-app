// src/components/Home/QuizActions.js
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  FaTrash,
  FaRegBookmark,
  FaBookmark,
  FaEllipsisV,
  FaLock,
  FaGlobe,
  FaPlay,
  FaEdit,
} from "react-icons/fa";
import { deleteQuiz, changeQuizVisibility } from "../../services/quizService";

import { showError } from "../../utils/toastUtils";

const QuizActions = ({
  quizId,
  quizData,
  isOwner,
  isAdmin,
  visibility,
  setVisibility,
  onDelete,
  setIsActionsOpen, // Callback to control parent z-index
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isBookmarked, setIsBookmarked] = useState(false);
  const navigate = useNavigate();

  const handleToggle = () => {
    setIsOpen((prev) => {
      const newState = !prev;
      setIsActionsOpen(newState); // Notify parent of dropdown state
      return newState;
    });
  };

  const handlePlay = () => {
    navigate(`/quiz/play/${quizId}`);
    setIsOpen(false);
    setIsActionsOpen(false);
  };

  const handleEdit = () => {
    navigate(`/quiz/edit/${quizId}`);
    setIsOpen(false);
    setIsActionsOpen(false);
  };

  const handleDeleteQuiz = async () => {
    if (!isOwner && !isAdmin) {
      showError("Brak uprawnień do usunięcia quizu!");
      return;
    }
    try {
      await deleteQuiz(quizId, quizData);
      onDelete?.(quizId);
    } catch (err) {
      console.error("Delete failed:", err);
    }
    setIsOpen(false);
    setIsActionsOpen(false);
  };

  const handleChangeVisibility = async () => {
    if (!isOwner && !isAdmin) {
      showError("Brak uprawnień do zmiany widoczności!");
      return;
    }
    try {
      const newVisibility = await changeQuizVisibility(
        quizId,
        visibility,
        quizData,
      );
      setVisibility(newVisibility);
    } catch (err) {
      console.error("Visibility change failed:", err);
    }
    setIsOpen(false);
    setIsActionsOpen(false);
  };

  const handleBookmark = () => {
    setIsBookmarked((prev) => !prev);
    console.log(`Bookmark quiz ${quizId}, new state: ${!isBookmarked}`);
    setIsOpen(false);
    setIsActionsOpen(false);
  };

  const hasOwnerActions = isOwner || isAdmin;

  if (!hasOwnerActions) {
    return (
      <button
        onClick={handleBookmark}
        className="group relative cursor-pointer rounded-full bg-white p-2 text-yellow-500 shadow-md transition-all duration-200 hover:bg-gray-50 hover:text-yellow-600 focus:ring-2 focus:ring-yellow-300 focus:outline-none"
        title="Dodaj do zakładek"
      >
        {isBookmarked ? (
          <FaBookmark className="text-xl" aria-label="Usuń z zakładek" />
        ) : (
          <FaRegBookmark className="text-xl" aria-label="Dodaj do zakładek" />
        )}
        <div className="absolute top-full z-20 mt-2 hidden rounded bg-gray-800 px-2 py-1 text-xs text-white group-hover:block">
          {isBookmarked ? "Usuń z zakładek" : "Dodaj do zakładek"}
        </div>
      </button>
    );
  }

  return (
    <div className="relative">
      <button
        onClick={handleToggle}
        className="group relative cursor-pointer rounded-full bg-white p-2 text-gray-600 shadow-md transition-all duration-200 hover:bg-gray-50 hover:text-gray-800 focus:ring-2 focus:ring-gray-300 focus:outline-none"
        title="Więcej opcji"
      >
        <FaEllipsisV className="text-xl" aria-label="Więcej opcji" />
        <div className="absolute top-full z-20 mt-2 hidden rounded bg-gray-800 px-2 py-1 text-xs text-white group-hover:block">
          Więcej opcji
        </div>
      </button>

      {isOpen && (
        <div className="absolute right-0 z-50 mt-2 w-48 rounded-lg bg-white shadow-lg">
          <div className="flex flex-col p-2">
            <button
              onClick={handlePlay}
              className="flex cursor-pointer items-center gap-2 rounded-md p-2 text-blue-600 transition-all duration-200 hover:bg-gray-100"
              title="Graj w Quiz"
            >
              <FaPlay className="text-lg" aria-label="Graj w Quiz" />
              <span>Graj w Quiz</span>
            </button>
            <button
              onClick={handleBookmark}
              className="flex cursor-pointer items-center gap-2 rounded-md p-2 text-yellow-500 transition-all duration-200 hover:bg-gray-100"
              title={isBookmarked ? "Usuń z zakładek" : "Dodaj do zakładek"}
            >
              {isBookmarked ? (
                <FaBookmark className="text-lg" aria-label="Usuń z zakładek" />
              ) : (
                <FaRegBookmark
                  className="text-lg"
                  aria-label="Dodaj do zakładek"
                />
              )}
              <span>
                {isBookmarked ? "Usuń z zakładek" : "Dodaj do zakładek"}
              </span>
            </button>
            {(isOwner || isAdmin) && (
              <>
                <button
                  onClick={handleEdit}
                  className="flex cursor-pointer items-center gap-2 rounded-md p-2 text-gray-600 transition-all duration-200 hover:bg-gray-100"
                  title="Edytuj quiz"
                >
                  <FaEdit className="text-lg" aria-label="Edytuj quiz" />
                  <span>Edytuj quiz</span>
                </button>
                <button
                  onClick={handleChangeVisibility}
                  className="flex cursor-pointer items-center gap-2 rounded-md p-2 text-gray-600 transition-all duration-200 hover:bg-gray-100"
                  title={`Zmień widoczność na ${visibility === "public" ? "prywatny" : "publiczny"}`}
                >
                  {visibility === "public" ? (
                    <FaGlobe
                      className="text-lg"
                      aria-label="Zmień na prywatny"
                    />
                  ) : (
                    <FaLock
                      className="text-lg"
                      aria-label="Zmień na publiczny"
                    />
                  )}
                  <span>{`Zmień na ${visibility === "public" ? "prywatny" : "publiczny"}`}</span>
                </button>
                <button
                  onClick={handleDeleteQuiz}
                  className="flex cursor-pointer items-center gap-2 rounded-md p-2 text-red-500 transition-all duration-200 hover:bg-gray-100"
                  title="Usuń quiz"
                >
                  <FaTrash className="text-lg" aria-label="Usuń quiz" />
                  <span>Usuń quiz</span>
                </button>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default QuizActions;
