import { useParams, useNavigate } from "react-router-dom";
import { doc, getDoc, setDoc, collection, getDocs } from "firebase/firestore";
import { db, auth } from "../firebase";
import { useEffect, useState, useRef } from "react";
import {
  showLoading,
  updateLoadingToSuccess,
  updateLoadingToError,
} from "../utils/toastUtils"; // Adjust path as needed

const QuizPlay = () => {
  const { quizId } = useParams();
  const navigate = useNavigate();
  const [quizData, setQuizData] = useState(null);
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [userAnswers, setUserAnswers] = useState({});
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [timeLeft, setTimeLeft] = useState(null); // Timer in seconds
  const [shuffledAnswers, setShuffledAnswers] = useState([]); // Store shuffled answers
  const timerRef = useRef(null);

  useEffect(() => {
    const fetchQuiz = async () => {
      const toastId = showLoading("Ładowanie quizu...");
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
        setTimeLeft(quiz.timeLimitPerQuestion || 0); // Initialize timer
        updateLoadingToSuccess(toastId, "Quiz załadowany!");
      } catch (err) {
        updateLoadingToError(toastId, `Błąd: ${err.message}`);
      } finally {
        setLoading(false);
      }
    };

    fetchQuiz();
  }, [quizId]);

  // Shuffle answers when the question changes
  useEffect(() => {
    if (questions.length > 0) {
      const currentQuestion = questions[currentQuestionIndex];
      const answers = [
        currentQuestion.correctAnswer,
        ...currentQuestion.wrongAnswers,
      ];
      setShuffledAnswers(answers.sort(() => Math.random() - 0.5)); // Shuffle once per question
    }
  }, [questions, currentQuestionIndex]);

  // Timer logic
  useEffect(() => {
    if (questions.length > 0 && timeLeft > 0 && !isSubmitted) {
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
  }, [questions, timeLeft, currentQuestionIndex, isSubmitted]);

  if (loading || !quizData || questions.length === 0) return null;

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
      setTimeLeft(quizData.timeLimitPerQuestion || 0); // Reset timer
    } else {
      handleSubmit();
    }
  };

  const handleNext = () => {
    if (currentQuestionIndex < questions.length - 1) {
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
      const toastId = showLoading("Zapisywanie wyniku...");
      try {
        await setDoc(
          doc(db, "quizResults", `${userId}_${quizId}_${Date.now()}`),
          {
            userId,
            quizId,
            quizTitle: quizData.title, // Updated to title
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
    let score = 0;
    questions.forEach((question, index) => {
      if (userAnswers[index] === question.correctAnswer) {
        score += 1;
      }
    });
    return score;
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
      <h1 className="mb-4 text-3xl font-bold text-gray-800">
        {quizData.title}
      </h1>

      {/* Progress Bar */}
      <div className="mb-6">
        <div className="h-2.5 w-full rounded-full bg-gray-200">
          <div
            className="h-2.5 rounded-full bg-blue-600 transition-all duration-300"
            style={{ width: `${progress}%` }}
          ></div>
        </div>
        <p className="mt-1 text-sm text-gray-600">
          Pytanie {currentQuestionIndex + 1} z {questions.length}
        </p>
      </div>

      <div className="rounded-xl bg-white p-6 shadow-md">
        <h2 className="mb-4 text-xl font-semibold text-gray-800">
          Pytanie {currentQuestionIndex + 1}: {currentQuestion.title}
        </h2>
        {currentQuestion.imageUrl && (
          <img
            src={currentQuestion.imageUrl}
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
          {currentQuestionIndex < questions.length - 1 ? (
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
