import { useState, useEffect } from "react";
import { fetchQuizData } from "../utils/quizUtils";
import {
  showLoading,
  updateLoadingToSuccess,
  updateLoadingToError,
} from "../utils/toastUtils";

export const useQuiz = (quizId) => {
  const [quizData, setQuizData] = useState(null);
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchQuiz = async () => {
      const toastId = showLoading("Ładowanie quizu...");
      setLoading(true);
      setError(null);

      try {
        const { quiz, questions } = await fetchQuizData(quizId);
        setQuizData(quiz);
        setQuestions(questions);
        updateLoadingToSuccess(toastId, "Quiz załadowany pomyślnie!");
      } catch (err) {
        setError(err.message);
        updateLoadingToError(toastId, `Błąd: ${err.message}`);
      } finally {
        setLoading(false);
      }
    };

    if (quizId) {
      fetchQuiz();
    }
  }, [quizId]);

  return { quizData, questions, loading, error };
};
