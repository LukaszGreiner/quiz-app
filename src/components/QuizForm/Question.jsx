import { useState } from "react";
import { FaTrash } from "react-icons/fa";
import ImageUpload from "./ImageUpload";
import { quizFormConfig } from "../../config/quizFormConfig";
import CollapsibleSection from "./CollapsibleSection";

const Question = ({
  index,
  question,
  onChange,
  onDelete,
  onExpand,
  canDelete,
}) => {
  const [isOpen, setIsOpen] = useState(question.isOpen);

  const handleImageChange = (file) => onChange(index, "image", file);
  const handleToggle = () => setIsOpen((prev) => !prev);
  const handleDelete = () => onDelete(index);

  const renderSummary = () => (
    <div className="mb-2 flex flex-col gap-2 md:flex-row md:items-center">
      {question.image && (
        <div className="mx-auto flex-shrink-0 md:mx-0">
          <img
            src={URL.createObjectURL(question.image)}
            alt={`Podgląd pytania ${index + 1}`}
            className="h-16 w-16 rounded-md object-cover"
          />
        </div>
      )}
      <div className="w-full flex-1">
        <label htmlFor={`questionText-${index}`} className="sr-only">
          Tekst pytania {index + 1}
        </label>
        <input
          id={`questionText-${index}`}
          type="text"
          value={question.questionText}
          onChange={(e) => onChange(index, "questionText", e.target.value)}
          onClick={() => onExpand(index)}
          placeholder="Wpisz pytanie"
          maxLength={quizFormConfig.MAX_QUESTION_TEXT_LENGTH}
          required
          className="w-full rounded-md border border-gray-200 p-1.5 text-sm break-all focus:ring-1 focus:ring-indigo-500"
        />
      </div>
    </div>
  );

  return (
    <div className="rounded-md border border-gray-200 bg-gray-50 p-4 md:p-6">
      <div className="mb-1 flex items-center justify-between">
        <span className="text-sm font-medium text-gray-700">
          Pytanie {index + 1}
        </span>
        {canDelete && (
          <button
            type="button"
            onClick={handleDelete}
            className="text-gray-400 hover:text-red-500"
            aria-label={`Usuń pytanie ${index + 1}`}
          >
            <FaTrash size={14} />
          </button>
        )}
      </div>
      <CollapsibleSection
        isOpen={isOpen}
        onToggle={handleToggle}
        summary={renderSummary()}
      >
        <div className="mt-4 space-y-4">
          <div>
            <label
              htmlFor={`questionText-${index}`}
              className="mb-1 block text-sm text-gray-600"
            >
              Tekst pytania
            </label>
            <input
              id={`questionText-${index}`}
              type="text"
              value={question.questionText}
              onChange={(e) => onChange(index, "questionText", e.target.value)}
              placeholder="Wpisz pytanie"
              maxLength={quizFormConfig.MAX_QUESTION_TEXT_LENGTH}
              required
              className="w-full rounded-md border border-gray-200 p-1.5 text-sm break-all focus:ring-1 focus:ring-indigo-500"
            />
          </div>
          <ImageUpload
            image={question.image}
            onChange={handleImageChange}
            label="Dodaj zdjęcie (jpg/png)"
          />
          <div className="grid grid-cols-1 gap-2 md:grid-cols-2">
            <div>
              <label
                htmlFor={`correctAnswer-${index}`}
                className="mb-1 block text-sm text-gray-600"
              >
                Prawidłowa odpowiedź
              </label>
              <input
                id={`correctAnswer-${index}`}
                type="text"
                value={question.correctAnswer}
                onChange={(e) =>
                  onChange(index, "correctAnswer", e.target.value)
                }
                placeholder="Prawidłowa odpowiedź"
                maxLength={quizFormConfig.MAX_ANSWER_LENGTH}
                required
                className="w-full rounded-md border border-green-200 bg-green-50 p-1.5 text-sm focus:ring-1 focus:ring-green-500"
              />
            </div>
            <div>
              <label className="mb-1 block text-sm text-gray-600">
                Nieprawidłowe odpowiedzi
              </label>
              <div className="space-y-3">
                {question.wrongAnswers.map((answer, wrongIndex) => (
                  <div key={wrongIndex}>
                    <label
                      htmlFor={`wrongAnswer-${index}-${wrongIndex}`}
                      className="sr-only"
                    >
                      Nieprawidłowa odpowiedź {wrongIndex + 1}
                    </label>
                    <input
                      id={`wrongAnswer-${index}-${wrongIndex}`}
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
                      maxLength={quizFormConfig.MAX_ANSWER_LENGTH}
                      required
                      className="w-full rounded-md border border-red-200 bg-red-50 p-1.5 text-sm focus:ring-1 focus:ring-red-500"
                    />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </CollapsibleSection>
    </div>
  );
};

export default Question;
