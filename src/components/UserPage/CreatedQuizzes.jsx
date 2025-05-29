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
  if (loading) {
    return (
      <div className="py-12 text-center">
        <div className="animate-pulse">
          <div className="bg-surface mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full">
            <svg
              className="text-text-muted h-8 w-8 animate-spin"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              ></circle>
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              ></path>
            </svg>
          </div>
          <p className="font-quicksand text-text-muted">
            Loading your quizzes...
          </p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="py-12 text-center">
        <div className="bg-incorrect/10 mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full">
          <svg
            className="text-incorrect h-8 w-8"
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path
              fillRule="evenodd"
              d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
              clipRule="evenodd"
            />
          </svg>
        </div>
        <p className="font-quicksand text-text mb-2">Error loading quizzes</p>
        <p className="font-quicksand text-text-muted text-sm">{error}</p>
      </div>
    );
  }
  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="bg-primary/10 flex h-10 w-10 items-center justify-center rounded-full">
            <svg
              className="text-primary h-5 w-5"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path
                fillRule="evenodd"
                d="M3 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z"
                clipRule="evenodd"
              />
            </svg>
          </div>
          <div>
            <h2 className="font-montserrat text-text text-xl font-bold">
              Created Quizzes
            </h2>
            <p className="font-quicksand text-text-muted text-sm">
              {quizzes.length} quiz{quizzes.length !== 1 ? "es" : ""} created
            </p>
          </div>
        </div>
        <button className="bg-primary text-text-inverse font-quicksand hover:bg-primary/90 flex items-center gap-2 rounded-xl px-4 py-2 font-medium transition-all duration-200 hover:shadow-md active:scale-95">
          <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 20 20">
            <path
              fillRule="evenodd"
              d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z"
              clipRule="evenodd"
            />
          </svg>
          Create New
        </button>
      </div>

      {quizzes.length === 0 ? (
        <div className="py-12 text-center">
          <div className="bg-surface mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full">
            <svg
              className="text-text-muted h-10 w-10"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 6v6m0 0v6m0-6h6m-6 0H6"
              />
            </svg>
          </div>
          <h3 className="font-montserrat text-text mb-2 text-lg font-semibold">
            No quizzes created yet
          </h3>
          <p className="font-quicksand text-text-muted mx-auto mb-6 max-w-md">
            Start creating engaging quizzes to share with others. Your quizzes
            will appear here once you've created them.
          </p>
          <button className="bg-primary text-text-inverse font-quicksand hover:bg-primary/90 inline-flex items-center gap-2 rounded-xl px-6 py-3 font-medium transition-all duration-200 hover:shadow-md active:scale-95">
            <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 20 20">
              <path
                fillRule="evenodd"
                d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z"
                clipRule="evenodd"
              />
            </svg>
            Create Your First Quiz
          </button>
        </div>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {quizzes.map((quiz) => (
            <div key={quiz.id} className="group">
              <QuizCard quiz={quiz} />
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default CreatedQuizzes;
