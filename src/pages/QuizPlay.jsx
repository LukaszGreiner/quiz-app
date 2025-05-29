import { useParams, useNavigate } from "react-router-dom";
// Remove useEffect, useState, useRef if no longer directly used here
import { useQuiz } from "../hooks/useQuiz";
// Remove auth, db, setDoc, updateDoc, increment from here
import QuizHeader from "../components/QuizPlay/QuizHeader";
import QuestionCard from "../components/QuizPlay/QuestionCard";
import NavigationButtons from "../components/QuizPlay/NavigationButtons";
// Remove showLoading, updateLoadingToSuccess, updateLoadingToError from here if handled by service/hook
// Remove fetchUserQuizAttempts from here
import QuizRating from "../components/QuizPlay/QuizRating";
import { useQuizPlay } from "../hooks/useQuizPlay"; // Import the new hook
import Btn from "../components/common/Btn";

const QuizPlay = () => {
  const { quizId } = useParams();
  const navigate = useNavigate();
  const { quizData, questions, loading, error } = useQuiz(quizId);

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
    handlePrevious, // Added from hook
    progress,
    currentQuestion,
    score, // Get score from hook
  } = useQuizPlay(quizId, quizData, questions, navigate);

  return (
    <div className="bg-background mx-auto min-h-screen max-w-4xl p-4 sm:p-6">
      {loading && (
        <div className="flex items-center justify-center py-16">
          <span className="text-primary animate-pulse text-lg">
            Ładowanie...
          </span>
        </div>
      )}
      {error && (
        <div className="flex items-center justify-center py-16">
          <span className="text-incorrect text-lg">Błąd: {error}</span>
        </div>
      )}
      {!loading &&
        !error &&
        (!quizData || !questions || questions.length === 0) && (
          <div className="flex items-center justify-center py-16">
            <span className="text-text-muted text-lg">
              Brak danych do wyświetlenia lub quiz jest pusty.
            </span>
          </div>
        )}
      {!loading && !error && quizData && questions && questions.length > 0 && (
        <>
          {isSubmitted ? (
            <div className="bg-surface-elevated mx-auto max-w-2xl rounded-2xl p-6 shadow-lg">
              <h1 className="text-primary mb-4 text-3xl font-bold">
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
                    className={`border-border rounded-xl border p-4 shadow-md ${userAnswers[index] === question.correctAnswer ? "bg-correct/10 border-correct/20" : "bg-incorrect/10 border-incorrect/20"}`}
                  >
                    <h3 className="text-text mb-2 text-lg font-semibold">
                      Pytanie {index + 1}: {question.title}
                    </h3>
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
              </div>              <div className="mt-8 flex flex-col justify-center gap-4 sm:flex-row">
                <Btn
                  onClick={() => navigate(`/quiz/${quizId}`)}
                  variant="primary"
                  size="lg"
                  className="w-full sm:w-auto"
                >
                  Powrót do opisu quizu
                </Btn>                <Btn
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
            <>
              <QuizHeader
                title={quizData.title}
                currentQuestionIndex={currentQuestionIndex}
                totalQuestions={questions.length}
                progress={progress}
              />
              <QuestionCard
                question={currentQuestion}
                shuffledAnswers={shuffledAnswers}
                userAnswer={userAnswers[currentQuestionIndex]}
                onAnswerSelect={handleAnswerSelect}
                timeLeft={timeLeft}
                timeLimitPerQuestion={quizData.timeLimitPerQuestion}
              />
              <NavigationButtons
                currentQuestionIndex={currentQuestionIndex}
                totalQuestions={questions.length}
                onPrevious={handlePrevious}
                onNext={handleNextOrSubmit}
                onSubmit={handleNextOrSubmit}
                isNextDisabled={
                  !userAnswers[currentQuestionIndex] &&
                  currentQuestionIndex < questions.length - 1
                }
                isSubmitDisabled={
                  currentQuestionIndex === questions.length - 1 &&
                  !userAnswers[currentQuestionIndex]
                }
              />
            </>
          )}
        </>
      )}
    </div>
  );
};

export default QuizPlay;
