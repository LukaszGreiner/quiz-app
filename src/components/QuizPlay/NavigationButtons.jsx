import ThemeToggle from "../common/ThemeToggle";

const NavigationButtons = ({
  currentQuestionIndex,
  totalQuestions,
  onPrevious,
  onNext,
  onSubmit,
  isNextDisabled,
  isSubmitDisabled,
}) => {
  return (
    <div className="mt-6 flex justify-between">
      <button
        onClick={onPrevious}
        disabled={currentQuestionIndex === 0}
        className="rounded-md bg-gray-600 px-4 py-2 text-white transition duration-300 hover:bg-gray-700 disabled:bg-gray-400"
      >
        Poprzednie
      </button>
      {currentQuestionIndex < totalQuestions - 1 ? (
        <button
          onClick={onNext}
          disabled={isNextDisabled}
          className="rounded-md bg-blue-600 px-4 py-2 text-white transition duration-300 hover:bg-blue-700 disabled:bg-gray-400"
        >
          Następne
        </button>
      ) : (
        <button
          onClick={onSubmit}
          disabled={isSubmitDisabled}
          className="rounded-md bg-green-600 px-4 py-2 text-white transition duration-300 hover:bg-green-700 disabled:bg-gray-400"
        >
          Zakończ
        </button>
      )}
    </div>
  );
};

export default NavigationButtons;
