import { FaTrash, FaAngleDown } from "react-icons/fa";
import ImageUpload from "./ImageUpload";

const Question = ({
  index,
  question,
  onChange,
  onDelete,
  onExpand,
  onToggle,
  canDelete,
}) => {
  const isFilled =
    question.questionText.trim() &&
    question.correctAnswer.trim() &&
    question.wrongAnswers.every((answer) => answer.trim());

  const handleImageChange = (file) => {
    onChange(index, "image", file);
  };
  return (
    <div className="rounded-md border border-gray-200 bg-gray-50 p-4 md:p-6">
      <div className="mb-1 flex items-center justify-between">
        <span className="text-sm font-medium text-gray-700">
          Pytanie {index + 1}
        </span>
        {canDelete && (
          <button
            type="button"
            onClick={() => onDelete(index)}
            className="text-gray-400 hover:text-red-500"
          >
            <FaTrash size={14} />
          </button>
        )}
      </div>

      {/* Question Text and Image (in contracted state) */}
      <div className="mb-2 flex flex-col gap-2 md:flex-row md:items-center">
        {/* Image Preview (only in contracted state, no remove button) */}
        {!question.isOpen && question.image && (
          <div className="mx-auto flex-shrink-0 md:mx-0">
            <img
              src={URL.createObjectURL(question.image)}
              alt="Question preview"
              className="h-16 w-16 rounded-md object-cover"
            />
          </div>
        )}

        {/* Question Text Input */}
        <input
          type="text"
          value={question.questionText}
          onChange={(e) => onChange(index, "questionText", e.target.value)}
          onClick={() => onExpand(index)}
          placeholder="Wpisz pytanie"
          required
          className="w-full flex-1 rounded-md border border-gray-200 p-1.5 text-sm break-all focus:ring-1 focus:ring-indigo-500 focus:outline-none"
        />
      </div>

      {/* Expanded Content (including Image Upload for changing/removing the image) */}
      {question.isOpen && (
        <div className="mt-4">
          {/* Image Upload (visible when expanded, includes remove button) */}
          <ImageUpload
            image={question.image}
            onChange={handleImageChange}
            label="Dodaj zdjęcie (jpg/png)"
          />

          {/* Answers Section */}
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 md:gap-6">
            {/* Correct Answer */}
            <div>
              <label className="mb-2 block text-sm text-gray-600">
                Prawidłowa odpowiedź
              </label>
              <input
                type="text"
                value={question.correctAnswer}
                onChange={(e) =>
                  onChange(index, "correctAnswer", e.target.value)
                }
                placeholder="Prawidłowa odpowiedź"
                required
                className="w-full rounded-md border border-green-200 bg-green-50 p-1.5 text-sm focus:ring-1 focus:ring-green-500 focus:outline-none"
              />
            </div>

            {/* Incorrect Answers */}
            <div>
              <label className="mb-2 block text-sm text-gray-600">
                Nieprawidłowe odpowiedzi
              </label>
              <div className="space-y-3">
                {question.wrongAnswers.map((answer, wrongIndex) => (
                  <input
                    key={wrongIndex}
                    type="text"
                    value={answer}
                    onChange={(e) =>
                      onChange(
                        index,
                        "wrongAnswers",
                        e.target.value,
                        wrongIndex,
                      )
                    }
                    placeholder={`Nieprawidłowa odpowiedź ${wrongIndex + 1}`}
                    required
                    className="w-full rounded-md border border-red-200 bg-red-50 p-1.5 text-sm focus:ring-1 focus:ring-red-500 focus:outline-none"
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Toggle Button */}
      {isFilled && (
        <div className="mt-2 flex justify-center">
          <FaAngleDown
            size={16}
            className={`cursor-pointer text-gray-400 transition-transform ${
              question.isOpen ? "rotate-180" : ""
            }`}
            onClick={() => onToggle(index)}
            title={question.isOpen ? "Pokaż mniej" : "Pokaż więcej"}
          />
        </div>
      )}
    </div>
  );
};

export default Question;
