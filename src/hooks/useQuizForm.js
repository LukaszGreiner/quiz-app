import { useState, useRef, useCallback, useEffect } from "react";
import { auth, db, storage } from "../firebase";
import { deleteDoc, doc, updateDoc } from "firebase/firestore";
import { deleteObject, ref, updateMetadata } from "firebase/storage";
import { quizFormConfig } from "../config/quizFormConfig";
import {
  isQuizValid,
  isQuestionFilled,
  prepareQuizData,
  uploadImages,
  saveQuizToFirestore,
  validateField,
} from "../utils/quizUtils";
import {
  showError,
  showLoading,
  updateLoadingToSuccess,
  updateLoadingToError,
} from "../utils/toastUtils";

const toastMessages = {
  saveQuiz: {
    success: (quizName) => `Quiz "${quizName}" został zapisany!`,
    error: "Błąd zapisu quizu",
  },
  changeVisibility: {
    success: "Widoczność zmieniona!",
    error: "Błąd zmiany widoczności",
  },
  deleteQuiz: { success: "Quiz usunięty!", error: "Błąd usuwania quizu" },
};

const withToastHandling = async (callback, messageConfig) => {
  const toastId = showLoading("Przetwarzanie...");
  try {
    const result = await callback();
    updateLoadingToSuccess(toastId, messageConfig.success(result));
    return result;
  } catch (err) {
    updateLoadingToError(toastId, messageConfig.error);
    throw err;
  }
};

