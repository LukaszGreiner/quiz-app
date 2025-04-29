import { useParams, useNavigate } from "react-router-dom";
import { useQuiz } from "../hooks/useQuiz";
import { formatTotalTime } from "../utils/quizUtils";

const QuizDisplay = () => {
  const { quizId } = useParams();
  const { quizData, questions, loading, error } = useQuiz(quizId);
  const navigate = useNavigate();

  if (loading) return <p>Ładowanie...</p>;
  if (error) return <p>Błąd: {error}</p>;
  if (!quizData || questions.length === 0)
    return <p>Brak danych do wyświetlenia</p>;

  const totalTime = quizData.timeLimitPerQuestion * questions.length;

  const handleStartQuiz = () => {
    navigate(`/quiz/play/${quizId}`);
  };

  return (
    <div className="mx-auto max-w-4xl p-6">
      {/* Quiz Header */}
      <div className="mb-8 rounded-xl bg-white p-6 shadow-md">
        {quizData.imageUrl && (
          <img
            src={quizData.imageUrl}
            alt={`Obraz quizu ${quizData.title}`}
            className="mb-4 h-auto max-h-64 w-full rounded-lg object-contain"
            onError={(e) =>
              (e.target.src =
                "https://placehold.co/200x150.png?text=Brak%20obrazu")
            }
          />
        )}
        <h1 className="mb-2 text-3xl font-bold text-gray-800">
          {quizData.title}
        </h1>
        {quizData.description && (
          <p className="mb-4 text-gray-600">{quizData.description}</p>
        )}
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
            <strong>Twórca:</strong> {quizData.authorId}
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
