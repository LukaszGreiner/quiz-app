import Question from "./Question";
import { quizFormConfig } from "../../config/quizFormConfig";

const QuestionList = ({ fields, append, remove }) => {
  return (
    <div className="space-y-4">
      {fields.map((field, index) => (
        <Question
          key={field.id}
          index={index}
          onDelete={() => remove(index)}
          canDelete={fields.length > 1}
        />
      ))}{" "}
      <button
        type="button"
        onClick={() =>
          append({
            title: "",
            correctAnswer: "",
            wrongAnswers: ["", "", ""],
            image: null,
          })
        }
        disabled={fields.length >= quizFormConfig.QUIZ_QUESTIONS_LIMIT}
        className="bg-primary text-text-inverse hover:bg-primary/85 focus:ring-primary/20 active:bg-primary/95 flex w-full items-center justify-center rounded-md px-4 py-2 focus:ring-2 disabled:cursor-not-allowed disabled:opacity-50"
      >
        Dodaj pytanie
      </button>
    </div>
  );
};

export default QuestionList;
