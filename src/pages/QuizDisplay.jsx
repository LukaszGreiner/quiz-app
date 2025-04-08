import { useParams, useNavigate } from "react-router-dom";
import { doc, getDoc, collection, getDocs } from "firebase/firestore";
import { db } from "../firebase";
import { useEffect, useState } from "react";
import { formatTotalTime } from "../utils/quizUtils";
import {
  showLoading,
  updateLoadingToSuccess,
  updateLoadingToError,
} from "../utils/toastUtils";

const QuizDisplay = () => {
  const { quizId } = useParams();
  const [quizData, setQuizData] = useState(null);
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(false); // prevent rendering
  const navigate = useNavigate();

  useEffect(() => {
    const fetchQuiz = async () => {
      const toastId = showLoading("Ładowanie quizu..."); // Show loading toast
      setLoading(true);

      try {
        // Fetch main quiz document
        const quizRef = doc(db, "quizzes", quizId);
        const quizSnap = await getDoc(quizRef);

        if (!quizSnap.exists()) {
          throw new Error("Quiz nie istnieje");
        }

        const quiz = quizSnap.data();

        // Fetch questions from subcollection
        const questionsRef = collection(db, "quizzes", quizId, "questions");
        const questionsSnap = await getDocs(questionsRef);

        if (questionsSnap.empty) {
          throw new Error("Brak pytań w quizie");
        }

        const questionsData = questionsSnap.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));

        setQuizData(quiz);
        setQuestions(questionsData);
        updateLoadingToSuccess(toastId, "Quiz załadowany pomyślnie!");
      } catch (err) {
        updateLoadingToError(toastId, `Błąd: ${err.message}`);
      } finally {
        setLoading(false);
      }
    };

    fetchQuiz();
  }, [quizId]);

  if (loading || !quizData || questions.length === 0) return null; // Render nothing while loading or if data is incomplete

  const totalTime = quizData.timeLimitPerQuestion * questions.length;

  const handleStartQuiz = () => {
    navigate(`/quiz/play/${quizId}`);
  };

  // Placeholder for author name (replace with actual user fetch if needed)
  const authorName = quizData.authorId; // Ideally, fetch username from users collection

  return (
    <div className="mx-auto max-w-4xl p-6">
      {/* Quiz Header */}
      <div className="mb-8 rounded-xl bg-white p-6 shadow-md">
        {quizData.imageUrl && (
          <img
            src={quizData.imageUrl}
            alt={`Obraz quizu ${quizData.title}`}
            className="mb-4 h-48 w-full rounded-lg object-cover"
            onError={(e) =>
              (e.target.src =
                "https://placehold.co/300x200.png?text=Brak%20obrazu")
            }
          />
        )}
        <h1 className="mb-2 text-3xl font-bold text-gray-800">
          {quizData.title}
        </h1>
        <p className="mb-4 text-gray-600">{quizData.description}</p>
        <div className="flex flex-col gap-2 text-sm text-gray-700">
          <p>
            <strong>Kategoria:</strong> {quizData.category}
          </p>
          <p>
            <strong>Trudność:</strong> {quizData.difficulty}
          </p>
          <p>
            <strong>Widoczność:</strong>{" "}
            {quizData.visibility === "public" ? "Publiczny" : "Prywatny"}
          </p>
          <p>
            <strong>Twórca:</strong> {authorName}
          </p>
          <p>
            <strong>Liczba pytań:</strong> {questions.length}
          </p>
          <p>
            <strong>Czas całkowity:</strong>{" "}
            {totalTime > 0 ? formatTotalTime(totalTime) : "Bez limitu"}
          </p>
        </div>
      </div>

      {/* Questions List */}
      <div className="space-y-6">
        <h2 className="text-2xl font-semibold text-gray-800">Pytania</h2>
        {questions.map((question, index) => (
          <div key={question.id} className="rounded-xl bg-white p-6 shadow-md">
            <h3 className="mb-2 text-xl font-medium text-gray-800">
              Pytanie {index + 1}: {question.title}
            </h3>
            {question.imageUrl && (
              <img
                src={question.imageUrl}
                alt={`Obraz dla pytania ${index + 1}`}
                className="mb-4 h-32 w-full rounded-lg object-cover"
                onError={(e) =>
                  (e.target.src =
                    "https://placehold.co/200x150.png?text=Brak%20obrazu")
                }
              />
            )}
            <ul className="space-y-2">
              <li className="text-green-600">
                <strong>Poprawna odpowiedź:</strong> {question.correctAnswer}
              </li>
              <li>
                <strong>Błędne odpowiedzi:</strong>
                <ul className="ml-4 list-disc">
                  {question.wrongAnswers.map((answer, i) => (
                    <li key={i} className="text-gray-700">
                      {answer}
                    </li>
                  ))}
                </ul>
              </li>
            </ul>
          </div>
        ))}
      </div>

      {/* Start Quiz Button */}
      <div className="mt-8 text-center">
        <button
          onClick={handleStartQuiz}
          className="inline-block rounded-full bg-blue-600 px-6 py-3 text-lg font-semibold text-white transition duration-300 hover:bg-blue-700"
        >
          Rozpocznij Quiz
        </button>
      </div>
    </div>
  );
};

export default QuizDisplay;
