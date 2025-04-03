import { useState, useRef } from "react";
import { useFormContext } from "react-hook-form";
import { FaEdit } from "react-icons/fa";
import { quizFormConfig } from "../../config/quizFormConfig";

const QuizHeader = () => {
  const {
    register,
    setValue,
    watch,
    formState: { errors },
  } = useFormContext();
  const [isEditing, setIsEditing] = useState(false);
  const inputRef = useRef(null);
  const title = watch("title");

  const handleFinish = () => {
    const trimmedValue = inputRef.current.value.trim();
    setValue("title", trimmedValue.length ? trimmedValue : "Quiz bez nazwy");
    setIsEditing(false);
  };

  const startEditing = () => {
    setIsEditing(true);
    inputRef.current?.focus();
  };

  return (
    <div className="flex items-center justify-between rounded-md bg-gray-50 p-4">
      {isEditing ? (
        <div className="w-full">
          <input
            ref={inputRef}
            type="text"
            defaultValue={title}
            onBlur={handleFinish}
            onKeyDown={(e) => e.key === "Enter" && handleFinish()}
            maxLength={quizFormConfig.MAX_QUIZ_NAME_LENGTH}
            className="w-full border-b-2 border-indigo-500 py-1 text-2xl font-semibold text-gray-800 focus:outline-none"
          />
          {errors.title && (
            <span className="mt-1 text-sm text-red-600">
              {errors.title.message}
            </span>
          )}
        </div>
      ) : (
        <div className="flex items-center gap-2">
          <h2 className="text-2xl font-semibold text-gray-800">{title}</h2>
          <button
            onClick={startEditing}
            className="text-gray-400 hover:text-indigo-600"
          >
            <FaEdit size={16} />
          </button>
        </div>
      )}
    </div>
  );
};

export default QuizHeader;
