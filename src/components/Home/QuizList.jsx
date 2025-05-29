import { useState, useEffect, useCallback } from "react";
import { useParams } from "react-router-dom";
import { auth, db } from "../../firebase";
import { collection, query, where, getDocs } from "firebase/firestore";
import QuizCard from "../QuizCard/QuizCard";
import { useQuizForm } from "../../hooks/useQuizForm";

const QuizList = () => {
  const [quizzes, setQuizzes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const currentUserId = auth.currentUser?.uid || null;
  const { category } = useParams();

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
      let publicQuery;

      if (!category || category.toLowerCase() === "wszystkie") {
        publicQuery = query(
          collection(db, "quizzes"),
          where("visibility", "==", "public"),
        );
      } else {
        publicQuery = query(
          collection(db, "quizzes"),
          where("visibility", "==", "public"),
          where(
            "category",
            "==",
            category.charAt(0).toUpperCase() + category.slice(1).toLowerCase(),
          ),
        );
      }

      const publicSnapshot = await getDocs(publicQuery);
      const publicQuizzes = publicSnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      quizzesData = [...publicQuizzes];

      if (currentUserId) {
        let privateQuery;
        if (!category || category.toLowerCase() === "wszystkie") {
          privateQuery = query(
            collection(db, "quizzes"),
            where("createdBy", "==", currentUserId),
            where("visibility", "==", "private"),
          );
        } else {
          privateQuery = query(
            collection(db, "quizzes"),
            where("createdBy", "==", currentUserId),
            where("visibility", "==", "private"),
            where(
              "category",
              "==",
              category.charAt(0).toUpperCase() +
                category.slice(1).toLowerCase(),
            ),
          );
        }

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
  }, [currentUserId, category]);

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
    <div className="mx-auto max-w-7xl p-6">
      <h2 className="mb-8 text-center">
        Lista Quizów
        {category && category !== "wszystkie" ? ` - ${category}` : ""}
      </h2>

      {/* Status Messages */}
      {loading && (
        <div className="text-primary mb-6 text-center">Ładowanie quizów...</div>
      )}
      {error && <div className="text-incorrect mb-6 text-center">{error}</div>}
      {deleteLoading && (
        <div className="text-primary mb-6 text-center">Usuwanie quizu...</div>
      )}
      {deleteError && (
        <div className="text-incorrect mb-6 text-center">{deleteError}</div>
      )}
      {successMessage && (
        <div className="text-correct mb-6 text-center">{successMessage}</div>
      )}

      {/* Empty State */}
      {!loading && !error && quizzes.length === 0 && (
        <div className="py-12 text-center">
          <p className="text-text-muted text-lg">
            Brak quizów do wyświetlenia.
          </p>
        </div>
      )}

      {/* Quiz Grid */}
      {!loading && !error && quizzes.length > 0 && (
        <div className="grid grid-cols-1 justify-items-center gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {quizzes.map((quiz) => (
            <QuizCard
              key={quiz.id}
              quiz={{
                quizId: quiz.id,
                imageUrl: quiz.image,
                title: quiz.name,
                description: quiz.description,
                visibility: quiz.visibility,
                authorId: quiz.createdBy,
                category: quiz.category,
                questions: quiz.questions,
                createdAt: quiz.createdAt,
                imagePath: quiz.imagePath,
              }}
              onEdit={() => console.log(`Edit quiz: ${quiz.id}`)}
              onDelete={handleDelete}
            />
          ))}
        </div>
      )}

      {/* Refresh Button */}
      <div className="mt-8 text-center">
        <button
          onClick={fetchQuizzes}
          className="bg-primary text-text-inverse hover:bg-primary/85 active:bg-primary/95 focus:ring-primary/20 rounded-lg px-6 py-3 font-medium transition-all duration-200 focus:ring-2 focus:outline-none"
        >
          Odśwież listę
        </button>
      </div>
    </div>
  );
};

export default QuizList;
