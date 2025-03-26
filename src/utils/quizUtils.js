// utils/quizUtils.js
import { db, storage } from "../firebase";
import { collection, addDoc } from "firebase/firestore";
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";

export const isQuizValid = (quiz, questions) => {
  return (
    quiz.name.trim() &&
    quiz.category.trim() &&
    questions.every(isQuestionFilled) &&
    questions.length > 0
  );
};

export const isQuestionFilled = (question) => {
  return (
    question.questionText.trim() &&
    question.correctAnswer.trim() &&
    question.wrongAnswers.every((answer) => answer.trim())
  );
};

export const prepareQuizData = (quiz, questions, userId) => {
  return {
    createdBy: userId,
    name: quiz.name,
    description: quiz.description,
    timeLimitPerQuestion: quiz.timeLimitPerQuestion,
    category: quiz.category,
    difficulty: quiz.difficulty,
    visibility: quiz.visibility,
    image: null,
    imagePath: quiz.image
      ? `images/${userId}/${quiz.name}-${Date.now()}`
      : null,
    createdAt: new Date().toISOString(),
    questions: questions.map(
      ({ questionText, correctAnswer, wrongAnswers, image }) => ({
        text: questionText,
        correctAnswer,
        wrongAnswers,
        image: null,
        imagePath: image
          ? `images/${userId}/${quiz.name}-${Date.now()}-${Math.random()}`
          : null,
      }),
    ),
  };
};

export const uploadImages = async (quizData, quizImage, questionsImages) => {
  try {
    // Przesyłanie obrazu quizu z metadanymi
    if (quizImage) {
      const quizImageRef = ref(storage, quizData.imagePath);
      const metadata = {
        customMetadata: {
          visibility: quizData.visibility, // Metadane w customMetadata
        },
      };
      console.log("Przesyłanie obrazu quizu z metadanymi:", metadata);
      const uploadTask = uploadBytesResumable(
        quizImageRef,
        quizImage,
        metadata,
      );
      await uploadTask; // Czekamy na zakończenie przesyłania
      quizData.image = await getDownloadURL(quizImageRef);
      console.log("Obraz quizu przesłany, URL:", quizData.image);
    }

    // Przesyłanie obrazów pytań z metadanymi
    for (let i = 0; i < questionsImages.length; i++) {
      if (questionsImages[i]) {
        const questionImageRef = ref(storage, quizData.questions[i].imagePath);
        const metadata = {
          customMetadata: {
            visibility: quizData.visibility, // Metadane w customMetadata
          },
        };
        console.log(`Przesyłanie obrazu pytania ${i} z metadanymi:`, metadata);
        const uploadTask = uploadBytesResumable(
          questionImageRef,
          questionsImages[i],
          metadata,
        );
        await uploadTask; // Czekamy na zakończenie przesyłania
        quizData.questions[i].image = await getDownloadURL(questionImageRef);
        console.log(
          `Obraz pytania ${i} przesłany, URL:`,
          quizData.questions[i].image,
        );
      }
    }

    return quizData;
  } catch (error) {
    console.error("Błąd podczas przesyłania obrazów:", error);
    throw error;
  }
};

export const saveQuizToFirestore = async (quizData) => {
  try {
    const docRef = await addDoc(collection(db, "quizzes"), quizData);
    return docRef.id;
  } catch (error) {
    throw new Error(`Błąd podczas zapisywania quizu: ${error.message}`);
  }
};

export const formatTotalTime = (totalSeconds) => {
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  if (minutes > 0 && seconds === 0) return `${minutes} min`;
  if (minutes > 0) return `${minutes} min ${seconds} s`;
  return `${seconds} s`;
};
