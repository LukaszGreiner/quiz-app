import { useState, useEffect, useCallback } from "react";
import { auth, db } from "../firebase";
import { collection, query, where, getDocs } from "firebase/firestore";
import QuizCard from "./QuizCard";
import { useQuizForm } from "../hooks/useQuizForm"; // Import the hook

const QuizList = () => {
  const [quizzes, setQuizzes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const currentUserId = auth.currentUser?.uid || null;

  // Use the hook just for deletion functionality
  const {
    deleteQuiz,
    isLoading: deleteLoading,
    error: deleteError,
    successMessage,
  } = useQuizForm();

  const fetchQuizzes = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      let quizzesData = [];
      const publicQuery = query(
        collection(db, "quizzes"),
        where("visibility", "==", "public"),
      );
      const publicSnapshot = await getDocs(publicQuery);
      const publicQuizzes = publicSnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      quizzesData = [...publicQuizzes];

      if (currentUserId) {
        const privateQuery = query(
          collection(db, "quizzes"),
          where("createdBy", "==", currentUserId),
          where("visibility", "==", "private"),
        );
        const privateSnapshot = await getDocs(privateQuery);
        const privateQuizzes = privateSnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        quizzesData = [...quizzesData, ...privateQuizzes];
      }

      setQuizzes(quizzesData);
    } catch (err) {
      setError("Błąd podczas pobierania quizów: " + err.message);
    } finally {
      setLoading(false);
    }
  }, [currentUserId]);

  const handleDelete = async (quizId) => {
    if (window.confirm("Czy na pewno chcesz usunąć ten quiz?")) {
      const quizToDelete = quizzes.find((q) => q.id === quizId);
      if (quizToDelete) {
        await deleteQuiz(quizId, quizToDelete);
        if (!deleteError) {
          setQuizzes((prev) => prev.filter((q) => q.id !== quizId));
        }
      }
    }
  };

  useEffect(() => {
    fetchQuizzes();
  }, [fetchQuizzes]);

  return (
    <div className="mx-auto max-w-4xl p-4">
      <h2 className="mb-6 text-center text-2xl font-bold">Lista Quizów</h2>
      {loading && (
        <div className="text-center text-indigo-600">Ładowanie quizów...</div>
      )}
      {error && <div className="text-center text-red-600">{error}</div>}
      {deleteLoading && (
        <div className="text-center text-indigo-600">Usuwanie quizu...</div>
      )}
      {deleteError && (
        <div className="text-center text-red-600">{deleteError}</div>
      )}
      {successMessage && (
        <div className="text-center text-green-600">{successMessage}</div>
      )}
      {!loading && !error && quizzes.length === 0 && (
        <div className="text-center text-gray-600">
          Brak quizów do wyświetlenia.
        </div>
      )}
      <div className="flex flex-wrap justify-center gap-4">
        {quizzes.map((quiz) => (
          <QuizCard
            key={quiz.id}
            id={quiz.id}
            image={quiz.image}
            name={quiz.name}
            visibility={quiz.visibility}
            createdBy={quiz.createdBy}
            questions={quiz.questions}
            currentUserId={currentUserId}
            onEdit={() => console.log(`Edit quiz: ${quiz.id}`)}
            onDelete={handleDelete}
          />
        ))}
      </div>
      <div className="mt-6 text-center">
        <button
          onClick={fetchQuizzes}
          className="rounded-md bg-indigo-600 px-4 py-2 text-white hover:bg-indigo-700"
        >
          Odśwież listę
        </button>
      </div>
    </div>
  );
};

export default QuizList;
