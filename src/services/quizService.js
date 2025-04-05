import { collection, doc, serverTimestamp, setDoc } from "firebase/firestore";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { db, storage } from "../firebase"; // Adjust path as needed

export const createQuiz = async (
  data,
  currentUser,
  navigate,
  showLoading,
  updateLoadingToSuccess,
  updateLoadingToError,
  reset,
) => {
  // Show loading toast
  const toastId = showLoading("Saving quiz...");

  try {
    if (!currentUser) {
      throw new Error("Zaloguj się aby stworzyć quiz!");
    }

    // Create a new quiz document reference
    const quizRef = doc(collection(db, "quizzes"));
    const quizId = quizRef.id;

    // Upload quiz image to Firebase Storage (if provided)
    let quizImageUrl = null;
    if (data.image) {
      const file = data.image;
      const quizImageRef = ref(storage, `quizzes/${quizId}/quiz_image.jpg`);
      await uploadBytes(quizImageRef, file);
      quizImageUrl = await getDownloadURL(quizImageRef);
    }

    // Upload question images concurrently (if provided)
    const questionImageUploads = data.questions.map(async (question, index) => {
      if (question.image) {
        const file = question.image;
        const questionImageRef = ref(
          storage,
          `quizzes/${quizId}/questions/${index}/image.jpg`,
        );
        await uploadBytes(questionImageRef, file);
        return await getDownloadURL(questionImageRef);
      }
      return null;
    });
    const questionImageUrls = await Promise.all(questionImageUploads);

    // Prepare the quiz data object
    const quizData = {
      quizId: quizId,
      authorId: currentUser.uid,
      createdAt: serverTimestamp(),
      title: data.title,
      category: data.category,
      description: data.description,
      timeLimitPerQuestion: data.timeLimitPerQuestion,
      difficulty: data.difficulty,
      visibility: data.visibility,
      imageUrl: quizImageUrl,
      questions: data.questions.map((question, index) => ({
        title: question.title,
        correctAnswer: question.correctAnswer,
        wrongAnswers: question.wrongAnswers,
        imageUrl: questionImageUrls[index],
      })),
      avgRating: 0,
      playsCount: 0,
    };

    // Save the quiz data to Firestore
    await setDoc(quizRef, quizData);

    // Update toast to success
    updateLoadingToSuccess(toastId, "Quiz zapisany!");

    // Reset the form only on success
    reset();

    // Navigate to the quiz detail page
    navigate(`/quiz/${quizId}`);
  } catch (error) {
    // Update toast to error
    updateLoadingToError(toastId, `${error.message}`);
  }
};
