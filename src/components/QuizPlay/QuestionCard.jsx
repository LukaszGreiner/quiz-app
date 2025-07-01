const QuestionCard = ({
  question,
  shuffledAnswers,
  userAnswer,
  onAnswerSelect,
  timeLeft,
  timeLimitPerQuestion,
  currentQuestionIndex,
  totalQuestions,
  progress,
  showFeedback, // Add feedback prop
}) => {
  // Add animation classes for the card to create a smooth transition effect
  const cardAnimationClass = "animate-fadeIn";
  
  return (
    <section className={`bg-surface border-border rounded-xl border ${question.imageUrl ? 'p-3 sm:p-5 md:p-6' : 'p-3 sm:p-4 md:p-5'} shadow-md flex flex-col justify-center items-center w-full ${cardAnimationClass}`}>
      <div className={`w-full max-w-4xl mx-auto flex flex-col justify-center ${question.imageUrl ? 'gap-3' : 'gap-2'}`}>
        <header className="!bg-surface text-center mb-4">
          <h1 className="text-text mb-3 text-base md:text-xl font-semibold">{question.title}</h1>

          <div className="bg-surface-elevated border-border h-2.5 w-full rounded-full border relative overflow-hidden">
            <div
              className="bg-primary h-2.5 rounded-full transition-all duration-1000 ease-out relative overflow-hidden"
              style={{ width: `${progress}%` }}
              aria-valuenow={progress}
              aria-valuemin={0}
              aria-valuemax={100}
              role="progressbar"
            >
              <div className="absolute inset-0 bg-white/20 animate-progressPulse"></div>
            </div>
          </div>
          <p className="text-text-muted mt-2 text-xs sm:text-sm">
            Pytanie{" "}
            <span className="text-primary font-semibold">
              {currentQuestionIndex + 1}
            </span>{" "}
            z {totalQuestions}
          </p>
        </header>
        {/* Image container that only renders when an image is present */}
        {question.imageUrl ? (
          <div className="my-3 md:my-4 w-full flex justify-center items-center min-h-[80px] max-h-[28vh]">
            <img
              src={question.imageUrl}
              alt="Obraz dla pytania"
              className="border-border rounded-lg border object-contain h-auto max-h-[26vh] max-w-full"
              loading="lazy" 
              onError={(e) =>
                (e.target.src =
                  "https://placehold.co/200x150.png?text=Brak%20obrazu")
              }
            />
          </div>
        ) : (
          /* Small spacer when no image */
          <div className="my-1"></div>
        )}
        {/* Always reserve space for the timer to prevent layout shifts */}
        <div className={`h-7 ${question.imageUrl ? 'mb-2 md:mb-3' : 'mb-3 md:mb-4'} text-center`}>
          {typeof timeLeft === "number" && timeLimitPerQuestion > 0 && (
            <p className="text-info text-base md:text-lg font-medium">
              Pozostały czas: <span className="font-bold">{timeLeft}s</span>
            </p>
          )}
        </div>
        <div className={`grid sm:grid-cols-2 gap-2 md:gap-3 ${question.imageUrl ? 'my-3 md:my-4' : 'mt-1 mb-3 md:mb-4'} w-full max-w-3xl mx-auto`}>
          {shuffledAnswers.map((answer, index) => (
            <button
              key={index}
              onClick={() => onAnswerSelect(answer)}
              disabled={showFeedback}
              className={`text-text border-border focus:ring-primary/20 focus:border-border-focus active:bg-primary/95 min-h-[40px] md:min-h-[44px] w-full rounded-lg border px-3 py-2 text-left font-medium transition-all duration-300 focus:ring-1 focus:outline-none disabled:cursor-not-allowed ${
                showFeedback && answer === question.correctAnswer
                  ? "bg-correct/20 text-correct border-correct animate-correctAnswer"
                  : showFeedback && userAnswer === answer && answer !== question.correctAnswer
                  ? "bg-incorrect/20 text-incorrect border-incorrect animate-incorrectAnswer"
                  : userAnswer === answer
                  ? "bg-selected text-text-inverse border-selected animate-selectedAnswer"
                  : "bg-surface-elevated hover:bg-primary/10 hover:border-primary"
              } ${showFeedback && userAnswer !== answer ? "opacity-50" : ""}`}
              aria-pressed={userAnswer === answer}
              tabIndex={0}
            >
              {answer}
              {showFeedback && answer === question.correctAnswer && (
                <span className="ml-2 text-correct">✓</span>
              )}
              {showFeedback && userAnswer === answer && answer !== question.correctAnswer && (
                <span className="ml-2 text-incorrect">✗</span>
              )}
            </button>
          ))}
        </div>
        
        {/* Always reserve space for the feedback message to prevent layout shifts */}
        <div className={`h-10 ${question.imageUrl ? 'mt-4' : 'mt-3'} text-center`}>
          {showFeedback && (
            <>
              <p className="text-text-muted text-xs sm:text-sm animate-feedbackMessage">
                {currentQuestionIndex < totalQuestions - 1 
                  ? "Za chwilę nastąpi przejście do kolejnego pytania..." 
                  : "Za chwilę nastąpi zakończenie quizu..."}
              </p>
              <p className="text-xs text-text-muted animate-fadeIn mt-1" style={{animationDelay: '0.2s'}}>
                (Pytanie {currentQuestionIndex + 1} z {totalQuestions})
              </p>
            </>
          )}
        </div>
      </div>
    </section>
  );
};

export default QuestionCard;
