import { useState } from "react";
import { FaTrash } from "react-icons/fa";
import ImageUpload from "./ImageUpload";
import { quizFormConfig } from "../../config/quizFormConfig";
import CollapsibleSection from "./CollapsibleSection";
import { useFormContext } from "react-hook-form";
import { Controller } from "react-hook-form";

const Question = ({ index, onDelete, canDelete }) => {
  const {
    register,
    control,
    watch,
    formState: { errors },
  } = useFormContext();
  const [isOpen, setIsOpen] = useState(false);
  const title = watch(`questions.${index}.title`) || "";

  const handleToggle = () => setIsOpen((prev) => !prev);

  const renderSummary = () => {
    const image = watch(`questions.${index}.image`);
    return (
      <div className="mb-2 flex flex-col gap-2 md:flex-row md:items-center">
        {image && (
          <div className="mx-auto flex-shrink-0 md:mx-0">
            <img
              src={URL.createObjectURL(image)}
              alt={`Podgląd pytania ${index + 1}`}
              className="h-16 w-16 rounded-md object-cover"
            />
          </div>
        )}
        <div className="w-full flex-1">
          <input
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
            onClick={handleToggle}
          />
          {errors.questions?.[index]?.title && (
            <span className="text-sm text-red-600">
              {errors.questions[index].title.message}
            </span>
          )}
        </div>
      </div>
    );
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
      <CollapsibleSection
        isOpen={isOpen}
        onToggle={handleToggle}
        summary={renderSummary()}
      >
        <div className="mt-4 space-y-4">
          <div>
            <label
              htmlFor={`title-${index}`}
              className="mb-1 block text-sm text-gray-600"
            >
              Tekst pytania
            </label>
            <input
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
          <Controller
            name={`questions.${index}.image`}
            control={control}
            render={({ field }) => (
              <ImageUpload
                image={field.value}
                onChange={(file) => field.onChange(file)}
                label="Dodaj zdjęcie (jpg/png)"
              />
            )}
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
