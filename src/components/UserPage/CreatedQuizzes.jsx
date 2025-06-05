// src/components/CreatedQuizzes.jsx
import React, { useState, useEffect } from "react";
import { getFilteredDocs } from "../../services/firestore";
import QuizCard from "../QuizCard/QuizCard";
import Btn from "../common/Btn";
import { FileText, Plus, AlertTriangle, Loader } from "lucide-react";
const CreatedQuizzes = ({ authorId }) => {
  const [quizzes, setQuizzes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    console.log("Author ID:", authorId); // Debug log for authorId
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
          console.log("Fetched quizzes:", quizData); // Debug log for fetched quizzes
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
            <Loader className="text-text-muted h-8 w-8 animate-spin" />
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
          <AlertTriangle className="text-incorrect h-8 w-8" />
        </div>
        <p className="font-quicksand text-text mb-2">Error loading quizzes</p>
        <p className="font-quicksand text-text-muted text-sm">{error}</p>
      </div>
    );
  }
  return (
    <div>
      {" "}
      <div className="mb-6 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="bg-primary/10 flex h-10 w-10 items-center justify-center rounded-full">
            <FileText className="text-primary h-5 w-5" />
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
        <Btn
          variant="primary"
          size="md"
          className="flex items-center gap-2"
          to="/newquiz"
        >
          <Plus className="h-4 w-4" />
          Create New
        </Btn>
      </div>{" "}
      {quizzes.length === 0 ? (
        <div className="py-12 text-center">
          <div className="bg-surface mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full">
            <Plus className="text-text-muted h-10 w-10" />
          </div>
          <h3 className="font-montserrat text-text mb-2 text-lg font-semibold">
            No quizzes created yet
          </h3>
          <p className="font-quicksand text-text-muted mx-auto mb-6 max-w-md">
            Start creating engaging quizzes to share with others. Your quizzes
            will appear here once you've created them.
          </p>
          <Btn
            variant="primary"
            size="lg"
            className="inline-flex items-center gap-2"
            to="/newquiz"
          >
            <Plus className="h-4 w-4" />
            Create Your First Quiz
          </Btn>
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
