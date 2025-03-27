import { FaTrash, FaEye, FaEyeSlash } from "react-icons/fa";
import { doc, updateDoc, deleteDoc } from "firebase/firestore";
import { deleteObject, ref, updateMetadata } from "firebase/storage";
import { db, storage, auth } from "../firebase";
import {
  showError,
  showLoading,
  updateLoadingToSuccess,
  updateLoadingToError,
} from "../utils/toastUtils";

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

      // Delete associated images from storage
      if (quizDoc.imagePath)
        await deleteObject(ref(storage, quizDoc.imagePath));
      for (const q of quizDoc.questions || []) {
        if (q.imagePath) await deleteObject(ref(storage, q.imagePath));
      }

      // Delete quiz from Firestore
      await deleteDoc(quizRef);
    }, toastMessages.deleteQuiz);
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

      // Update visibility metadata for images (optional)
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

      setVisibility(newVisibility); // Update parent state
    }, toastMessages.changeVisibility);
  };

  return (
    <div className="flex gap-2">
      {(isOwner || isAdmin) && (
        <>
          <button
            onClick={handleChangeVisibility}
            className="p-2 text-gray-500 transition-colors duration-200 hover:text-gray-700"
            title={`Zmień widoczność na ${visibility === "public" ? "prywatny" : "publiczny"}`}
          >
            {visibility === "public" ? (
              <FaEye className="text-xl" /> // Public = visible (open eye)
            ) : (
              <FaEyeSlash className="text-xl" /> // Private = not visible (crossed eye)
            )}
          </button>
          <button
            onClick={handleDeleteQuiz}
            className="p-2 text-red-500 transition-colors duration-200 hover:text-red-700"
            title="Usuń quiz"
          >
            <FaTrash className="text-xl" />
          </button>
        </>
      )}
    </div>
  );
};

export default QuizActions;
