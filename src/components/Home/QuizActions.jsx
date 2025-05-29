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
  quiz,
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
      await deleteQuiz(quizId, quiz);
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
        ...quiz,
        quizId,
        visibility,
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
        className="group bg-surface border-border text-accent hover:bg-surface-elevated hover:border-border-focus hover:text-accent/85 active:bg-surface-elevated/95 focus:border-border-focus focus:ring-accent/20 relative rounded-full border p-2 transition-all duration-200 focus:ring-2 focus:outline-none"
        title="Dodaj do zakładek"
      >
        {isBookmarked ? (
          <FaBookmark className="text-lg" aria-label="Usuń z zakładek" />
        ) : (
          <FaRegBookmark className="text-lg" aria-label="Dodaj do zakładek" />
        )}
        <div className="bg-surface-elevated border-border text-text absolute bottom-full left-1/2 z-50 mb-2 hidden -translate-x-1/2 transform rounded border px-2 py-1 text-xs whitespace-nowrap shadow-md group-hover:block">
          {isBookmarked ? "Usuń z zakładek" : "Dodaj do zakładek"}
        </div>
      </button>
    );
  }
  return (
    <div className="relative">
      <button
        onClick={handleToggle}
        className="group bg-surface border-border text-text-muted hover:bg-surface-elevated hover:border-border-focus hover:text-text active:bg-surface-elevated/95 focus:border-border-focus focus:ring-primary/20 relative rounded-full border p-2 transition-all duration-200 focus:ring-2 focus:outline-none"
        title="Więcej opcji"
      >
        <FaEllipsisV className="text-lg" aria-label="Więcej opcji" />
        <div className="bg-surface-elevated border-border text-text absolute bottom-full left-1/2 z-50 mb-2 hidden -translate-x-1/2 transform rounded border px-2 py-1 text-xs whitespace-nowrap shadow-md group-hover:block">
          Więcej opcji
        </div>
      </button>

      {isOpen && (
        <div className="bg-surface border-border absolute right-0 z-50 mt-2 w-48 rounded-lg border shadow-lg">
          <div className="p-2">
            <button
              onClick={handlePlay}
              className="text-primary hover:bg-surface-elevated active:bg-surface-elevated/95 focus:bg-surface-elevated flex w-full items-center gap-3 rounded-md p-3 transition-all duration-200 focus:outline-none"
              title="Graj w Quiz"
            >
              <FaPlay className="text-sm" aria-label="Graj w Quiz" />
              <span className="text-sm font-medium">Graj w Quiz</span>
            </button>
            <button
              onClick={handleBookmark}
              className="text-accent hover:bg-surface-elevated active:bg-surface-elevated/95 focus:bg-surface-elevated flex w-full items-center gap-3 rounded-md p-3 transition-all duration-200 focus:outline-none"
              title={isBookmarked ? "Usuń z zakładek" : "Dodaj do zakładek"}
            >
              {isBookmarked ? (
                <FaBookmark className="text-sm" aria-label="Usuń z zakładek" />
              ) : (
                <FaRegBookmark
                  className="text-sm"
                  aria-label="Dodaj do zakładek"
                />
              )}
              <span className="text-sm font-medium">
                {isBookmarked ? "Usuń z zakładek" : "Dodaj do zakładek"}
              </span>
            </button>{" "}
            {(isOwner || isAdmin) && (
              <>
                <button
                  onClick={handleEdit}
                  className="text-text hover:bg-surface-elevated active:bg-surface-elevated/95 focus:bg-surface-elevated flex w-full items-center gap-3 rounded-md p-3 transition-all duration-200 focus:outline-none"
                  title="Edytuj quiz"
                >
                  <FaEdit className="text-sm" aria-label="Edytuj quiz" />
                  <span className="text-sm font-medium">Edytuj quiz</span>
                </button>
                <button
                  onClick={handleChangeVisibility}
                  className="text-text hover:bg-surface-elevated active:bg-surface-elevated/95 focus:bg-surface-elevated flex w-full items-center gap-3 rounded-md p-3 transition-all duration-200 focus:outline-none"
                  title={`Zmień widoczność na ${visibility === "public" ? "prywatny" : "publiczny"}`}
                >
                  {visibility === "public" ? (
                    <FaGlobe
                      className="text-sm"
                      aria-label="Zmień na prywatny"
                    />
                  ) : (
                    <FaLock
                      className="text-sm"
                      aria-label="Zmień na publiczny"
                    />
                  )}
                  <span className="text-sm font-medium">{`Zmień na ${visibility === "public" ? "prywatny" : "publiczny"}`}</span>
                </button>
                <button
                  onClick={handleDeleteQuiz}
                  className="text-incorrect hover:bg-incorrect/10 active:bg-incorrect/20 focus:bg-incorrect/10 flex w-full items-center gap-3 rounded-md p-3 transition-all duration-200 focus:outline-none"
                  title="Usuń quiz"
                >
                  <FaTrash className="text-sm" aria-label="Usuń quiz" />
                  <span className="text-sm font-medium">Usuń quiz</span>
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
