/**
 * Quiz Service
 *
 * This file should handle all quiz-related operations with external services:
 * - Firebase operations (CRUD)
 * - Data fetching
 * - State persistence
 * - Complex business logic
 *
 * Rules:
 * 1. Handle all Firebase interactions
 * 2. Manage complex operations (transactions, batch updates)
 * 3. Handle errors and provide meaningful error messages
 * 4. Abstract database implementation details
 * 5. No UI logic or state management
 *
 * Examples of appropriate functions:
 * - fetchQuizById()
 * - createQuiz()
 * - updateQuizVisibility()
 * - deleteQuiz()
 */

import {
  collection,
  doc,
  query,
  where,
  getDoc,
  serverTimestamp,
  setDoc,
  getDocs,
  updateDoc,
  writeBatch,
  increment,
} from "firebase/firestore";
import {
  deleteObject,
  getDownloadURL,
  ref,
  uploadBytes,
} from "firebase/storage";
import { auth, db, storage } from "../firebase";
import { quizFormConfig } from "../config/quizFormConfig";
import {
  showLoading,
  updateLoadingToError,
  updateLoadingToSuccess,
  withToastHandling,
} from "../utils/toastUtils";
import { streakService } from "./streakService";

const { ALLOWED_IMG_TYPES, MAX_IMG_SIZE } = quizFormConfig;

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

// Fetch quiz data by ID
const fetchQuizById = async (quizId) => {
  try {
    const docRef = doc(db, "quizzes", quizId);
    const docSnap = await getDoc(docRef);

    if (!docSnap.exists())
      throw new Error(`Nie znaleziono quizu o ID: ${quizId}`);
    const quizObj = docSnap.data();

    return quizObj;
  } catch (error) {
    console.error("Wystąpił błąd przy pobieraniu quizu: ", error);
    throw error;
  }
};

