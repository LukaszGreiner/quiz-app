import { useForm, useFieldArray, FormProvider } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import {
  showLoading,
  updateLoadingToSuccess,
  updateLoadingToError,
} from "../../utils/toastUtils";
import QuizHeader from "./QuizHeader";
import QuizDetails from "./QuizDetails";
import QuestionList from "./QuestionList";
import ScrollToTopButton from "./ScrollToTopButton";
import { FaSave } from "react-icons/fa";
import { quizFormConfig } from "../../config/quizFormConfig";
import { createQuiz } from "../../services/quizService";

const QuizForm = () => {
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  const methods = useForm({
    defaultValues: {
      title: "Quiz bez nazwy",
      category: "",
      description: "",
      timeLimitPerQuestion: quizFormConfig.timeLimitPerQuestion,
      difficulty: quizFormConfig.defaultValues,
      visibility: "public",
      image: null,
      questions: [
        {
          title: "",
          correctAnswer: "",
          wrongAnswers: ["", "", ""],
          image: null,
        },
      ],
    },
  });
  const { control, handleSubmit, formState } = methods;
  const { isValid } = formState;
  const { fields, append, remove } = useFieldArray({
    control,
    name: "questions",
  });

  const onSubmit = async (data) => {
    await createQuiz(
      data,
      currentUser,
      navigate,
      showLoading,
      updateLoadingToSuccess,
      updateLoadingToError,
      methods.reset,
    );
  };

  return (
    <div className="relative mx-auto max-w-3xl">
      <FormProvider {...methods}>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <QuizHeader />
          <QuizDetails questionCount={fields.length} />
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-gray-700">
              Pytania: {fields.length}/{quizFormConfig.QUIZ_QUESTIONS_LIMIT}
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
              disabled={!isValid}
            >
              <FaSave className="mr-2" />
              Zapisz i opublikuj
            </button>
          </div>
        </form>
      </FormProvider>
      <ScrollToTopButton />
    </div>
  );
};

export default QuizForm;
