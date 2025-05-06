import { FormProvider } from "react-hook-form";
import { useParams } from "react-router-dom";
import QuizHeader from "./QuizHeader";
import QuizDetails from "./QuizDetails";
import QuestionList from "./QuestionList";
import ScrollToTopButton from "./ScrollToTopButton";
import { FaSave, FaInfoCircle } from "react-icons/fa";
import useQuizForm from "../../hooks/useQuizForm";
import { quizFormConfig } from "../../config/quizFormConfig";
import QuizFromFileBtn from "./QuizFromFileBtn";

function QuizForm({ defaultValues, onSubmit, onReset }) {
  const { quizId } = useParams();
  const isEditMode = Boolean(quizId);

  const {
    methods,
    fields,
    append,
    remove,
    isValid,
    isSubmitting,
    handleImportQuestions,
    handleFormSubmit,
    handleSaveToStorage,
    handleRestoreFromStorage,
    handleReset: defaultReset,
    watch,
  } = useQuizForm(defaultValues, onSubmit);

  // Use external reset handler if provided, otherwise use the default
  const resetForm = () => {
    if (onReset) {
      onReset();
    } else {
      defaultReset();
    }
  };

  return (
    <div className="relative mx-auto max-w-3xl">
      <FormProvider {...methods}>
        <form onSubmit={handleFormSubmit} className="space-y-6">
          <QuizHeader />
          <QuizDetails questionCount={watch("questions")?.length || 0} />

          {/* Autosave notification */}
          <div
            className={`flex items-center rounded-md p-3 text-sm ${isEditMode ? "bg-yellow-50 text-yellow-700" : "bg-green-50 text-green-700"}`}
          >
            <FaInfoCircle className="mr-2" />
            {isEditMode
              ? "W trybie edycji automatyczne zapisywanie jest wyłączone. Kliknij 'Zapisz do localStorage', aby zachować zmiany."
              : "Automatyczne zapisywanie włączone. Twoje zmiany są zapisywane automatycznie."}
          </div>

          <div className="flex gap-2">
            <button
              className="bg-warning hover:bg-warning-hover cursor-pointer rounded-md p-2 text-white"
              onClick={resetForm}
              type="button"
            >
              Zresetuj formularz
            </button>
            <button
              className="bg-primary hover:bg-primary-hover cursor-pointer rounded-md p-2 text-white"
              onClick={handleSaveToStorage}
              type="button"
            >
              Zapisz do localstorage
            </button>
            <button
              className="bg-secondary hover:bg-secondary-hover cursor-pointer rounded-md p-2 text-white"
              onClick={handleRestoreFromStorage}
              type="button"
            >
              Przywróć z localstorage
            </button>
            <QuizFromFileBtn onImportQuestions={handleImportQuestions} />
          </div>

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
}

export default QuizForm;
