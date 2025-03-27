import { db, storage } from "../firebase";
import { collection, addDoc } from "firebase/firestore";
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { quizFormConfig } from "../config/quizFormConfig";
import { showError } from "./toastUtils";

// Centralized field validation
export const validateField = (value, config, fieldName) => {
  if (typeof value === "string") {
    if (value.length > config.maxLength) {
      const error = `${fieldName} przekracza ${config.maxLength} znaków!`;
      showError(error);
      throw new Error(error);
    }
    return value;
  }
  if (value instanceof File) {
    return validateImage(value, fieldName);
  }
  return value;
};

// Validates image files
export const validateImage = (file, fieldName = "obrazu") => {
  if (!file) return null;
  if (file.size > quizFormConfig.MAX_IMAGE_SIZE) {
    const error = `Rozmiar ${fieldName} przekracza ${quizFormConfig.MAX_IMAGE_SIZE / (1024 * 1024)} MB!`;
    showError(error);
    throw new Error(error);
  }
  if (!quizFormConfig.ALLOWED_IMAGE_TYPES.includes(file.type)) {
    const error = `Niedozwolony format ${fieldName}! (Dozwolone: JPG, PNG, GIF)`;
    showError(error);
    throw new Error(error);
  }
  return file;
};

// Validates if a question is fully filled
export const isQuestionFilled = (question) => {
  return (
    question.questionText.trim() &&
    question.correctAnswer.trim() &&
    question.wrongAnswers.every((answer) => answer.trim())
  );
};

// Validates the entire quiz
export const isQuizValid = (quiz, questions) => {
  return (
    quiz.name.trim() &&
    quiz.category.trim() &&
    questions.length >= quizFormConfig.MIN_QUESTIONS_REQUIRED &&
    questions.every(isQuestionFilled)
  );
};

// Dynamic quiz data preparation
export const prepareQuizData = (
  quiz,
  questions,
  userId,
  config = quizFormConfig,
) => {
  if (!isQuizValid(quiz, questions)) {
    throw new Error("Nieprawidłowe dane quizu!");
  }
  const quizData = { createdBy: userId, createdAt: new Date().toISOString() };
  Object.keys(quiz).forEach((key) => {
    if (key !== "image") quizData[key] = quiz[key];
  });
  quizData.imagePath = quiz.image
    ? `images/${userId}/${quiz.name}-${Date.now()}`
    : null;
  quizData.questions = questions.map((q) => ({
    text: q.questionText,
    correctAnswer: q.correctAnswer,
    wrongAnswers: q.wrongAnswers,
    image: null,
    imagePath: q.image
      ? `images/${userId}/${quiz.name}-${Date.now()}-${Math.random()}`
      : null,
  }));
  return quizData;
};

// Upload single image with metadata
const uploadSingleImage = async (file, path, visibility) => {
  const imageRef = ref(storage, path);
  const metadata = { customMetadata: { visibility } };
  await uploadBytesResumable(imageRef, file, metadata);
  return getDownloadURL(imageRef);
};

// Upload all images
export const uploadImages = async (quizData, quizImage, questionsImages) => {
  if (quizImage) {
    quizData.image = await uploadSingleImage(
      quizImage,
      quizData.imagePath,
      quizData.visibility,
    );
  }
  for (let i = 0; i < questionsImages.length; i++) {
    if (questionsImages[i]) {
      quizData.questions[i].image = await uploadSingleImage(
        questionsImages[i],
        quizData.questions[i].imagePath,
        quizData.visibility,
      );
    }
  }
  return quizData;
};

// Save quiz to Firestore
export const saveQuizToFirestore = async (quizData) => {
  const docRef = await addDoc(collection(db, "quizzes"), quizData);
  return docRef.id;
};

// Format total time
export const formatTotalTime = (totalSeconds) => {
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  return minutes > 0
    ? `${minutes} min ${seconds > 0 ? `${seconds} s` : ""}`
    : `${seconds} s`;
};
