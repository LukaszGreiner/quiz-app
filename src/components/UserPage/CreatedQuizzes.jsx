// src/components/CreatedQuizzes.jsx
import React, { useState, useEffect } from "react";
import { getFilteredDocs } from "../../services/firestore";
import QuizCard from "../QuizCard/QuizCard";
const CreatedQuizzes = ({ authorId }) => {
  const [quizzes, setQuizzes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchQuizzes = async () => {
      try {
        setLoading(true);
        if (authorId) {
          const quizData = await getFilteredDocs(
            "quizzes",
            "authorId",
            "==",
            authorId,
          );
          setQuizzes(quizData);
          console.log(quizData);
        } else {
          setQuizzes([]);
        }
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };

    fetchQuizzes();
  }, [authorId]);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div>
      <h2>Created Quizzes</h2>
      {quizzes.length === 0 ? (
        <p>No quizzes found for this author.</p>
      ) : (
        <ul className="flex flex-wrap items-center justify-center gap-4">
          {quizzes.map((quiz) => (
            <li key={quiz.id}>
              <QuizCard quiz={quiz} />
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default CreatedQuizzes;
