import { useRef } from "react";
import { FaTrash } from "react-icons/fa";
import ImageUpload from "./ImageUpload";
import { quizFormConfig } from "../../config/quizFormConfig";
import { useFormContext } from "react-hook-form";
import { Controller } from "react-hook-form";
import CollapsibleSection from "./CollapsibleSection";

const Question = ({ index, onDelete, canDelete }) => {
  const {
    register,
    control,
    watch,
    formState: { errors },
  } = useFormContext();
  const quizTitle = useRef(null);

  // Watch required fields
  const title = watch(`questions.${index}.title`);
  const correctAnswer = watch(`questions.${index}.correctAnswer`);
  const wrongAnswers = [
    watch(`questions.${index}.wrongAnswers.0`),
    watch(`questions.${index}.wrongAnswers.1`),
    watch(`questions.${index}.wrongAnswers.2`),
  ];

  // Check if all required fields are filled
  const areFieldsFilled =
    title?.trim() &&
    correctAnswer?.trim() &&
    wrongAnswers.every((answer) => answer?.trim());

  // Custom toggle handler
  const handleToggle = (isOpen, setIsOpen) => {
    if (isOpen) {
      // Allow collapsing only if all fields are filled
      if (areFieldsFilled) {
        setIsOpen(false);
      }
    } else {
      // Always allow expanding
      setIsOpen(true);
    }
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
            onClick={onDelete}
            className="text-gray-400 hover:text-red-500"
            aria-label={`Usuń pytanie ${index + 1}`}
          >
            <FaTrash size={14} />
          </button>
        )}
      </div>
      {/* Title */}
      <div className="mb-2">
        <input
          ref={quizTitle}
          id={`title-${index}`}
          type="text"
          {...register(`questions.${index}.title`, {
            required: "Pytanie jest wymagane",
            maxLength: {
              value: quizFormConfig.MAX_QUESTION_TEXT_LENGTH,
              message: `Maksymalna długość to ${quizFormConfig.MAX_QUESTION_TEXT_LENGTH} znaków`,
            },
          })}
          placeholder="Wpisz pytanie"
          className="w-full rounded-md border border-gray-200 p-1.5 text-sm break-all focus:ring-1 focus:ring-indigo-500"
        />
        {errors.questions?.[index]?.title && (
          <span className="text-sm text-red-600">
            {errors.questions[index].title.message}
          </span>
        )}
      </div>
      {/* Collapsible Content */}
      <CollapsibleSection onToggle={handleToggle}>
        <div className="mt-4 space-y-4">
          <Controller
            name={`questions.${index}.image`}
            control={control}
            render={({ field }) => (
              <ImageUpload
                image={field.value}
                onChange={(file) => field.onChange(file)}
                label="Dodaj zdjęcie (jpg/png)"
                fieldName={`questions.${index}.image`}
              />
            )}
          />
          {/* Correct answers */}
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
                {...register(`questions.${index}.correctAnswer`, {
                  required: "Prawidłowa odpowiedź jest wymagana",
                  maxLength: {
                    value: quizFormConfig.MAX_ANSWER_LENGTH,
                    message: `Maksymalna długość to ${quizFormConfig.MAX_ANSWER_LENGTH} znaków`,
                  },
                })}
                placeholder="Prawidłowa odpowiedź"
                className="w-full rounded-md border border-green-200 bg-green-50 p-1.5 text-sm focus:ring-1 focus:ring-green-500"
              />
              {errors.questions?.[index]?.correctAnswer && (
                <span className="text-sm text-red-600">
                  {errors.questions[index].correctAnswer.message}
                </span>
              )}
            </div>
            {/* Wrong answer */}
            <div>
              <label className="mb-1 block text-sm text-gray-600">
                Nieprawidłowe odpowiedzi
              </label>
              <div className="space-y-3">
                {["0", "1", "2"].map((wrongIndex) => (
                  <div key={wrongIndex}>
                    <input
                      id={`wrongAnswer-${index}-${wrongIndex}`}
                      type="text"
                      {...register(
                        `questions.${index}.wrongAnswers.${wrongIndex}`,
                        {
                          required: "Nieprawidłowa odpowiedź jest wymagana",
                          maxLength: {
                            value: quizFormConfig.MAX_ANSWER_LENGTH,
                            message: `Maksymalna długość to ${quizFormConfig.MAX_ANSWER_LENGTH} znaków`,
                          },
                        },
                      )}
                      placeholder={`Nieprawidłowa odpowiedź ${parseInt(wrongIndex) + 1}`}
                      className="w-full rounded-md border border-red-200 bg-red-50 p-1.5 text-sm focus:ring-1 focus:ring-red-500"
                    />
                    {errors.questions?.[index]?.wrongAnswers?.[wrongIndex] && (
                      <span className="text-sm text-red-600">
                        {
                          errors.questions[index].wrongAnswers[wrongIndex]
                            .message
                        }
                      </span>
                    )}
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
