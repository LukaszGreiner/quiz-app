import {
  doc,
  updateDoc,
  deleteDoc,
  collection,
  getDocs,
  setDoc,
  getDoc,
  query,
  where,
} from "firebase/firestore";
import { deleteObject, listAll, ref, updateMetadata } from "firebase/storage";
import { db, storage, auth } from "../firebase";
import {
  showError,
  showLoading,
  updateLoadingToSuccess,
  updateLoadingToError,
} from "./toastUtils";

export const fetchQuizData = async (quizId) => {
  try {
    // Fetch main quiz document
    const quizRef = doc(db, "quizzes", quizId);
    const quizSnap = await getDoc(quizRef);

    if (!quizSnap.exists()) {
      throw new Error("Quiz nie istnieje");
    }
    const quiz = quizSnap.data();
    const questions = quizSnap.data().questions;
    console.log(questions);

    return { quiz, questions };
  } catch (error) {
    console.error("Error fetching quiz data:", error);
    throw error;
  }
};

const toastMessages = {
  deleteQuiz: { success: "Quiz usunięty!", error: "Błąd usuwania quizu" },
  changeVisibility: {
    success: "Widoczność zmieniona!",
    error: "Błąd zmiany widoczności",
  },
  updateQuiz: {
    success: "Quiz zaktualizowany!",
    error: "Błąd aktualizacji quizu",
  },
};

const withToastHandling = async (callback, messageConfig) => {
  const toastId = showLoading("Przetwarzanie...");
  try {
    await callback();
    updateLoadingToSuccess(toastId, messageConfig.success);
  } catch (err) {
    updateLoadingToError(toastId, `${messageConfig.error}: ${err.message}`);
    throw err;
  }
};

export const deleteQuiz = async (quizId, quizData) => {
  const userId = auth.currentUser?.uid;
  if (!userId) throw new Error("Musisz być zalogowany!");

  await withToastHandling(async () => {
    const quizRef = doc(db, "quizzes", quizId);

    // Delete quiz image
    if (quizData.imageUrl) {
      const imgFormat = quizData.imageUrl.split("?")[0].split(".").pop();
      const imageRef = ref(
        storage,
        `quizzes/${quizId}/quiz_image.${imgFormat}`,
      );
      console.log("Deleting: ", imageRef);
      await deleteObject(imageRef).catch((err) =>
        console.warn("Wystąpił błąd podczas usuwania zdjęcia:", err),
      );
      console.log(
        "Quiz image deleted successfully. `quizzes/${quizId}/quiz_image.jpg`",
        imageRef,
      );
    }

    // Delete questions images
    const questions = quizData.questions || [];
    const deleteQuestionImages = questions.map(async (question, index) => {
      if (question.imageUrl) {
        const imgFormat = question.imageUrl.split("?")[0].split(".").pop();
        const imgRef = ref(
          storage,
          `quizzes/${quizId}/questions/${index}/image.${imgFormat}`,
        );
        console.log("Deleting question image:", imgRef.fullPath);
        try {
          await deleteObject(imgRef);
          console.log(
            `Question image deleted successfully: ${imgRef.fullPath}`,
          );
        } catch (err) {
          console.warn(
            `Question image deletion failed for index ${index}:`,
            err,
          );
        }
      }
    });

    await Promise.all(deleteQuestionImages);

    // Delete quiz document
    await deleteDoc(quizRef);
  }, toastMessages.deleteQuiz);
};

export const changeQuizVisibility = async (
  quizId,
  currentVisibility,
  quizData,
) => {
  const userId = auth.currentUser?.uid;
  if (!userId) throw new Error("Musisz być zalogowany!");

  const newVisibility = currentVisibility === "public" ? "private" : "public";

  await withToastHandling(async () => {
    const quizRef = doc(db, "quizzes", quizId);
    await updateDoc(quizRef, { visibility: newVisibility });

    // Update storage metadata if images exist
    if (quizData.imageUrl) {
      const imageRef = ref(storage, quizData.imageUrl);
      await updateMetadata(imageRef, {
        customMetadata: { visibility: newVisibility },
      });
    }

    const questionsRef = collection(db, "quizzes", quizId, "questions");
    const questionsSnap = await getDocs(questionsRef);
    await Promise.all(
      questionsSnap.docs.map(async (qDoc) => {
        const qData = qDoc.data();
        if (qData.imageUrl) {
          const qImageRef = ref(storage, qData.imageUrl);
          await updateMetadata(qImageRef, {
            customMetadata: { visibility: newVisibility },
          });
        }
      }),
    );

    return newVisibility; // Return for state update
  }, toastMessages.changeVisibility);
};

export const updateQuiz = async (quizId, updatedData) => {
  const userId = auth.currentUser?.uid;
  if (!userId) throw new Error("Musisz być zalogowany!");

  await withToastHandling(async () => {
    const quizRef = doc(db, "quizzes", quizId);
    await updateDoc(quizRef, {
      title: updatedData.title,
      category: updatedData.category,
      description: updatedData.description,
      timeLimitPerQuestion: updatedData.timeLimitPerQuestion,
      difficulty: updatedData.difficulty,
      visibility: updatedData.visibility,
      // imageUrl update requires separate storage logic if changed
    });

    // Note: Updating images would require additional upload logic similar to createQuiz
  }, toastMessages.updateQuiz);
};
// Format total time
export const formatTotalTime = (totalSeconds) => {
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  return minutes > 0
    ? `${minutes} min ${seconds > 0 ? `${seconds} s` : ""}`
    : `${seconds} s`;
};
