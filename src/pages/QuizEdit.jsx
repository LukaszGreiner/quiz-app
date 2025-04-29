import { useParams } from "react-router";
import QuizForm from "../components/QuizForm/QuizForm";
import { fetchQuizById } from "../services/quizService";
import { useEffect } from "react";
import { useState } from "react";

export default function QuizEdit() {
  const { quizId } = useParams();
  const [quizData, setQuizData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadQuizData = async () => {
      try {
        setIsLoading(true);
        const data = await fetchQuizById(quizId);
        setQuizData(data);
        console.log("Quiz data:", typeof data);
        setIsLoading(false);
        console.log("Quiz data loaded:", data);
      } catch (error) {
        console.error("Error loading quiz data:", error);
        setIsLoading(false);
      }
    };
    loadQuizData();
  }, [quizId]);

  console.log(quizData);

  // Przekazujemy dane do formularza
  const formValues = {
    title: quizData?.title,
    category: quizData?.category,
    description: quizData?.description,
    timeLimitPerQuestion: quizData?.timeLimitPerQuestion,
    difficulty: quizData?.difficulty,
    visibility: quizData?.visibility,
    image: quizData?.imageUrl,
    questions: quizData?.questions.map((question) => ({
      title: question?.title,
      correctAnswer: question?.correctAnswer,
      wrongAnswers: question?.wrongAnswers || ["", "", ""],
      image: question?.imageUrl || null,
    })),
  };

  if (isLoading) return <div>Loading...</div>;

  return <QuizForm defaultValues={formValues} />;
}
