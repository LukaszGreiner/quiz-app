import { useParams } from "react-router";
import useLocalStorage from "../hooks/useLocalStorage";
import QuizForm from "../components/QuizForm/QuizForm";
import { fetchQuizById } from "../services/quizService";
import { useEffect, useCallback } from "react";
import { useState } from "react";

export default function QuizEdit() {
  const { quizId } = useParams();
  const { getItem, removeItem } = useLocalStorage();
  const [quizData, setQuizData] = useState(null);
  const [originalData, setOriginalData] = useState(null); // Store original data separately
  const [isLoading, setIsLoading] = useState(true);

  // Fetch original data from server
  const fetchOriginalQuizData = useCallback(async () => {
    try {
      const data = await fetchQuizById(quizId);
      // Format data for form
      const formattedData = {
        ...data,
        image: data.imageUrl || null,
        imageUrl: data.imageUrl || null,
        questions: data.questions.map((q) => ({
          ...q,
          image: q.imageUrl || null,
          imageUrl: q.imageUrl || null,
        })),
      };
      setOriginalData(formattedData); // Save original data
      return formattedData;
    } catch (error) {
      console.error("Error fetching original quiz data:", error);
      return null;
    }
  }, [quizId]);

  // Load data - either from localStorage or from server
  const loadQuizData = useCallback(async () => {
    try {
      setIsLoading(true);
      const savedForm = getItem("editQuizFormState");

      // Always fetch original data first (for reset functionality)
      const originalQuizData = await fetchOriginalQuizData();

      if (savedForm) {
        // Use saved localStorage state
        setQuizData(savedForm);
      } else if (originalQuizData) {
        // No localStorage data, use original data
        setQuizData(originalQuizData);
      }
    } catch (error) {
      console.error("Error loading quiz data:", error);
    } finally {
      setIsLoading(false);
    }
  }, [quizId]); // Removed getItem dependency

  useEffect(() => {
    loadQuizData();
  }, [loadQuizData]);

  // Handle form reset - use the stored original data
  const handleReset = useCallback(() => {
    removeItem("editQuizFormState");
    // Use the stored original data instead of reloading
    if (originalData) {
      setQuizData({ ...originalData });
    }
  }, [removeItem, originalData]);

  if (isLoading) return <div>Loading...</div>;

  return <QuizForm defaultValues={quizData} onReset={handleReset} />;
}