// Create a new quiz
const createQuiz = async (
  data,
  currentUser,
  navigate,
  showLoading,
  updateLoadingToSuccess,
  updateLoadingToError,
  reset,
) => {
  const toastId = showLoading("Saving quiz...");

  try {
    if (!currentUser) {
      throw new Error("Zaloguj się aby stworzyć quiz!");
    }

    const quizRef = doc(collection(db, "quizzes"));
    const quizId = quizRef.id;

    let quizImageUrl = null;

    if (data.image) {
      const file = data.image;
      console.log("file", file);
      if (!Object.keys(ALLOWED_IMG_TYPES).includes(file.type)) {
        throw new Error("Obraz quizu musi być w formacie JPG, PNG lub GIF");
      }
      if (file.size > MAX_IMG_SIZE) {
        throw new Error("Obraz quizu nie może być większy niż 2 MB");
      }
      const extension = ALLOWED_IMG_TYPES[file.type];
      const quizImageRef = ref(
        storage,
        `quizzes/${quizId}/quiz_image${extension}`,
      );
      await uploadBytes(quizImageRef, file, {
        contentType: file.type,
        customMetadata: { originalName: file.name },
      });
      quizImageUrl = await getDownloadURL(quizImageRef);
    }

    const questionImageUploads = data.questions.map(async (question, index) => {
      if (question.image) {
        const file = question.image;
        if (!Object.keys(ALLOWED_IMG_TYPES).includes(file.type)) {
          throw new Error(
            `Obraz pytania numer ${index + 1} musi być w formacie JPG, PNG lub GIF`,
          );
        }
        if (file.size > MAX_IMG_SIZE) {
          throw new Error(
            `Obraz pytania numer ${index + 1} jest za duży. Maksymalny dozwolony rozmiar to ${MAX_IMG_SIZE} MB`,
          );
        }
        const extension = ALLOWED_IMG_TYPES[file.type];
        const questionImageRef = ref(
          storage,
          `quizzes/${quizId}/questions/${index}/image${extension}`,
        );
        await uploadBytes(questionImageRef, file, {
          contentType: file.type,
          customMetadata: { originalName: file.name },
        });
        return await getDownloadURL(questionImageRef);
      }
      return null;
    });
    const questionImageUrls = await Promise.all(questionImageUploads);
    console.log("data", data);

    // Get rid of unnecessary data
    /* eslint-disable no-unused-vars */
    const {
      image,
      ratingsCount,
      ratingsSum,
      playsCount,
      bookmarksCount,
      ...quizRest
    } = data;
    /* eslint-enable no-unused-vars */

    const initialQuestionsStats = {};
    data.questions.forEach((_, index) => {
      initialQuestionsStats[String(index)] = {
        correctCount: 0,
        incorrectCount: 0,
      };
    });

    const quizData = {
      ...quizRest,
      authorId: currentUser.uid,
      quizId: quizId,
      createdAt: serverTimestamp(),
      imageUrl: quizImageUrl,
      questions: data.questions.map((question, index) => {
        // eslint-disable-next-line no-unused-vars
        const { image, ...questionRest } = question;
        return {
          ...questionRest,
          imageUrl: questionImageUrls[index],
        };
      }),
      questionsStats: initialQuestionsStats,
      playsCount: 0,
      scoreSum: 0,
      completionTimeSum: 0,
    };
    console.log("quizData", quizData);
    setDoc(quizRef, quizData);

    // stats subcollection
    const statsRef = collection(quizRef, "stats");
    await Promise.all([
      setDoc(doc(statsRef, "plays"), { count: 0 }),
      setDoc(doc(statsRef, "ratings"), { total: 0, count: 0 }),
    ]);

    updateLoadingToSuccess(toastId, "Quiz zapisany!");
    reset();
    navigate(`/quiz/${quizId}`);
  } catch (error) {
    updateLoadingToError(toastId, `${error.message}`);
  }
};
const deleteQuiz = async (quizId, quizData) => {
  const userId = auth.currentUser?.uid;
  if (!userId) throw new Error("Musisz być zalogowany!");

  const batch = writeBatch(db);
  const quizRef = doc(db, "quizzes", quizId);

  try {
    // Step 1: Prepare Firestore deletions in a batch
    // Delete quiz document
    batch.delete(quizRef);

    // Delete subcollections (e.g., stats)
    const quizStatsRef = collection(db, `quizzes/${quizId}/stats`);
    const statsSnapshot = await getDocs(quizStatsRef);
    statsSnapshot.forEach((doc) => {
      batch.delete(doc.ref);
    });

    // Delete all ratings for this quiz
    const ratingsQuery = query(
      collection(db, "quizRatings"),
      where("quizId", "==", quizId),
    );
    const ratingsSnapshot = await getDocs(ratingsQuery);
    ratingsSnapshot.forEach((doc) => {
      batch.delete(doc.ref);
    });

    // Delete all quiz results for this quiz
    const resultsQuery = query(
      collection(db, "quizResults"),
      where("quizId", "==", quizId),
    );

    const resultsSnapshot = await getDocs(resultsQuery);
    resultsSnapshot.forEach((doc) => {
      batch.delete(doc.ref);
    });

    // Step 2: Prepare Storage deletions
    const storageDeletionPromises = [];

    // Delete quiz image
    if (quizData.imageUrl) {
      const imgFormat = quizData.imageUrl.split("?")[0].split(".").pop();
      const imageRef = ref(
        storage,
        `quizzes/${quizId}/quiz_image.${imgFormat}`,
      );
      storageDeletionPromises.push(
        deleteObject(imageRef).catch((err) => {
          console.warn("Wystąpił błąd podczas usuwania zdjęcia:", err);
          throw err; // Ensure failure propagates
        }),
      );
    }

    // Delete question images
    const questions = quizData.questions || [];
    console.log("questions", questions);
    questions.forEach((question, index) => {
      if (question.imageUrl) {
        const imgFormat = question.imageUrl.split("?")[0].split(".").pop();
        const imgRef = ref(
          storage,
          `quizzes/${quizId}/questions/${index}/image.${imgFormat}`,
        );
        console.log("Preparing to delete question image:", imgRef.fullPath);
        storageDeletionPromises.push(
          deleteObject(imgRef)
            .then(() => {
              console.log(`Question image deleted: ${imgRef.fullPath}`);
            })
            .catch((err) => {
              console.warn(
                `Question image deletion failed for index ${index}:`,
                err,
              );
              throw err; // Ensure failure propagates
            }),
        );
      }
    });

    // Step 3: Execute Storage deletions first
    await Promise.all(storageDeletionPromises);

    // Step 4: Commit Firestore batch
    await batch.commit();

    // Step 5: Notify success
    await withToastHandling(() => Promise.resolve(), toastMessages.deleteQuiz);
  } catch (error) {
    // Step 6: Handle failure
    console.error("Failed to delete quiz:", error);
    await withToastHandling(
      () => Promise.reject(error),
      toastMessages.deleteQuiz,
    );
    throw error; // Propagate error to caller
  }
};

