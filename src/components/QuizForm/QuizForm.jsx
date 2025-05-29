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
          <QuizDetails questionCount={watch("questions")?.length || 0} />{" "}
          {/* Autosave notification */}
          <div
            className={`flex items-center rounded-md p-3 text-sm ${isEditMode ? "bg-warning/10 text-warning" : "bg-correct/10 text-correct"}`}
          >
            <FaInfoCircle className="mr-2" />
            {isEditMode
              ? "W trybie edycji automatyczne zapisywanie jest wyłączone. Kliknij 'Zapisz do localStorage', aby zachować zmiany."
              : "Automatyczne zapisywanie włączone. Twoje zmiany są zapisywane automatycznie."}
          </div>
          <div className="flex gap-2">
            <button
              className="bg-warning text-text-inverse hover:bg-warning/85 focus:ring-warning/20 active:bg-warning/95 cursor-pointer rounded-md p-2 focus:ring-2 disabled:cursor-not-allowed disabled:opacity-50"
              onClick={resetForm}
              type="button"
            >
              Zresetuj formularz
            </button>
            <button
              className="bg-primary text-text-inverse hover:bg-primary/85 focus:ring-primary/20 active:bg-primary/95 cursor-pointer rounded-md p-2 focus:ring-2 disabled:cursor-not-allowed disabled:opacity-50"
              onClick={handleSaveToStorage}
              type="button"
            >
              Zapisz do localstorage
            </button>
            <button
              className="bg-secondary text-text-inverse hover:bg-secondary/85 focus:ring-secondary/20 active:bg-secondary/95 cursor-pointer rounded-md p-2 focus:ring-2 disabled:cursor-not-allowed disabled:opacity-50"
              onClick={handleRestoreFromStorage}
              type="button"
            >
              Przywróć z localstorage
            </button>
            <QuizFromFileBtn onImportQuestions={handleImportQuestions} />
          </div>{" "}
          <div className="flex items-center justify-between">
            <span className="text-text-muted text-sm font-medium">
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
              className="bg-correct text-text-inverse hover:bg-correct/85 focus:ring-correct/20 active:bg-correct/95 flex w-full items-center justify-center rounded-md px-4 py-2 focus:ring-2 disabled:cursor-not-allowed disabled:opacity-50"
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
