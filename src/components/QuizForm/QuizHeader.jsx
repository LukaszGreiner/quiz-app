import { useState, useRef } from "react";
import { FaEdit } from "react-icons/fa";

const QuizHeader = ({ name, onNameChange }) => {
  const [isEditing, setIsEditing] = useState(false);
  const inputRef = useRef(null);

  const handleBlur = () => {
    if (!name.trim()) onNameChange("Quiz bez nazwy");
    setIsEditing(false);
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      if (!name.trim()) onNameChange("Quiz bez nazwy");
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
        <input
          ref={inputRef}
          type="text"
          value={name}
          onChange={(e) => onNameChange(e.target.value)}
          onBlur={handleBlur}
          onKeyDown={handleKeyPress}
          autoFocus
          className="w-full border-b-2 border-indigo-500 py-1 text-2xl font-semibold text-gray-800 focus:outline-none"
        />
      ) : (
        <div className="flex items-center gap-2">
          <h2 className="text-2xl font-semibold text-gray-800">{name}</h2>
          <button
            onClick={handleEditClick}
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
