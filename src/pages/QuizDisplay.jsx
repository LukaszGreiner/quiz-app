import { useParams, useNavigate } from "react-router-dom";
import { useQuiz } from "../hooks/useQuiz";
import {
  formatTotalTime,
  getAvgCompletionTimeText,
  getAvgRatingText,
  getAvgScoreText,
  getPlaysCountText,
  timestampToCurrentDate,
} from "../utils/quizUtils";

const QuizDisplay = () => {
  const { quizId } = useParams();
  const { quizData, questions, loading, error } = useQuiz(quizId);
  const navigate = useNavigate();

  if (loading)
    return <p className="text-center text-lg text-gray-700">Ładowanie...</p>;
  if (error)
    return <p className="text-center text-lg text-red-600">Błąd: {error}</p>;
  if (!quizData || questions.length === 0)
    return (
      <p className="text-center text-lg text-gray-700">
        Brak danych do wyświetlenia
      </p>
    );

  const totalTime = quizData.timeLimitPerQuestion * questions.length;

  const handleStartQuiz = () => {
    navigate(`/quiz/play/${quizId}`);
  };

  // Calculate additional stats
  const playsCountText = getPlaysCountText(quizData);
  const avgRatingText = getAvgRatingText(quizData);
  const avgScoreText = getAvgScoreText(quizData, questions.length);
  const avgCompletionTimeText = getAvgCompletionTimeText(quizData);
  const totalRatingsText = quizData?.ratingsCount?.toString() ?? "0";

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-600 to-blue-500 px-4 py-8 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-3xl pb-24">
        {" "}
        {/* Added pb-24 for padding at the bottom */}
        {/* Quiz Header */}
        <div className="hover:shadow-3xl mb-8 rounded-xl bg-white p-6 shadow-2xl transition-shadow duration-300">
          {quizData.imageUrl && (
            <div className="mb-6 overflow-hidden rounded-lg shadow-md">
              <img
                src={quizData.imageUrl}
                alt={`Obraz quizu ${quizData.title}`}
                className="h-auto max-h-72 w-full rounded-lg object-cover transition-transform duration-300 hover:scale-105"
                onError={(e) =>
                  (e.target.src =
                    "https://placehold.co/600x400.png?text=Brak%20obrazu&font=roboto")
                }
              />
            </div>
          )}
          <h1 className="mb-3 text-4xl font-bold text-gray-800">
            {quizData.title}
          </h1>

          <p className="mb-6 text-lg text-gray-600">{quizData.description}</p>
          <button
            onClick={handleStartQuiz}
            className="transform rounded-full bg-gradient-to-r from-green-400 to-blue-500 px-8 py-4 text-xl font-bold text-white shadow-lg transition-all duration-300 ease-in-out hover:scale-105 hover:from-green-500 hover:to-blue-600 hover:shadow-xl focus:ring-4 focus:ring-green-300 focus:outline-none"
          >
            Rozpocznij Quiz
          </button>

          <hr className="my-6 border-gray-300" />

          <div className="grid grid-cols-1 gap-x-6 gap-y-4 text-base text-gray-700 md:grid-cols-2">
            <p>
              <strong className="font-semibold text-gray-900">
                Kategoria:{" "}
              </strong>{" "}
              {quizData.category || "Brak"}
            </p>
            <p>
              <strong className="font-semibold text-gray-900">
                Trudność:{" "}
              </strong>{" "}
              {quizData.difficulty || "Nieokreślona"}
            </p>
            <p>
              <strong className="font-semibold text-gray-900">
                Widoczność:{" "}
              </strong>
              {quizData.visibility === "public" ? "Publiczny" : "Prywatny"}
            </p>
            <p>
              {/* TODO: Fetch and display creator's name instead of ID */}
              <strong className="font-semibold text-gray-900">
                Twórca:
              </strong>{" "}
              {quizData.authorId}
            </p>
            <p>
              <strong className="font-semibold text-gray-900">Quiz ID:</strong>{" "}
              {quizData.quizId}
            </p>
            <p>
              <strong className="font-semibold text-gray-900">
                Liczba pytań:
              </strong>{" "}
              {questions.length}
            </p>
            <p>
              <strong className="font-semibold text-gray-900">
                Czas na ukończenie:{" "}
              </strong>
              {totalTime > 0 ? formatTotalTime(totalTime) : "Bez limitu"}
            </p>
            <p>
              <strong className="font-semibold text-gray-900">
                Data utworzenia:{" "}
              </strong>
              {timestampToCurrentDate(quizData?.createdAt)}
            </p>
          </div>

          <hr className="my-6 border-gray-300" />

          <h2 className="mb-4 text-2xl font-semibold text-gray-800">
            Statystyki
          </h2>
          <div className="grid grid-cols-1 gap-x-6 gap-y-4 text-base text-gray-700 md:grid-cols-2">
            <p>
              <strong className="font-semibold text-gray-900">
                Liczba zagrań:
              </strong>{" "}
              {playsCountText}
            </p>
            <p>
              <strong className="font-semibold text-gray-900">
                Średnia ocena:
              </strong>{" "}
              {avgRatingText} (Liczba ocen: {totalRatingsText})
            </p>
            <p>
              <strong className="font-semibold text-gray-900">
                Średni wynik:
              </strong>{" "}
              {avgScoreText}
            </p>
            <p>
              <strong className="font-semibold text-gray-900">
                Średni czas ukończenia:
              </strong>{" "}
              {avgCompletionTimeText}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default QuizDisplay;
