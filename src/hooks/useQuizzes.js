// src/hooks/useQuizzes.js
import { useState, useEffect } from "react";
import { collection, getDocs, query, orderBy } from "firebase/firestore";
import { db } from "../firebase";

export const useQuizzes = () => {
  const [quizzes, setQuizzes] = useState([]);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    const fetchQuizzes = async () => {
      try {
        const q = query(
          collection(db, "quizzes"),
          orderBy("createdAt", "desc"),
        );
        const querySnapshot = await getDocs(q);
        const quizData = querySnapshot.docs.map((doc) => ({
          quizId: doc.id,
          ...doc.data(),
        }));
        setQuizzes(quizData);
      } catch (error) {
        console.error("Błąd ładowania quizów:", error);
        setQuizzes([]);
      } finally {
        setLoading(false);
      }
    };
    fetchQuizzes();
  }, []);

  return { quizzes, loading };
};
