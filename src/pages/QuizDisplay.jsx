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
import Btn from "../components/common/Btn";

const QuizDisplay = () => {
  const { quizId } = useParams();
  const { quizData, questions, loading, error } = useQuiz(quizId);
  const navigate = useNavigate();

  if (loading)
    return <p className="text-text-muted text-center text-lg">Ładowanie...</p>;
  if (error)
    return <p className="text-danger text-center text-lg">Błąd: {error}</p>;
  if (!quizData || questions.length === 0)
    return (
      <p className="text-text-muted text-center text-lg">
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
    <main className="bg-background min-h-screen px-4 py-8 sm:px-6 lg:px-8">
      <section className="mx-auto max-w-3xl pb-24">
        {/* Quiz Header */}
        <article className="bg-surface-elevated mb-8 rounded-xl p-6 shadow-lg transition-shadow duration-300 hover:shadow-2xl">
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
          <h1 className="text-text mb-3 text-4xl font-bold">
            {quizData.title}
          </h1>
          <p className="text-text-muted mb-6 text-lg">{quizData.description}</p>
          <Btn
            aria-label="Rozpocznij Quiz"
            onClick={handleStartQuiz}
            className="bg-primary text-text-inverse hover:bg-accent focus:ring-accent min-h-[44px] w-full rounded-full px-8 py-4 text-xl font-bold shadow-md transition-all duration-200 focus:ring-4 focus:outline-none sm:w-auto"
          >
            Rozpocznij Quiz
          </Btn>

          <hr className="border-border my-6" />

          <div className="text-text grid grid-cols-1 gap-x-6 gap-y-4 text-base md:grid-cols-2">
            <p>
              <strong className="text-text font-semibold">Kategoria: </strong>
              {quizData.category || "Brak"}
            </p>
            <p>
              <strong className="text-text font-semibold">Trudność: </strong>
              {quizData.difficulty || "Nieokreślona"}
            </p>
            <p>
              <strong className="text-text font-semibold">Widoczność: </strong>
              {quizData.visibility === "public" ? "Publiczny" : "Prywatny"}
            </p>
            <p>
              <strong className="text-text font-semibold">Twórca:</strong>{" "}
              {quizData.authorId}
            </p>
            <p>
              <strong className="text-text font-semibold">Quiz ID:</strong>{" "}
              {quizData.quizId}
            </p>
            <p>
              <strong className="text-text font-semibold">Liczba pytań:</strong>{" "}
              {questions.length}
            </p>
            <p>
              <strong className="text-text font-semibold">
                Czas na ukończenie:{" "}
              </strong>
              {totalTime > 0 ? formatTotalTime(totalTime) : "Bez limitu"}
            </p>
            <p>
              <strong className="text-text font-semibold">
                Data utworzenia:{" "}
              </strong>
              {timestampToCurrentDate(quizData?.createdAt)}
            </p>
          </div>

          <hr className="border-border my-6" />

          <h2 className="text-text mb-4 text-2xl font-semibold">Statystyki</h2>
          <div className="text-text grid grid-cols-1 gap-x-6 gap-y-4 text-base md:grid-cols-2">
            <p>
              <strong className="text-text font-semibold">
                Liczba zagrań:
              </strong>{" "}
              {playsCountText}
            </p>
            <p>
              <strong className="text-text font-semibold">
                Średnia ocena:
              </strong>{" "}
              {avgRatingText}{" "}
              <span className="text-text-muted">
                (Liczba ocen: {totalRatingsText})
              </span>
            </p>
            <p>
              <strong className="text-text font-semibold">Średni wynik:</strong>{" "}
              {avgScoreText}
            </p>
            <p>
              <strong className="text-text font-semibold">
                Średni czas ukończenia:
              </strong>{" "}
              {avgCompletionTimeText}
            </p>
          </div>
        </article>
      </section>
    </main>
  );
};

export default QuizDisplay;
