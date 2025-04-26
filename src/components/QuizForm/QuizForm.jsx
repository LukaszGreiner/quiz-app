import { useForm, useFieldArray, FormProvider } from "react-hook-form";
import { useNavigate, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { useAuth } from "../../context/AuthContext";
import {
  showLoading,
  updateLoadingToSuccess,
  updateLoadingToError,
} from "../../utils/toastUtils";
import { fetchQuizData } from "../../utils/quizUtils";
import QuizHeader from "./QuizHeader";
import QuizDetails from "./QuizDetails";
import QuestionList from "./QuestionList";
import ScrollToTopButton from "./ScrollToTopButton";
import { FaSave } from "react-icons/fa";
import { quizFormConfig } from "../../config/quizFormConfig";
import { createQuiz } from "../../services/quizService";

const QuizForm = ({ defaultValues, onSubmit }) => {
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false); // Define useState at the top level
  const methods = useForm({
    defaultValues: defaultValues || {
      title: "Quiz bez nazwy",
      category: "Nauka",
      description: "",
      timeLimitPerQuestion: 0,
      difficulty: quizFormConfig.DEFAULT_DIFFICULTY,
      visibility: "public",
      image: null,
      questions: [
        {
          title: "placeholder",
          correctAnswer: "placeholder1",
          wrongAnswers: ["placeholder2", "placeholder3", "placeholder4"],
          image: null,
        },
      ],
    },
  });
  const { control, handleSubmit, formState, reset, watch } = methods;
  const { isValid } = formState;
  const { fields, append, remove } = useFieldArray({
    control,
    name: "questions",
  });

  useEffect(() => {
    const loadQuizData = async () => {
      if (defaultValues) {
        reset(defaultValues);
      } else {
        const { quizId } = useParams();
        if (quizId) {
          try {
            const { quiz, questions } = await fetchQuizData(quizId);
            reset({
              ...quiz,
              questions: questions.map((q) => ({
                title: q.title,
                correctAnswer: q.correctAnswer,
                wrongAnswers: q.wrongAnswers,
                imageUrl: null,
              })),
            });
          } catch (error) {
            console.error("Error loading quiz data:", error);
          }
        }
      }
    };

    loadQuizData();
  }, [defaultValues, reset]);

  const handleFormSubmit = async (data) => {
    if (isSubmitting) return; // Prevent re-submission

    try {
      setIsSubmitting(true); // Set submitting state
      if (onSubmit) {
        await onSubmit(data);
      } else {
        await createQuiz(
          data,
          currentUser,
          navigate,
          showLoading,
          updateLoadingToSuccess,
          updateLoadingToError,
          methods.reset,
        );
      }
    } catch (error) {
      console.error("Error submitting quiz:", error);
    } finally {
      setIsSubmitting(false); // Reset submitting state
    }
  };

  return (
    <div className="relative mx-auto max-w-3xl">
      <FormProvider {...methods}>
        <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-6">
          <QuizHeader />
          <QuizDetails questionCount={watch("questions")?.length || 0} />
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-gray-700">
              Pytania: {watch("questions")?.length || 0}/
              {quizFormConfig.QUIZ_QUESTIONS_LIMIT}
            </span>
          </div>
          <QuestionList fields={fields} append={append} remove={remove} />

          <div className="relative">
            <button
              type="submit"
              title={
                isValid
                  ? "Zapisz i opublikuj"
                  : "Wypełnij wszystkie wymagane pola, aby zapisać quiz"
              }
              className="flex w-full items-center justify-center rounded-md bg-green-600 px-4 py-2 text-white hover:bg-green-700 disabled:cursor-not-allowed disabled:bg-gray-400"
              disabled={!isValid || isSubmitting}
            >
              <FaSave className="mr-2" />
              {isSubmitting ? "Zapisywanie..." : "Zapisz i opublikuj"}
            </button>
          </div>
        </form>
      </FormProvider>
      <ScrollToTopButton />
    </div>
  );
};

export default QuizForm;
