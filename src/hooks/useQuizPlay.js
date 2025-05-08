import { useState, useEffect, useRef, useCallback } from "react";
import { auth } from "../firebase";
import { fetchUserQuizAttempts, saveQuizResult } from "../services/quizService";
import { updateLoadingToError } from "../utils/toastUtils";

export const useQuizPlay = (quizId, quizData, questions) => {
  const [quizStartAt, setQuizStartAt] = useState(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [userAnswers, setUserAnswers] = useState({});
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [timeLeft, setTimeLeft] = useState(null);
  const [shuffledAnswers, setShuffledAnswers] = useState([]);
  const [userAttempts, setUserAttempts] = useState([]);
  const [maxScoreAchieved, setMaxScoreAchieved] = useState(false);
  const timerRef = useRef(null);

  useEffect(() => {
    if (quizData?.timeLimitPerQuestion && !isSubmitted) {
      setTimeLeft(quizData.timeLimitPerQuestion);
    }
  }, [currentQuestionIndex, quizData, isSubmitted]);

  useEffect(() => {
    const fetchAttempts = async () => {
      const userId = auth.currentUser?.uid;
      if (!userId || !quizId || !questions || questions.length === 0) return;

      try {
        const attempts = await fetchUserQuizAttempts(userId, quizId);
        setUserAttempts(attempts);
        const maxScore = questions.length;
        const hasMaxScore = attempts.some(
          (attempt) => attempt.score === maxScore,
        );
        setMaxScoreAchieved(hasMaxScore);
      } catch (error) {
        console.error("Error fetching user attempts:", error);
      }
    };

    if (auth.currentUser && quizId && questions?.length > 0) {
      fetchAttempts();
    }
  }, [quizId, questions]); // auth.currentUser dependency

  useEffect(() => {
    if (questions?.length > 0 && quizStartAt === null) {
      setQuizStartAt(Date.now());
    }
  }, [questions, quizStartAt]);

  useEffect(() => {
    if (questions?.length > 0 && questions[currentQuestionIndex]) {
      const currentQuestion = questions[currentQuestionIndex];
      const answers = [
        currentQuestion.correctAnswer,
        ...currentQuestion.wrongAnswers,
      ];
      setShuffledAnswers(answers.sort(() => Math.random() - 0.5));
    }
  }, [questions, currentQuestionIndex]);

  const calculateScore = useCallback(() => {
    if (!questions) return 0;
    return questions.reduce(
      (score, question, index) =>
        userAnswers[index] === question.correctAnswer ? score + 1 : score,
      0,
    );
  }, [questions, userAnswers]);

  const submitQuiz = useCallback(async () => {
    clearInterval(timerRef.current);
    setIsSubmitted(true);

    const userId = auth.currentUser?.uid;
    if (userId && quizData && questions && quizStartAt !== null) {
      const score = calculateScore();
      try {
        await saveQuizResult(
          userId,
          quizId,
          quizData.title,
          score,
          questions.length,
          quizStartAt,
          userAnswers,
          questions,
        );
      } catch (err) {
        // Error is handled by saveQuizResult's toast
        console.error("Error in submitQuiz:", err);
      }
    } else if (!userId) {
      updateLoadingToError(null, "Zaloguj się, aby zapisać wynik!");
    }
  }, [
    quizId,
    quizData,
    questions,
    userAnswers,
    quizStartAt,
    calculateScore,
    setIsSubmitted,
  ]);

  useEffect(() => {
    if (
      questions?.length > 0 &&
      timeLeft !== null &&
      timeLeft > 0 &&
      !isSubmitted &&
      quizData?.timeLimitPerQuestion > 0
    ) {
      timerRef.current = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            clearInterval(timerRef.current);
            // Automatically submit or move to next if time runs out for a question
            if (currentQuestionIndex < questions.length - 1) {
              setCurrentQuestionIndex((prevIdx) => prevIdx + 1);
              // Time will be reset by the other useEffect for timeLeft
            } else {
              submitQuiz();
            }
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(timerRef.current);
  }, [
    questions,
    timeLeft,
    currentQuestionIndex,
    isSubmitted,
    quizData,
    submitQuiz,
  ]);

  const handleAnswerSelect = useCallback(
    (answer) => {
      setUserAnswers((prev) => ({
        ...prev,
        [currentQuestionIndex]: answer,
      }));
    },
    [currentQuestionIndex],
  );

  const handleNextOrSubmit = useCallback(() => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex((prev) => prev + 1);
      // Time reset is handled by useEffect watching currentQuestionIndex and quizData.timeLimitPerQuestion
    } else {
      submitQuiz();
    }
  }, [currentQuestionIndex, questions, submitQuiz]);

  const handlePrevious = useCallback(() => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex((prev) => prev - 1);
    }
  }, [currentQuestionIndex]);

  const progress =
    questions?.length > 0
      ? ((currentQuestionIndex + 1) / questions.length) * 100
      : 0;
  const currentQuestion = questions?.[currentQuestionIndex];
  const score = isSubmitted ? calculateScore() : 0;

  return {
    currentQuestionIndex,
    userAnswers,
    isSubmitted,
    timeLeft,
    shuffledAnswers,
    userAttempts,
    maxScoreAchieved,
    handleAnswerSelect,
    handleNextOrSubmit,
    handlePrevious,
    progress,
    currentQuestion,
    score,
    isLoadingUserAttempts:
      !auth.currentUser ||
      (auth.currentUser &&
        userAttempts.length === 0 &&
        questions?.length > 0 &&
        !maxScoreAchieved),
  };
};
