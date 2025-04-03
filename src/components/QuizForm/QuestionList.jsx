import Question from "./Question";
import { quizFormConfig } from "../../config/quizFormConfig";

const QuestionList = ({ fields, append, remove }) => {
  return (
    <div className="space-y-4">
      {fields.map((field, index) => (
        <Question
          key={field.id} // Use field.id from useFieldArray for unique keys
          index={index}
          onDelete={() => remove(index)}
          canDelete={fields.length > 1}
        />
      ))}
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
        className="flex w-full items-center justify-center rounded-md bg-indigo-600 px-4 py-2 text-white hover:bg-indigo-700 disabled:cursor-not-allowed disabled:bg-gray-400"
      >
        Dodaj pytanie
      </button>
    </div>
  );
};

export default QuestionList;
