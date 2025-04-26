import {
  collection,
  doc,
  query,
  where,
  getDoc,
  serverTimestamp,
  setDoc,
  getDocs,
} from "firebase/firestore";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { db, storage } from "../firebase";
import { quizFormConfig } from "../config/quizFormConfig";

const { ALLOWED_IMG_TYPES, MAX_IMG_SIZE } = quizFormConfig;

// Fetch quiz data by ID
export const fetchQuizById = async (quizId) => {
  try {
    const docRef = doc(db, "quizzes", quizId);
    const docSnap = await getDoc(docRef);

    if (!docSnap.exists()) throw new Error("Taki quiz nie istnieje");

    console.log(docSnap.data(), docSnap);

    return docSnap.data();
  } catch (error) {
    console.error("Wystąpił błąd przy pobieraniu quizu: ", error);
    throw error;
  }
};

// Fetch user quiz attempts
export const fetchUserQuizAttempts = async (userId, quizId) => {
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

// Create a new quiz
export const createQuiz = async (
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

    const quizData = {
      authorId: currentUser.uid,
      category: data.category,
      description: data.description,
      difficulty: data.difficulty,
      imageUrl: quizImageUrl,
      quizId: quizId,
      createdAt: serverTimestamp(),
      timeLimitPerQuestion: data.timeLimitPerQuestion,
      title: data.title,
      visibility: data.visibility,
      questions: data.questions.map((question, index) => ({
        title: question.title,
        correctAnswer: question.correctAnswer,
        wrongAnswers: question.wrongAnswers,
        imageUrl: questionImageUrls[index],
      })),
    };
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
