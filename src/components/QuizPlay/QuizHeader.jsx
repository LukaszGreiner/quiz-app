const   QuizHeader = ({
  title,
  currentQuestionIndex,
  totalQuestions,
  progress,
}) => {
  return (
    <header className="bg-surface border-border mb-6 flex flex-col gap-2 rounded-xl border p-4 shadow-sm">
      {/* <h1 className="text-primary mb-2 text-2xl font-bold sm:text-3xl">
        {title}
      </h1> */}
      <div className="bg-surface-elevated border-border h-2.5 w-full rounded-full border">
        <div
          className="bg-primary h-2.5 rounded-full transition-all duration-300"
          style={{ width: `${progress}%` }}
          aria-valuenow={progress}
          aria-valuemin={0}
          aria-valuemax={100}
          role="progressbar"
        ></div>
      </div>
      <p className="text-text-muted mt-1 text-sm">
        Pytanie{" "}
        <span className="text-primary font-semibold">
          {currentQuestionIndex + 1}
        </span>{" "}
        z {totalQuestions}
      </p>
    </header>
  );
};

export default QuizHeader;
