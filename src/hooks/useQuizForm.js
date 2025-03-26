import { useState, useRef, useCallback, useEffect } from "react";
import { auth, db, storage } from "../firebase";
import { doc, updateDoc } from "firebase/firestore";
import { ref, updateMetadata } from "firebase/storage";
import {
  isQuizValid,
  isQuestionFilled,
  prepareQuizData,
  uploadImages,
  saveQuizToFirestore,
} from "../utils/quizUtils";

const QUIZ_QUESTIONS_LIMIT = 20;

export const useQuizForm = () => {
  const [quiz, setQuiz] = useState({
    name: "Quiz bez nazwy",
    description: "",
    timeLimitPerQuestion: 0,
    category: "",
    difficulty: "normal",
    visibility: "public",
    image: null,
  });

  const [questions, setQuestions] = useState([
    {
      questionText: "",
      correctAnswer: "",
      wrongAnswers: ["", "", ""],
      isOpen: true, // Nadal ustawiamy początkowe isOpen, ale nie zarządzamy nim
      image: null,
    },
  ]);

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);

  const questionsContainerRef = useRef(null);
  const isMounted = useRef(false);

  useEffect(() => {
    isMounted.current = true;
    return () => {
      isMounted.current = false;
    };
  }, []);

  const handleQuizChange = (e) => {
    const { name, value, files } = e.target;
    if (name === "image") {
      setQuiz((prev) => ({ ...prev, image: files[0] || null }));
    } else {
      const val =
        name === "timeLimitPerQuestion"
          ? value === ""
            ? 0
            : Number(value)
          : value;
      setQuiz((prev) => ({ ...prev, [name]: val }));
    }
  };

  const handleNameChange = (name) => {
    setQuiz((prev) => ({ ...prev, name }));
  };

  const handleQuestionChange = (
    index,
    field,
    value,
    wrongAnswerIndex = null,
  ) => {
    setQuestions((prev) => {
      const newQuestions = [...prev];
      if (field === "wrongAnswers" && wrongAnswerIndex !== null) {
        newQuestions[index][field][wrongAnswerIndex] = value;
      } else if (field === "image") {
        newQuestions[index][field] = value instanceof File ? value : null;
      } else {
        newQuestions[index][field] = value;
      }
      return newQuestions;
    });
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
      questions.length < QUIZ_QUESTIONS_LIMIT &&
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
      setTimeout(() => {
        questionsContainerRef.current?.lastElementChild?.scrollIntoView({
          behavior: "smooth",
          block: "start",
        });
      }, 0);
    }
  };

  const handleDeleteQuestion = (index) => {
    if (questions.length > 1) {
      setQuestions((prev) => prev.filter((_, i) => i !== index));
    }
  };

  const handleSubmit = useCallback(
    async (e) => {
      e.preventDefault();

      if (!isMounted.current || isLoading) return;

      setIsLoading(true);
      setError(null);
      setSuccessMessage(null);

      try {
        if (!isQuizValid(quiz, questions)) {
          throw new Error(
            "Wypełnij wszystkie wymagane pola: nazwę quizu, kategorię i pytania!",
          );
        }

        const userId = auth.currentUser?.uid;
        if (!userId) {
          throw new Error("Musisz być zalogowany, aby zapisać quiz!");
        }

        let quizData = prepareQuizData(quiz, questions, userId);
        const questionsImages = questions.map((q) => q.image);
        quizData = await uploadImages(quizData, quiz.image, questionsImages);
        const quizId = await saveQuizToFirestore(quizData);

        if (isMounted.current) {
          setSuccessMessage(`Quiz zapisany pomyślnie! ID: ${quizId}`);
          setQuiz({
            name: "Quiz bez nazwy",
            description: "",
            timeLimitPerQuestion: 0,
            category: "",
            difficulty: "normal",
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
        }
      } catch (err) {
        if (isMounted.current) {
          setError(err.message);
        }
      } finally {
        if (isMounted.current) {
          setIsLoading(false);
        }
      }
    },
    [quiz, questions, isLoading],
  );

  const handleChangeVisibility = useCallback(
    async (quizId, newVisibility, quizData) => {
      if (!isMounted.current || isLoading) return;

      setIsLoading(true);
      setError(null);
      setSuccessMessage(null);

      try {
        const userId = auth.currentUser?.uid;
        if (!userId) {
          throw new Error(
            "Musisz być zalogowany, aby zmienić widoczność quizu!",
          );
        }

        await updateDoc(doc(db, "quizzes", quizId), {
          visibility: newVisibility,
        });

        const metadata = {
          customMetadata: {
            visibility: newVisibility,
          },
        };
        if (quizData.imagePath) {
          const quizImageRef = ref(storage, quizData.imagePath);
          console.log("Aktualizacja metadanych obrazu quizu:", metadata);
          await updateMetadata(quizImageRef, metadata);
        }
        for (const question of quizData.questions) {
          if (question.imagePath) {
            const questionImageRef = ref(storage, question.imagePath);
            console.log("Aktualizacja metadanych obrazu pytania:", metadata);
            await updateMetadata(questionImageRef, metadata);
          }
        }

        if (isMounted.current) {
          setQuiz((prev) => ({ ...prev, visibility: newVisibility }));
          setSuccessMessage("Widoczność quizu zmieniona pomyślnie!");
        }
      } catch (err) {
        if (isMounted.current) {
          setError(err.message);
        }
      } finally {
        if (isMounted.current) {
          setIsLoading(false);
        }
      }
    },
    [isLoading],
  );

  return {
    quiz,
    questions,
    questionsContainerRef,
    handleQuizChange,
    handleNameChange,
    handleQuestionChange,
    handleExpandQuestion,
    handleAddQuestion,
    handleDeleteQuestion,
    handleSubmit,
    handleChangeVisibility,
    questionLimit: QUIZ_QUESTIONS_LIMIT,
    isLoading,
    error,
    successMessage,
  };
};
