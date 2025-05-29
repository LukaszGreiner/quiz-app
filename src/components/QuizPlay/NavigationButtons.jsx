import Btn from "../common/Btn";

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
    <nav
      className="mt-6 flex flex-col justify-between gap-3 sm:flex-row"
      aria-label="Nawigacja pytań"
    >      <Btn
        onClick={onPrevious}
        disabled={currentQuestionIndex === 0}
        variant="secondary"
        size="lg"
        className="w-full sm:w-auto"
        aria-label="Poprzednie pytanie"
      >
        Poprzednie
      </Btn>
      {currentQuestionIndex < totalQuestions - 1 ? (        <Btn
          onClick={onNext}
          disabled={isNextDisabled}
          variant="primary"
          size="lg"
          className="w-full sm:w-auto"
          aria-label="Następne pytanie"
        >
          Następne
        </Btn>
      ) : (        <Btn
          onClick={onSubmit}
          disabled={isSubmitDisabled}
          variant="correct"
          size="lg"
          className="w-full sm:w-auto"
          aria-label="Zakończ quiz"
        >
          Zakończ
        </Btn>
      )}
    </nav>
  );
};

export default NavigationButtons;
