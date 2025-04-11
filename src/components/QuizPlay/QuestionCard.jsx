const QuestionCard = ({
  question,
  shuffledAnswers,
  userAnswer,
  onAnswerSelect,
  timeLeft,
}) => {
  return (
    <div className="rounded-xl bg-white p-6 shadow-md">
      <h2 className="mb-4 text-xl font-semibold text-gray-800">
        {question.title}
      </h2>
      {question.imageUrl && (
        <img
          src={question.imageUrl}
          alt={`Obraz dla pytania`}
          className="mb-4 h-32 w-full rounded-lg object-cover"
          onError={(e) =>
            (e.target.src =
              "https://placehold.co/200x150.png?text=Brak%20obrazu")
          }
        />
      )}
      {timeLeft > 0 && (
        <div className="mb-4 text-center">
          <p className="text-lg font-medium text-gray-700">
            Pozostały czas: {timeLeft} s
          </p>
        </div>
      )}
      <div className="space-y-3">
        {shuffledAnswers.map((answer, index) => (
          <button
            key={index}
            onClick={() => onAnswerSelect(answer)}
            className={`w-full rounded-md px-4 py-3 text-left text-gray-800 transition-colors duration-200 ${
              userAnswer === answer
                ? "bg-blue-500 text-white"
                : "bg-gray-100 hover:bg-gray-200"
            }`}
          >
            {answer}
          </button>
        ))}
      </div>
    </div>
  );
};

export default QuestionCard;
