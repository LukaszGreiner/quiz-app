import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { useQuiz } from "../hooks/useQuiz";
import QuizHeader from "../components/QuizPlay/QuizHeader";
import QuestionCard from "../components/QuizPlay/QuestionCard";
import QuizRating from "../components/QuizPlay/QuizRating";
import { useQuizPlay } from "../hooks/useQuizPlay";
import Btn from "../components/common/Btn";
import LoadingAnimation from "../components/common/LoadingAnimation";
import StreakNotification from "../components/UserPage/StreakNotification";

const QuizPlay = () => {
  const { quizId } = useParams();
  const navigate = useNavigate();
  const { quizData, questions, loading, error } = useQuiz(quizId);
  const [showStreakNotification, setShowStreakNotification] = useState(false);

  const {
    currentQuestionIndex,
    userAnswers,
    isSubmitted,
    timeLeft,
    shuffledAnswers,
    userAttempts,
    maxScoreAchieved,
    handleAnswerSelect,
    handleNextOrSubmit,
    handlePrevious,
    progress,
    currentQuestion,
    score,
    answerFeedback,
  } = useQuizPlay(quizId, quizData, questions, navigate);

  // Show streak notification when quiz is completed
  useEffect(() => {
    if (isSubmitted && !showStreakNotification) {
      // Delay showing streak notification slightly to let quiz results load
      const timer = setTimeout(() => {
        setShowStreakNotification(true);
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [isSubmitted, showStreakNotification]);
  
  // Handle keyboard input for answer selection
  useEffect(() => {
    const handleKeyPress = (event) => {
      // Only handle keyboard input if we're in an active quiz (not submitted) and have feedback disabled
      if (isSubmitted || answerFeedback || !currentQuestion || !shuffledAnswers || shuffledAnswers.length === 0) {
        return;
      }

      // Handle number keys 1-4 for answer selection
      const keyNumber = event.key;
      const answerIndex = parseInt(keyNumber) - 1; // Convert to 0-based index

      // Check if the key is a valid answer option (1-4) and within available answers
      if (keyNumber >= '1' && keyNumber <= '4' && answerIndex < shuffledAnswers.length) {
        event.preventDefault(); // Prevent any default behavior
        const selectedAnswer = shuffledAnswers[answerIndex];
        handleAnswerSelect(selectedAnswer);
      }
    };

    // Add the event listener when quiz is active
    if (!isSubmitted && !answerFeedback && currentQuestion && shuffledAnswers && shuffledAnswers.length > 0) {
      document.addEventListener('keydown', handleKeyPress);
    }

    // Cleanup function to remove event listener
    return () => {
      document.removeEventListener('keydown', handleKeyPress);
    };
  }, [isSubmitted, answerFeedback, currentQuestion, shuffledAnswers, handleAnswerSelect]);
  
  // Remove debug logging for production
  /* 
  console.log("QuizPlay rendering with:", {
    currentQuestionIndex,
    totalQuestions: questions?.length,
    hasCurrentQuestion: Boolean(currentQuestion),
    isSubmitted,
    answerFeedback
  });
  */
  
  return (
    <div className="bg-background mx-auto min-h-[100svh] max-w-5xl px-3 sm:px-4 py-3 flex flex-col justify-start md:justify-center items-center overflow-auto pt-12 md:pt-16 pb-12">
      {loading && (
        <div className="flex items-center justify-center py-8 flex-grow w-full">
          <LoadingAnimation />
        </div>
      )}
      {error && (
        <div className="flex items-center justify-center py-16 flex-grow w-full">
          <span className="text-incorrect text-lg">Błąd: {error}</span>
        </div>
      )}
      {!loading &&
        !error &&
        (!quizData || !questions || questions.length === 0) && (
          <div className="flex items-center justify-center py-16 flex-grow w-full">
            <span className="text-text-muted text-lg">
              Brak danych do wyświetlenia lub quiz jest pusty.
            </span>
          </div>
        )}
      {!loading && !error && quizData && questions && questions.length > 0 && (
        <>
          {/* Force re-render when isSubmitted changes */}
          {isSubmitted ? (
            <div className="bg-surface-elevated mx-auto max-w-3xl rounded-2xl p-5 sm:p-6 md:p-7 shadow-lg my-2 sm:my-4 flex flex-col justify-start w-full overflow-auto">
              <h1 className="text-primary mb-6 text-2xl md:text-3xl font-bold text-center">
                Wynik Quizu: {quizData.title}
              </h1>
              <p className="text-text mb-2 text-lg">
                Twój wynik:{" "}
                <span className="text-correct font-bold">{score}</span> /{" "}
                {questions.length}
              </p>
              <p className="text-text-muted mb-1 text-sm">
                Liczba podejść:{" "}
                {userAttempts.length > 0 ? userAttempts.length : 1}
              </p>
              <p className="text-text-muted mb-4 text-sm">
                {maxScoreAchieved
                  ? "Gratulacje! Zdobyłeś maksymalny wynik w jednym z podejść."
                  : score === questions.length
                    ? "Gratulacje! Zdobyłeś maksymalny wynik!"
                    : "Nie zdobyłeś jeszcze maksymalnego wyniku. Spróbuj ponownie!"}
              </p>
              <QuizRating quizId={quizId} />
              <div className="mt-6 space-y-4">
                {questions.map((question, index) => (
                  <div
                    key={index}
                    className={`border-border rounded-xl border p-3 sm:p-4 shadow-md ${userAnswers[index] === question.correctAnswer ? "bg-correct/10 border-correct/20" : "bg-incorrect/10 border-incorrect/20"}`}
                  >
                    <h3 className="text-text mb-2 text-lg font-semibold">
                      Pytanie {index + 1}: {question.title}
                    </h3>
                    {question.imageUrl && (
                      <div className="mb-4 w-full flex justify-center">
                        <img
                          src={question.imageUrl}
                          alt={`Obraz dla pytania ${index + 1}`}
                          className="border-border rounded-lg border object-contain h-auto max-h-64"
                          loading="lazy"
                          onError={(e) =>
                            (e.target.src =
                              "https://placehold.co/200x150.png?text=Brak%20obrazu")
                          }
                        />
                      </div>
                    )}
                    <p className="text-text-muted text-sm">
                      <strong>Twoja odpowiedź:</strong>{" "}
                      {userAnswers[index] || "Brak odpowiedzi"}
                    </p>
                    <p className="text-text-muted text-sm">
                      <strong>Poprawna odpowiedź:</strong>{" "}
                      {question.correctAnswer}
                    </p>
                  </div>
                ))}
              </div>{" "}
              <div className="mt-8 flex flex-col justify-center gap-4 sm:flex-row">
                <Btn
                  onClick={() => navigate(`/quiz/${quizId}`)}
                  variant="primary"
                  size="lg"
                  className="w-full sm:w-auto"
                >
                  Powrót do opisu quizu
                </Btn>{" "}
                <Btn
                  onClick={() => window.location.reload()}
                  variant="secondary"
                  size="lg"
                  className="w-full sm:w-auto"
                >
                  Spróbuj ponownie
                </Btn>
              </div>
            </div>
          ) : (
            <div className="flex flex-col w-full items-center justify-start md:justify-center mt-1 md:mt-0">
              {currentQuestion ? (
                <>
                  <QuestionCard
                    key={`question-${currentQuestionIndex}`}
                    title={quizData.title}
                    currentQuestionIndex={currentQuestionIndex}
                    totalQuestions={questions.length}
                    progress={progress}
                    question={currentQuestion}
                    shuffledAnswers={shuffledAnswers}
                    userAnswer={userAnswers[currentQuestionIndex]}
                    onAnswerSelect={handleAnswerSelect}
                    timeLeft={timeLeft}
                    timeLimitPerQuestion={quizData.timeLimitPerQuestion}
                    showFeedback={answerFeedback}
                  />
                </>
              ) : (
                <div className="flex items-center justify-center py-16 flex-grow w-full">
                  <span className="text-text-muted text-lg">
                    Brak pytania do wyświetlenia.
                  </span>
                </div>
              )}
            </div>
          )}
        </>
      )}
      
      {/* Streak Notification */}
      {showStreakNotification && (
        <StreakNotification 
          onClose={() => setShowStreakNotification(false)}
          autoClose={8000}
        />
      )}
    </div>
  );
};

export default QuizPlay;
