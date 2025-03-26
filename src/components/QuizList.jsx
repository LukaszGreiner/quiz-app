import { useState, useEffect, useCallback } from "react";
import { auth, db } from "../firebase";
import { collection, query, where, getDocs } from "firebase/firestore";

const QuizList = () => {
  const [quizzes, setQuizzes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const currentUserId = auth.currentUser?.uid || null;

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

  useEffect(() => {
    fetchQuizzes();
  }, [fetchQuizzes]);

  return (
    <div className="mx-auto max-w-3xl p-4">
      <h2 className="mb-4 text-2xl font-bold">Lista Quizów</h2>
      {loading && <div className="text-indigo-600">Ładowanie quizów...</div>}
      {error && <div className="text-red-600">{error}</div>}
      {!loading && !error && quizzes.length === 0 && (
        <div className="text-gray-600">Brak quizów do wyświetlenia.</div>
      )}
      <div className="space-y-4">
        {quizzes.map((quiz) => (
          <div
            key={quiz.id}
            className="rounded-md border border-gray-200 bg-gray-50 p-4"
          >
            <div className="flex items-center gap-4">
              {quiz.image ? (
                <img
                  src={quiz.image}
                  alt={`Obraz quizu ${quiz.name}`}
                  className="h-16 w-16 rounded-md object-cover"
                  onError={(e) =>
                    (e.target.src =
                      "https://placehold.co/128x128.png?text=Brak%20obrazu")
                  }
                />
              ) : (
                <div className="flex h-16 w-16 items-center justify-center rounded-md bg-gray-200 text-gray-500">
                  Brak obrazu
                </div>
              )}
              <div>
                <h3 className="text-lg font-semibold">{quiz.name}</h3>
                <p className="text-sm text-gray-600">
                  Widoczność:{" "}
                  {quiz.visibility === "public" ? "Publiczny" : "Prywatny"}
                </p>
                <p className="text-sm text-gray-600">
                  Twórca:{" "}
                  {quiz.createdBy === currentUserId ? "Ty" : quiz.createdBy}
                </p>
                <p className="text-sm text-gray-600">
                  Liczba pytań: {quiz.questions.length}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
      <button
        onClick={fetchQuizzes}
        className="mt-4 rounded-md bg-indigo-600 px-4 py-2 text-white hover:bg-indigo-700"
      >
        Odśwież listę
      </button>
    </div>
  );
};

export default QuizList;
