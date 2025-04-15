const QuizHeader = ({
  title,
  currentQuestionIndex,
  totalQuestions,
  progress,
}) => {
  return (
    <div className="mb-6">
      <h1 className="mb-4 text-3xl font-bold text-gray-800">{title}</h1>
      <div className="h-2.5 w-full rounded-full bg-gray-200">
        <div
          className="h-2.5 rounded-full bg-blue-600 transition-all duration-300"
          style={{ width: `${progress}%` }}
        ></div>
      </div>
      <p className="mt-1 text-sm text-gray-600">
        Pytanie {currentQuestionIndex + 1} z {totalQuestions}
      </p>
    </div>
  );
};

export default QuizHeader;
