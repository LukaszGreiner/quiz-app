import { useState, useRef } from "react";
import { useFormContext } from "react-hook-form";
import { FaEdit } from "react-icons/fa";
import { quizFormConfig } from "../../config/quizFormConfig";

const QuizHeader = () => {
  const {
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
    <div className="bg-surface flex items-center justify-between rounded-md p-4">
      {isEditing ? (
        <div className="w-full">
          <input
            ref={inputRef}
            type="text"
            defaultValue={title}
            onBlur={handleFinish}
            onKeyDown={(e) => e.key === "Enter" && handleFinish()}
            maxLength={quizFormConfig.MAX_QUIZ_NAME_LENGTH}
            className="border-primary text-text focus:border-border-focus w-full border-b-2 py-1 text-2xl font-semibold focus:outline-none"
          />
          {errors.title && (
            <span className="text-incorrect mt-1 text-sm">
              {errors.title.message}
            </span>
          )}
        </div>
      ) : (
        <div className="flex items-center gap-2">
          <h2 className="text-text text-2xl font-semibold">{title}</h2>
          <button
            onClick={startEditing}
            className="text-text-muted hover:text-primary focus:text-primary focus:ring-primary/20 transition-colors duration-200 focus:ring-2"
          >
            <FaEdit size={16} />
          </button>
        </div>
      )}
    </div>
  );
};

export default QuizHeader;
