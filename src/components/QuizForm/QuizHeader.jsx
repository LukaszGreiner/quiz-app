import { useState, useRef } from "react";
import { FaEdit } from "react-icons/fa";
import { quizFormConfig } from "../../config/quizFormConfig";

const QuizHeader = ({ name, onChange }) => {
  const [isEditing, setIsEditing] = useState(false);
  const inputRef = useRef(null);

  const handleBlur = () => {
    if (!name.trim())
      onChange({ target: { name: "name", value: "Quiz bez nazwy" } });
    setIsEditing(false);
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      if (!name.trim())
        onChange({ target: { name: "name", value: "Quiz bez nazwy" } });
      setIsEditing(false);
    }
  };

  const handleEditClick = () => {
    setIsEditing(true);
    setTimeout(() => inputRef.current?.focus(), 0);
  };

  return (
    <div className="flex items-center justify-between rounded-md bg-gray-50 p-4">
      {isEditing ? (
        <div className="w-full">
          <label htmlFor="quiz-name" className="sr-only">
            Nazwa quizu
          </label>
          <input
            id="quiz-name"
            ref={inputRef}
            type="text"
            name="name"
            value={name}
            onChange={onChange}
            onBlur={handleBlur}
            onKeyDown={handleKeyPress}
            maxLength={quizFormConfig.MAX_QUIZ_NAME_LENGTH}
            autoFocus
            className="w-full border-b-2 border-indigo-500 py-1 text-2xl font-semibold text-gray-800 focus:outline-none"
            aria-label="Edytuj nazwę quizu"
            aria-required="true"
          />
        </div>
      ) : (
        <div className="flex items-center gap-2">
          <h2 className="text-2xl font-semibold text-gray-800">{name}</h2>
          <button
            onClick={handleEditClick}
            className="text-gray-400 hover:text-indigo-600"
            aria-label="Edytuj nazwę quizu"
          >
            <FaEdit size={16} />
          </button>
        </div>
      )}
    </div>
  );
};

export default QuizHeader;
