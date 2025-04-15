import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState, useRef } from "react";
import { useQuiz } from "../hooks/useQuiz";
import { auth, db } from "../firebase";
import { setDoc, doc } from "firebase/firestore";
import QuizHeader from "../components/QuizPlay/QuizHeader";
import QuestionCard from "../components/QuizPlay/QuestionCard";
import NavigationButtons from "../components/QuizPlay/NavigationButtons";
import {
  showLoading,
  updateLoadingToSuccess,
  updateLoadingToError,
} from "../utils/toastUtils";
import { fetchUserQuizAttempts } from "../services/quizService";
import QuizRating from "../components/QuizPlay/QuizRating";

const QuizPlay = () => {
  const { quizId } = useParams();
  const { quizData, questions, loading, error } = useQuiz(quizId);
  const navigate = useNavigate();

  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [userAnswers, setUserAnswers] = useState({});
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [timeLeft, setTimeLeft] = useState(null);
  const [shuffledAnswers, setShuffledAnswers] = useState([]);
  const [userAttempts, setUserAttempts] = useState([]);
  const [maxScoreAchieved, setMaxScoreAchieved] = useState(false);
  const timerRef = useRef(null);

  useEffect(() => {
    const fetchAttempts = async () => {
      const userId = auth.currentUser?.uid;
      if (!userId) return;

      try {
        const attempts = await fetchUserQuizAttempts(userId, quizId);
        setUserAttempts(attempts);

        // Check if the user has achieved the maximum score
        const maxScore = questions.length;
        const hasMaxScore = attempts.some(
          (attempt) => attempt.score === maxScore,
        );
        setMaxScoreAchieved(hasMaxScore);
      } catch (error) {
        console.error("Error fetching user attempts:", error);
      }
    };

    if (auth.currentUser && quizId) {
      fetchAttempts();
    }
  }, [quizId, questions.length]);

  useEffect(() => {
    if (questions.length > 0) {
      const currentQuestion = questions[currentQuestionIndex];
      const answers = [
        currentQuestion.correctAnswer,
        ...currentQuestion.wrongAnswers,
      ];
      setShuffledAnswers(answers.sort(() => Math.random() - 0.5));
    }
  }, [questions, currentQuestionIndex]);

  useEffect(() => {
    if (questions.length > 0 && timeLeft > 0 && !isSubmitted) {
      timerRef.current = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            clearInterval(timerRef.current);
            handleNextOrSubmit();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(timerRef.current);
  }, [questions, timeLeft, currentQuestionIndex, isSubmitted]);

  if (loading) return <p>Ładowanie...</p>;
  if (error) return <p>Błąd: {error}</p>;
  if (!quizData || questions.length === 0)
    return <p>Brak danych do wyświetlenia</p>;

  const currentQuestion = questions[currentQuestionIndex];

  const handleAnswerSelect = (answer) => {
    setUserAnswers((prev) => ({
      ...prev,
      [currentQuestionIndex]: answer,
    }));
  };

  const handleNextOrSubmit = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex((prev) => prev + 1);
      setTimeLeft(quizData.timeLimitPerQuestion || 0);
    } else {
      handleSubmit();
    }
  };

  const handleSubmit = async () => {
    clearInterval(timerRef.current);
    setIsSubmitted(true);

    const userId = auth.currentUser?.uid;
    if (userId) {
      const score = calculateScore();
      const toastId = showLoading("Zapisywanie wyniku...");
      try {
        await setDoc(
          doc(db, "quizResults", `${userId}_${quizId}_${Date.now()}`),
          {
            userId,
            quizId,
            quizTitle: quizData.title,
            score,
            totalQuestions: questions.length,
            completedAt: new Date().toISOString(),
          },
        );
        updateLoadingToSuccess(toastId, "Wynik zapisany!");
      } catch (err) {
        updateLoadingToError(toastId, `Błąd zapisu wyniku: ${err.message}`);
      }
    } else {
      updateLoadingToError(null, "Zaloguj się, aby zapisać wynik!");
    }
  };

  const calculateScore = () => {
    return questions.reduce(
      (score, question, index) =>
        userAnswers[index] === question.correctAnswer ? score + 1 : score,
      0,
    );
  };

  const progress = ((currentQuestionIndex + 1) / questions.length) * 100;

  if (isSubmitted) {
    const score = calculateScore();
    return (
      <div className="mx-auto max-w-4xl p-6">
        <h1 className="mb-4 text-3xl font-bold text-gray-800">
          Wynik Quizu: {quizData.title}
        </h1>
        <p className="text-lg text-gray-700">
          Twój wynik: {score} / {questions.length}
        </p>
        <p className="text-sm text-gray-600">
          Liczba podejść: {userAttempts.length + 1}
        </p>
        <p className="text-sm text-gray-600">
          {maxScoreAchieved
            ? "Gratulacje! Zdobyłeś maksymalny wynik w jednym z podejść."
            : "Nie zdobyłeś jeszcze maksymalnego wyniku. Spróbuj ponownie!"}
        </p>
        <QuizRating />
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
        </div>
      </div>
    );
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
      />
      <NavigationButtons
        currentQuestionIndex={currentQuestionIndex}
        totalQuestions={questions.length}
        onPrevious={() => setCurrentQuestionIndex((prev) => prev - 1)}
        onNext={() => setCurrentQuestionIndex((prev) => prev + 1)}
        onSubmit={handleSubmit}
        isNextDisabled={!userAnswers[currentQuestionIndex]}
        isSubmitDisabled={!userAnswers[currentQuestionIndex]}
      />
    </div>
  );
};

export default QuizPlay;
