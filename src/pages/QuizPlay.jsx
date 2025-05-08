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

  if (loading) return <p>Ładowanie...</p>;
  if (error) return <p>Błąd: {error}</p>;
  // Ensure questions and quizData are loaded before passing to hook or rendering
  if (!quizData || !questions || questions.length === 0) {
    // The hook might run with empty questions initially, handle this gracefully
    return <p>Brak danych do wyświetlenia lub quiz jest pusty.</p>;
  }

  if (isSubmitted) {
    // const finalScore = calculateScore(); // Score is now from the hook
    return (
      <div className="mx-auto max-w-4xl p-6">
        <h1 className="mb-4 text-3xl font-bold text-gray-800">
          Wynik Quizu: {quizData.title}
        </h1>
        <p className="text-lg text-gray-700">
          Twój wynik: {score} / {questions.length}
        </p>
        <p className="text-sm text-gray-600">
          {/* Add 1 to attempts if the current one isn't in userAttempts yet */}
          Liczba podejść: {userAttempts.length > 0 ? userAttempts.length : 1}
        </p>
        <p className="text-sm text-gray-600">
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
              className={`rounded-lg p-4 shadow-md ${
                userAnswers[index] === question.correctAnswer
                  ? "bg-green-100"
                  : "bg-red-100"
              }`}
            >
              <h3 className="mb-2 text-lg font-semibold text-gray-800">
                Pytanie {index + 1}: {question.title}
              </h3>
              <p className="text-sm text-gray-700">
                <strong>Twoja odpowiedź:</strong>{" "}
                {userAnswers[index] || "Brak odpowiedzi"}
              </p>
              <p className="text-sm text-gray-700">
                <strong>Poprawna odpowiedź:</strong> {question.correctAnswer}
              </p>
            </div>
          ))}
        </div>
        <div className="mt-8 text-center">
          <button
            onClick={() => navigate(`/quiz/${quizId}`)}
            className="rounded-full bg-blue-600 px-6 py-3 text-lg font-semibold text-white transition duration-300 hover:bg-blue-700"
          >
            Powrót do opisu quizu
          </button>
          <button
            onClick={() => window.location.reload()} // Or a more sophisticated reset
            className="ml-4 rounded-full bg-gray-500 px-6 py-3 text-lg font-semibold text-white transition duration-300 hover:bg-gray-600"
          >
            Spróbuj ponownie
          </button>
        </div>
      </div>
    );
  }

  // Ensure currentQuestion is available before rendering QuestionCard
  if (!currentQuestion) {
    return <p>Ładowanie pytania...</p>;
  }

  return (
    <div className="mx-auto max-w-4xl p-6">
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
        onPrevious={handlePrevious} // Use handlePrevious from hook
        onNext={handleNextOrSubmit} // This now handles submit on last question
        onSubmit={handleNextOrSubmit} // Or specific submit if needed, but handleNextOrSubmit covers it
        isNextDisabled={
          !userAnswers[currentQuestionIndex] &&
          currentQuestionIndex < questions.length - 1
        }
        isSubmitDisabled={
          currentQuestionIndex === questions.length - 1 &&
          !userAnswers[currentQuestionIndex]
        }
        // No direct isSubmitDisabled needed if onNext handles submission
      />
    </div>
  );
};

export default QuizPlay;
