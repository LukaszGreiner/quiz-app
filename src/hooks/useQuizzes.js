// src/hooks/useQuizzes.js
import { useState, useEffect } from "react";
import { collection, getDocs, query, orderBy } from "firebase/firestore";
import { db } from "../firebase";
import {
  showError,
  showLoading,
  updateLoadingToSuccess,
  updateLoadingToError,
} from "../utils/toastUtils";

export const useQuizzes = () => {
  const [quizzes, setQuizzes] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchQuizzes = async () => {
      const toastId = showLoading("Ładowanie quizów...");
      try {
        const q = query(
          collection(db, "quizzes"),
          orderBy("createdAt", "desc"),
        );
        const querySnapshot = await getDocs(q);
        if (querySnapshot.empty) {
          updateLoadingToError(toastId, "Brak quizów do wyświetlenia");
          setQuizzes([]);
        } else {
          const quizData = querySnapshot.docs.map((doc) => ({
            quizId: doc.id,
            ...doc.data(),
          }));
          console.log("Fetched quizzes:", quizData);
          setQuizzes(quizData);
          updateLoadingToSuccess(toastId, "Quizy załadowane!");
        }
      } catch (error) {
        updateLoadingToError(
          toastId,
          `Błąd ładowania quizów: ${error.message}`,
        );
      } finally {
        setLoading(false);
      }
    };
    fetchQuizzes();
  }, []);

  return { quizzes, loading };
};
