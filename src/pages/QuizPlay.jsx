import { useParams, useNavigate } from "react-router-dom";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { db, auth } from "../firebase";
import { useEffect, useState, useRef } from "react";
import { toast } from "react-toastify";

const QuizPlay = () => {
  const { quizId } = useParams();
  const navigate = useNavigate();
  const [quizData, setQuizData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [userAnswers, setUserAnswers] = useState({});
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [timeLeft, setTimeLeft] = useState(null); // Timer in seconds
  const [shuffledAnswers, setShuffledAnswers] = useState([]); // Store shuffled answers
  const timerRef = useRef(null);

  useEffect(() => {
    const fetchQuiz = async () => {
      try {
        const docRef = doc(db, "quizzes", quizId);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          setQuizData(docSnap.data());
          setTimeLeft(docSnap.data().timeLimitPerQuestion || 0); // Initialize timer
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

  // Shuffle answers when the question changes
  useEffect(() => {
    if (quizData) {
      const currentQuestion = quizData.questions[currentQuestionIndex];
      const answers = [
        currentQuestion.correctAnswer,
        ...currentQuestion.wrongAnswers,
      ];
      setShuffledAnswers(answers.sort(() => Math.random() - 0.5)); // Shuffle once per question
    }
  }, [quizData, currentQuestionIndex]);

  // Timer logic
  useEffect(() => {
    if (quizData && timeLeft > 0 && !isSubmitted) {
      timerRef.current = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            clearInterval(timerRef.current);
            handleNextOrSubmit(); // Auto-move to next or submit
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(timerRef.current); // Cleanup on unmount or question change
  }, [quizData, timeLeft, currentQuestionIndex, isSubmitted]);

  if (loading) return <div className="text-center text-lg">Loading...</div>;
  if (error) return <div className="text-center text-red-600">{error}</div>;
  if (!quizData) return null;

  const currentQuestion = quizData.questions[currentQuestionIndex];

  const handleAnswerSelect = (answer) => {
    setUserAnswers((prev) => ({
      ...prev,
      [currentQuestionIndex]: answer,
    }));
  };

  const handleNextOrSubmit = () => {
    if (currentQuestionIndex < quizData.questions.length - 1) {
      setCurrentQuestionIndex((prev) => prev + 1);
      setTimeLeft(quizData.timeLimitPerQuestion || 0); // Reset timer
    } else {
      handleSubmit();
    }
  };

  const handleNext = () => {
    if (currentQuestionIndex < quizData.questions.length - 1) {
      setCurrentQuestionIndex((prev) => prev + 1);
      setTimeLeft(quizData.timeLimitPerQuestion || 0); // Reset timer
    }
  };

  const handlePrevious = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex((prev) => prev - 1);
      setTimeLeft(quizData.timeLimitPerQuestion || 0); // Reset timer
    }
  };

  const handleSubmit = async () => {
    clearInterval(timerRef.current);
    setIsSubmitted(true);

    // Save result to Firestore
    const userId = auth.currentUser?.uid;
    if (userId) {
      const score = calculateScore();
      try {
        await setDoc(
          doc(db, "quizResults", `${userId}_${quizId}_${Date.now()}`),
          {
            userId,
            quizId,
            quizName: quizData.name,
            score,
            totalQuestions: quizData.questions.length,
            completedAt: new Date().toISOString(),
          },
        );
        toast.success("Wynik zapisany!");
      } catch (err) {
        toast.error("Błąd zapisu wyniku: " + err.message);
      }
    } else {
      toast.warn("Zaloguj się, aby zapisać wynik!");
    }
  };

  const calculateScore = () => {
    let score = 0;
    quizData.questions.forEach((question, index) => {
      if (userAnswers[index] === question.correctAnswer) {
        score += 1;
      }
    });
    return score;
  };

  const progress =
    ((currentQuestionIndex + 1) / quizData.questions.length) * 100;

  if (isSubmitted) {
    const score = calculateScore();
    return (
      <div className="mx-auto max-w-4xl p-6">
        <h1 className="mb-4 text-3xl font-bold text-gray-800">
          Wynik Quizu: {quizData.name}
        </h1>
        <p className="text-lg text-gray-700">
          Twój wynik: {score} / {quizData.questions.length}
        </p>
        <div className="mt-4 flex justify-center gap-4">
          <button
            onClick={() => window.location.reload()}
            className="rounded-full bg-blue-600 px-6 py-3 text-lg font-semibold text-white transition duration-300 hover:bg-blue-700"
          >
            Spróbuj ponownie
          </button>
          <button
            onClick={() => navigate(`/quiz/${quizId}`)}
            className="rounded-full bg-gray-600 px-6 py-3 text-lg font-semibold text-white transition duration-300 hover:bg-gray-700"
          >
            Powrót do opisu
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-4xl p-6">
      <h1 className="mb-4 text-3xl font-bold text-gray-800">{quizData.name}</h1>

      {/* Progress Bar */}
      <div className="mb-6">
        <div className="h-2.5 w-full rounded-full bg-gray-200">
          <div
            className="h-2.5 rounded-full bg-blue-600 transition-all duration-300"
            style={{ width: `${progress}%` }}
          ></div>
        </div>
        <p className="mt-1 text-sm text-gray-600">
          Pytanie {currentQuestionIndex + 1} z {quizData.questions.length}
        </p>
      </div>

      <div className="rounded-xl bg-white p-6 shadow-md">
        <h2 className="mb-4 text-xl font-semibold text-gray-800">
          Pytanie {currentQuestionIndex + 1}: {currentQuestion.text}
        </h2>
        {currentQuestion.image && (
          <img
            src={currentQuestion.image}
            alt={`Obraz dla pytania ${currentQuestionIndex + 1}`}
            className="mb-4 h-32 w-full rounded-lg object-cover"
            onError={(e) =>
              (e.target.src =
                "https://placehold.co/200x150.png?text=Brak%20obrazu")
            }
          />
        )}

        {/* Timer */}
        {quizData.timeLimitPerQuestion > 0 && (
          <div className="mb-4 text-center">
            <p className="text-lg font-medium text-gray-700">
              Pozostały czas: {timeLeft} s
            </p>
          </div>
        )}

        <div className="space-y-3">
          {shuffledAnswers.map((answer, index) => (
            <button
              key={index}
              onClick={() => handleAnswerSelect(answer)}
              className={`w-full rounded-md px-4 py-3 text-left text-gray-800 transition-colors duration-200 ${
                userAnswers[currentQuestionIndex] === answer
                  ? "bg-blue-500 text-white"
                  : "bg-gray-100 hover:bg-gray-200"
              }`}
            >
              {answer}
            </button>
          ))}
        </div>

        <div className="mt-6 flex justify-between">
          <button
            onClick={handlePrevious}
            disabled={currentQuestionIndex === 0}
            className="rounded-md bg-gray-600 px-4 py-2 text-white transition duration-300 hover:bg-gray-700 disabled:bg-gray-400"
          >
            Poprzednie
          </button>
          {currentQuestionIndex < quizData.questions.length - 1 ? (
            <button
              onClick={handleNext}
              disabled={!userAnswers[currentQuestionIndex]}
              className="rounded-md bg-blue-600 px-4 py-2 text-white transition duration-300 hover:bg-blue-700 disabled:bg-gray-400"
            >
              Następne
            </button>
          ) : (
            <button
              onClick={handleSubmit}
              disabled={!userAnswers[currentQuestionIndex]}
              className="rounded-md bg-green-600 px-4 py-2 text-white transition duration-300 hover:bg-green-700 disabled:bg-gray-400"
            >
              Zakończ
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default QuizPlay;
