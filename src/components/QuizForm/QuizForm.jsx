import { useQuizForm } from "../../hooks/useQuizForm";
import QuizHeader from "./QuizHeader";
import QuizDetails from "./QuizDetails";
import QuestionList from "./QuestionList";
import ScrollToTopButton from "./ScrollToTopButton";
import { isQuestionFilled, isQuizValid } from "../../utils/quizUtils";
import { FaPlus, FaSave } from "react-icons/fa";
import { quizFormConfig } from "../../config/quizFormConfig";

const QuizForm = () => {
  const {
    quiz,
    questions,
    questionsContainerRef,
    handleQuizChange,
    handleSubmit,
    handleAddQuestion,
    handleQuestionChange,
    handleDeleteQuestion,
    handleExpandQuestion,
    questionLimit,
  } = useQuizForm();

  const canAddQuestion =
    questions.length < questionLimit &&
    isQuestionFilled(questions[questions.length - 1]);
  const canSubmit = isQuizValid(quiz, questions);
  const isCategoryMissing = !quiz.category.trim();
  const areQuestionsIncomplete = questions.some((q) => !isQuestionFilled(q));
  const isMinQuestionsMissing =
    questions.length < quizFormConfig.MIN_QUESTIONS_REQUIRED;

  return (
    <div className="relative mx-auto max-w-3xl">
      <form onSubmit={handleSubmit} className="space-y-6">
        <QuizHeader name={quiz.name} onChange={handleQuizChange} />
        <QuizDetails
          quiz={quiz}
          onChange={handleQuizChange}
          questionCount={questions.length}
        />

        {/* Display question count */}
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium text-gray-700">
            Pytania: {questions.length}/{quizFormConfig.QUIZ_QUESTIONS_LIMIT}
          </span>
        </div>

        <QuestionList
          questions={questions}
          questionsContainerRef={questionsContainerRef}
          onQuestionChange={handleQuestionChange}
          onDelete={handleDeleteQuestion}
          onExpand={handleExpandQuestion}
        />

        <button
          type="button"
          onClick={handleAddQuestion}
          disabled={!canAddQuestion}
          title={
            canAddQuestion
              ? "Dodaj nowe pytanie"
              : "Wypełnij ostatnie pytanie, aby dodać kolejne"
          }
          className="flex w-full items-center justify-center rounded-md bg-indigo-600 px-4 py-2 text-white hover:bg-indigo-700 disabled:cursor-not-allowed disabled:bg-gray-400"
          aria-disabled={!canAddQuestion}
        >
          <FaPlus className="mr-2" />
          Dodaj pytanie
        </button>

        <div className="relative">
          <button
            type="submit"
            disabled={!canSubmit}
            title={
              canSubmit
                ? "Zapisz quiz"
                : "Wypełnij wszystkie wymagane pola, aby zapisać"
            }
            className="flex w-full items-center justify-center rounded-md bg-green-600 px-4 py-2 text-white hover:bg-green-700 disabled:cursor-not-allowed disabled:bg-gray-400"
            aria-disabled={!canSubmit}
            aria-describedby={canSubmit ? undefined : "save-quiz-error"}
          >
            <FaSave className="mr-2" />
            Zapisz quiz
          </button>
          {!canSubmit && (
            <span
              id="save-quiz-error"
              className="mt-1 block text-center text-sm text-red-600"
            >
              {isCategoryMissing
                ? "Wybierz kategorię, aby zapisać quiz!"
                : areQuestionsIncomplete
                  ? "Wypełnij wszystkie pola pytania, aby zapisać quiz!"
                  : isMinQuestionsMissing
                    ? `Quiz musi zawierać co najmniej ${quizFormConfig.MIN_QUESTIONS_REQUIRED} pytań!`
                    : "Upewnij się, że wymagane pola są wypełnione!"}
            </span>
          )}
        </div>
      </form>
      <ScrollToTopButton />
    </div>
  );
};

export default QuizForm;
