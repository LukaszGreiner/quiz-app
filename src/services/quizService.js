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
} from "firebase/firestore";
import {
  deleteObject,
  getDownloadURL,
  ref,
  uploadBytes,
} from "firebase/storage";
import { auth, db, storage } from "../firebase";
import { quizFormConfig } from "../config/quizFormConfig";
import { withToastHandling } from "../utils/toastUtils";

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

    // get rid of unnecessary data
    const {
      image,
      ratingsCount,
      ratingsSum,
      playsCount,
      bookmarksCount,
      ...quizRest
    } = data;

    const quizData = {
      ...quizRest,
      authorId: currentUser.uid,
      quizId: quizId,
      createdAt: serverTimestamp(),
      imageUrl: quizImageUrl,
      questions: data.questions.map((question, index) => {
        const { image, ...questionRest } = question;
        return {
          ...questionRest,
          imageUrl: questionImageUrls[index],
        };
      }),
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

// Fetch user quiz attempts
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

export {
  fetchQuizById,
  createQuiz,
  deleteQuiz,
  updateQuiz,
  changeQuizVisibility,
  fetchUserQuizAttempts,
};
