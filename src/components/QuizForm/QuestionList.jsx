// components/QuestionList.jsx
import Question from "./Question";

const QuestionList = ({
  questions,
  questionsContainerRef,
  onQuestionChange,
  onDelete,
  onExpand,
}) => {
  return (
    <div ref={questionsContainerRef} className="space-y-4">
      {questions.map((question, index) => (
        <Question
          key={index}
          index={index}
          question={question}
          onChange={onQuestionChange}
          onDelete={onDelete}
          onExpand={onExpand}
          canDelete={questions.length > 1}
        />
      ))}
    </div>
  );
};

export default QuestionList;