export const useQuizForm = () => {
  const [quiz, setQuiz] = useState({
    name: "Quiz bez nazwy",
    description: "",
    timeLimitPerQuestion: 0,
    category: "",
    difficulty: quizFormConfig.DEFAULT_DIFFICULTY,
    visibility: "public",
    image: null,
  });

  const [questions, setQuestions] = useState([
    {
      questionText: "",
      correctAnswer: "",
      wrongAnswers: ["", "", ""],
      isOpen: true,
      image: null,
    },
  ]);

  const questionsContainerRef = useRef(null);
  const isMounted = useRef(false);

  useEffect(() => {
    isMounted.current = true;
    return () => (isMounted.current = false);
  }, []);

  const handleQuizChange = (e) => {
    const { name, value, files } = e.target;
    try {
      setQuiz((prev) => ({
        ...prev,
        [name]: validateField(
          files
            ? files[0]
            : name === "timeLimitPerQuestion"
              ? value === ""
                ? 0
                : Number(value)
              : value,
          {
            maxLength:
              quizFormConfig[`MAX_${name.toUpperCase()}_LENGTH`] || Infinity,
          },
          name,
        ),
      }));
    } catch (err) {
      console.error(err);
    }
  };

  const handleQuestionChange = (
    index,
    field,
    value,
    wrongAnswerIndex = null,
  ) => {
    try {
      const config = {
        maxLength:
          quizFormConfig[`MAX_${field.toUpperCase()}_LENGTH`] || Infinity,
      };
      const validatedValue = validateField(value, config, field);
      setQuestions((prev) => {
        const newQuestions = [...prev];
        if (field === "wrongAnswers" && wrongAnswerIndex !== null) {
          newQuestions[index][field][wrongAnswerIndex] = validatedValue;
        } else {
          newQuestions[index][field] = validatedValue;
        }
        return newQuestions;
      });
    } catch (err) {
      console.error(err);
    }
  };

  const handleExpandQuestion = useCallback((index) => {
    setQuestions((prev) => {
      const newQuestions = [...prev];
      if (
        isQuestionFilled(newQuestions[index]) &&
        !newQuestions[index].isOpen
      ) {
        newQuestions[index].isOpen = true;
      }
      return newQuestions;
    });
  }, []);

  const handleAddQuestion = () => {
    if (
      questions.length < quizFormConfig.QUIZ_QUESTIONS_LIMIT &&
      isQuestionFilled(questions[questions.length - 1])
    ) {
      setQuestions((prev) => [
        ...prev.map((q) => ({ ...q, isOpen: false })),
        {
          questionText: "",
          correctAnswer: "",
          wrongAnswers: ["", "", ""],
          isOpen: true,
          image: null,
        },
      ]);
      setTimeout(
        () =>
          questionsContainerRef.current?.lastElementChild?.scrollIntoView({
            behavior: "smooth",
          }),
        0,
      );
    }
  };

  const handleDeleteQuestion = (index) => {
    if (questions.length > quizFormConfig.MIN_QUESTIONS_REQUIRED) {
      setQuestions((prev) => prev.filter((_, i) => i !== index));
    }
  };

  const resetForm = () => {
    setQuiz({
      name: "Quiz bez nazwy",
      description: "",
      timeLimitPerQuestion: 0,
      category: "",
      difficulty: quizFormConfig.DEFAULT_DIFFICULTY,
      visibility: "public",
      image: null,
    });
    setQuestions([
      {
        questionText: "",
        correctAnswer: "",
        wrongAnswers: ["", "", ""],
        isOpen: true,
        image: null,
      },
    ]);
  };

  const handleSubmit = useCallback(
    async (e) => {
      e.preventDefault();
      if (!isMounted.current || !isQuizValid(quiz, questions)) {
        showError(
          quiz.category.trim()
            ? "Wypełnij wszystkie wymagane pola!"
            : "Wybierz kategorię!",
        );
        return;
      }
      await withToastHandling(async () => {
        const userId =
          auth.currentUser?.uid || throwError("Musisz być zalogowany!");
        const quizData = prepareQuizData(quiz, questions, userId);
        const uploadedData = await uploadImages(
          quizData,
          quiz.image,
          questions.map((q) => q.image),
        );
        const quizId = await saveQuizToFirestore(uploadedData);
        resetForm();
        return quiz.name;
      }, toastMessages.saveQuiz);
    },
    [quiz, questions],
  );

  const handleChangeVisibility = useCallback(
    async (quizId, newVisibility, quizData) => {
      if (!isMounted.current) return;
      await withToastHandling(async () => {
        auth.currentUser?.uid || throwError("Musisz być zalogowany!");
        await updateDoc(doc(db, "quizzes", quizId), {
          visibility: newVisibility,
        });
        const metadata = { customMetadata: { visibility: newVisibility } };
        if (quizData.imagePath)
          await updateMetadata(ref(storage, quizData.imagePath), metadata);
        for (const q of quizData.questions) {
          if (q.imagePath)
            await updateMetadata(ref(storage, q.imagePath), metadata);
        }
        setQuiz((prev) => ({ ...prev, visibility: newVisibility }));
      }, toastMessages.changeVisibility);
    },
    [],
  );

  const deleteQuiz = useCallback(async (quizId, quizData) => {
    if (!isMounted.current) return;
    await withToastHandling(async () => {
      const userId =
        auth.currentUser?.uid || throwError("Musisz być zalogowany!");
      const { claims } = await auth.currentUser.getIdTokenResult();
      if (!claims.admin && quizData.createdBy !== userId)
        throwError("Brak uprawnień!");
      if (quizData.imagePath)
        await deleteObject(ref(storage, quizData.imagePath));
      for (const q of quizData.questions) {
        if (q.imagePath) await deleteObject(ref(storage, q.imagePath));
      }
      await deleteDoc(doc(db, "quizzes", quizId));
    }, toastMessages.deleteQuiz);
  }, []);

  return {
    quiz,
    questions,
    questionsContainerRef,
    handleQuizChange,
    handleQuestionChange,
    handleExpandQuestion,
    handleAddQuestion,
    handleDeleteQuestion,
    handleSubmit,
    handleChangeVisibility,
    deleteQuiz,
    questionLimit: quizFormConfig.QUIZ_QUESTIONS_LIMIT,
  };
};

const throwError = (message) => {
  throw new Error(message);
};
