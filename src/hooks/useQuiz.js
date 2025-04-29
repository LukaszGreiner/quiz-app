import { useState, useEffect } from "react";
import { showError } from "../utils/toastUtils";
import { fetchQuizById } from "../services/quizService";

export const useQuiz = (quizId) => {
  const [state, setState] = useState({
    quizData: null,
    questions: [],
    loading: true,
    error: null,
  });

  useEffect(() => {
    if (!quizId) return;

    const fetchQuiz = async () => {
      try {
        const quiz = await fetchQuizById(quizId);
        setState({
          quizData: quiz,
          questions: quiz.questions,
          loading: false,
          error: null,
        });
      } catch (error) {
        showError("Błąd ładowania quizu: " + error.message);
        setState((prev) => ({
          ...prev,
          error: error.message,
          loading: false,
        }));
      }
    };

    fetchQuiz();
  }, [quizId]);

  return state;
};