const updateQuiz = async (quizId, updatedData) => {
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
    });
  }, toastMessages.updateQuiz);
};

const changeQuizVisibility = async (quizId, currentVisibility) => {
  const userId = auth.currentUser?.uid;
  if (!userId) throw new Error("Musisz być zalogowany!");

  const newVisibility = currentVisibility === "public" ? "private" : "public";

  await withToastHandling(async () => {
    const quizRef = doc(db, "quizzes", quizId);
    await updateDoc(quizRef, { visibility: newVisibility });

    return newVisibility;
  }, toastMessages.changeVisibility);
};

const fetchUserQuizAttempts = async (userId, quizId) => {
  try {
    const resultsRef = collection(db, "quizResults");
    const q = query(
      resultsRef,
      where("userId", "==", userId),
      where("quizId", "==", quizId),
    );
    const querySnapshot = await getDocs(q);

    const attempts = querySnapshot.docs.map((doc) => doc.data());
    return attempts;
  } catch (error) {
    console.error("Error fetching user quiz attempts:", error);
    throw error;
  }
};

// Save quiz result
const saveQuizResult = async (
  userId,
  quizId,
  quizTitle,
  score,
  totalQuestions,
  quizStartAt,
  userAnswers,
  questions,
) => {
  const toastId = showLoading("Zapisywanie wyniku...");
  try {
    const completedAt = Date.now();
    const completionTimeinMs = Math.floor(completedAt - quizStartAt);

    const batch = writeBatch(db);

    // 1. Save the quiz result
    const resultDocRef = doc(
      db,
      "quizResults",
      `${userId}_${quizId}_${Date.now()}`,
    );
    batch.set(resultDocRef, {
      userId,
      quizId,
      quizTitle,
      score,
      totalQuestions,
      completedAt: new Date(completedAt).toISOString(),
      completionTimeinMs,
    });

    // 2. Update overall quiz stats (playsCount, scoreSum, completionTimeSum)
    const quizRef = doc(db, "quizzes", quizId);
    batch.update(quizRef, {
      playsCount: increment(1),
      scoreSum: increment(score),
      completionTimeSum: increment(completionTimeinMs),
    });

    // 3. Update question-specific stats
    questions.forEach((question, index) => {
      const isCorrect = userAnswers[index] === question.correctAnswer;

      const statsPathPrefix = `questionsStats.${index}`;
      batch.update(quizRef, {
        [`${statsPathPrefix}.correctCount`]: increment(isCorrect ? 1 : 0),
        [`${statsPathPrefix}.incorrectCount`]: increment(isCorrect ? 0 : 1),
      });
    });

    await batch.commit();
    
    // Update user's daily streak
    try {
      await streakService.updateStreakOnQuizCompletion(userId, new Date(completedAt).toISOString());
    } catch (streakError) {
      console.error("Error updating streak:", streakError);
      // Don't fail the quiz result save if streak update fails
    }
    
    updateLoadingToSuccess(toastId, "Wynik zapisany!");
  } catch (err) {
    updateLoadingToError(toastId, `Błąd zapisu wyniku: ${err.message}`);
    console.error("Error saving quiz result:", err);
    throw err;
  }
};

export {
  fetchQuizById,
  createQuiz,
  deleteQuiz,
  updateQuiz,
  changeQuizVisibility,
  fetchUserQuizAttempts,
  saveQuizResult,
};
