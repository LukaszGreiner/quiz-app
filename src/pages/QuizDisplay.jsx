import { useParams, useNavigate } from "react-router-dom"; // Add useNavigate
import { doc, getDoc } from "firebase/firestore";
import { db } from "../firebase";
import { useEffect, useState } from "react";
import { formatTotalTime } from "../utils/quizUtils";

const QuizDisplay = () => {
  const { quizId } = useParams();
  const [quizData, setQuizData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate(); // Add navigate hook

  useEffect(() => {
    const fetchQuiz = async () => {
      try {
        const docRef = doc(db, "quizzes", quizId);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          setQuizData(docSnap.data());
        } else {
          setError("Quiz not found");
        }
      } catch (err) {
        setError("Failed to load quiz: " + err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchQuiz();
  }, [quizId]);

  if (loading) return <div className="text-center text-lg">Loading...</div>;
  if (error) return <div className="text-center text-red-600">{error}</div>;
  if (!quizData) return null;

  const totalTime = quizData.timeLimitPerQuestion * quizData.questions.length;

  const handleStartQuiz = () => {
    navigate(`/quiz/play/${quizId}`); // Redirect to /quiz/play/:quizId
  };

  return (
    <div className="mx-auto max-w-4xl p-6">
      {/* Quiz Header */}
      <div className="mb-8 rounded-xl bg-white p-6 shadow-md">
        {quizData.image && (
          <img
            src={quizData.image}
            alt={`Obraz quizu ${quizData.name}`}
            className="mb-4 h-48 w-full rounded-lg object-cover"
            onError={(e) =>
              (e.target.src =
                "https://placehold.co/300x200.png?text=Brak%20obrazu")
            }
          />
        )}
        <h1 className="mb-2 text-3xl font-bold text-gray-800">
          {quizData.name}
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
            <strong>Twórca:</strong> {quizData.createdBy}
          </p>
          <p>
            <strong>Liczba pytań:</strong> {quizData.questions.length}
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
        {quizData.questions.map((question, index) => (
          <div key={index} className="rounded-xl bg-white p-6 shadow-md">
            <h3 className="mb-2 text-xl font-medium text-gray-800">
              Pytanie {index + 1}: {question.text}
            </h3>
            {question.image && (
              <img
                src={question.image}
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
