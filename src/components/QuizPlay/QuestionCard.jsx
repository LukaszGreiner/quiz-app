const QuestionCard = ({
  question,
  shuffledAnswers,
  userAnswer,
  onAnswerSelect,
  timeLeft,
  timeLimitPerQuestion,
}) => {
  return (
    <section className="bg-surface border-border mb-6 rounded-xl border p-4 shadow-md sm:p-6">
      <h2 className="text-text mb-4 text-xl font-semibold">{question.title}</h2>
      {question.imageUrl && (
        <img
          src={question.imageUrl}
          alt="Obraz dla pytania"
          className="border-border mb-4 h-auto max-h-64 w-full rounded-lg border object-contain"
          onError={(e) =>
            (e.target.src =
              "https://placehold.co/200x150.png?text=Brak%20obrazu")
          }
        />
      )}
      {typeof timeLeft === "number" && timeLimitPerQuestion > 0 && (
        <div className="mb-4 text-center">
          <p className="text-info text-lg font-medium">
            Pozostały czas: <span className="font-bold">{timeLeft}s</span>
          </p>
        </div>
      )}
      <div className="space-y-3">
        {shuffledAnswers.map((answer, index) => (
          <button
            key={index}
            onClick={() => onAnswerSelect(answer)}
            className={`text-text border-border focus:ring-primary/20 focus:border-border-focus active:bg-primary/95 min-h-[44px] w-full rounded-lg border px-4 py-3 text-left font-medium transition-colors duration-200 focus:ring-2 focus:outline-none disabled:cursor-not-allowed disabled:opacity-50 ${
              userAnswer === answer
                ? "bg-selected text-text-inverse border-selected"
                : "bg-surface-elevated hover:bg-primary/10 hover:border-primary"
            }`}
            aria-pressed={userAnswer === answer}
            tabIndex={0}
          >
            {answer}
          </button>
        ))}
      </div>
    </section>
  );
};

export default QuestionCard;
