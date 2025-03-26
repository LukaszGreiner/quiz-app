import { useQuizForm } from "../../hooks/useQuizForm";
import QuizHeader from "./QuizHeader";
import QuizDetails from "./QuizDetails";
import QuestionList from "./QuestionList";
import ScrollToTopButton from "./ScrollToTopButton";
import { isQuestionFilled, isQuizValid } from "../../utils/quizUtils";
import { FaPlus, FaSave } from "react-icons/fa";

const QuizForm = () => {
  const {
    quiz,
    questions,
    questionsContainerRef,
    handleQuizChange,
    handleNameChange,
    handleSubmit,
    handleAddQuestion,
    handleQuestionChange,
    handleDeleteQuestion,
    handleExpandQuestion,
    questionLimit,
    isLoading,
    error,
    successMessage,
  } = useQuizForm();

  return (
    <div className="relative mx-auto max-w-3xl">
      <form onSubmit={handleSubmit} className="space-y-6">
        {isLoading && (
          <div className="text-center text-indigo-600">
            Zapisywanie quizu...
          </div>
        )}
        {error && <div className="text-center text-red-600">{error}</div>}
        {successMessage && (
          <div className="text-center text-green-600">{successMessage}</div>
        )}

        <QuizHeader name={quiz.name} onNameChange={handleNameChange} />
        <QuizDetails
          quiz={quiz}
          onChange={handleQuizChange}
          questionCount={questions.length}
        />
        <QuestionList
          questions={questions}
          questionsContainerRef={questionsContainerRef}
          onQuestionChange={handleQuestionChange}
          onDelete={handleDeleteQuestion}
          onExpand={handleExpandQuestion}
        />
        {questions.length < questionLimit && (
          <button
            type="button"
            onClick={handleAddQuestion}
            disabled={!isQuestionFilled(questions[questions.length - 1])}
            className="flex w-full items-center justify-center rounded-md bg-indigo-600 px-4 py-2 text-white hover:bg-indigo-700 disabled:bg-gray-400"
          >
            <FaPlus className="mr-2" /> {/* Ikonka Dodaj */}
            Dodaj pytanie
          </button>
        )}
        <button
          type="submit"
          disabled={isLoading || !isQuizValid(quiz, questions)}
          className="flex w-full items-center justify-center rounded-md bg-green-600 px-4 py-2 text-white hover:bg-green-700 disabled:bg-gray-400"
        >
          <FaSave className="mr-2" /> {/* Ikonka Zapisz */}
          Zapisz quiz
        </button>
      </form>
      <ScrollToTopButton />
    </div>
  );
};

export default QuizForm;
