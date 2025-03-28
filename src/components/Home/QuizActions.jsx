import {
  FaTrash,
  FaRegBookmark,
  FaBookmark,
  FaEllipsisV,
  FaLock,
  FaGlobe,
} from "react-icons/fa";
import { useState } from "react";
import { doc, updateDoc, deleteDoc } from "firebase/firestore";
import { deleteObject, ref, updateMetadata } from "firebase/storage";
import { db, storage, auth } from "../../firebase";
import {
  showError,
  showLoading,
  updateLoadingToSuccess,
  updateLoadingToError,
} from "../../utils/toastUtils";

const toastMessages = {
  deleteQuiz: { success: "Quiz usunięty!", error: "Błąd usuwania quizu" },
  changeVisibility: {
    success: "Widoczność zmieniona!",
    error: "Błąd zmiany widoczności",
  },
};

const withToastHandling = async (callback, messageConfig) => {
  const toastId = showLoading("Przetwarzanie...");
  try {
    await callback();
    updateLoadingToSuccess(toastId, messageConfig.success);
  } catch (err) {
    updateLoadingToError(toastId, messageConfig.error);
    throw err;
  }
};

const QuizActions = ({
  quizId,
  quizData,
  isOwner,
  isAdmin,
  visibility,
  setVisibility,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isBookmarked, setIsBookmarked] = useState(false);

  const handleDeleteQuiz = async () => {
    if (!isOwner && !isAdmin) {
      showError("Brak uprawnień do usunięcia quizu!");
      return;
    }

    await withToastHandling(async () => {
      const userId = auth.currentUser?.uid;
      if (!userId) throw new Error("Musisz być zalogowany!");

      const quizRef = doc(db, "quizzes", quizId);
      const quizDoc = quizData;

      if (quizDoc.imagePath)
        await deleteObject(ref(storage, quizDoc.imagePath));
      for (const q of quizDoc.questions || []) {
        if (q.imagePath) await deleteObject(ref(storage, q.imagePath));
      }

      await deleteDoc(quizRef);
    }, toastMessages.deleteQuiz);
    setIsOpen(false);
  };

  const handleChangeVisibility = async () => {
    if (!isOwner && !isAdmin) {
      showError("Brak uprawnień do zmiany widoczności!");
      return;
    }

    const newVisibility = visibility === "public" ? "private" : "public";

    await withToastHandling(async () => {
      const userId = auth.currentUser?.uid;
      if (!userId) throw new Error("Musisz być zalogowany!");

      const quizRef = doc(db, "quizzes", quizId);
      await updateDoc(quizRef, { visibility: newVisibility });

      if (quizData.imagePath) {
        await updateMetadata(ref(storage, quizData.imagePath), {
          customMetadata: { visibility: newVisibility },
        });
      }
      for (const q of quizData.questions || []) {
        if (q.imagePath) {
          await updateMetadata(ref(storage, q.imagePath), {
            customMetadata: { visibility: newVisibility },
          });
        }
      }

      setVisibility(newVisibility);
    }, toastMessages.changeVisibility);
    setIsOpen(false);
  };

  const handleBookmark = () => {
    setIsBookmarked((prev) => !prev);
    console.log(`Bookmark quiz ${quizId}, new state: ${!isBookmarked}`);
    setIsOpen(false);
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
          <FaBookmark
            className={`text-xl ${isBookmarked ? "fill-current" : ""}`}
            aria-label="Dodaj do zakładek"
          />
        ) : (
          <FaRegBookmark
            className={`text-xl ${isBookmarked ? "fill-current" : ""}`}
            aria-label="Usuń z zakładek"
          />
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
        onClick={() => setIsOpen(!isOpen)}
        className="group relative cursor-pointer rounded-full bg-white p-2 text-gray-600 shadow-md transition-all duration-200 hover:bg-gray-50 hover:text-gray-800 focus:ring-2 focus:ring-gray-300 focus:outline-none"
        title="Więcej opcji"
      >
        <FaEllipsisV className="text-xl" aria-label="Więcej opcji" />
        <div className="absolute top-full z-20 mt-2 hidden rounded bg-gray-800 px-2 py-1 text-xs text-white group-hover:block">
          Więcej opcji
        </div>
      </button>

      {isOpen && (
        <div className="absolute right-0 z-10 mt-2 w-48 rounded-lg bg-white shadow-lg">
          <div className="flex flex-col p-2">
            <button
              onClick={handleBookmark}
              className="flex cursor-pointer items-center gap-2 rounded-md p-2 text-yellow-500 transition-all duration-200 hover:bg-gray-100"
              title={isBookmarked ? "Usuń z zakładek" : "Dodaj do zakładek"}
            >
              {isBookmarked ? (
                <FaBookmark
                  className={`text-xl ${isBookmarked ? "fill-current" : ""}`}
                  aria-label="Dodaj do zakładek"
                />
              ) : (
                <FaRegBookmark
                  className={`text-xl ${isBookmarked ? "fill-current" : ""}`}
                  aria-label="Usuń z zakładek"
                />
              )}
              <span>
                {isBookmarked ? "Usuń z zakładek" : "Dodaj do zakładek"}
              </span>
            </button>
            {(isOwner || isAdmin) && (
              <>
                <button
                  onClick={handleChangeVisibility}
                  className="flex cursor-pointer items-center gap-2 rounded-md p-2 text-gray-600 transition-all duration-200 hover:bg-gray-100"
                  title={`Zmień widoczność na ${visibility === "public" ? "prywatny" : "publiczny"}`}
                >
                  {visibility === "public" ? (
                    <FaGlobe
                      className="text-lg text-nowrap"
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
